/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createProductBenefit,
  getProductBenefitsByProductId,
} from "@/lib/services/products/productBenefit";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[productId]/benefits
export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "productId tidak valid" },
        { status: 400 }
      );
    }

    const data = await getProductBenefitsByProductId(productId);
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Product Benefit tidak ditemukan" },
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

// POST /api/products/[productId]/benefits
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "productId tidak valid" },
        { status: 400 }
      );
    }

    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "title wajib diisi" }, { status: 400 });
    }

    const newBenefit = await createProductBenefit(title, productId);
    return NextResponse.json(newBenefit, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal membuat data" },
      { status: 500 }
    );
  }
}
