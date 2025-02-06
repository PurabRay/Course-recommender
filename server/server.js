const express = require('express');
const cors = require('cors');
const axios = require('axios');
const geoip = require('geoip-lite');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const KRUTRIM_API_URL = process.env.KRUTRIM_API_URL || 'https://cloud.olakrutrim.com/v1/chat/completions';
const KRUTRIM_API_KEY = process.env.KRUTRIM_API_KEY;

// Fixed exchange rates (you can update these or use a real-time API later)
const exchangeRates = {
    'USD': 1,
    'EUR': 0.91,
    'GBP': 0.79,
    'INR': 83.12,
    'JPY': 148.15,
    // Add more currencies as needed
};

// Currency symbols mapping
const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'INR': '₹',
    'JPY': '¥',
    // Add more currencies as needed
};

// Function to convert price to target currency
async function convertPrice(priceStr, targetCurrency) {
    try {
        if (!priceStr || priceStr === 'Free') return priceStr;
        
        // Extract numeric value (assuming input is in USD format like "$29.99")
        const match = priceStr.match(/\$?(\d+\.?\d*)/);
        if (!match) return priceStr;

        const amount = parseFloat(match[1]);
        const sourceCurrency = 'USD'; // Assuming all prices are in USD by default

        if (sourceCurrency === targetCurrency) return priceStr;

        // Convert using fixed exchange rates
        const rate = exchangeRates[targetCurrency] || 1;
        const convertedAmount = amount * rate;

        // Format the price based on currency
        let formattedPrice;
        switch(targetCurrency) {
            case 'JPY':
                // Japanese Yen doesn't use decimals
                formattedPrice = Math.round(convertedAmount);
                break;
            case 'INR':
                // Indian format with two decimals
                formattedPrice = convertedAmount.toFixed(2);
                break;
            default:
                // Standard format with two decimals
                formattedPrice = convertedAmount.toFixed(2);
        }

        return `${currencySymbols[targetCurrency] || targetCurrency}${formattedPrice}`;
    } catch (error) {
        console.error('Price conversion error:', error);
        return priceStr;
    }
}

// Function to convert all prices in resources
async function convertAllPrices(resources, targetCurrency) {
    console.log('Converting prices to:', targetCurrency);
    const levels = ['beginner', 'intermediate', 'advanced'];
    const types = ['free', 'paid'];

    for (const level of levels) {
        for (const type of types) {
            if (resources[level] && resources[level][type]) {
                for (const resource of resources[level][type]) {
                    if (resource.price && resource.price !== 'Free') {
                        console.log('Converting price:', resource.price);
                        resource.price = await convertPrice(resource.price, targetCurrency);
                        console.log('Converted to:', resource.price);
                    }
                }
            }
        }
    }
    return resources;
}

app.use(cors());
app.use(express.json());

app.post('/api/get-resources', async (req, res) => {
    const { subject } = req.body;
    
    // Get client IP and location
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    
    // Default to USD if location cannot be determined
    const currencyMap = {
        'US': 'USD',
        'GB': 'GBP',
        'EU': 'EUR',
        'IN': 'INR',
        'JP': 'JPY',
        // Add more country-currency mappings as needed
    };
    
    const targetCurrency = geo ? currencyMap[geo.country] || 'USD' : 'USD';

    try {
        const prompt = `Find the best learning resources for ${subject}. For each category (Beginner, Intermediate, Advanced), provide both free and paid resources. Include courses, tutorials, documentation, books, and any other valuable learning materials. For each resource, provide:
        - Title
        - URL
        - Brief description (1-2 sentences)
        - Type (course, book, tutorial, etc.)
        - Estimated time to complete
        - Price (if paid, in USD)

        Format the response as a JSON object with the following structure:
        {
            "beginner": {
                "free": [resources],
                "paid": [resources]
            },
            "intermediate": {
                "free": [resources],
                "paid": [resources]
            },
            "advanced": {
                "free": [resources],
                "paid": [resources]
            }
        }`;

        console.log('Sending request to Krutrim...');
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${KRUTRIM_API_KEY}`
        };

        const response = await axios.post(
            KRUTRIM_API_URL,
            {
                model: "Meta-Llama-3.1-70B-Instruct",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that always responds in valid JSON format."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            { headers }
        );

        let content;
        if (typeof response.data === 'string') {
            // Remove all markdown code block markers and trim whitespace
            content = response.data.replace(/```json\s*|\s*```/g, '').trim();
        } else if (response.data.choices && response.data.choices[0].message) {
            content = response.data.choices[0].message.content;
            // Remove all markdown code block markers and trim whitespace
            content = content.replace(/```json\s*|\s*```/g, '').trim();
        } else {
            throw new Error('Unexpected response format from API');
        }

        // Add better error handling for JSON parsing
        try {
            let resources = JSON.parse(content);
            
            // Convert prices to local currency
            resources = await convertAllPrices(resources, targetCurrency);
            
            // Add currency information to the response
            const responseData = {
                currency: {
                    code: targetCurrency,
                    symbol: currencySymbols[targetCurrency] || targetCurrency
                },
                resources: resources
            };

            res.json(responseData);
        } catch (parseError) {
            console.error('JSON Parse Error. Content:', content);
            console.error('Parse Error:', parseError);
            throw new Error(`Failed to parse response: ${parseError.message}`);
        }

    } catch (error) {
        console.error('Detailed error:', JSON.stringify(error, null, 2));
        if (error.response) {
            console.error('Response error data:', error.response.data);
            console.error('Response error status:', error.response.status);
        } else if (error.request) {
            console.error('Request error:', error.request);
        } else {
            console.error('Error parsing response:', error.message);
        }
        res.status(500).json({ 
            error: 'Failed to fetch resources',
            details: error.response?.data?.error || error.message,
            rawError: error.toString()
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 