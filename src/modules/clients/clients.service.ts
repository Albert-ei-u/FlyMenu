import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { hashPassword } from '../../common/password';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CurrentUser } from '../../common/auth/current-user';
import { getRestaurantIdForUser } from '../../common/auth/restaurant-id';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('clients', 'Restaurant-side client directory, preferences, spend, visits, and profile cards.');
  }

  async findAll(user?: CurrentUser) {
    const restaurantId = user ? await getRestaurantIdForUser(this.prisma, user) : undefined;
    
    const where = restaurantId ? {
      
      restaurants: {
        some: {
          restaurantId: restaurantId
        }
      }
    } : {};

    return this.prisma.customerProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, fullName: true, email: true, phone: true } }, restaurants: true },
    });
  }

  async create(body: CreateClientDto) {
    return this.prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        passwordHash: await hashPassword(`FlyMenu-${Date.now()}`),
        customerProfile: {
          create: {
            loyaltyTier: body.loyaltyTier ?? 'STANDARD',
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        customerProfile: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.customerProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true, phone: true } }, restaurants: true },
    });
  }

  async update(id: string, body: Partial<CreateClientDto>) {
    const profile = await this.prisma.customerProfile.findUniqueOrThrow({ where: { id } });
    return this.prisma.user.update({
      where: { id: profile.userId },
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        customerProfile: {
          update: {
            loyaltyTier: body.loyaltyTier,
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        customerProfile: true,
      },
    });
  }
}
