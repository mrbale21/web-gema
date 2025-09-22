/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteNewProductDetail,
  getNewProductDetailById,
  updateNewProductDetail,
} from "@/lib/services/newProductServices";
import { NextResponse } from "next/server";

// GET /api/newprod/[productId]/detail/[detailId]
export async function GET(
  req: Request,
  { params }: { params: { productId: string; detailId: string } }
) {
  const productId = Number(params.productId);
  const detailId = Number(params.detailId);

  if (isNaN(productId) || isNaN(detailId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const detail = await getNewProductDetailById(productId, detailId);
    if (!detail) {
      return NextResponse.json({ error: "Detail not found" }, { status: 404 });
    }
    return NextResponse.json(detail, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/newprod/[productId]/detail/[detailId]
export async function PUT(
  req: Request,
  { params }: { params: { productId: string; detailId: string } }
) {
  try {
    const body = await req.json();
    const productId = Number(params.productId);
    const detailId = Number(params.detailId);

    if (isNaN(productId) || isNaN(detailId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await updateNewProductDetail(productId, detailId, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/newprod/[productId]/detail/[detailId]
export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; detailId: string } }
) {
  try {
    const productId = Number(params.productId);
    const detailId = Number(params.detailId);

    if (isNaN(productId) || isNaN(detailId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await deleteNewProductDetail(productId, detailId);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
