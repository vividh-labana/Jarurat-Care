// Vercel Serverless Function to fetch quotes
// Uses multiple sources with fallback to curated quotes

// Curated inspirational quotes for cancer awareness
const fallbackQuotes = [
    { q: "The human spirit is stronger than anything that can happen to it.", a: "C.C. Scott" },
    { q: "You beat cancer by how you live, why you live, and in the manner in which you live.", a: "Stuart Scott" },
    { q: "Cancer may have started the fight, but I will finish it.", a: "Unknown" },
    { q: "Courage is not the absence of fear, but rather the judgment that something else is more important than fear.", a: "Ambrose Redmoon" },
    { q: "Once you choose hope, anything's possible.", a: "Christopher Reeve" },
    { q: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", a: "Rikki Rogers" },
    { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
    { q: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", a: "Ralph Waldo Emerson" },
    { q: "You never know how strong you are until being strong is the only choice you have.", a: "Bob Marley" },
    { q: "In the middle of difficulty lies opportunity.", a: "Albert Einstein" },
    { q: "Hope is the thing with feathers that perches in the soul.", a: "Emily Dickinson" },
    { q: "Every day is a gift. That's why they call it the present.", a: "Unknown" },
    { q: "Life is not about waiting for the storm to pass, it's about learning to dance in the rain.", a: "Vivian Greene" },
    { q: "The greatest glory in living lies not in never falling, but in rising every time we fall.", a: "Nelson Mandela" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "When you come to the end of your rope, tie a knot and hang on.", a: "Franklin D. Roosevelt" },
    { q: "It is during our darkest moments that we must focus to see the light.", a: "Aristotle" },
    { q: "The best way out is always through.", a: "Robert Frost" },
    { q: "You are braver than you believe, stronger than you seem, and smarter than you think.", a: "A.A. Milne" },
    { q: "Hardships often prepare ordinary people for an extraordinary destiny.", a: "C.S. Lewis" },
    { q: "Where there is no struggle, there is no strength.", a: "Oprah Winfrey" },
    { q: "The wound is the place where the Light enters you.", a: "Rumi" },
    { q: "Turn your wounds into wisdom.", a: "Oprah Winfrey" },
    { q: "A hero is an ordinary individual who finds the strength to persevere and endure in spite of overwhelming obstacles.", a: "Christopher Reeve" },
    { q: "Keep your face always toward the sunshine—and shadows will fall behind you.", a: "Walt Whitman" },
    { q: "Stars can't shine without darkness.", a: "D.H. Sidebottom" },
    { q: "The struggle you're in today is developing the strength you need for tomorrow.", a: "Robert Tew" },
    { q: "Rock bottom became the solid foundation on which I rebuilt my life.", a: "J.K. Rowling" },
    { q: "Out of difficulties grow miracles.", a: "Jean de La Bruyère" },
    { q: "Never give up, for that is just the place and time that the tide will turn.", a: "Harriet Beecher Stowe" }
];

export default async function handler(req, res) {
    // Set headers to prevent caching
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    try {
        // Try fetching from ZenQuotes API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch('https://zenquotes.io/api/random', {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Jarurat-Care-App'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            // Check if we got a valid quote (not rate limited)
            if (data && data[0] && data[0].q && !data[0].q.includes('Too many requests')) {
                return res.status(200).json(data);
            }
        }
        
        // If API fails or rate limited, use random fallback
        throw new Error('API unavailable');
        
    } catch (error) {
        // Return a random quote from our curated collection
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        const quote = fallbackQuotes[randomIndex];
        
        res.status(200).json([{ q: quote.q, a: quote.a }]);
    }
}
