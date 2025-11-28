// src/employee-profile/employee-profile.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import {
  ChangeRequest,
  ChangeRequestDocument,
} from './schemas/change-request.schema';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class EmployeeProfileService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(ChangeRequest.name)
    private changeRequestModel: Model<ChangeRequestDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  // ✅ Fixed: Return EmployeeDocument | null
  async findById(employeeId: string): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ employeeId })
      .populate('departmentId')
      .populate('positionId')
      .populate('managerId')
      .exec();
  }

  async findAll(): Promise<EmployeeDocument[]> {
    return this.employeeModel.find({ isActive: true }).exec();
  }

  async createEmployee(
    employeeData: Partial<Employee>,
  ): Promise<EmployeeDocument> {
    const newEmployee = new this.employeeModel({
      ...employeeData,
      employeeId: `EMP-${Date.now()}`, // Auto-generate employee ID
    });
    return newEmployee.save();
  }

  async updateEmployee(
    employeeId: string,
    updateData: Partial<Employee>,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOneAndUpdate({ employeeId }, { $set: updateData }, { new: true })
      .exec();
  }

  async deactivateEmployee(
    employeeId: string,
  ): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOneAndUpdate(
        { employeeId },
        { $set: { isActive: false } },
        { new: true },
      )
      .exec();
  }

  // Change Request Methods
  async createChangeRequest(
    requestData: Partial<ChangeRequest>,
  ): Promise<ChangeRequestDocument> {
    const newRequest = new this.changeRequestModel({
      ...requestData,
      requestId: `CR-${Date.now()}`,
    });
    return newRequest.save();
  }

  async findChangeRequestsByEmployee(
    employeeId: string,
  ): Promise<ChangeRequestDocument[]> {
    return this.changeRequestModel
      .find({ employeeId })
      .populate('employeeId')
      .populate('requestedBy')
      .populate('reviewedBy')
      .exec();
  }

  async approveChangeRequest(
    requestId: string,
    reviewedBy: string,
  ): Promise<ChangeRequestDocument | null> {
    return this.changeRequestModel
      .findOneAndUpdate(
        { requestId },
        {
          $set: {
            status: 'Approved',
            reviewedBy,
            reviewedAt: new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  // Audit Log Methods
  async createAuditLog(logData: Partial<AuditLog>): Promise<AuditLogDocument> {
    const newLog = new this.auditLogModel(logData);
    return newLog.save();
  }

  async findAuditLogsByEntity(
    entityType: string,
    entityId: string,
  ): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ entityType, entityId })
      .sort({ timestamp: -1 })
      .exec();
  }
}
