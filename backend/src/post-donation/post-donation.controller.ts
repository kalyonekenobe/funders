import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { PostDonationService } from './post-donation.service';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePostDonationDto } from './dto/update-post-donation.dto';
import { PostDonationEntity } from './entities/post-donation.entity';

@Controller('post-donations')
@ApiTags('Post donations')
export class PostDonationController {
  constructor(private readonly postDonationService: PostDonationService) {}

  @ApiOkResponse({
    description: 'The post donation with requested id',
    type: PostDonationEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post donation with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post donation to be found.',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postDonationService.findById(id);
  }

  @ApiOkResponse({
    description: 'Post donation was successfully updated.',
    type: PostDonationEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post donation with the requested id was not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot update post donation. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post donation to be updated',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDonationDto: UpdatePostDonationDto) {
    return this.postDonationService.update(id, updatePostDonationDto);
  }

  @ApiOkResponse({
    description: 'Post donation was successfully removed.',
    type: PostDonationEntity,
  })
  @ApiNotFoundResponse({
    description: 'The post donation with the requested id was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @ApiParam({
    name: 'id',
    description: 'The uuid of the post donation to be removed',
    schema: { example: '989d32c2-abd4-43d3-a420-ee175ae16b98' },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postDonationService.remove(id);
  }
}
