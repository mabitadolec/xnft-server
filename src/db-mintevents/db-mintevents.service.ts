import { Injectable } from '@nestjs/common';
import { Prisma, DataMintEvents } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DbMinteventsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.DataMintEventsCreateInput,
  ): Promise<{ success: boolean; data: DataMintEvents }> {
    try {
      return {
        success: true,
        data: await this.prisma.dataMintEvents.create({
          data,
        }),
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        data: null,
      };
    }
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DataMintEventsWhereUniqueInput;
    where?: Prisma.DataMintEventsWhereInput;
    orderBy?: Prisma.DataMintEventsOrderByWithRelationInput;
  }): Promise<DataMintEvents[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.dataMintEvents.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(
    qReqWhereUniqueInput: Prisma.DataMintEventsWhereUniqueInput,
  ): Promise<DataMintEvents> {
    return this.prisma.dataMintEvents.findUnique({
      where: qReqWhereUniqueInput,
    });
  }

  exists(where: Prisma.DataMintEventsWhereInput): Promise<boolean> {
    return this.prisma.dataMintEvents
      .count({ where })
      .then((count) => count > 0);
  }

  update(params: {
    where: Prisma.DataMintEventsWhereUniqueInput;
    data: Prisma.DataMintEventsUpdateInput;
  }): Promise<DataMintEvents> {
    const { where, data } = params;
    return this.prisma.dataMintEvents.update({
      data,
      where,
    });
  }

  remove(
    where: Prisma.DataMintEventsWhereUniqueInput,
  ): Promise<DataMintEvents> {
    return this.prisma.dataMintEvents.delete({
      where,
    });
  }
}
