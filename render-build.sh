set -o errexit

bun install
bun run build
bunx --bun prisma generate 
bunx --bun prisma migrate deploy