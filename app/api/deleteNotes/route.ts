import prisma from "@/app/lib/prisma";
import { toast } from "react-toastify";
import { auth } from '@clerk/nextjs/server';


export async function DELETE(request: Request) {
    const notesId = await request.json();
    const { userId } = await auth();

    try {
        const note = await prisma.note.delete({
            where: {
                id: notesId,
                AND: {
                    userId: userId
                }
            }
        })

        return Response.json(note)
    }

    catch (error: any) {
        toast.error(error)
    }





}