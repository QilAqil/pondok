import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const santri = await prisma.santri.findMany(); 
  return NextResponse.json(santri);
}

export async function POST(request: Request) {
  const { userId } = await auth(); //tambah await
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const data = await request.json();
  const santri = await prisma.santri.create({
    data: {
      name: data.name,
      email: data.email,
      photo: data.photo,
    },
  });
  return NextResponse.json(santri);
}

export async function DELETE(request: Request) {
  const { userId } = await auth(); //tambah await
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
  await prisma.santri.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
