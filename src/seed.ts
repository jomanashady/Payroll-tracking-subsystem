import mongoose from 'mongoose';
import { DepartmentSchema } from './organization-structure/models/department.schema';
import { PositionSchema } from './organization-structure/models/position.schema';
import { PositionAssignmentSchema } from './organization-structure/models/position-assignment.schema';
import { EmployeeProfileSchema } from './employee-profile/models/employee-profile.schema';
import { AppraisalCycleSchema } from './performance/models/appraisal-cycle.schema';
import { AppraisalTemplateSchema } from './performance/models/appraisal-template.schema';
import { EmployeeStatus, ContractType, WorkType, Gender, MaritalStatus } from './employee-profile/enums/employee-profile.enums';
import { AppraisalTemplateType, AppraisalRatingScaleType, AppraisalCycleStatus } from './performance/enums/performance.enums';

async function seed() {
  const mongoUri = 'mongodb://localhost:27017/hr-system';
  
  console.log(`Connecting to MongoDB at ${mongoUri}...`);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  // Create Models
  const DepartmentModel = mongoose.model('Department', DepartmentSchema);
  const PositionModel = mongoose.model('Position', PositionSchema);
  const PositionAssignmentModel = mongoose.model('PositionAssignment', PositionAssignmentSchema);
  const EmployeeProfileModel = mongoose.model('EmployeeProfile', EmployeeProfileSchema);
  const AppraisalCycleModel = mongoose.model('AppraisalCycle', AppraisalCycleSchema);
  const AppraisalTemplateModel = mongoose.model('AppraisalTemplate', AppraisalTemplateSchema);

  // Clear existing data
  console.log('Clearing existing data...');
  await DepartmentModel.deleteMany({});
  await PositionModel.deleteMany({});
  await PositionAssignmentModel.deleteMany({});
  await EmployeeProfileModel.deleteMany({});
  await AppraisalCycleModel.deleteMany({});
  await AppraisalTemplateModel.deleteMany({});
  console.log('Data cleared.');

  // 1. Create Departments
  console.log('Seeding Departments...');
  const hrDept = await DepartmentModel.create({
    code: 'HR-001',
    name: 'Human Resources',
    description: 'Handles all HR related tasks',
    isActive: true,
  });

  const engDept = await DepartmentModel.create({
    code: 'ENG-001',
    name: 'Engineering',
    description: 'Software Development and Engineering',
    isActive: true,
  });

  const salesDept = await DepartmentModel.create({
    code: 'SALES-001',
    name: 'Sales',
    description: 'Sales and Marketing',
    isActive: true,
  });
  console.log('Departments seeded.');

  // 2. Create Positions
  console.log('Seeding Positions...');
  const hrManagerPos = await PositionModel.create({
    code: 'POS-HR-MGR',
    title: 'HR Manager',
    description: 'Manager of Human Resources',
    departmentId: hrDept._id,
    isActive: true,
  });

  const softwareEngPos = await PositionModel.create({
    code: 'POS-SWE',
    title: 'Software Engineer',
    description: 'Full Stack Developer',
    departmentId: engDept._id,
    isActive: true,
  });

  const salesRepPos = await PositionModel.create({
    code: 'POS-SALES-REP',
    title: 'Sales Representative',
    description: 'Sales Representative',
    departmentId: salesDept._id,
    isActive: true,
  });
  console.log('Positions seeded.');

  // 3. Create Employees
  console.log('Seeding Employees...');
  const alice = await EmployeeProfileModel.create({
    firstName: 'Alice',
    lastName: 'Smith',
    fullName: 'Alice Smith',
    nationalId: 'NAT-ALICE-001',
    employeeNumber: 'EMP-001',
    dateOfHire: new Date('2020-01-01'),
    workEmail: 'alice@company.com',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: hrManagerPos._id,
    primaryDepartmentId: hrDept._id,
  });

  const bob = await EmployeeProfileModel.create({
    firstName: 'Bob',
    lastName: 'Jones',
    fullName: 'Bob Jones',
    nationalId: 'NAT-BOB-002',
    employeeNumber: 'EMP-002',
    dateOfHire: new Date('2021-05-15'),
    workEmail: 'bob@company.com',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: softwareEngPos._id,
    primaryDepartmentId: engDept._id,
  });

  const charlie = await EmployeeProfileModel.create({
    firstName: 'Charlie',
    lastName: 'Brown',
    fullName: 'Charlie Brown',
    nationalId: 'NAT-CHARLIE-003',
    employeeNumber: 'EMP-003',
    dateOfHire: new Date('2022-03-10'),
    workEmail: 'charlie@company.com',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: salesRepPos._id,
    primaryDepartmentId: salesDept._id,
  });
  console.log('Employees seeded.');

  // 4. Create Position Assignments
  console.log('Seeding Position Assignments...');
  await PositionAssignmentModel.create({
    employeeProfileId: alice._id,
    positionId: hrManagerPos._id,
    departmentId: hrDept._id,
    startDate: new Date('2020-01-01'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: bob._id,
    positionId: softwareEngPos._id,
    departmentId: engDept._id,
    startDate: new Date('2021-05-15'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: charlie._id,
    positionId: salesRepPos._id,
    departmentId: salesDept._id,
    startDate: new Date('2022-03-10'),
  });
  console.log('Position Assignments seeded.');

  // 5. Create Performance Data
  console.log('Seeding Performance Data...');
  const template = await AppraisalTemplateModel.create({
    name: 'Annual Review Template 2025',
    description: 'Standard annual review template',
    templateType: AppraisalTemplateType.ANNUAL,
    isActive: true,
    ratingScale: {
      type: AppraisalRatingScaleType.FIVE_POINT,
      min: 1,
      max: 5,
      step: 1,
      labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    },
    sections: [
      {
        key: 'core_values',
        title: 'Core Values',
        weight: 50,
        criteria: [
          { key: 'integrity', title: 'Integrity', weight: 50 },
          { key: 'teamwork', title: 'Teamwork', weight: 50 },
        ],
      },
      {
        key: 'goals',
        title: 'Goals',
        weight: 50,
        criteria: [
          { key: 'goal_achievement', title: 'Goal Achievement', weight: 100 },
        ],
      },
    ],
  });

  await AppraisalCycleModel.create({
    name: '2025 Annual Review Cycle',
    description: 'Performance review for the year 2025',
    cycleType: AppraisalTemplateType.ANNUAL,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: AppraisalCycleStatus.PLANNED,
    templates: [
      {
        templateId: template._id,
        departmentIds: [hrDept._id, engDept._id, salesDept._id],
      },
    ],
  });
  console.log('Performance Data seeded.');

  console.log('Seeding completed successfully.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
