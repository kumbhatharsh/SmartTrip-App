// Itinerary generation service using the Hugging Face API

interface ItineraryRequest {
  destination: string;
  departureCity: string;
  interests?: string;
  duration?: string;
}

interface HuggingFaceResponse {
  result: string;
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
}

export const generateItinerary = async (request: ItineraryRequest): Promise<GeneratedItinerary> => {
  try {
    console.log("Generating itinerary for:", request);
    
    // Format the input for the Hugging Face API - simplified to use only the required parameters
    const prompt = `Generate a comprehensive travel itinerary from ${request.departureCity} to ${request.destination}` + 
      (request.duration ? ` for ${request.duration}` : ' for 5 days') +
      (request.interests ? `. Interests: ${request.interests}` : '') +
      `. Include flight options, recommended hotels, daily schedule with activities, and travel tips.`;
    
    // Call the Hugging Face API
    const response = await fetch("https://huggingface.co/spaces/piyushkumarp1/itinerary/api/run/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [prompt]
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as HuggingFaceResponse;
    console.log("API response:", data);
    
    // Parse the API response
    const rawItinerary = data.result;
    
    // Process the raw text into structured data
    const processedItinerary = processRawItinerary(rawItinerary, request);
    
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
    dates: "Flexible dates",
    flights: [],
    hotels: [],
    dailySchedule: [],
    attractions: [],
    restaurants: [],
    tips: []
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
  const restaurantsSection = extractSection(rawText, "Restaurant", "Tip");
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
