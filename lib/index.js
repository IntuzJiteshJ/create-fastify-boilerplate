/**
 * Main orchestration: runs all scaffolding steps in order.
 * Uses a single context object; no global state.
 */

import { join } from 'path';
import { promptProjectName } from './promptProjectName.js';
import { initProject } from './initProject.js';
import { installCoreDeps } from './installCoreDeps.js';
import { promptOptionalFeatures } from './promptOptionalFeatures.js';
import { installOptionalDeps } from './installOptionalDeps.js';
import { installDevDeps } from './installDevDeps.js';
import { setupQualityGates } from './setupQualityGates.js';
import { setupVitest } from './setupVitest.js';
import { setupStryker } from './setupStryker.js';
import { copyPrTemplate } from './copyPrTemplate.js';
import { scaffoldStructure } from './scaffoldStructure.js';
import { generateReadme } from './generateReadme.js';
import { logStep } from './utils.js';

/**
 * Shared context passed through the pipeline.
 * @typedef {Object} Context
 * @property {string} projectName - Validated project directory name
 * @property {string} projectPath - Absolute path to the new project directory
 * @property {Object} options - Optional feature flags
 * @property {boolean} options.redis - Enable Redis-based caching
 * @property {boolean} options.queue - Enable background job queue
 */

export async function main() {
  const cwd = process.cwd();

  try {
    // 1. Prompt for project name (validates and re-prompts until valid)
    const projectName = await promptProjectName();
    const projectPath = join(cwd, projectName);

    const context = { projectName, projectPath, options: { redis: false, queue: false } };

    // 2. Create directory, package.json, git init, .gitignore
    logStep('Creating project directory and initializing…');
    await initProject(context);

    // 3. Install core runtime dependencies
    logStep('Installing core dependencies…');
    await installCoreDeps(context);

    // 4. Optional features (Redis, BullMQ) — prompts and conditional installs
    await promptOptionalFeatures(context);
    await installOptionalDeps(context);

    // 5. Dev dependencies (TypeScript, ts-node, nodemon, @types/node)
    logStep('Installing dev dependencies…');
    await installDevDeps(context);

    // 6. Scaffold base structure (src/, config, tsconfig, etc.) so quality tools have files to lint
    logStep('Scaffolding project structure…');
    await scaffoldStructure(context);

    // 7. Quality gates: Husky, ESLint, Prettier
    logStep('Setting up Husky and quality gates…');
    await setupQualityGates(context);

    // 8. Vitest and coverage
    logStep('Setting up Vitest…');
    await setupVitest(context);

    // 9. StrykerJS
    logStep('Setting up StrykerJS…');
    await setupStryker(context);

    // 10. GitHub PR template
    logStep('Adding GitHub PR template…');
    await copyPrTemplate(context);

    // 11. README (after structure so we can list real paths)
    logStep('Generating README…');
    await generateReadme(context);

    logStep(`Done. Run: cd ${projectName} && npm run dev`);
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}
