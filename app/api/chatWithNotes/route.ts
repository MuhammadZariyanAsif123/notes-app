import prisma from '../../lib/prisma'
import { auth } from '@clerk/nextjs/server';
import generateEmbedding from '@/app/lib/generateEmbedding';
import genAI from '@/app/services/gemini';
import { models } from '@/app/models/models';

interface RelevantNote {
    id: number
    title: string
    content: string
}

export async function POST(request: Request) {

    const { userId } = await auth();

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json();
    const { message, history } = body

    try {

        const vector = await generateEmbedding(message)
        const vectorString = `[${vector?.join(',')}]`

        const relevantNotes: RelevantNote[] = await prisma.$queryRaw`
      SELECT id, title, content
      FROM "Note"
      WHERE "userId" = ${userId}
      AND embedding IS NOT NULL
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 5
    `

        const notesContext = relevantNotes.map((note: RelevantNote, index: number) =>
            `Note ${index + 1} - "${note.title}": ${note.content}`
        ).join('\n\n')

        const model = genAI.getGenerativeModel({
            model: models['Gemini-2.5-Flash'],
            systemInstruction: `You are a helpful personal assistant with access to the user's notes. 
      Answer questions based on the following notes only. 
      If the answer isn't in the notes, say "I couldn't find anything about that in your notes."
      
      User's relevant notes:
      ${notesContext}`
        })

        const chat = model.startChat({ history })

        const result = await chat.sendMessage(message)

        const text = result.response.text()

        return Response.json({ reply: text })

    } catch (error) {
        console.log(error)
        return Response.json({ error: "Something went wrong" }, { status: 500 })
    }

}