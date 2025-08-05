import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const requestHistory: number[] = [];

interface SoilData {
  moisture: number;
  ph: number;
  temperature: number;
  nutrients: number;
}

interface ChatRequest {
  message: string;
  soilData: SoilData;
  userType: 'child' | 'elder';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChatResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Initialize Google Gemini AI client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey || '');

// Rate limiting function
const checkRateLimit = (): boolean => {
  const now = Date.now();
  
  // Remove requests older than the window
  while (requestHistory.length > 0 && requestHistory[0] < now - RATE_LIMIT_WINDOW) {
    requestHistory.shift();
  }
  
  // Check if we're under the limit
  if (requestHistory.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  // Add current request
  requestHistory.push(now);
  return true;
};

// Generate system prompt based on user type and soil data
const generateSystemPrompt = (userType: 'child' | 'elder', soilData: SoilData): string => {
  const soilStatus = `Current soil conditions: Moisture ${soilData.moisture}%, pH ${soilData.ph}, Temperature ${soilData.temperature}°C, Nutrients ${soilData.nutrients}%`;
  
  if (userType === 'child') {
    return `You are Soily the Worm 🪱, a friendly and enthusiastic garden helper who talks to children aged 6-12. 

Your personality:
- Use simple, fun language that kids can understand
- Be encouraging and positive
- Use emojis and exclamation points
- Explain things like you're talking to a curious friend
- Make gardening sound exciting and magical
- Use analogies kids can relate to (like comparing roots to straws)

${soilStatus}

Always relate your advice to their actual soil conditions when relevant. Keep responses short (2-3 sentences max) and age-appropriate. If they ask about something not related to gardening, gently redirect them back to garden topics in a fun way.`;
  } else {
    return `You are a professional Garden Assistant providing expert advice to adult gardeners and elderly users.

Your personality:
- Professional but friendly tone
- Provide detailed, accurate information
- Use proper gardening terminology
- Give practical, actionable advice
- Be patient and thorough in explanations
- Consider accessibility needs for elderly users

${soilStatus}

Always incorporate their actual soil data into your responses when relevant. Provide specific recommendations based on their current conditions. Keep responses informative but concise (3-4 sentences max).`;
  }
};

// Fallback responses for when API is unavailable
const getFallbackResponse = (message: string, userType: 'child' | 'elder', soilData: SoilData): string => {
  const lowerMessage = message.toLowerCase();
  
  if (userType === 'child') {
    if (lowerMessage.includes('water') || lowerMessage.includes('moisture')) {
      return `Hi there! 🪱 Your soil moisture is ${soilData.moisture}%! ${
        soilData.moisture < 50 
          ? "Your plants are a bit thirsty! Let's give them some water - they'll be so happy! 💧"
          : "Your plants have plenty to drink! Great job keeping them happy! 😊"
      }`;
    }
    
    if (lowerMessage.includes('ph') || lowerMessage.includes('soil')) {
      return `Your soil happiness level is ${soilData.ph}! 🧪 ${
        soilData.ph >= 6.0 && soilData.ph <= 7.0
          ? "Your soil is super happy! Perfect for growing amazing plants! 🌟"
          : "Your soil needs a little help to be happier. We can make it perfect together! 🌱"
      }`;
    }
    
    return "That's a great question! 🌟 I'm having trouble thinking right now, but I love talking about gardens! Ask me about watering, soil, or how to help your plants grow! 🌱";
  } else {
    if (lowerMessage.includes('moisture') || lowerMessage.includes('water')) {
      return `Your current soil moisture is ${soilData.moisture}%. ${
        soilData.moisture < 40 
          ? "This is below optimal levels. I recommend immediate watering with 1-2 inches of water applied slowly."
          : soilData.moisture < 60
          ? "This is within acceptable range. Monitor daily and water when the top inch feels dry."
          : "Excellent moisture levels. Your current watering schedule is working well."
      }`;
    }
    
    if (lowerMessage.includes('ph')) {
      return `Your soil pH is ${soilData.ph}. ${
        soilData.ph < 6.0
          ? "This indicates acidic soil. Consider adding lime to raise pH to the optimal 6.0-7.0 range."
          : soilData.ph > 7.5
          ? "This indicates alkaline soil. Add organic matter or sulfur to lower pH naturally."
          : "Excellent pH range for most plants. This supports optimal nutrient uptake."
      }`;
    }
    
    return "I'm currently experiencing connectivity issues, but I can provide guidance on soil moisture, pH levels, temperature management, and nutrient requirements. What specific aspect would you like to discuss?";
  }
};

// Main chat function
export const sendChatMessage = async ({
  message,
  soilData,
  userType,
  conversationHistory = []
}: ChatRequest): Promise<ChatResponse> => {
  try {
    // Check if API key is available
    if (!apiKey) {
      console.warn('Gemini API key not available, using fallback response');
      return {
        success: false,
        message: getFallbackResponse(message, userType, soilData),
        error: "API key not configured"
      };
    }

    // Check rate limiting
    if (!checkRateLimit()) {
      return {
        success: false,
        message: userType === 'child'
          ? "Whoa! You're asking so many questions! 🤯 Let me catch my breath for a minute!"
          : "Rate limit exceeded. Please wait a moment before sending another message.",
        error: "Rate limit exceeded"
      };
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: import.meta.env.VITE_GEMINI_MODEL,
      generationConfig: {
        maxOutputTokens: userType === 'child' ? 150 : 300,
        temperature: userType === 'child' ? 0.8 : 0.7,
      },
    });

    // Prepare the system prompt and conversation history
    const systemPrompt = generateSystemPrompt(userType, soilData);

    // Build conversation history for Gemini
    const history = conversationHistory.slice(-6).map(msg => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }],
    }));

    // Start chat session with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will respond according to these guidelines and incorporate the soil data you provided.' }],
        },
        ...history
      ],
    });

    // Send the message
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response from Gemini model');
    }

    return {
      success: true,
      message: text.trim()
    };

  } catch (error) {
    console.error('Gemini API error:', error);

    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Return fallback response
    return {
      success: false,
      message: getFallbackResponse(message, userType, soilData),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Gemini API connection...');
    console.log('API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing');
    console.log('Model:', import.meta.env.VITE_GEMINI_MODEL);

    const model = genAI.getGenerativeModel({
      model: import.meta.env.VITE_GEMINI_MODEL,
      generationConfig: {
        maxOutputTokens: 10,
        temperature: 0.7,
      },
    });

    const result = await model.generateContent('Hello');
    const response = result.response;
    const text = response.text();

    console.log('Gemini API test successful:', text);
    return !!text;
  } catch (error) {
    console.error('Gemini API connection test failed:', error);
    return false;
  }
};

// Export types for use in components
export type { ChatRequest, ChatResponse, SoilData };
