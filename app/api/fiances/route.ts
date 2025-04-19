import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const skip = (page - 1) * limit;

  try {
    const companies = await prisma.company.findMany({
      include: {
        finance: true
      }
    })

    const serialized = replaceBigInt(companies);

    return NextResponse.json(serialized);
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// BigInt 處理函式
function replaceBigInt(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(replaceBigInt);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, replaceBigInt(value)]),
    );
  } else if (typeof obj === "bigint") {
    return obj.toString();
  }

  return obj;
}
