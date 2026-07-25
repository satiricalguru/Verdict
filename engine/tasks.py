import os
import asyncio

def run_benchmark_task(model_id: str, prompt_id: str):
    """
    Worker task for processing benchmark runs in background.
    """
    print(f"[Worker] Processing benchmark for model={model_id}, prompt={prompt_id}")
    return {"status": "success", "model_id": model_id, "prompt_id": prompt_id}
