# Use official Python runtime as base image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Copy project
COPY . .

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Debug: list files and check the project structure
RUN echo "Current directory: $(pwd)"
RUN ls -la
RUN ls -la minesweeper_django/
RUN test -f minesweeper_django/__init__.py && echo "INNER __init__.py exists" || echo "INNER __init__.py missing"
RUN python -c "import sys; print('\\n'.join(sys.path))"
RUN python -c "import minesweeper_django; print('minesweeper_django imported')"
RUN python -c "import minesweeper_django.settings; print('minesweeper_django.settings imported')"

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "minesweeper_django.wsgi:application"]