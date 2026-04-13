import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResumeModule } from './resume/resume.module';
import { AiModule } from './ai/ai.module';
import { DeployModule } from './deploy/deploy.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        uri: config.get<string>('SUPABASE_DB_URL'),
        autoLoadModels: true,
        synchronize: true,
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
        },
      }),
    }),
    ResumeModule,
    AiModule,
    DeployModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
