# MelonLoader API Server

Server for fetching game information for [MelonLoader](https://github.com/LavaGang/MelonLoader).

Built using TypeORM, NodeJs, Typescript, express.js, moment.js, axios, and various other projects.
## Installing / Getting a Dev environment set up

### Prerequisites:

- Nodejs
- Yarn

### Instructions:

1. Create an `ormconfig.json` file in the root directory (same place as `package.json`)
2. If you have a MySQL server, populate as follows, filling appropriate values for `$HOST`, `$USERNAME`, `$PASSWORD`, and `$DBNAME`.  
```json
{
   "type": "mysql",
   "host": "$HOST",
   "port": 3306,
   "username": "$USERNAME",
   "password": "$PASSWORD",
   "database": "$DBNAME",
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
```
3. If you don't have a MySQL server, use a SQLite database, like so:
```json
{
   "type": "sqlite",
   "database": "db.sqlite",
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
```
4. Install dependencies using `yarn`
5. Create a `.env` file containing the text `ACCOUNT_CREATION_KEY=[key to create accounts]` - you will need this key to create accounts in the database.
6. Start the server using `yarn start` - it will listen on port 7778, or you can specify `PORT=1234` in the `.env` file to override.
