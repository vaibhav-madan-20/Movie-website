export const openai = async (prompt) => {
    const p = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "openai/gpt-oss-120b:free",
            "messages": [
                {
                    "role": "user",
                    "content": `Act as a movie recommendation system. Suggest some movies for the query: ${prompt}. Follow the format given ahead properly. Only give names of 5 movies, comma seperated like the example result given ahead. Follow this format strictly-3 Idiots, PK, Dangal, Kabir Singh, Joker`
                }
            ],
            "reasoning": { "enabled": true }
        })
    });
    const json = await p.json();
    // console.log(json);

    if (!json?.choices) return [];
    const result = json?.choices[0]?.message?.content.split(", ");
    // console.log(result);

    if (result.length !== 5) return [];
    return result;
}
/* In CRA, variables must begin with REACT_APP_
Restart the server to use changes in environment variables */