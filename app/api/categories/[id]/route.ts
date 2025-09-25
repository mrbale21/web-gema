import { NextResponse } from "next/server";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categoryService";

// GET by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await getCategoryById(Number(params.id));
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT update
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const category = await updateCategory(Number(params.id), body);
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCategory(Number(params.id));
    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
