import { Module } from '@nestjs/common';
import { OrganizationStructureService } from './organization-structure.service';
import { OrganizationStructureController } from './organization-structure.controller';

@Module({
  providers: [OrganizationStructureService],
  controllers: [OrganizationStructureController]
})
export class OrganizationStructureModule {}
