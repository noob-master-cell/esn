import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersLoader {
    constructor(private readonly prisma: PrismaService) { }

    public readonly batchUsers = new DataLoader<string, User>(
        async (userIds: readonly string[]) => {
            const users = await this.prisma.user.findMany({
                where: {
                    id: { in: [...userIds] },
                },
            });

            const userMap = new Map(users.map((user) => [user.id, user]));
            return userIds.map((id) => userMap.get(id) || null);
        },
    );
}
