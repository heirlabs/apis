# docs.heir.es — built and served from the Railway project alongside the rest
# of the platform (previously Vercel).
#
# Two stages so the runtime image contains Node + the built static site and
# nothing else: no VitePress toolchain, and none of this repo's API
# dependencies (mongoose/express/jwt), which the docs do not need.
#
# REQUIRED dashboard setting: Networking → Public Networking → Target Port =
# 3001, exactly as for the main web service. Railway's proxy has no other way
# to learn the port, whatever this file or the PORT variable say.

# ---------- build ----------
FROM node:20-bookworm-slim AS build

WORKDIR /app

# Install with dev dependencies — VitePress is a devDependency and is required
# to build. Copy manifests first so this layer caches across content edits.
COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY docs ./docs
RUN npm run docs:build

# ---------- runtime ----------
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Drop root: nothing here needs to write to the filesystem.
USER node

COPY --chown=node:node serve-docs.mjs ./serve-docs.mjs
COPY --chown=node:node --from=build /app/docs/.vitepress/dist ./docs/.vitepress/dist

EXPOSE 3001

CMD ["node", "serve-docs.mjs"]
