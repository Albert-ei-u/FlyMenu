import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddApplicationDocumentDto } from './dto/add-application-document.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RestaurantApplicationsService } from './restaurant-applications.service';

@Controller('restaurant-applications')
export class RestaurantApplicationsController {
  constructor(private readonly applicationsService: RestaurantApplicationsService) {}

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  create(@Body() body: CreateApplicationDto) {
    return this.applicationsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string, @Body() body: ReviewApplicationDto) {
    return this.applicationsService.review(id, 'approve', body);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() body: ReviewApplicationDto) {
    return this.applicationsService.review(id, 'reject', body);
  }

  @Post(':id/request-info')
  requestInfo(@Param('id') id: string, @Body() body: ReviewApplicationDto) {
    return this.applicationsService.review(id, 'request-info', body);
  }

  @Post(':id/documents')
  addDocument(@Param('id') id: string, @Body() body: AddApplicationDocumentDto) {
    return this.applicationsService.addDocument(id, body);
  }

  @Post('documents/:documentId/verify')
  verifyDocument(@Param('documentId') documentId: string) {
    return this.applicationsService.verifyDocument(documentId);
  }
}
