import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('users', 'Platform identities, roles, permissions, account status, and profile metadata.');
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        customerProfile: true,
        staffProfiles: true,
      },
    });
  }
}
