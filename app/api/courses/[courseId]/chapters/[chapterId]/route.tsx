import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params } :{ params: { courseId: string; chapterId: string } }
){
    try {
        const {userId} = auth();
        const { isPublished , ...value} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status: 401});
        }
        const OwnCourse = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId
            }
        })
        if(!OwnCourse){
            return new NextResponse("Unauthorized",{status: 401});
        }
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data:{
                ...value,
            }
        })
        return NextResponse.json(chapter);

        // TODO: Handle Video Upload
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}