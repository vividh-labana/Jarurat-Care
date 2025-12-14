// Vercel Serverless Function to fetch quotes from ZenQuotes API
// This bypasses CORS issues by making the request server-side

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    try {
        // Fetch from ZenQuotes API with cache-busting
        const response = await fetch(`https://zenquotes.io/api/random?t=${Date.now()}`, {
            headers: {
                'Cache-Control': 'no-cache',
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        
        // Return the quote
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching quote:', error);
        
        // Return a fallback quote on error
        res.status(200).json([{
            q: "The human spirit is stronger than anything that can happen to it.",
            a: "C.C. Scott"
        }]);
    }
}

