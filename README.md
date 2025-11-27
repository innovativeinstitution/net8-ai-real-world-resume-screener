
# 📘 .NET 8 & AI in Action: Resume Screener  
Build a Real-World AI-Powered Resume Screening Platform using .NET 8, FastAPI, PostgreSQL, RabbitMQ, and OpenAI

---

## 🚀 Project Overview

This project is the hands-on companion for the Udemy course  
**.NET 8 & AI in Action: Building a Real-World Resume Screener**.

It includes a full-stack, AI-powered application with:

- 🟣 **.NET 8 Core API** — REST endpoints for Jobs, Candidates, Rankings, and Metrics  
- 🐍 **AI Worker (FastAPI + LangChain)** — Resume parsing, embeddings, ranking, and AI recommendations  
- 🐘 **PostgreSQL with pgvector** — Resume embeddings, job storage, candidate data, rankings  
- 🐇 **RabbitMQ Queue System** — Async messaging between API and AI worker  
- 💻 **React + TypeScript + Tailwind UI** — Beautiful front-end for candidate and job management  
- 🤖 **OpenAI Integration** — GPT-based resume ranking & analysis  
- 📡 **Message-driven architecture** — Event-based processing using RabbitMQ  

---

## 📦 Environment Configuration

Create a `.env` file in your root directory and paste the following values:

> ⚠️ Replace placeholder values (especially API keys) before use!

```
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

