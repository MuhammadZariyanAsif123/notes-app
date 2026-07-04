import genAI from "../services/gemini";
import { models } from "../models/models";

const model = genAI.getGenerativeModel({
    model: models["Gemini-2.5-Flash"]
})

export async function detectMood(title: string, content: string) {

    const prompt = `Analyze the following note and detect its overall mood and tone.

Title: "${title}"
Content: "${content}"

Respond with ONLY a mood label and a single relevant emoji that best represents the note's tone.
Rules:
- Maximum 3 words + 1 emoji
- No explanation
- No punctuation at the end
- No extra text whatsoever

Examples of valid responses:
Motivated 
Reflective 
Stressed 
Creative 
Excited 
Focused 
Anxious 
Grateful 
Curious 
Neutral 

The above are only just examples. The mood should be dynamic based on the ${title} and ${content}.
`
    let result = await model.generateContent(prompt)

    return result.response.text().trim();
}