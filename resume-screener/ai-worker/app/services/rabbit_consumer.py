import asyncio
import json
import time
import pika
from pika.exceptions import AMQPConnectionError
from app.core.config import settings
from app.services.resume_parser import handle_resume_parse
from app.services.rank_refresh import handle_rank_refresh

def start_consumers():
    url = settings.RABBITMQ_URL
    if not url:
        print("[AI Worker] ERROR: RABBITMQ_URL not set. Consumer thread exiting.", flush=True)
        return

    params = pika.URLParameters(url)
    delay = 1

    while True:
        try:
            print(f"[AI Worker] Connecting to RabbitMQ at {url} …", flush=True)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()

            channel.queue_declare(queue="resume.parse", durable=True)
            channel.queue_declare(queue="rank.refresh", durable=True)
            channel.basic_qos(prefetch_count=1)

            def on_resume_parse(ch, method, properties, body):
                msg = json.loads(body)
                asyncio.run(handle_resume_parse(msg))
                ch.basic_ack(delivery_tag=method.delivery_tag)

            def on_rank_refresh(ch, method, properties, body):
                msg = json.loads(body)
                asyncio.run(handle_rank_refresh(msg))
                ch.basic_ack(delivery_tag=method.delivery_tag)

            channel.basic_consume(queue="resume.parse", on_message_callback=on_resume_parse)
            channel.basic_consume(queue="rank.refresh", on_message_callback=on_rank_refresh)

            print("[AI Worker] Connected to RabbitMQ, consuming…", flush=True)
            delay = 1
            channel.start_consuming()

        except AMQPConnectionError:
            print(f"[AI Worker] RabbitMQ not ready, retrying in {delay}s…", flush=True)
            time.sleep(delay)
            delay = min(delay * 2, 30)
            continue
        except Exception as e:
            print(f"[AI Worker] Consumer crashed: {e}. Retrying in {delay}s…", flush=True)
            time.sleep(delay)
            delay = min(delay * 2, 30)
            continue
