// NOTE: Authentication guard and strategy for the admin module
// are not implemented here because they would be similar to the
// ones already created in the AuthModule for normal users.

import { Controller, Post, Body, Patch, Param, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { HandleEditRequestDto } from './dto/handle-edit-request.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    const admin = await this.adminService.validateAdmin(
      loginDto.username,
      loginDto.password,
    );
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    return this.adminService.login(admin);
  }

  @Post('create')
  async createAdmin(@Body() createDto: AdminRegisterDto) {
    return this.adminService.createAdmin(createDto.username, createDto.password);
  }

  @Patch(':id')
  async handleEditRequest(
    @Param('id') id: number,
    @Body() body: HandleEditRequestDto,
  ) {
    return this.adminService.handleEditRequest(id, body.action, body.adminComment);
  }
}
