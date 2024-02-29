import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
){
    try {
        const { userId } = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status: 401})
        }
        const { courseId } = params;
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        })
        
        const unpublishCourse = await db.course.update({
            where:{
                id: params.courseId,
                userId: userId,
            },
            data:{
                isPublished: false
            }
        })
        return NextResponse.json(unpublishCourse);
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}