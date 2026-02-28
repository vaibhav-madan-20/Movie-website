const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export const askAI = async (prompt) => {
    const model = "gemini-2.5-flash";
    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const data = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: `Act as a movie recommendation system. Suggest some movies for the query: ${prompt}. Follow the format given ahead properly. Only give names of 5 movies, comma seperated like the example result given ahead. Follow this format strictly-3 Idiots, PK, Dangal, Kabir Singh, Joker` }
                ]
            }
        ]
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_KEY
        },
        body: JSON.stringify(data)
    });

    const json = await response.json();

    if (!json?.candidates) return [];
    const text = json.candidates[0].content.parts[0].text;
    const result = text.split(", ");

    if (result.length !== 5) return [];
    return result;
}
