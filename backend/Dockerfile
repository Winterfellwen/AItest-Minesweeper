FROM python:3.12-slim

WORKDIR /app

# Environment variables — fill via platform deployment config or docker --env
ARG MYSQL_HOST=127.0.0.1
ARG MYSQL_PORT=3306
ARG MYSQL_DATABASE=minesweeper
ARG MYSQL_USER=root
ARG MYSQL_PASSWORD=
ARG DJANGO_SECRET_KEY=dev-secret-key-change-in-prod
ENV MYSQL_HOST=${MYSQL_HOST}
ENV MYSQL_PORT=${MYSQL_PORT}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}

RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    gcc \
    python3-dev \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

EXPOSE 8000

CMD python manage.py migrate --noinput && \
    gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2
