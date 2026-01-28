# create-fastify-boilerplate

Scaffolds a production-ready Fastify API project with TypeScript, testing, quality gates, and CI-ready tooling.

## Run locally

**Without publishing:**

```bash
npm install
node bin/cli.js
# or
npm start
```

**From this directory (for development):**

```bash
npm link
cd /path/to/empty/dir
npx create-fastify-boilerplate
```

## Publish to npm

1. Bump version in `package.json` if needed.
2. Log in: `npm login`
3. Publish: `npm publish`

After publishing, anyone can run:

```bash
npx github:IntuzJiteshJ/create-fastify-boilerplate
```

and get a new Fastify project with validation prompts, optional Redis/BullMQ, Husky, ESLint, Prettier, Vitest, StrykerJS, and a clean `src/` structure.
