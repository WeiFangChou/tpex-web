import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {

    const companies = await prisma.finance.findMany({
        include: {
            company: true
        }
    });

    const serialized = replaceBigInt(companies);

    return NextResponse.json(serialized);
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
