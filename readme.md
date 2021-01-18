# Yarn workspace

> We have used yarn workspace.

## Setup project

``` bash
# install dependencies

#install yarn by apt-get if there is any issue with nvm
https://stackoverflow.com/questions/46013544/yarn-install-command-error-no-such-file-or-directory-install

#steps to install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install imagemagick
sudo apt-get install graphicsmagick
sudo apt-get install ffmpeg
sudo apt-get install yarn -y

#For install extension in mac
brew install imagemagick graphicsmagick
brew install ffmpeg

# All the things should be installed with the help of yarn

yarn #This should be for initial folder.

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
