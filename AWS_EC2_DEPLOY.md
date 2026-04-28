# AWS EC2 Docker Deployment

This project is already set up to run with Docker Compose. The simplest AWS deployment path is:

1. Launch an Ubuntu EC2 instance
2. Install Docker and Docker Compose plugin
3. Copy this project to the instance
4. Create a production `.env`
5. Run `docker compose up --build -d`

## 1. Create the EC2 instance

Use an Ubuntu LTS instance and allow these inbound security group rules:

- `22` for SSH from your IP
- `80` for HTTP from anywhere

If you plan to test on a nonstandard port, allow that port too.

## 2. Connect to the server

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## 3. Install Docker

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

Verify:

```bash
docker --version
docker compose version
```

## 4. Copy the project to EC2

If the code is in Git:

```bash
git clone <your-repo-url>
cd cclab
```

Or copy it with `scp` from your machine.

## 5. Create production environment variables

Create a root `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id
SECRET_KEY=use-a-long-random-secret
MONGO_INITDB_ROOT_USERNAME=appuser
MONGO_INITDB_ROOT_PASSWORD=use-a-strong-password
FRONTEND_PORT=80
```

If you use Google login, add your EC2 public URL to Google OAuth allowed origins, for example:

- `http://YOUR_EC2_PUBLIC_IP`
- or your domain, like `https://app.example.com`, after you set up DNS and HTTPS

## 6. Start the containers

From the project root:

```bash
docker compose up --build -d
```

Check status:

```bash
docker compose ps
docker compose logs -f
```

## 7. Open the app

Visit:

```text
http://YOUR_EC2_PUBLIC_IP
```

## Updates

When you change code:

```bash
git pull
docker compose up --build -d
```

## Important note

This setup stores MongoDB data inside a Docker volume on the EC2 machine. That is fine for a simple deployment, but for a more durable AWS setup you should eventually move MongoDB to a managed database such as MongoDB Atlas or another external database service.
