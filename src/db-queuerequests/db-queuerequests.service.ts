import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, DataQueueRequests } from '@prisma/client';

@Injectable()
export class DbQueuerequestsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.DataQueueRequestsCreateInput,
  ): Promise<{ success: boolean; data: DataQueueRequests }> {
    const success = true;
    try {
      return {
        success,
        data: await this.prisma.dataQueueRequests.create({
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
    cursor?: Prisma.DataQueueRequestsWhereUniqueInput;
    where?: Prisma.DataQueueRequestsWhereInput;
    orderBy?: Prisma.DataQueueRequestsOrderByWithRelationInput;
  }): Promise<DataQueueRequests[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.dataQueueRequests.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(
    qReqWhereUniqueInput: Prisma.DataQueueRequestsWhereUniqueInput,
  ): Promise<DataQueueRequests> {
    return this.prisma.dataQueueRequests.findUnique({
      where: qReqWhereUniqueInput,
    });
  }

  exists(where: Prisma.DataQueueRequestsWhereUniqueInput): Promise<boolean> {
    return this.prisma.dataQueueRequests
      .count({ where })
      .then((count) => count > 0);
  }

  update(params: {
    where: Prisma.DataQueueRequestsWhereUniqueInput;
    data: Prisma.DataQueueRequestsUpdateInput;
  }): Promise<DataQueueRequests> {
    const { where, data } = params;
    return this.prisma.dataQueueRequests.update({
      data,
      where,
    });
  }

  remove(
    where: Prisma.DataQueueRequestsWhereUniqueInput,
  ): Promise<DataQueueRequests> {
    return this.prisma.dataQueueRequests.delete({
      where,
    });
  }
}
