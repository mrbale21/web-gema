/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTrainingDetail,
  getAllTrainingDetail,
} from "@/lib/services/trainingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const data = await getAllTrainingDetail();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const { title, desc, icon } = await req.json();
    const newData = await createTrainingDetail(title, desc, icon);
    return NextResponse.json(newData, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
