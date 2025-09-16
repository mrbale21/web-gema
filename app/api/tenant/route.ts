import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  getTenant,
  updateTenant,
  deleteTenant,
  createTenant,
} from "@/lib/services/tenantServices";
import { uploadToS3Buffer } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    let data: Record<string, any> = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      for (const [key, value] of formData.entries()) {
        if (key === "imageLogo" && value instanceof File) {
          const buffer = await streamToBuffer(value.stream());
          const fileName = `${Date.now()}-${value.name}`;
          const s3Key = `tenantLogo/${fileName}`;

          // upload ke S3
          imageUrl = await uploadToS3Buffer(
            buffer,
            s3Key,
            value.type || "image/jpeg"
          );
        } else {
          data[key] = value;
        }
      }
    } else {
      data = await req.json();
    }

    const tenant = await createTenant({
      ...data,
      imageLogo: imageUrl ?? data.imageLogo,
    });

    return NextResponse.json(tenant);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ GET tenant
export async function GET() {
  try {
    const tenant = await getTenant();
    return NextResponse.json(tenant ?? {}); // selalu return JSON
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PUT tenant (bisa JSON atau multipart/form-data)
export async function PUT(req: NextRequest) {
  try {
    let data: Record<string, any> = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {};

      for (const [key, value] of formData.entries()) {
        if (key === "image" && value instanceof File) {
          const buffer = await streamToBuffer(value.stream());
          const fileName = `${Date.now()}-${value.name}`;
          const s3Key = `tenantLogo/${fileName}`;

          // upload ke S3
          imageUrl = await uploadToS3Buffer(
            buffer,
            s3Key,
            value.type || "image/jpeg"
          );
        } else {
          data[key] = value;
        }
      }
    }

    const tenant = await getTenant();
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant belum ada, silakan buat dulu." },
        { status: 400 }
      );
    }

    const updatedTenant = await updateTenant(tenant.id, {
      ...data,
      imageLogo: imageUrl ?? data.imageLogo ?? tenant.imageLogo,
    });

    return NextResponse.json(updatedTenant);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE tenant (pakai ID)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteTenant(id);
    return NextResponse.json({ message: "Tenant berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// helper konversi ReadableStream ke Buffer
async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | null | undefined
) {
  if (!stream) return Buffer.alloc(0);
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}
