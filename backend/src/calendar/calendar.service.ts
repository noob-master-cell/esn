import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import ical, { ICalCalendarMethod } from 'ical-generator';
import { EventStatus } from '@prisma/client';

@Injectable()
export class CalendarService {
    constructor(private prisma: PrismaService) { }

    async getCalendarFeed() {
        const events = await this.prisma.event.findMany({
            where: {
                status: EventStatus.PUBLISHED,
                isPublic: true,
            },
            include: {
                organizer: true,
            },
        });

        const calendar = ical({
            name: 'ESN Events',
            method: ICalCalendarMethod.PUBLISH,
            timezone: 'Europe/Berlin', // Adjust as needed or make dynamic
        });

        events.forEach((event) => {
            calendar.createEvent({
                start: event.startDate,
                end: event.endDate,
                summary: event.title,
                description: event.description,
                location: event.location,
                url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/events/${event.id}`,
                organizer: {
                    name: `${event.organizer.firstName} ${event.organizer.lastName}`,
                    email: event.organizer.email,
                },
            });
        });

        return calendar;
    }
}
