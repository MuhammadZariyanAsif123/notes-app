import { detectMood } from "@/app/lib/detectMood";
import prisma from "@/app/lib/prisma"
import { auth } from '@clerk/nextjs/server';


export async function POST(request: Request) {
    const notesList = await request.json()
    const { userId } = await auth();

    const note = await prisma.note.update({
        where: {
            id: notesList.id,
            AND: { userId: userId }
        },
        data: {
            title: notesList.data.title,
            content: notesList.data.content
        }
    })


    const mood = await detectMood(note.title, note.content)

    await prisma.$executeRaw
        `UPDATE "Note"
        SET mood = ${mood}
        WHERE id = ${note.id}`

    return Response.json(note)
}