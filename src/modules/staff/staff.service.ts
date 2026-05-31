import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('staff', 'Employee directory, roles, status, efficiency, and worked hours.');
  }

  findAll() {
    return this.prisma.staffMember.findMany({
      orderBy: { createdAt: 'desc' },
      include: { restaurant: true, user: { select: { id: true, email: true, fullName: true } } },
    });
  }

  create(body: CreateStaffMemberDto) {
    return this.prisma.staffMember.create({ data: body });
  }

  findOne(id: string) {
    return this.prisma.staffMember.findUnique({
      where: { id },
      include: { restaurant: true, user: { select: { id: true, email: true, fullName: true } } },
    });
  }

  update(id: string, body: Partial<CreateStaffMemberDto>) {
    return this.prisma.staffMember.update({ where: { id }, data: body });
  }
}
