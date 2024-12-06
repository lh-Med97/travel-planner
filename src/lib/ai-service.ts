import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI model
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
if (!apiKey) {
  console.error('NEXT_PUBLIC_GOOGLE_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface TripPreferences {
  budget?: string;
  duration?: string;
  interests?: string[];
  travelStyle?: string;
  season?: string;
}

export class AITravelService {
  static async getDestinationRecommendations(preferences: TripPreferences) {
    console.log('Getting recommendations with preferences:', preferences);
    
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const prompt = `As a travel expert, recommend 5 destinations based on these preferences:
      Budget: ${preferences.budget}
      Duration: ${preferences.duration}
      Interests: ${preferences.interests?.join(', ')}
      Travel Style: ${preferences.travelStyle}
      Season: ${preferences.season}
      
      For each destination, provide:
      1. Name
      2. Brief description
      3. Estimated budget range
      4. Best time to visit
      5. Top 3 attractions`;

    try {
      console.log('Sending prompt to AI:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log('Received AI response:', response.text());
      return response.text();
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get destination recommendations');
    }
  }

  static async generateItinerary(destination: string, duration: string, preferences: TripPreferences) {
    console.log('Generating itinerary for destination:', destination, 'with preferences:', preferences);
    
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const prompt = `Create a detailed ${duration} itinerary for ${destination} considering:
      Travel Style: ${preferences.travelStyle}
      Interests: ${preferences.interests?.join(', ')}
      Budget Level: ${preferences.budget}
      
      Include:
      1. Day-by-day schedule
      2. Recommended activities
      3. Estimated timing
      4. Travel tips
      5. Estimated costs`;

    try {
      console.log('Sending prompt to AI:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log('Received AI response:', response.text());
      return response.text();
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate itinerary');
    }
  }

  static async getTravelTips(destination: string, preferences: TripPreferences) {
    console.log('Getting travel tips for destination:', destination, 'with preferences:', preferences);
    
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const prompt = `Provide personalized travel tips for ${destination} considering:
      Travel Style: ${preferences.travelStyle}
      Budget: ${preferences.budget}
      Season: ${preferences.season}
      
      Include:
      1. Local customs and etiquette
      2. Safety tips
      3. Money-saving advice
      4. Transportation recommendations
      5. Must-try local experiences`;

    try {
      console.log('Sending prompt to AI:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log('Received AI response:', response.text());
      return response.text();
    } catch (error) {
      console.error('Error getting travel tips:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get travel tips');
    }
  }
}
