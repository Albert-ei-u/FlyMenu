import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RealtimeModule } from './realtime/realtime.module';
import { EmailModule } from './integrations/email/email.module';
import { StorageModule } from './integrations/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { RestaurantApplicationsModule } from './modules/restaurant-applications/restaurant-applications.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { CustomersModule } from './modules/customers/customers.module';
import { StaffModule } from './modules/staff/staff.module';
import { ClientsModule } from './modules/clients/clients.module';
import { OperationsModule } from './modules/operations/operations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PlatformModule } from './modules/platform/platform.module';
import { MediaModule } from './modules/media/media.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TablesModule } from './modules/tables/tables.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RealtimeModule,
    EmailModule,
    StorageModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    RestaurantApplicationsModule,
    MenuModule,
    OrdersModule,
    ReservationsModule,
    CustomersModule,
    StaffModule,
    ClientsModule,
    OperationsModule,
    NotificationsModule,
    AnalyticsModule,
    PlatformModule,
    MediaModule,
    SettingsModule,
    TablesModule,
    FavoritesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
