import { Injectable } from '@nestjs/common';
import { Prisma, DataTransactionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DbTxstatusService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.DataTransactionStatusCreateInput,
  ): Promise<{ success: boolean; data: DataTransactionStatus }> {
    const success = true;
    try {
      return {
        success,
        data: await this.prisma.dataTransactionStatus.create({
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
    cursor?: Prisma.DataTransactionStatusWhereUniqueInput;
    where?: Prisma.DataTransactionStatusWhereInput;
    orderBy?: Prisma.DataTransactionStatusOrderByWithRelationInput;
  }): Promise<DataTransactionStatus[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.dataTransactionStatus.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(
    qReqWhereUniqueInput: Prisma.DataTransactionStatusWhereUniqueInput,
  ): Promise<DataTransactionStatus> {
    return this.prisma.dataTransactionStatus.findUnique({
      where: qReqWhereUniqueInput,
    });
  }

  exists(
    where: Prisma.DataTransactionStatusWhereUniqueInput,
  ): Promise<boolean> {
    return this.prisma.dataTransactionStatus
      .count({ where })
      .then((count) => count > 0);
  }

  update(params: {
    where: Prisma.DataTransactionStatusWhereUniqueInput;
    data: Prisma.DataTransactionStatusUpdateInput;
  }): Promise<DataTransactionStatus> {
    const { where, data } = params;
    return this.prisma.dataTransactionStatus.update({
      data,
      where,
    });
  }

  remove(
    where: Prisma.DataTransactionStatusWhereUniqueInput,
  ): Promise<DataTransactionStatus> {
    return this.prisma.dataTransactionStatus.delete({
      where,
    });
  }
}
