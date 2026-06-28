import generateEmbedding from "@/app/lib/generateEmbedding";
import prisma from "@/app/lib/prisma"
import { auth } from '@clerk/nextjs/server';


export async function POST(request: Request) {
    const notesList = await request.json()
    const { userId } = await auth();

    console.log("Notes List", notesList)
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

    const embedding = await generateEmbedding(note.title + " " + note.content)
    const vectorString = `[${embedding?.join(',')}]`

    await prisma.$executeRaw
        `
        UPDATE "Note"
        SET embedding = ${vectorString}::vector
        WHERE id = ${note.id}`

    return Response.json(note)
}