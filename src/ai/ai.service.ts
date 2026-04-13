import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
    async parseResume(text: string) {
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'meta-llama/llama-3-8b-instruct',
      messages: [
        {
          role: 'user',
          content: `
Extract resume into JSON:
{
  "name": "",
  "title": "",
  "skills": [],
  "projects": [],
  "experience": []
}

Resume:
${text}
          `,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    }
  );

  return res.data.choices[0].message.content;
}
}
