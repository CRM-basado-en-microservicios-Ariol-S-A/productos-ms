import { IsString } from "class-validator";


export class CreateBrandDto {
    @IsString({ message: "El formato no es correcto" })
    nombre: string;

    @IsString({ message: "El formato no es correcto" })
    description: string;
}
