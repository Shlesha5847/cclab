# Docker Deployment

## 1. Prepare environment variables

Create a root `.env` file from `.env.example` and fill in the values you want to use:

```env
GOOGLE_CLIENT_ID=your-google-client-id
SECRET_KEY=your-jwt-secret
MONGO_INITDB_ROOT_USERNAME=appuser
MONGO_INITDB_ROOT_PASSWORD=strong-password
FRONTEND_PORT=8080
```

If you use Google login, make sure the Google OAuth app allows your frontend origin, for example `http://localhost:8080`.

## 2. Build and start the stack

From the project root:

```bash
docker compose up --build -d
```

The app will be available at `http://localhost:${FRONTEND_PORT}`. If `FRONTEND_PORT` is not set, it defaults to `8080`.

## 3. Stop the stack

```bash
docker compose down
```

If you also want to remove MongoDB data:

```bash
docker compose down -v
```

## Services

- `frontend`: Nginx serving the Vite build on port `80`
- `backend`: Flask app served by Gunicorn on internal port `5000`
- `mongo`: MongoDB 7 with a persistent Docker volume

## Useful commands

```bash
docker compose logs -f
docker compose ps
docker compose up --build
```
