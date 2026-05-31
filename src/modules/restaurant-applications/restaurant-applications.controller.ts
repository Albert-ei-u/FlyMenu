import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AddApplicationDocumentDto } from './dto/add-application-document.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';
import { RestaurantApplicationsService } from './restaurant-applications.service';

@ApiTags('Restaurant Applications')
@Controller('restaurant-applications')
export class RestaurantApplicationsController {
  constructor(private readonly applicationsService: RestaurantApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List onboarding applications', description: 'Retrieve all partner restaurant applications.' })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Submit onboarding application', description: 'Apply for a new restaurant account on the platform.' })
  create(@Body() body: CreateApplicationDto) {
    return this.applicationsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application details', description: 'Retrieve details of an application including status and attached verification documents.' })
  @ApiParam({ name: 'id', description: 'Application ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve application', description: 'Approve application, auto-generating user credentials and restaurant profiles.' })
  @ApiParam({ name: 'id', description: 'Application ID (CUID).' })
  approve(@Param('id') id: string, @Body() body: ReviewApplicationDto) {
    return this.applicationsService.review(id, 'approve', body);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject application', description: 'Reject application and set state.' })
  @ApiParam({ name: 'id', description: 'Application ID (CUID).' })
  reject(@Param('id') id: string, @Body() body: ReviewApplicationDto) {
    return this.applicationsService.review(id, 'reject', body);
  }

  @Post(':id/request-info')
  @ApiOperation({ summary: 'Request info', description: 'Request more documents or info from applicant.' })
  @ApiParam({ name: 'id', description: 'Application ID (CUID).' })
  requestInfo(@Param('id') id: string, @Body() body: ReviewApplicationDto) {
    return this.applicationsService.review(id, 'request-info', body);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Attach verification document', description: 'Attach a legal document (e.g. food license, tax certificate) to the application.' })
  @ApiParam({ name: 'id', description: 'Application ID (CUID).' })
  addDocument(@Param('id') id: string, @Body() body: AddApplicationDocumentDto) {
    return this.applicationsService.addDocument(id, body);
  }

  @Post('documents/:documentId/verify')
  @ApiOperation({ summary: 'Verify legal document', description: 'Mark an attached application document as verified.' })
  @ApiParam({ name: 'documentId', description: 'Document record ID (CUID).' })
  verifyDocument(@Param('documentId') documentId: string) {
    return this.applicationsService.verifyDocument(documentId);
  }
}

