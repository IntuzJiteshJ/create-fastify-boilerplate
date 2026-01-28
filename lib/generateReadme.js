/**
 * Renders README.md from template and writes to projectPath/README.md.
 * Sections: Introduction, Project Structure, Getting Started, How To Extend, Quality Standards.
 */

import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { render } from 'ejs';
import { getTemplatesPath } from './utils.js';

/**
 * @param {{ projectName: string, projectPath: string, options: { redis: boolean, queue: boolean } }} context
 */
export async function generateReadme(context) {
  const { projectName, projectPath, options } = context;
  const templates = getTemplatesPath();
  const templatePath = join(templates, 'README.md.ejs');

  const { existsSync } = await import('fs');
  if (!existsSync(templatePath)) {
    const fallback = `# ${projectName}\n\nA Fastify API boilerplate.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`;
    await writeFile(join(projectPath, 'README.md'), fallback);
    return;
  }

  const template = await readFile(templatePath, 'utf-8');
  const rendered = render(template, {
    projectName,
    redis: options.redis,
    queue: options.queue,
  });
  await writeFile(join(projectPath, 'README.md'), rendered);
}
