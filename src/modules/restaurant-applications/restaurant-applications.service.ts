import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';
import { AddApplicationDocumentDto } from './dto/add-application-document.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReviewApplicationDto } from './dto/review-application.dto';

@Injectable()
export class RestaurantApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('restaurant-applications', 'Partner onboarding, document review, approval, rejection, and admin notes.');
  }

  create(body: CreateApplicationDto) {
    return this.prisma.restaurantApplication.create({
      data: body,
      include: { documents: true },
    });
  }

  findAll() {
    return this.prisma.restaurantApplication.findMany({
      orderBy: { submittedAt: 'desc' },
      include: { documents: true },
    });
  }

  findOne(id: string) {
    return this.prisma.restaurantApplication.findUnique({
      where: { id },
      include: { documents: true, restaurant: true },
    });
  }

  async review(id: string, decision: 'approve' | 'reject' | 'request-info', body: ReviewApplicationDto) {
    const statusByDecision = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      'request-info': 'MORE_INFO_REQUESTED',
    } as const;

    const application = await this.prisma.restaurantApplication.update({
      where: { id },
      data: {
        status: statusByDecision[decision],
        reviewNotes: body.reviewNotes,
        reviewedAt: new Date(),
      },
      include: { documents: true, restaurant: true },
    });

    await this.prisma.activityLog.create({
      data: {
        action: `restaurant_application.${decision}`,
        entity: 'RestaurantApplication',
        entityId: id,
        metadata: {
          reviewNotes: body.reviewNotes,
          restaurantName: application.restaurantName,
        },
      },
    });

    return application;
  }

  addDocument(applicationId: string, body: AddApplicationDocumentDto) {
    return this.prisma.applicationDocument.create({
      data: {
        applicationId,
        label: body.label,
        fileUrl: body.fileUrl,
      },
    });
  }

  async verifyDocument(documentId: string) {
    const document = await this.prisma.applicationDocument.update({
      where: { id: documentId },
      data: { verifiedAt: new Date() },
    });

    await this.prisma.activityLog.create({
      data: {
        action: 'restaurant_application.document_verified',
        entity: 'ApplicationDocument',
        entityId: documentId,
        metadata: {
          label: document.label,
          applicationId: document.applicationId,
        },
      },
    });

    return document;
  }
}
