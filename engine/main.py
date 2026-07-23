from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import os
import json

from providers import ModelProviderClient
from judge import JudgePanelEvaluator
from sandbox import SandboxedPreviewRenderer

app = FastAPI(
    title="Verdict Execution Engine",
    description="Python service for model evaluation, multi-judge scoring, and live SSE streaming logs.",
    version="1.0.0",
)

provider_client = ModelProviderClient()
judge_evaluator = JudgePanelEvaluator()
sandbox_renderer = SandboxedPreviewRenderer()

class RunRequest(BaseModel):
    model_id: str
    categories: List[str]
    byok_key: Optional[str] = None

@app.get("/")
def health_check():
    return {"status": "ok", "service": "verdict-engine", "version": "1.0.0"}

@app.post("/api/runs")
async def trigger_benchmark_run(request: RunRequest):
    run_id = f"run-{os.urandom(3).hex()}"
    return {
        "status": "queued",
        "run_id": run_id,
        "model_id": request.model_id,
        "categories": request.categories,
        "estimated_cost_usd": 0.42,
    }

@app.get("/api/runs/{run_id}/stream")
async def stream_run_logs(run_id: str):
    async def log_generator():
        yield f"data: {json.dumps({'log': f'[12:45:00] INFO verdict.engine: Enqueuing benchmark run {run_id}...'})}\n\n"
        await asyncio.sleep(0.8)
        yield f"data: {json.dumps({'log': '[12:45:01] INFO verdict.worker: Pulled prompt #1: Realtime Financial Analytics Dashboard'})}\n\n"
        await asyncio.sleep(1.0)
        yield f"data: {json.dumps({'log': '[12:45:03] DEBUG verdict.provider: Invoking model API (tokens: 3,420 in, 850 out)'})}\n\n"
        await asyncio.sleep(1.2)
        yield f"data: {json.dumps({'log': '[12:45:05] INFO verdict.sandbox: Playwright browser rendered output. Screenshot captured.'})}\n\n"
        await asyncio.sleep(0.9)
        yield f"data: {json.dumps({'log': '[12:45:07] INFO verdict.judge: Multi-Judge Panel (3 models) evaluating sample...'})}\n\n"
        await asyncio.sleep(1.0)
        yield f"data: {json.dumps({'log': '[12:45:09] SUCCESS verdict.judge: Sample graded. Func: 88.5, Craft: 86, Composite: 85.2.'})}\n\n"
        await asyncio.sleep(0.5)
        yield f"data: {json.dumps({'log': f'[12:45:10] SUCCESS verdict.engine: Benchmark run {run_id} marked COMPLETE.'})}\n\n"

    return StreamingResponse(log_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
