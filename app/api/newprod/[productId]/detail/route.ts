/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewProductDetail,
  getNewProductDetails,
} from "@/lib/services/newProductServices";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const details = await getNewProductDetails(Number(params.productId));
    return NextResponse.json(details);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title wajib diisi" }, { status: 400 });
    }

    const detail = await createNewProductDetail(Number(params.productId), body);
    return NextResponse.json(detail, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
