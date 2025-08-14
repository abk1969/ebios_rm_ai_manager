# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies and uv
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh

# Add uv to PATH
ENV PATH="/root/.local/bin:/root/.cargo/bin:$PATH"

# Copy project files for better caching
COPY pyproject.toml .
COPY requirements-minimal.txt .

# Install Python dependencies with uv (much faster)
RUN uv venv .venv && \
    uv pip install -r requirements-minimal.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app

# Activate virtual environment for all users
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
USER app

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8081/health')"

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV PORT=8081

# Run the application
CMD ["python", "app.py"]
