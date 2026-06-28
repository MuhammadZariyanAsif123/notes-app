import prisma from '../../lib/prisma'
import { auth } from '@clerk/nextjs/server';
import generateEmbedding from '@/app/lib/generateEmbedding';


export async function POST(request: Request) {

    const { userId } = await auth();   // Generates the userId of the active Login User.

    const body = await request.json();

    let note;

    // Insert record in the note table
    try {
        note = await prisma.note.create({
            data: {
                title: body.title,
                content: body.content,
                userId: userId
            }
        })

        const embedding = await generateEmbedding(note.title + " " + note.content)

        const vectorString = `[${embedding?.join(',')}]`

        console.log("Vector string preview:", vectorString.substring(0, 50))
        console.log("Vector string length:", vectorString.length)
        console.log("Note id:", note.id)

        await prisma.$executeRaw
            `
        UPDATE "Note"
        SET embedding = ${vectorString}::vector
        WHERE id = ${note.id}
        `

    }
    catch (error: any) {
        console.log(error)
    }

    return Response.json(note);
}



