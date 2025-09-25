import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationPIN } from "@/lib/senEmail";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    return NextResponse.json(
      { error: "Email sudah terdaftar" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
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
    message: "Registrasi berhasil, cek email untuk PIN.",
  });
}
