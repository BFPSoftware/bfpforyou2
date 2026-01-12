# syntax=docker.io/docker/dockerfile:1

# Use Windows Server Core base image
# IMPORTANT: Windows containers require the host OS version to match the container OS version
# - If building on Windows 10, you may need to use a compatible version or build on the target server
# - ltsc2022 = Windows Server 2022 (requires Windows Server 2022 or compatible host)
# - ltsc2019 = Windows Server 2019 (requires Windows Server 2019 or compatible host)
# - 1809 = Windows Server 2019 (older, requires Windows 10 1809 or compatible host)
#
# Build with: docker build -t ghcr.io/bfpsoftware/bfpforyou2:latest .
# Or specify version: docker build --build-arg WINDOWS_VERSION=ltsc2019 -t ghcr.io/bfpsoftware/bfpforyou2:latest .
ARG WINDOWS_VERSION=ltsc2019
FROM mcr.microsoft.com/windows/servercore:${WINDOWS_VERSION} AS base

# Set PowerShell as the default shell (using full path)
SHELL ["C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Install Node.js 20
RUN Write-Host 'Downloading Node.js...'; \
    Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile 'nodejs.msi' -UseBasicParsing; \
    Write-Host 'Installing Node.js...'; \
    Start-Process msiexec.exe -ArgumentList '/i', 'nodejs.msi', '/quiet', '/norestart' -Wait; \
    Remove-Item nodejs.msi; \
    $env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH', 'User'); \
    [System.Environment]::SetEnvironmentVariable('PATH', $env:PATH, 'Machine')

# Set PATH environment variable so Node.js is available in all stages
# Node.js installs to Program Files, so we need to add it to PATH
RUN $nodePath = 'C:\Program Files\nodejs'; \
    $currentPath = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine'); \
    if ($currentPath -notlike '*nodejs*') { \
        [System.Environment]::SetEnvironmentVariable('PATH', $currentPath + ';' + $nodePath, 'Machine') \
    }

# Verify Node.js installation and install yarn globally
RUN $env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH', 'User'); \
    Write-Host 'Verifying Node.js installation...'; \
    node --version; \
    npm --version; \
    Write-Host 'Installing yarn globally...'; \
    npm install -g yarn

# Set ENV so PATH persists across stages
ENV PATH="C:\Program Files\nodejs;${PATH}"

# Install dependencies only when needed
FROM base AS deps
SHELL ["C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN $env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH', 'User'); \
    if (Test-Path yarn.lock) { yarn --frozen-lockfile } \
    elseif (Test-Path package-lock.json) { npm ci } \
    elseif (Test-Path pnpm-lock.yaml) { corepack enable pnpm; pnpm i --frozen-lockfile } \
    else { Write-Host 'Lockfile not found.'; exit 1 }

# Rebuild the source code only when needed
FROM base AS builder
SHELL ["C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# Increase Node.js memory limit for the build process
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN $env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH', 'User'); \
    if (Test-Path yarn.lock) { yarn run build } \
    elseif (Test-Path package-lock.json) { npm run build } \
    elseif (Test-Path pnpm-lock.yaml) { corepack enable pnpm; pnpm run build } \
    else { Write-Host 'Lockfile not found.'; exit 1 }

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]