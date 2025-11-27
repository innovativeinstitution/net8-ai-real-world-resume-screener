# net8-ai-real-world-resume-screener

# Postgres
POSTGRES_DB=resume_screener
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppassword
POSTGRES_PORT=5432

# RabbitMQ
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
RABBITMQ_PORT=5672
RABBITMQ_MGMT_PORT=15672

# OpenAI
OPENAI_API_KEY=

# Internal service URLs
DATABASE_URL=postgresql+psycopg://appuser:apppassword@postgres:5432/resume_screener
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# CORS
WEB_ORIGIN=http://localhost:5173
API_ORIGIN=http://localhost:8080
AI_WORKER_ORIGIN=http://localhost:8000
