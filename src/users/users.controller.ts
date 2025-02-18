import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  async createUser(@Body() body: { name: string; password: string }) {
    return await this.usersService.createUser(body.name, body.password);
  }

  @Post('login')
  async userLogin(@Body() body: { name: string; password: string }) {
    return await this.usersService.login(body.name, body.password);
  }

  @Get()
  async findAll() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getSingleUser(id);
  }

  @Put('update-user/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() body: { name?: string; password?: string },
  ) {
    return await this.usersService.updateUser(id, body.name, body.password);
  }

  @Delete(':id')
  async deleteSingleUser(@Param('id') id: string) {
    return await this.usersService.deleteUserById(id);
  }
}
