import { NextResponse } from "next/server";
import { syncLatestModels, getLastSyncTime } from "@/lib/sync";

export async function GET() {
  const result = await syncLatestModels(false);
  return NextResponse.json({
    lastSyncTime: getLastSyncTime(),
    ...result,
  });
}

export async function POST() {
  const result = await syncLatestModels(true);
  return NextResponse.json({
    lastSyncTime: getLastSyncTime(),
    ...result,
  });
}
