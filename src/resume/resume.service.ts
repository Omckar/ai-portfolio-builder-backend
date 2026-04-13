import { Injectable } from '@nestjs/common';
import pdfParse = require('pdf-parse');

import { AiService } from '../ai/ai.service';
import { DeployService } from '../deploy/deploy.service';

@Injectable()
export class ResumeService {

  constructor(
    private aiService: AiService,
    private deployService: DeployService,
  ) {}

  async parse(file: Express.Multer.File) {
    // ✅ 1. Extract PDF text
    const parser = new pdfParse.PDFParse({ data: file.buffer });
    const result = await parser.getText();
    const text = result.text;

    // ✅ 2. AI parsing
    const parsed = await this.aiService.parseResume(text);

    // ✅ 3. Extract clean JSON
    return this.extractAndParseJSON(parsed);
  }

  async deploy(data: any, template: number, color: string, theme: string) {
    // ✅ 4. Generate HTML
    const html = this.generateHTML(data, template, theme, color);

    // ✅ 5. Deploy
    const url = await this.deployService.deploy(html);

    return { url };
  }

  // ✅ Robust JSON extractor (IMPORTANT)
  extractAndParseJSON(raw: string) {
    try {
      // Remove markdown if present
      const cleaned = raw.replace(/```json|```/g, '').trim();

      // Extract JSON block
      const match = cleaned.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error('No JSON found');
      }

      return JSON.parse(match[0]);

    } catch (err) {
      console.error('AI RAW RESPONSE:\n', raw);
      throw new Error('Invalid AI response');
    }
  }

  generateHTML(data: any, template: number, theme: string, color: string) {
    const isDark = theme === 'dark';
    
    if (template === 1) return this.templateOne(data, isDark, color);
    if (template === 2) return this.templateTwo(data, isDark, color);
    if (template === 3) return this.templateThree(data, isDark, color);
    
    return this.templateOne(data, isDark, color);
  }

  private templateOne(data: any, isDark: boolean, color: string) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.name} | Portfolio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: ${isDark ? '#0f172a' : '#f8fafc'};
      color: ${isDark ? '#f1f5f9' : '#1e293b'};
      line-height: 1.6;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 4rem 2rem; }
    .header { text-align: center; margin-bottom: 4rem; }
    .header h1 { font-size: 3.5rem; margin: 0; color: ${color}; font-weight: 800; letter-spacing: -0.025em; }
    .header p { font-size: 1.25rem; opacity: 0.8; margin-top: 0.5rem; }
    .section { margin-top: 4rem; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; }
    .section-title::after { content: ''; flex: 1; height: 1px; background: ${isDark ? '#334155' : '#e2e8f0'}; }
    .card { 
      background: ${isDark ? '#1e293b' : '#ffffff'};
      padding: 1.5rem;
      border-radius: 1rem;
      margin-bottom: 1rem;
      border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-2px); }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-tag { 
      background: ${color}20; 
      color: ${color}; 
      padding: 0.35rem 0.85rem; 
      border-radius: 9999px; 
      font-size: 0.875rem; font-weight: 600; 
      border: 1px solid ${color}40;
    }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
    .company { font-weight: 700; font-size: 1.125rem; }
    .duration { font-size: 0.875rem; opacity: 0.6; }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>${data.name}</h1>
      <p>${data.title || 'Professional Specialist'}</p>
    </header>
    <section class="section">
      <h2 class="section-title">About</h2>
      <div class="card">${data.about || 'Innovative professional with a track record of delivering high-quality solutions.'}</div>
    </section>
    <section class="section">
      <h2 class="section-title">Experience</h2>
      ${(data.experience || []).map((e: any) => `
        <div class="card">
          <div class="exp-header">
            <span class="company">${e.company}</span>
            <span class="duration">${e.duration || ''}</span>
          </div>
          <div style="font-weight: 500; opacity: 0.9;">${e.position || ''}</div>
          <p style="margin-top: 1rem; font-size: 0.95rem;">${e.description || ''}</p>
        </div>
      `).join('')}
    </section>
    <section class="section">
      <h2 class="section-title">Education</h2>
      ${(data.education || []).map((e: any) => `
        <div class="card">
          <div class="exp-header">
            <span class="company">${e.degree || ''}</span>
            <span class="duration">${e.year || ''}</span>
          </div>
          <div style="font-weight: 500; opacity: 0.9;">${e.college || ''}</div>
          ${e.score ? `<div style="font-size: 0.85rem; margin-top: 0.5rem; color: ${color}; font-weight: bold;">Score: ${e.score}</div>` : ''}
        </div>
      `).join('')}
    </section>
    <section class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${(data.skills || []).map((s: string) => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </section>
  </div>
</body>
</html>`;
  }

  private templateTwo(data: any, isDark: boolean, color: string) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.name} | Resume</title>
  <style>
    body {
      margin: 0;
      font-family: 'Georgia', serif;
      background: ${isDark ? '#1a1a1a' : '#ffffff'};
      color: ${isDark ? '#dddddd' : '#333333'};
      padding: 50px;
    }
    .wrapper { max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 40px; }
    h1 { border-bottom: 2px solid ${color}; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
    .section { margin-bottom: 30px; }
    .section-h { font-weight: bold; text-transform: uppercase; color: ${color}; margin-bottom: 10px; border-bottom: 1px solid #eee; }
    .item { margin-bottom: 15px; }
    .item-title { font-weight: bold; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>${data.name}</h1>
    <p>${data.title || ''}</p>
    <div class="section">
      <div class="section-h">Summary</div>
      <p>${data.about || ''}</p>
    </div>
    <div class="section">
      <div class="section-h">Experience</div>
      ${(data.experience || []).map((e: any) => `
        <div class="item">
          <div class="item-title">${e.position} @ ${e.company}</div>
          <div style="font-style: italic; font-size: 0.9em;">${e.duration}</div>
          <div>${e.description || ''}</div>
        </div>
      `).join('')}
    </div>
    <div class="section">
      <div class="section-h">Skills</div>
      <p>${(data.skills || []).join(', ')}</p>
    </div>
  </div>
</body>
</html>`;
  }

  private templateThree(data: any, isDark: boolean, color: string) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.name} Portfolio</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: ${isDark ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'};
      color: ${isDark ? '#f1f5f9' : '#1e293b'};
      min-height: 100vh;
    }
    .hero {
      height: 40vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: ${color};
      color: white;
      clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    }
    .container { max-width: 1100px; margin: -50px auto 50px; padding: 0 20px; }
    .glass-card {
      background: ${isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)'};
      backdrop-filter: blur(12px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
    .badge { background: ${color}; color: white; padding: 4px 12px; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="hero">
    <h1 style="font-size: 4rem; margin: 0;">${data.name}</h1>
    <p style="font-size: 1.5rem; opacity: 0.9;">${data.title || ''}</p>
  </div>
  <div class="container">
    <div class="glass-card">
      <div class="grid">
        <div>
          <h2>Work Experience</h2>
          ${(data.experience || []).map((e: any) => `
            <div style="margin-bottom: 25px;">
              <h3 style="margin: 0;">${e.position}</h3>
              <div style="color: ${color}; font-weight: 600;">${e.company}</div>
              <small>${e.duration}</small>
              <p>${e.description || ''}</p>
            </div>
          `).join('')}
        </div>
        <div>
          <h2>Technical Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${(data.skills || []).map((s: string) => `<span class="badge">${s}</span>`).join('')}
          </div>
          <br>
          <h2>About Me</h2>
          <p>${data.about || ''}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }
}