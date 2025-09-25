/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteProductBenefit,
  getProductBenefitById,
  updateProductBenefit,
} from "@/lib/services/products/productBenefit";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[productId]/benefits/[benefitId]
export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string; benefitId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const benefitId = parseInt(params.benefitId, 10);

    if (isNaN(productId) || isNaN(benefitId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const benefit = await getProductBenefitById(benefitId);

    if (!benefit || benefit.productId !== productId) {
      return NextResponse.json(
        { error: "Product Benefit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(benefit);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/products/[productId]/benefits/[benefitId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string; benefitId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const benefitId = parseInt(params.benefitId, 10);

    if (isNaN(productId) || isNaN(benefitId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { title, isActive } = await req.json();
    const updated = await updateProductBenefit(benefitId, title, isActive);

    if (updated.productId !== productId) {
      return NextResponse.json(
        { error: "Benefit tidak sesuai dengan productId" },
        { status: 400 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products/[productId]/benefits/[benefitId]
export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string; benefitId: string } }
) {
  try {
    const benefitId = parseInt(params.benefitId, 10);

    if (isNaN(benefitId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await deleteProductBenefit(benefitId);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
