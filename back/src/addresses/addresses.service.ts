import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Address } from 'prisma/generated/prisma/client';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateAddressDto): Promise<Address> {
    return this.prisma.address.create({ data: { ...body } });
  }

  findAll() {
    return `This action returns all addresses`;
  }

  findOne(id: number) {
    return `This action returns address ${id}`;
  }

  async findOneOrCreate(
    addr: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Address> {
    return this.prisma.address.upsert({
      where: {
        address_city_postal_code: {
          address: addr.address,
          city: addr.city,
          postal_code: addr.postal_code,
        },
      },
      update: {},
      create: addr,
    });
  }

  async update(id: number, data: UpdateAddressDto): Promise<Address> {
    return this.prisma.address.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Address | null> {
    return this.prisma.address.delete({ where: { id } });
  }
}
