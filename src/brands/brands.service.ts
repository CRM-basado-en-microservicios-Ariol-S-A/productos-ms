import {
  Logger,
  Injectable,
  OnModuleInit,
  NotFoundException,
} from '@nestjs/common';

import { PaginationDto } from 'src/common';
import { PrismaClient } from '@prisma/client';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Products Database connected');
  }

  async create(createBrandDto: CreateBrandDto) {
    const marca = await this.marcas.create({
      data: createBrandDto,
    });

    return {
      message: 'Marca registrada',
      marca,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.marcas.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      marcas: await this.marcas.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const { description, nombre } = updateBrandDto;

    const marca = await this.marcas.findFirst({
      where: { id },
    });

    if (!marca) {
      return new NotFoundException();
    }

    const updateBrand = await this.marcas.update({
      where: { id },
      data: {
        nombre,
        description,
      },
    });

    return {
      message: 'Marca actualizada',
      updateBrand,
    };
  }

  async remove(id: string) {
    const marca = await this.marcas.delete({
      where: { id },
    });

    return {
      message: 'Se elimino la marca',
      marca,
    };
  }
}
