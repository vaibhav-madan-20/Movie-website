export default async function handler(req, res) {
    const { path } = req.query;

    if (!path) {
        return res.status(400).json({ error: "Missing 'path' query parameter" });
    }

    // Build the full TMDB URL, forwarding any extra query params
    const url = new URL(`https://api.themoviedb.org/3/${path}`);
    for (const [key, value] of Object.entries(req.query)) {
        if (key !== "path") {
            url.searchParams.set(key, value);
        }
    }

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN}`,
            },
        });

        const data = await response.json();
        // Cache for 1 hour on Vercel's edge, 5 min in browser
        res.setHeader("Cache-Control", "s-maxage=3600, max-age=300");
        return res.status(response.status).json(data);
    } catch (error) {
        console.error("TMDB proxy error:", error);
        return res.status(502).json({ error: "Failed to fetch from TMDB" });
    }
}
