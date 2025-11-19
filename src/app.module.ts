import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayrollTrackingModule } from './payroll-tracking/payroll-tracking.module';

@Module({
  imports: [PayrollTrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
