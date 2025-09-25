import { NextRequest, NextResponse } from "next/server";
import {
  createProductTitle,
  getProductTitleByProductId,
  updateProductTitleByProductId,
  deleteProductTitleByProductId,
} from "@/lib/services/products/productTitle";

// GET /api/products/:productId/productTitle
export async function GET(
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

    const data = await getProductTitleByProductId(productId);
    if (!data) {
      return NextResponse.json(
        { error: "ProductTitle tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// POST /api/products/:productId/productTitle
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    const { title, desc } = await req.json();

    if (!productId || !title) {
      return NextResponse.json(
        { error: "productId & title wajib diisi" },
        { status: 400 }
      );
    }

    const newTitle = await createProductTitle(productId, title, desc);
    return NextResponse.json(newTitle, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal membuat data" },
      { status: 500 }
    );
  }
}

// PUT /api/products/:productId/productTitle
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    const body = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await updateProductTitleByProductId(productId, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal update data" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:productId/productTitle
export async function DELETE(
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

    const deleted = await deleteProductTitleByProductId(productId);
    return NextResponse.json(deleted, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal hapus data" },
      { status: 500 }
    );
  }
}
