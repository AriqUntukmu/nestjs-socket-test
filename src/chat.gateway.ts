import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('dewiGreeting')
  handleMessageGreeting(@MessageBody() message: string): void {
    const resp = {
      id: 5995,
      messages: message,
      splitted_messages: [message],
      products: [],
      recommendation_answer: [],
      status: 200,
    };
    this.server.emit('msgFromDewi', resp);
  }

  @SubscribeMessage('chatToDewiMessaging')
  handleMessage(@MessageBody() message: any): void {
    this.logger.log(`Message received: ${message['user_message']}`);
    this.sendMessage(`ok diterima ${message['user_message']}`);
  }

  sendMessage(message: string): void {
    this.logger.log(`Message sent: ${message}`);
    const resp = {
      id: 5995,
      messages: message,
      splitted_messages: [message],
      products: [],
      recommendation_answer: [],
      status: 200,
    };
    this.server.emit('msgFromDewi', resp);
  }

  handleConnection(client: Socket) {
    this.logger.log('Client connected');
  }
  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
  }
}
