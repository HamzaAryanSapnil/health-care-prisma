set -o errexit

bun install
bun run build
bun run build:all
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio
bun run db:seed
bun run dev