import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationPIN } from "@/lib/senEmail";

export async function POST(req: NextRequest) {
  const { type, email, password, name } = await req.json();

  // REGISTER
  if (type === "register") {
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist)
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit PIN
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verified: false,
        verificationToken: pin,
        verificationExpires: expires,
      },
    });

    await sendVerificationPIN(email, pin);

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil. Silakan cek email untuk PIN verifikasi.",
    });
  }

  // LOGIN
  if (type === "login") {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: "Email belum diverifikasi. Silakan cek PIN." },
        { status: 403 }
      );
    }

    // Buat token jika mau pakai JWT atau bisa langsung return user
    return NextResponse.json({ success: true, user });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
