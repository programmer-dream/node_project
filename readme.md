# Yarn workspace

> We have used yarn workspace.

## Setup project

``` bash
# install dependencies
yarn #This should be for initial folder.
npm install #This should be for individual folders

Create Database
Change DB settings in config/database.js
Change env settings in config/env.js

# Migrate Db Command 
npx sequelize-cli db:migrate #Run Migration

# Seeder Db Command 
npx sequelize-cli db:seed:all #Run DB seed for admin user

#language SQL File.
Import the sql file for languaes in languages folder.

# Serve different folders with yarn workspace
yarn start:folderName

# Serve all folders
yarn start
```

## Migrations for DB.

``` bash
# Create Migration Command 
npx sequelize-cli migration:create --name migrationName

# Migrate Db Command 
npx sequelize-cli db:migrate
```

## Seeder for DB.

``` bash
# Create Seeder Command 
npx sequelize-cli seed:generate --name seederName

# Seed one file
npx sequelize-cli db:seed --seed nameOfSeed

# Seeder Db Command 
npx sequelize-cli db:seed:all
