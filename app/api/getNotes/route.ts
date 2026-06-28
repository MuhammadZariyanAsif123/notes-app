import prisma from "@/app/lib/prisma"
import { auth } from '@clerk/nextjs/server';

export async function GET() {

    const { userId } = await auth();

    const notes = await prisma.note.findMany({
        where: {
            userId: userId
        }
    });

    return Response.json(notes)

}