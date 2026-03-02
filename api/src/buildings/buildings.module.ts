import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [BuildingsService],
    exports: [BuildingsService],
})
export class BuildingsModule { }
