export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const encoder = new TextEncoder();
  const logs = [
    `[12:45:00] INFO  verdict.engine: Enqueuing benchmark run ${id}...`,
    `[12:45:01] INFO  verdict.worker: Pulled prompt #1: Realtime Financial Analytics Dashboard`,
    `[12:45:03] DEBUG verdict.provider: Invoking model API (tokens: 3,420 in, 850 out)`,
    `[12:45:05] INFO  verdict.sandbox: Playwright browser rendered output. Screenshot captured.`,
    `[12:45:07] INFO  verdict.judge: Multi-Judge Panel (3 models) evaluating sample...`,
    `[12:45:09] SUCCESS verdict.judge: Sample graded. Func: 88.5, Craft: 86, Composite: 85.2.`,
    `[12:45:10] SUCCESS verdict.engine: Benchmark run ${id} marked COMPLETE.`,
  ];

  const customStream = new ReadableStream({
    async start(controller) {
      for (const logLine of logs) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ log: logLine })}\n\n`));
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      controller.close();
    },
  });

  return new Response(customStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
