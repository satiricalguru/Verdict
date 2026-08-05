import os
import asyncio
from celery import Celery

app = Celery(
    "verdict",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
)

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


@app.task(name="verdict.tasks.run_benchmark")
def run_benchmark_task(model_id: str, prompt_id: str):
    """
    Worker task for processing benchmark runs in background.
    """
    print(f"[Worker] Processing benchmark for model={model_id}, prompt={prompt_id}")
    return {"status": "success", "model_id": model_id, "prompt_id": prompt_id}


async def _run_benchmark(model_id: str, prompt_id: str):
    run_benchmark_task.delay(model_id, prompt_id)


if __name__ == "__main__":
    app.worker_main()
