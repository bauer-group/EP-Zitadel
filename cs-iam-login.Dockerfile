# ===============================================================================
# BAUER GROUP — Zitadel Login v2 (branded, per-IdP brand logos)
# ===============================================================================
# Self-contained multi-stage build of apps/login from this monorepo. The
# workspace packages (@zitadel/client, @zitadel/proto) + buf proto codegen are
# all present here, so it builds exactly as upstream does — no published-package
# shortcut. Only customization: src/components/idps/sign-in-with-generic.tsx
# (real brand logos via simple-icons).
#
#   docker build -f cs-iam-login.Dockerfile -t cs-iam/login .
# ===============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Builder — produce the standalone Next build
# ---------------------------------------------------------------------------
FROM node:24-alpine AS builder
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && apk add --no-cache git ca-certificates
WORKDIR /repo

COPY . .
RUN pnpm install --no-frozen-lockfile
# Generate the protobuf TS (buf) that @zitadel/client + apps/login depend on.
RUN pnpm --filter @zitadel/proto generate
# Build the login (nx orchestrates @zitadel/client → @zitadel/login standalone).
RUN pnpm nx run @zitadel/login:build

# ---------------------------------------------------------------------------
# Stage 2: Runtime — mirrors upstream apps/login/Dockerfile
# ---------------------------------------------------------------------------
FROM node:24-alpine

LABEL vendor="BAUER GROUP"
LABEL maintainer="Karl Bauer <karl.bauer@bauer-group.com>"

LABEL org.opencontainers.image.title="EP-Zitadel Login v2"
LABEL org.opencontainers.image.description="Zitadel Login v2 with per-IdP brand logos - BAUER GROUP fork (EP-Zitadel)"
LABEL org.opencontainers.image.vendor="BAUER GROUP"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/bauer-group/EP-Zitadel"

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
RUN mkdir -p /.env-file && touch /.env-file/.env && chown -R nextjs:nodejs /.env-file

COPY --from=builder --chown=nextjs:nodejs /repo/apps/login/.next/standalone ./

USER nextjs
ENV HOSTNAME="::" \
    PORT="3000" \
    NODE_ENV="production" \
    NODE_OPTIONS="--use-openssl-ca --require /app/load-ssl-cert-dir.cjs" \
    SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt" \
    ZITADEL_TLS_ENABLED="false" \
    OTEL_SERVICE_NAME="zitadel-login" \
    OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD ["/usr/local/bin/node", "/app/healthcheck.mjs", "/ui/v2/login/ready"]

ENTRYPOINT ["/app/entrypoint.sh", "node", "apps/login/server.js"]
