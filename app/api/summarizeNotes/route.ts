import genAI from "@/app/services/gemini";
import { models } from "@/app/models/models";

const model = genAI.getGenerativeModel({
    model: models["Gemini-3.1-Flash-Lite"]
})


export async function POST(request: Request) {
    const notes = await request.json();
    
    let prompt = `Summarize the following note titled "${notes.title}" in 2-3 concise sentences:\n\n${notes.content}.`

    const summarizeContent = await model.generateContent(prompt)

    const result = summarizeContent.response.text()

    return Response.json({
        summary: result
    })

}