use ur local db to generate the migration file
yarn prisma generate
yarn prisma migrate dev

switch the .env's local db url to the real production db url
use turso's cli to apply the migration you just made
turso db shell dictionary-game < ./prisma/migrations/20240419014017\_/migration.sql
