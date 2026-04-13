import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

@Post('parse')
@UseInterceptors(FileInterceptor('file'))
parse(
  @UploadedFile() file: Express.Multer.File,
) {
    console.log(file)
  return this.resumeService.parse(file);
}

@Post('deploy')
deploy(
  @Body('data') data: any,
  @Body('template') template: number,
  @Body('theme') theme: string,
  @Body('color') color: string,
) {
    console.log(data, template, theme, color)
  return this.resumeService.deploy(data, template, color, theme);
}

}
