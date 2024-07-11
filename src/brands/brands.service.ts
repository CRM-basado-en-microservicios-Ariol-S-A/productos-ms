import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {

    const marca = await this.prisma.marcas.create({
      data: createBrandDto
    });

    return {
      message: "Marca registrada",
      marca,
    };
  }

  async findAll( paginationDto: PaginationDto ) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.marcas.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      marcas: await this.prisma.marcas.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const { description, nombre } = updateBrandDto;

    const marca = await this.prisma.marcas.findFirst({
      where: { id }
    });

    if( !marca ){
      return new NotFoundException();
    }

    const updateBrand = await this.prisma.marcas.update({
      where: { id },
      data: {
        nombre,
        description
      }
    })

    return {
      message: "Marca actualizada",
      updateBrand,
    }
  }

  async remove(id: string) {
    const marca =  await this.prisma.marcas.delete({
      where: { id }
    });

    return {
      message: "Se elimino la marca",
      marca,
    }
  }
}
