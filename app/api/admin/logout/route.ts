import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();

    // Delete the teacherId cookie
    cookieStore.delete("teacherId");

    return new NextResponse("Logged out successfully", { status: 200 });
}
