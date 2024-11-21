## Steps to setup Backend
## Steps to setup Backend

<b>Step 1:</b> Install MySql Database using docker.

```
docker-compose -f development.yml up --build -d db
```

or

```
docker compose -f development.yml up --build -d db
```

<b>Step 2:</b>
Create `.env` file and export the file.
Ask developer for env file

```
export $(grep -v '^#' .env | xargs)
```

<b>Step 4:</b>
Install the dependencies using npm.

```
npm install
```

<b>Step 5: here</b>
Start the backend server on the port 8000

```
nodemon
```

# Creating Migrations

### To create migration skeleton file

```
npx sequelize-cli migration:generate --name <name>
```

### To apply migrations

```
npx sequelize-cli db:migrate
```

### To revert migrations

```
npx sequelize-cli db:migrate:undo
```

### To apply seeders and

```
npx sequelize-cli db:seed:all
```

### To apply seeders for specific file

```
npx sequelize-cli db:seed --seed 20220519083444-activity-data.js
```

# Maintain Code Structure

### To apply pretier before commit

```
npm run format
```

# Maintain Code Test

### To run test case

```
npm run test
```

## Note:

`Do not forget to change in the model file if changes are made in the migrations.`

## For more information:

<a href="https://sequelize.org/master/manual/migrations.html">Click Here</a>
