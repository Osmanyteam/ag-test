# Requirements
* nodejs >= 16.15.0
* yarn
* mysql >= 5.0.0

## Setup backend
### run migrations
```
npx prisma migrate deploy
```
### Create .env file
```
mv .env.example .env
```
### Add global package dotenv-cli
```
yarn global add dotenv-cli
```
### Run development
```
yarn dev
```
### Run production
```
yarn start
```