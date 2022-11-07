import { Injectable } from '@nestjs/common';
import { DataMintDetailsRecords, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DbMintdetailsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.DataMintDetailsRecordsCreateInput,
  ): Promise<{ success: boolean; data: DataMintDetailsRecords }> {
    try {
      return {
        success: true,
        data: await this.prisma.dataMintDetailsRecords.create({
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
    cursor?: Prisma.DataMintDetailsRecordsWhereUniqueInput;
    where?: Prisma.DataMintDetailsRecordsWhereInput;
    orderBy?: Prisma.DataMintDetailsRecordsOrderByWithRelationInput;
  }): Promise<DataMintDetailsRecords[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.dataMintDetailsRecords.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(
    qReqWhereUniqueInput: Prisma.DataMintDetailsRecordsWhereUniqueInput,
  ): Promise<DataMintDetailsRecords> {
    return this.prisma.dataMintDetailsRecords.findUnique({
      where: qReqWhereUniqueInput,
    });
  }

  exists(where: Prisma.DataMintDetailsRecordsWhereInput): Promise<boolean> {
    return this.prisma.dataMintDetailsRecords
      .count({ where })
      .then((count) => count > 0);
  }

  update(params: {
    where: Prisma.DataMintDetailsRecordsWhereUniqueInput;
    data: Prisma.DataMintDetailsRecordsUpdateInput;
  }): Promise<DataMintDetailsRecords> {
    const { where, data } = params;
    return this.prisma.dataMintDetailsRecords.update({
      data,
      where,
    });
  }

  remove(
    where: Prisma.DataMintDetailsRecordsWhereUniqueInput,
  ): Promise<DataMintDetailsRecords> {
    return this.prisma.dataMintDetailsRecords.delete({
      where,
    });
  }
}
