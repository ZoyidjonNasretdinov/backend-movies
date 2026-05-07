import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';

@ApiTags('📊 Dashboard & Statistika')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '🛡️ Admin uchun umumiy statistika' })
  async getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('seller/stats')
  @Roles(Role.SELLER)
  @ApiOperation({ summary: '🏪 Seller uchun shaxsiy statistika' })
  async getSellerStats(@Request() req: any) {
    return this.dashboardService.getSellerStats(req.user.sub);
  }

  @Get('user/cabinet')
  @Roles(Role.USER, Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: '👤 User kabineti' })
  async getUserDashboard(@Request() req: any) {
    return {
      success: true,
      role: req.user.role,
      message: 'Xush kelibsiz kino ishqibozi!',
      user: req.user,
    };
  }
}
