# Yarn workspace

> We have used yarn workspace.

## Setup project

``` bash
# install dependencies
yarn #This should be for initial folder.
npm install #This should be for individual folders

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
