import prisma from "@/app/lib/prisma"
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid'


export async function POST(request: Request) {
    try {

        const noteId = await request.json();

        const { userId } = await auth();

        let notes;

        if (userId) {
            notes = await prisma.note.findUnique({
                where: {
                    id: noteId,
                    AND: {
                        userId: userId
                    }
                },
            })

            if (notes?.link == null) {
                const link = nanoid();

                notes = await prisma.note.update({
                    where: {
                        id: noteId,
                        AND: { userId: userId }
                    },
                    data: {
                        link: link
                    }
                })
            }
        }

        return Response.json({ link: notes?.link })
    }

    catch (error: any) {
        throw new Error(error)
    }


}