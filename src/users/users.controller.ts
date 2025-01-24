import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    async findAllUsers() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            return "No users on this platform"
        }
    }

    @Get(':id')
     async findUserByID( @Param('id') id ) {
        try {
            return await this.userService.getUserById(id)
        } catch (error) {
            return "No user with such id";
        }
    }
}
