import { Module } from '@nestjs/common';
import { DeployService } from './deploy.service';

@Module({
  providers: [DeployService],
  exports: [DeployService],
})
export class DeployModule {}
