import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('👤 User Cabinet: Profil')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Mening profilim' })
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  @Put('update')
  @ApiOperation({ summary: 'Profilni tahrirlash' })
  updateProfile(@Request() req: any, @Body() data: any) {
    return this.usersService.update(req.user.sub, data);
  }

  @Get('my-movies')
  @ApiOperation({ summary: 'Sotib olingan kinolarim' })
  getMyGames(@Request() req: any) {
    return this.usersService.getMyOrders(req.user.sub);
  }
}
