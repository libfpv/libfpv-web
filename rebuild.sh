#!/bin/bash
# Manual redeploy on the VPS (CI does the same through /usr/local/bin/deploy-libfpv-web).
set -e

git pull
docker compose build
docker compose up -d --remove-orphans
