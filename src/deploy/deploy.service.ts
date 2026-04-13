import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DeployService {

    

 async deploy(html: string) {
  const res = await axios.post(
    'https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1',
    {
      name: 'ai-portfolio',
      files: [
        {
          file: 'index.html',
          data: html,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return `https://${res.data.url}`;
}
}