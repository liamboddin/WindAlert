# WindAlert

An E-Mail-Alert-System for your personal favorite Kitesurfing-Spots. 

Create a user account with your personal e-mail you want to get the alerts sent to. Then add your kitesurfing spots via mouse-click on the map. Create wind windows with the windconditions for each spot you want to be alerted for. All that is left to do now is wait for some good conditions and get alerted in the morning as soon as some good conditions are forecasted. 

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
