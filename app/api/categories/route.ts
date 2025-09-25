import { NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
} from "@/lib/services/categoryService";

// GET all categories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await createCategory({
      name: body.name,
      slug: body.slug,
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
