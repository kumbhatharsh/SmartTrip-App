// Itinerary generation service using the Hugging Face API
import { Client } from "@gradio/client";

interface ItineraryRequest {
  destination: string;
  departureCity: string;
  interests?: string;
  duration?: string;
  journeyDate?: string;
  isPersonalized?: boolean;
  budget?: number;
}

export interface GeneratedItinerary {
  destination: string;
  duration: string;
  dates: string;
  flights: {
    airline: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    price: string;
  }[];
  hotels: {
    name: string;
    address: string;
    price: string;
    rating: number;
  }[];
  dailySchedule: {
    day: string;
    activities: {
      time: string;
      activity: string;
      location: string;
    }[];
  }[];
  attractions: {
    name: string;
    description: string;
    recommendedTime: string;
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    priceRange: string;
    address: string;
  }[];
  tips: string[];
  weather?: {
    forecast: string;
    temperature: string;
    conditions: string;
  }[];
  localEvents?: {
    name: string;
    date: string;
    description: string;
    location: string;
  }[];
}

export const generateItinerary = async (request: ItineraryRequest): Promise<GeneratedItinerary> => {
  try {
    console.log("Generating itinerary for:", request);
    
    // Convert duration to number if it's a string with just numbers
    const durationValue = request.duration ? parseInt(request.duration) : 5;
    
    // Convert budget from currency value (e.g. 500) to budget level (1-5)
    // We'll map budget ranges to levels:
    // 500-1000: 1 (Budget)
    // 1001-2000: 2
    // 2001-3000: 3 (Moderate)
    // 3001-4000: 4
    // 4001+: 5 (Luxury)
    
    let budgetLevel = 3; // Default to moderate
    
    if (request.budget) {
      if (request.budget <= 1000) {
        budgetLevel = 1;
      } else if (request.budget <= 2000) {
        budgetLevel = 2;
      } else if (request.budget <= 3000) {
        budgetLevel = 3;
      } else if (request.budget <= 4000) {
        budgetLevel = 4;
      } else {
        budgetLevel = 5;
      }
    }
    
    console.log("Using budget level:", budgetLevel, "for budget value:", request.budget);
    
    // Connect to the Hugging Face Space using Gradio client
    const client = await Client.connect("piyushkumarp1/itinerary");
    
    // Call the predict endpoint with the required parameters including the new ones
    const result = await client.predict("/predict", { 
      source_city: request.departureCity,
      destination_city: request.destination,
      interests: request.interests || "General tourism",
      duration: isNaN(durationValue) ? 5 : durationValue,
      journey_date: request.journeyDate || "Flexible dates",
      is_personalized: request.isPersonalized !== undefined ? request.isPersonalized : true,
      budget: budgetLevel
    });
    
    console.log("API response:", result.data);
    
    // Cast the result.data to string to fix the TypeScript error
    const rawItineraryText = String(result.data);
    
    // Process the raw text into structured data
    const processedItinerary = processRawItinerary(rawItineraryText, request);
    
    return processedItinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

const processRawItinerary = (rawText: string, request: ItineraryRequest): GeneratedItinerary => {
  console.log("Processing raw itinerary text:", rawText);
  
  // Default structure
  const itinerary: GeneratedItinerary = {
    destination: request.destination,
    duration: request.duration || "5 days",
    dates: request.journeyDate || "Flexible dates",
    flights: [],
    hotels: [],
    dailySchedule: [],
    attractions: [],
    restaurants: [],
    tips: [],
    weather: [],
    localEvents: []
  };
  
  // Extract flight information
  const flightSection = extractSection(rawText, "Flight", "Hotel");
  if (flightSection) {
    const flightLines = flightSection.split('\n').filter(line => line.trim() !== '');
    flightLines.forEach(line => {
      const match = line.match(/([A-Za-z\s]+).*?([A-Z0-9]+).*?(\$[\d,]+)/);
      if (match) {
        itinerary.flights.push({
          airline: match[1].trim(),
          flightNumber: match[2].trim(),
          departure: request.departureCity || "Your City",
          arrival: request.destination,
          price: match[3].trim()
        });
      }
    });
  }
  
  // Extract hotel information
  const hotelSection = extractSection(rawText, "Hotel", "Day 1");
  if (hotelSection) {
    const hotelLines = hotelSection.split('\n').filter(line => line.trim() !== '');
    hotelLines.forEach(line => {
      const match = line.match(/([^-$]+)(?:-\s*([^$]+))?(?:\s*(\$[\d,]+))?(?:\s*(\d+\s*star|\d+\.\d+\s*rating))?/i);
      if (match) {
        const hotelName = match[1]?.trim() || "";
        const hotelAddress = match[2]?.trim() || `${request.destination}`;
        const hotelPrice = match[3]?.trim() || "$150";
        const ratingText = match[4]?.trim() || "";
        const rating = ratingText.includes("star") 
          ? parseInt(ratingText.replace(/[^0-9]/g, '')) 
          : parseFloat(ratingText.replace(/[^0-9.]/g, '')) || 4;
          
        itinerary.hotels.push({
          name: hotelName,
          address: hotelAddress,
          price: hotelPrice,
          rating: rating
        });
      }
    });
  }
  
  // Extract daily schedule
  for (let i = 1; i <= 7; i++) {
    const daySection = extractSection(rawText, `Day ${i}`, `Day ${i+1}`);
    if (daySection) {
      const daySchedule = {
        day: `Day ${i}`,
        activities: [] as {time: string, activity: string, location: string}[]
      };
      
      const activityLines = daySection.split('\n').filter(line => line.trim() !== '');
      activityLines.forEach(line => {
        const timeMatch = line.match(/(\d{1,2}:\d{2}\s*(AM|PM)|\d{1,2}\s*(AM|PM))/i);
        if (timeMatch) {
          const time = timeMatch[0].trim();
          const remainingText = line.replace(timeMatch[0], '').trim();
          const locationMatch = remainingText.match(/at\s+([^.]+)/i);
          const activity = locationMatch 
            ? remainingText.replace(locationMatch[0], '').trim() 
            : remainingText;
          const location = locationMatch ? locationMatch[1].trim() : `${request.destination}`;
          
          daySchedule.activities.push({
            time,
            activity,
            location
          });
        }
      });
      
      if (daySchedule.activities.length > 0) {
        itinerary.dailySchedule.push(daySchedule);
      }
    }
  }
  
  // Extract attractions
  const attractionsSection = extractSection(rawText, "Attractions", "Restaurants");
  if (attractionsSection) {
    const attractionLines = attractionsSection.split('\n').filter(line => line.trim() !== '');
    attractionLines.forEach(line => {
      const match = line.match(/([^-:]+)(?:-\s*([^(]+))?(?:\s*\(([^)]+)\))?/);
      if (match) {
        itinerary.attractions.push({
          name: match[1]?.trim() || "",
          description: match[2]?.trim() || "Famous attraction",
          recommendedTime: match[3]?.trim() || "2 hours"
        });
      }
    });
  }
  
  // Extract restaurants
  const restaurantsSection = extractSection(rawText, "Restaurant", "Weather");
  if (restaurantsSection) {
    const restaurantLines = restaurantsSection.split('\n').filter(line => line.trim() !== '');
    restaurantLines.forEach(line => {
      const match = line.match(/([^-$]+)(?:-\s*([^$]+))?(?:\s*(\$+))?(?:\s*([^,]+))?/);
      if (match) {
        itinerary.restaurants.push({
          name: match[1]?.trim() || "",
          cuisine: match[4]?.trim() || "Local cuisine",
          priceRange: match[3]?.trim() || "$$$",
          address: match[2]?.trim() || `${request.destination}`
        });
      }
    });
  }
  
  // Extract weather information
  const weatherSection = extractSection(rawText, "Weather", "Local Events");
  if (weatherSection) {
    const weatherLines = weatherSection.split('\n').filter(line => line.trim() !== '');
    weatherLines.forEach(line => {
      const match = line.match(/([^:]+):\s*([^,]+),\s*([^.]+)/);
      if (match) {
        itinerary.weather?.push({
          forecast: match[1]?.trim() || "Forecast",
          temperature: match[2]?.trim() || "Temperature",
          conditions: match[3]?.trim() || "Conditions"
        });
      }
    });
  }
  
  // Extract local events
  const eventsSection = extractSection(rawText, "Local Events", "Tips");
  if (eventsSection) {
    const eventLines = eventsSection.split('\n').filter(line => line.trim() !== '');
    eventLines.forEach(line => {
      const match = line.match(/([^-]+)(?:-\s*([^(]+))?(?:\s*\(([^)]+)\))?(?:\s*at\s*([^.]+))?/);
      if (match) {
        itinerary.localEvents?.push({
          name: match[1]?.trim() || "Event",
          date: match[3]?.trim() || "During your stay",
          description: match[2]?.trim() || "Interesting local event",
          location: match[4]?.trim() || request.destination
        });
      }
    });
  }
  
  // Extract tips
  const tipsSection = extractSection(rawText, "Tips", "END");
  if (tipsSection) {
    const tipLines = tipsSection.split('\n').filter(line => line.trim() !== '');
    itinerary.tips = tipLines.map(line => line.replace(/^\d+\.\s*/, '').trim());
  }
  
  return itinerary;
};

// Helper function to extract sections from the raw text
const extractSection = (text: string, startMarker: string, endMarker: string): string | null => {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return null;
  
  const endIndex = endMarker === "END" ? text.length : text.indexOf(endMarker, startIndex);
  if (endIndex === -1) return text.substring(startIndex);
  
  return text.substring(startIndex, endIndex);
};
