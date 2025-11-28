import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationStatus } from '@prisma/client';

export interface EventCounts {
    confirmed: number;
    pending: number;
    cancelled: number;
}

/**
 * DataLoader for batching and caching event registration counts.
 * Prevents N+1 query issues when fetching counts for multiple events.
 * 
 * This loader groups registrations by event ID and status to efficiently
 * calculate confirmed, pending, and cancelled counts in a single database query.
 * 
 * @see https://github.com/graphql/dataloader
 */
@Injectable({ scope: Scope.REQUEST })
export class EventCountsLoader {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * DataLoader instance for batching event counts.
     * 
     * Keys: Event IDs (string)
     * Values: EventCounts object containing:
     * - confirmed: Number of confirmed/attended/no-show registrations
     * - pending: Number of pending registrations
     * - cancelled: Number of cancelled registrations
     */
    public readonly batchCounts = new DataLoader<string, EventCounts>(
        async (eventIds: readonly string[]) => {
            // Fetch all counts in a single query using grouping
            const counts = await this.prisma.registration.groupBy({
                by: ['eventId', 'status'],
                where: {
                    eventId: { in: [...eventIds] },
                },
                _count: {
                    _all: true,
                },
            });

            // Map results to eventIds
            const countsMap = new Map<string, EventCounts>();

            // Initialize map with zeros
            eventIds.forEach((id) => {
                countsMap.set(id, { confirmed: 0, pending: 0, cancelled: 0 });
            });

            // Populate map with actual data
            counts.forEach((item) => {
                const eventCounts = countsMap.get(item.eventId);
                if (eventCounts) {
                    const count = item._count._all;
                    if (
                        item.status === RegistrationStatus.CONFIRMED ||
                        item.status === RegistrationStatus.ATTENDED ||
                        item.status === RegistrationStatus.NO_SHOW
                    ) {
                        eventCounts.confirmed += count;
                    } else if (item.status === RegistrationStatus.PENDING) {
                        eventCounts.pending += count;
                    } else if (item.status === RegistrationStatus.CANCELLED) {
                        eventCounts.cancelled += count;
                    }
                }
            });

            return eventIds.map((id) => countsMap.get(id)!);
        },
    );
}
