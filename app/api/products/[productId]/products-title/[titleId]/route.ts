/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  getProductTitlesByProductId,
  createProductTitle,
  updateProductTitle,
} from "@/lib/services/products/productTitle";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const data = await getProductTitlesByProductId(Number(params.productId));
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/products/:productId/productTitle
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    if (!productId) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    const { title, desc, id } = await req.json(); // id ProductTitle yg mau diupdate
    if (!id || !title) {
      return NextResponse.json(
        { error: "id dan title wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await updateProductTitle(id, { title, desc });
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal update data" },
      { status: 500 }
    );
  }
}
