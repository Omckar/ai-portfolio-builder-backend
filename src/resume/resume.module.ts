import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { AiModule } from '../ai/ai.module';
import { DeployModule } from '../deploy/deploy.module';

@Module({
  imports: [AiModule, DeployModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}