import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';

@ApiTags('🎬 Kinolar (Movies)')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha kinolarni olish (Filter bilan)' })
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  findAll(
    @Query('genre') genre?: string,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.moviesService.findAll({ genre, search, minPrice, maxPrice });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta kino tafsilotlari' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Yangi kino qo\'shish (Seller/Admin)' })
  create(@Body() data: any, @Request() req: any) {
    return this.moviesService.create(data, req.user);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Kinoni tahrirlash' })
  update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.moviesService.update(id, data, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @ApiOperation({ summary: 'Kinoni o\'chirish' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.moviesService.remove(id, req.user);
  }
}
