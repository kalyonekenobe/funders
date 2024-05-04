import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { ChargeDto } from './dto/charge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Auth } from '../decorators/auth.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Payment intent was successfully created.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('charge')
  async charge(@Body() chargeDto: ChargeDto) {
    return this.paymentService.charge(chargeDto);
  }
}
