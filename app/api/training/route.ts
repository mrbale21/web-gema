/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTraining, getAllTraining } from "@/lib/services/trainingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const data = await getAllTraining();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const { title, desc, icon } = await req.json();
    const newData = await createTraining(title, desc, icon);
    return NextResponse.json(newData, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
