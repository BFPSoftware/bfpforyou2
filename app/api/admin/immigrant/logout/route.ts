import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("immigrantAdminId");
    cookieStore.delete("immigrantAdminName");

    return new NextResponse("Logged out successfully", { status: 200 });
}
