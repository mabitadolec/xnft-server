import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { DbTxstatusService } from 'src/db-txstatus/db-txstatus.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'ws_txstatus',
  cors: true,
})
export class TxstatusGateway {
  constructor(private readonly dbTxStatusService: DbTxstatusService) {}

  @SubscribeMessage('findTxByHash')
  async findTxByHash(
    _client: Socket,
    payload: string,
  ): Promise<WsResponse<string>> {
    try {
      const data = await this.dbTxStatusService.findOne({
        txHash: payload,
      });
      return {
        event: 'events',
        data: JSON.stringify(data),
      };
    } catch (err) {
      console.error(err);
      return {
        event: 'events',
        data: 'Error',
      };
    }
  }
  @SubscribeMessage('ping')
  ping(_client: Socket, payload: string): WsResponse<string> {
    console.log('ping', payload);
    return {
      event: 'events',
      data: JSON.stringify(payload),
    };
  }
}
