import {
  Logger,
  Injectable,
  OnModuleInit,
  HttpStatus,
} from '@nestjs/common';

import { PaginationDto } from 'src/common';
import { PrismaClient } from '@prisma/client';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BrandsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Products Database connected');
  }

  async create(createBrandDto: CreateBrandDto) {
    const marcaExiste = await this.marcas.findFirst({
      where: { nombre : createBrandDto.nombre}
    });

    if( marcaExiste) {
      throw new RpcException({
        message: "La marca ya esta registrada",
        status: HttpStatus.BAD_REQUEST
      });
    } 

    const marca = await this.marcas.create({
      data: createBrandDto,
    });

    return {
      message: 'Se registro la marca exitosamente',
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
    const { descripcion, nombre } = updateBrandDto;

    const marca = await this.marcas.findFirst({
      where: { id },
    });

    if (!marca) {
      throw new RpcException({
        message: "No se encontro la marca",
        status: HttpStatus.NOT_FOUND
      });
    }

    const updateBrand = await this.marcas.update({
      where: { id },
      data: {
        nombre,
        descripcion,
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
