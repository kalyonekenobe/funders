import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRegistrationMethodService } from './user-registration-method.service';
import { UserRegistrationMethodEntity } from './entities/user-registration-method.entity';
import { CreateUserRegistrationMethodDto } from './dto/create-user-registration-method.dto';

@ApiTags('User registration methods')
@Controller('user-registration-methods')
export class UserRegistrationMethodController {
  constructor(private readonly userRegistrationMethodService: UserRegistrationMethodService) {}

  @ApiCreatedResponse({
    description: 'User registration method was successfully created.',
    type: [UserRegistrationMethodEntity],
  })
  @ApiConflictResponse({
    description: 'Cannot created user registration method. Invalid data was provided.',
  })
  @Post()
  create(@Body() createUserRegistrationMethodDto: CreateUserRegistrationMethodDto) {
    return this.userRegistrationMethodService.create(createUserRegistrationMethodDto);
  }

  @ApiOkResponse({
    description: 'The list of user registration methods',
    type: [UserRegistrationMethodEntity],
  })
  @Get()
  findAll() {
    return this.userRegistrationMethodService.findAll();
  }
}
