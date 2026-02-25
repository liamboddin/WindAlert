# WindAlert

## Starting it locally

### Docker Compose

Create a `.env`-file that sets the necessary environment variables.

```
PG_USER=yourusername
PG_PASSWORD=yourpassword
MAIL_SMTP=SmtpServerUrlOfYourMailServer
MAIL_PORT=123
MAIL_USERNAME=YourMailUsername
MAIL_PASSWORD=YourMailPassword
JWT_SECRET=LongSequenceToFulfillSecurityRequirementsTheMoreTheBetter
```

### Backend

#### Environment variables

```
PG_HOST=localhost;
PG_PASSWORD=password;
PG_PORT=15432;
PG_USER=admin;
```

#### CLI options

```
--app.ui=./frontend/dist
```

### Frontend

#### Build for 8080

```
npm run build
```

#### Dev with hot reloading

```
npm run dev
```

## TODO's

- Logo

## Deploy new changes
docker compose down && docker compose up --build -d
