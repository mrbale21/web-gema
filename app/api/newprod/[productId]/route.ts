import {
  deleteNewProduct,
  getNewProductById,
  updateNewProduct,
} from "@/lib/services/newProductServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const product = await getNewProductById(Number(params.productId));
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const body = await req.json();
  const updated = await updateNewProduct(Number(params.productId), body);
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const deleted = await deleteNewProduct(Number(params.productId));
  return NextResponse.json(deleted);
}
