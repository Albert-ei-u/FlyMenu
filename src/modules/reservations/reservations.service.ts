import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { createConfirmationNumber } from '../../common/order-number';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser } from '../../common/auth/current-user';
import { getRestaurantIdForUser } from '../../common/auth/restaurant-id';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('reservations', 'Bookings, table selection, party size, special requests, confirmation numbers, and QR codes.');
  }

  async findAll(user?: CurrentUser) {
    const restaurantId = user ? await getRestaurantIdForUser(this.prisma, user) : undefined;
    const where = restaurantId ? { restaurantId } : {};

    return this.prisma.reservation.findMany({
      where,
      orderBy: { reservationDate: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true } },
        table: { select: { id: true, code: true } },
      },
    });
  }

  async availability(query: CheckAvailabilityDto) {
    const dayStart = new Date(query.date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const [restaurant, tables, reservations] = await Promise.all([
      this.prisma.restaurant.findUnique({
        where: { id: query.restaurantId },
        select: {
          id: true,
          name: true,
          openingTime: true,
          closingTime: true,
          maxPartySize: true,
        },
      }),
      this.prisma.restaurantTable.findMany({
        where: {
          restaurantId: query.restaurantId,
          isActive: true,
          capacity: { gte: Number(query.partySize) },
        },
        orderBy: [{ capacity: 'asc' }, { code: 'asc' }],
      }),
      this.prisma.reservation.findMany({
        where: {
          restaurantId: query.restaurantId,
          reservationDate: { gte: dayStart, lt: dayEnd },
          status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
        },
        select: {
          tableId: true,
          reservationTime: true,
        },
      }),
    ]);

    const slots = this.buildSlots(restaurant?.openingTime, restaurant?.closingTime);
    const availability = slots.map((time) => {
      const reservedTableIds = new Set(
        reservations
          .filter((reservation) => reservation.reservationTime === time)
          .map((reservation) => reservation.tableId)
          .filter(Boolean),
      );
      const availableTables = tables.filter((table) => !reservedTableIds.has(table.id));

      return {
        time,
        available: availableTables.length > 0,
        tablesLeft: availableTables.length,
        tables: availableTables,
      };
    });

    return {
      restaurant,
      date: query.date,
      partySize: Number(query.partySize),
      availability,
    };
  }

  create(body: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        confirmationNumber: createConfirmationNumber(),
        restaurantId: body.restaurantId,
        tableId: body.tableId,
        guestName: body.guestName,
        contactNumber: body.contactNumber,
        partySize: body.partySize,
        reservationDate: new Date(body.reservationDate),
        reservationTime: body.reservationTime,
        occasion: body.occasion,
        allergies: body.allergies,
        specialRequests: body.specialRequests,
        accessibilityNeeds: body.accessibilityNeeds ?? false,
        status: 'CONFIRMED',
      },
      include: { restaurant: true, table: true },
    });
  }

  findOne(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { restaurant: true, table: true },
    });
  }

  cancel(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  private buildSlots(openingTime?: string | null, closingTime?: string | null) {
    const fallbackSlots = ['11:30', '12:00', '13:00', '13:30', '19:00', '20:00', '21:30', '22:00'];

    if (!openingTime || !closingTime) {
      return fallbackSlots;
    }

    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    if (Number.isNaN(openHour) || Number.isNaN(closeHour)) {
      return fallbackSlots;
    }

    const slots: string[] = [];
    const current = new Date();
    current.setHours(openHour, openMinute || 0, 0, 0);

    const close = new Date();
    close.setHours(closeHour, closeMinute || 0, 0, 0);

    while (current < close) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + 90);
    }

    return slots;
  }
}
