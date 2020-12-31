# Power Generation by Country

## Demo

https://powergeneration.herokuapp.com

## Deploying to Heroku with Docker

In /server:

```
heroku create [NEW_APP_NAME]
```

```
heroku container:login
```

```
heroku container:push web --app [NEW_APP_NAME]
```

```
heroku container:release web --app [NEW_APP_NAME]
```