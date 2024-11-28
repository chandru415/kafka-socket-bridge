import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // You can specify your Angular app's origin here for security
  },
})
export class SocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`${client} is connected`);
  }

  handleDisconnect(client: any) {
    console.log(`${client} is disconnected`);

    this.server.disconnectSockets();
  }

  @SubscribeMessage('sendMessageToClient')
  sendMessageToClients(
    @MessageBody() data: { topic: string; message: string }
  ) {
    console.log('sendMessageToClient', data.topic, data.message);

    this.server.emit(data.topic, data.message);
  }

  @SubscribeMessage('messageFromClient') // Listening for this event from Angular
  handleMessage(@MessageBody() data: any, client: Socket): void {
    console.log('Message received from client:', data);

    // Optionally, you can emit back to the client
    this.server.emit('messageFromServer', 'Message received: ' + data);
  }
}
