import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from './current-user';

/**
 * Gets the restaurant ID for a user.
 * - If the user is a SUPER_ADMIN, it returns undefined (meaning all restaurants).
 * - Otherwise, it finds the restaurant owned by the user.
 */
export async function getRestaurantIdForUser(prisma: PrismaService, user: CurrentUser): Promise<string | undefined> {
  if (user.role === 'SUPER_ADMIN') {
    return undefined;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: user.sub },
    select: { id: true },
  });

  if (!restaurant) {
    throw new BadRequestException('No restaurant found for this user.');
  }

  return restaurant.id;
}
