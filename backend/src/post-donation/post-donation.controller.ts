import { Controller } from '@nestjs/common';
import { PostDonationService } from './post-donation.service';

@Controller()
export class PostDonationController {
  constructor(private readonly postDonationService: PostDonationService) {}
}
