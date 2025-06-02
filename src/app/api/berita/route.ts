import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const berita = await prisma.berita.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(berita);
  } catch (error) {
    console.error("Error fetching berita:", error);
    return NextResponse.json(
      { error: "Failed to fetch berita" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, image } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const berita = await prisma.berita.create({
      data: {
        title,
        content,
        image: image || null,
        authorId: userId,
      },
    });

    return NextResponse.json(berita);
  } catch (error) {
    console.error("Error creating berita:", error);
    return NextResponse.json(
      { error: "Failed to create berita" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, content, image } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Check if berita exists and belongs to user
    const existingBerita = await prisma.berita.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBerita) {
      return NextResponse.json(
        { error: "Berita not found" },
        { status: 404 }
      );
    }

    if (existingBerita.authorId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You can only edit your own berita" },
        { status: 403 }
      );
    }

    const berita = await prisma.berita.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        image: image || null,
      },
    });

    return NextResponse.json(berita);
  } catch (error) {
    console.error("Error updating berita:", error);
    return NextResponse.json(
      { error: "Failed to update berita" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Check if berita exists and belongs to user
    const existingBerita = await prisma.berita.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBerita) {
      return NextResponse.json(
        { error: "Berita not found" },
        { status: 404 }
      );
    }

    if (existingBerita.authorId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - You can only delete your own berita" },
        { status: 403 }
      );
    }

    await prisma.berita.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Berita deleted successfully" });
  } catch (error) {
    console.error("Error deleting berita:", error);
    return NextResponse.json(
      { error: "Failed to delete berita" },
      { status: 500 }
    );
  }
}
