#!/bin/sh
set -e
# Prod one-shot: schemat przed API. Bez seed. Brak osobnego kontenera migrate → brak Exited na liście.
npx prisma migrate deploy
exec node server.js
