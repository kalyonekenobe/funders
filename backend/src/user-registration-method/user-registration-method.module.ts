import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { UserRegistrationMethodController } from './user-registration-method.controller';
import { UserRegistrationMethodService } from './user-registration-method.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserRegistrationMethodController],
  providers: [UserRegistrationMethodService],
  exports: [UserRegistrationMethodService],
})
export class UserRegistrationMethodModule {}
