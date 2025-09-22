/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNewProduct,
  getAllProduct,
} from "@/lib/services/newProductServices";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await getAllProduct();
    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title wajib diisi" }, { status: 400 });
    }

    const product = await createNewProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
