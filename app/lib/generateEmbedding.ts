import genAI from "../services/gemini";
import { models } from "../models/models";

const model = genAI.getGenerativeModel(
    { model: models["Text-Embedding-001"] },
    { apiVersion: "v1" }
)

export default async function generateEmbedding(text: string) 
{

    try 
    {
        const result = await model.embedContent(text)

        return result.embedding.values
    }

    catch (error: any) 
    {

        console.log(error)
    }
}