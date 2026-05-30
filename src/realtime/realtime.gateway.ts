import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },

})
export class RealtimeGateway {
  @WebSocketServer()
  
  server!: Server;

  emitOrderUpdate(payload: unknown) {
    this.server.emit('orders:update', payload);
  }

  emitNotification(payload: unknown) {
    this.server.emit('notifications:new', payload);
  }

  @SubscribeMessage('orders:join')
  joinOrderRoom(@MessageBody() orderId: string) {
    return { event: 'orders:joined', data: { orderId } };
  }
}
