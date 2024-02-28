import Mux from '@mux/mux-node';
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const mux =new Mux({
    tokenId: process.env['MUX_TOKEN_ID'], // This is the default and can be omitted
    tokenSecret: process.env['MUX_TOKEN_SECRET'], // This is the default and can be omitted
  });

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
        if(value.videoUrl){
            const exitingMuxData = await db.muxData.findFirst({
                where:{
                    chapterId : params.chapterId
                }
            });
            if(exitingMuxData){
                await mux.video.assets.delete(exitingMuxData.assetId);
                await db.muxData.delete({
                    where:{
                        id: exitingMuxData.id
                    }
                })
            }
            const asset = await mux.video.assets.create({
                input: value.videoUrl,
                playback_policy:['public'],
                test:false
            })
            await db.muxData.create({
                data:{
                    chapterId : params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }
        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}