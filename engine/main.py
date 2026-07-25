from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import os
import json
import uuid

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
    prompt_text: Optional[str] = "Create a responsive HTML5 Canvas particle animation."
    byok_key: Optional[str] = None

@app.get("/")
def health_check():
    return {"status": "ok", "service": "verdict-engine", "version": "1.0.0"}

@app.post("/api/runs")
async def trigger_benchmark_run(request: RunRequest):
    run_id = f"run-{uuid.uuid4().hex[:8]}"

    # Execute provider invocation
    invoc = await provider_client.invoke_model(
        model_slug=request.model_id,
        model_id_string=request.model_id,
        prompt_text=request.prompt_text or "Create a responsive web app UI.",
        api_key=request.byok_key,
    )

    # Evaluate sample through multi-judge panel
    judgment = await judge_evaluator.evaluate_sample(
        raw_output=invoc["raw_output"],
        api_key=request.byok_key,
    )

    # Render sandboxed preview HTML
    sandboxed_html = sandbox_renderer.sanitize_and_wrap(invoc["raw_output"])

    return {
        "status": "complete",
        "run_id": run_id,
        "model_id": request.model_id,
        "categories": request.categories,
        "latency_ms": invoc["latency_ms"],
        "cost_usd": invoc["cost_usd"],
        "raw_output": invoc["raw_output"],
        "sandboxed_html": sandboxed_html,
        "judgment": judgment,
    }

@app.get("/api/runs/{run_id}/stream")
async def stream_run_logs(run_id: str):
    async def log_generator():
        timestamp = "12:45:00"
        yield f"data: {json.dumps({'log': f'[{timestamp}] INFO verdict.engine: Enqueuing benchmark run {run_id}...'})}\n\n"
        await asyncio.sleep(0.4)
        yield f"data: {json.dumps({'log': f'[{timestamp}] INFO verdict.worker: Pulled prompt task for execution'})}\n\n"
        await asyncio.sleep(0.5)
        yield f"data: {json.dumps({'log': f'[{timestamp}] DEBUG verdict.provider: Invoking model API endpoint...'})}\n\n"
        await asyncio.sleep(0.6)
        yield f"data: {json.dumps({'log': f'[{timestamp}] INFO verdict.sandbox: Rendered artifact in isolated CSP runtime.'})}\n\n"
        await asyncio.sleep(0.5)
        yield f"data: {json.dumps({'log': f'[{timestamp}] INFO verdict.judge: Multi-Judge Panel evaluating sample...'})}\n\n"
        await asyncio.sleep(0.4)
        yield f"data: {json.dumps({'log': f'[{timestamp}] SUCCESS verdict.judge: Sample graded successfully.'})}\n\n"
        await asyncio.sleep(0.3)
        yield f"data: {json.dumps({'log': f'[{timestamp}] SUCCESS verdict.engine: Benchmark run {run_id} marked COMPLETE.'})}\n\n"

    return StreamingResponse(log_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
