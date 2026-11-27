#!/bin/sh
set -e
# Start: migracje → seed (kategorie/technologie) → seed demo → API.
# Brak osobnego kontenera migrate → brak Exited na liście.
npx prisma migrate deploy
npx prisma db seed
npm run prisma:seed:demo
exec node server.js
