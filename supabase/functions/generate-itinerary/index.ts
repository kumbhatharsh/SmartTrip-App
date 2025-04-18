// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ItineraryRequest {
  destination: string;
  departureCity: string;
  interests?: string;
  duration?: string;
  journeyDate?: string; // This will now be in YYYY-MM-DD format
  budget?: number;
  isPersonalized?: boolean;
}

interface ItineraryResponse {
  success: boolean;
  itinerary: DetailedItinerary;
  error?: string;
}

interface DetailedItinerary {
  destination: string;
  duration: string;
  dates: string;
  attractions: Array<{name: string; description: string; recommendedTime: string}>;
  hotels: Array<{name: string; address: string; price: string; rating: number}>;
  flights: Array<{airline: string; flightNumber: string; departure: string; arrival: string; price: string}>;
  dailySchedule: Array<{day: string; activities: Array<{time: string; activity: string; location: string}>}>;
  restaurants: Array<{name: string; cuisine: string; priceRange: string; address: string}>;
  tips: string[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Generate a detailed itinerary based on the request parameters
function generateDetailedItinerary(
  destination: string, 
  departureCity: string, 
  interests?: string, 
  duration = "5 days",
  journeyDate?: string,
  budget = 500,
  isPersonalized = true
): DetailedItinerary {
  console.log(`Generating itinerary with journey date: ${journeyDate}, budget: ${budget}`);
  
  // Paris dummy data
  if (destination.toLowerCase().includes("paris")) {
    return {
      destination: "Paris, France",
      duration,
      dates: "Flexible dates",
      attractions: [
        { name: "Eiffel Tower", description: "Iconic iron tower offering spectacular city views", recommendedTime: "2-3 hours" },
        { name: "Louvre Museum", description: "World's largest art museum and home to the Mona Lisa", recommendedTime: "Half day" },
        { name: "Notre-Dame Cathedral", description: "Medieval Catholic cathedral with Gothic architecture", recommendedTime: "1-2 hours" },
        { name: "Champs-Élysées", description: "Elegant avenue known for luxury shopping and cafés", recommendedTime: "2-3 hours" },
        { name: "Montmartre", description: "Historic district with bohemian atmosphere and Sacré-Cœur Basilica", recommendedTime: "Half day" }
      ],
      hotels: [
        { name: "Hôtel Plaza Athénée", address: "25 Avenue Montaigne, 75008 Paris", price: "€850/night", rating: 5 },
        { name: "Le Meurice", address: "228 Rue de Rivoli, 75001 Paris", price: "€750/night", rating: 5 },
        { name: "Hôtel de Crillon", address: "10 Place de la Concorde, 75008 Paris", price: "€800/night", rating: 5 },
        { name: "Relais Christine", address: "3 Rue Christine, 75006 Paris", price: "€350/night", rating: 4 },
        { name: "Hôtel des Grands Boulevards", address: "17 Boulevard Poissonnière, 75002 Paris", price: "€200/night", rating: 4 }
      ],
      flights: [
        { airline: "Air France", flightNumber: "AF217", departure: "Mumbai 23:15", arrival: "Paris 04:30", price: "€650" },
        { airline: "Lufthansa", flightNumber: "LH761", departure: "Mumbai 03:25", arrival: "Paris 12:45", price: "€580" },
        { airline: "Emirates", flightNumber: "EK501", departure: "Mumbai 04:30", arrival: "Paris 13:15", price: "€720" },
        { airline: "Qatar Airways", flightNumber: "QR556", departure: "Mumbai 03:55", arrival: "Paris 14:05", price: "€690" },
        { airline: "Etihad Airways", flightNumber: "EY205", departure: "Mumbai 04:15", arrival: "Paris 15:30", price: "€650" }
      ],
      dailySchedule: [
        {
          day: "Day 1",
          activities: [
            { time: "09:00 AM", activity: "Breakfast at local café", location: "Le Marais district" },
            { time: "10:30 AM", activity: "Visit Louvre Museum", location: "Rue de Rivoli" },
            { time: "02:00 PM", activity: "Lunch at Café Marly", location: "93 Rue de Rivoli" },
            { time: "04:00 PM", activity: "Seine River Cruise", location: "Near Pont Neuf" },
            { time: "07:30 PM", activity: "Dinner", location: "Le Jules Verne at Eiffel Tower" }
          ]
        },
        {
          day: "Day 2",
          activities: [
            { time: "08:30 AM", activity: "Breakfast", location: "Hotel" },
            { time: "10:00 AM", activity: "Visit Eiffel Tower", location: "Champ de Mars" },
            { time: "01:00 PM", activity: "Lunch", location: "Le Suffren" },
            { time: "03:00 PM", activity: "Arc de Triomphe and Champs-Élysées", location: "8th arrondissement" },
            { time: "08:00 PM", activity: "Dinner", location: "L'Avenue" }
          ]
        },
        {
          day: "Day 3",
          activities: [
            { time: "09:00 AM", activity: "Breakfast", location: "Hotel" },
            { time: "10:30 AM", activity: "Montmartre and Sacré-Cœur", location: "18th arrondissement" },
            { time: "01:30 PM", activity: "Lunch", location: "La Maison Rose" },
            { time: "03:30 PM", activity: "Musée d'Orsay", location: "1 Rue de la Légion d'Honneur" },
            { time: "07:00 PM", activity: "Dinner", location: "Le Grand Véfour" }
          ]
        },
        {
          day: "Day 4",
          activities: [
            { time: "09:30 AM", activity: "Breakfast", location: "Hotel" },
            { time: "11:00 AM", activity: "Notre-Dame Cathedral", location: "Île de la Cité" },
            { time: "02:00 PM", activity: "Lunch", location: "Aux Anysetiers du Roy" },
            { time: "03:30 PM", activity: "Luxembourg Gardens", location: "6th arrondissement" },
            { time: "07:30 PM", activity: "Dinner", location: "L'Ambroisie" }
          ]
        },
        {
          day: "Day 5",
          activities: [
            { time: "08:30 AM", activity: "Breakfast", location: "Hotel" },
            { time: "10:00 AM", activity: "Versailles Palace (day trip)", location: "Versailles" },
            { time: "02:00 PM", activity: "Lunch", location: "La Flottille" },
            { time: "06:00 PM", activity: "Return to Paris", location: "" },
            { time: "08:30 PM", activity: "Farewell dinner", location: "Le Cinq" }
          ]
        }
      ],
      restaurants: [
        { name: "Le Jules Verne", cuisine: "French fine dining", priceRange: "€€€€", address: "Eiffel Tower, 2nd floor" },
        { name: "Septime", cuisine: "Modern French", priceRange: "€€€", address: "80 Rue de Charonne" },
        { name: "Breizh Café", cuisine: "French (crêpes)", priceRange: "€€", address: "109 Rue Vieille du Temple" },
        { name: "L'As du Fallafel", cuisine: "Middle Eastern", priceRange: "€", address: "34 Rue des Rosiers" },
        { name: "Le Comptoir du Relais", cuisine: "French bistro", priceRange: "€€€", address: "9 Carrefour de l'Odéon" }
      ],
      tips: [
        "Paris Museum Pass can save money if you plan to visit multiple museums",
        "Metro is the most efficient way to travel around the city",
        "Most attractions are closed on either Monday or Tuesday",
        "Tipping is not required but rounding up for good service is appreciated",
        "Learn a few basic French phrases - locals appreciate the effort",
        "Be aware of pickpockets in tourist areas and on public transport",
        "Make dinner reservations in advance, especially for high-end restaurants"
      ]
    };
  }
  
  // Generic fallback for other cities
  return {
    destination,
    duration,
    dates: "Flexible dates",
    attractions: [
      { name: "Popular Landmark", description: "Main attraction in the city", recommendedTime: "2-3 hours" },
      { name: "Local Museum", description: "Cultural heritage museum", recommendedTime: "Half day" },
      { name: "Historic District", description: "Historic area with traditional architecture", recommendedTime: "2 hours" },
      { name: "City Park", description: "Green space for relaxation", recommendedTime: "1-2 hours" },
      { name: "Viewpoint", description: "Scenic vista of the city", recommendedTime: "1 hour" }
    ],
    hotels: [
      { name: "Luxury Hotel", address: "City Center", price: "$300/night", rating: 5 },
      { name: "Boutique Hotel", address: "Historic District", price: "$200/night", rating: 4 },
      { name: "Mid-range Hotel", address: "Downtown", price: "$150/night", rating: 3.5 },
      { name: "Budget Hotel", address: "Near Transportation Hub", price: "$90/night", rating: 3 },
      { name: "Hostel", address: "Tourist Area", price: "$40/night", rating: 2.5 }
    ],
    flights: [
      { airline: "Major Airline", flightNumber: "MA123", departure: `${departureCity} 10:00`, arrival: `${destination} 12:30`, price: "$450" },
      { airline: "Budget Airline", flightNumber: "BA456", departure: `${departureCity} 14:15`, arrival: `${destination} 16:45`, price: "$320" },
      { airline: "National Carrier", flightNumber: "NC789", departure: `${departureCity} 08:30`, arrival: `${destination} 11:00`, price: "$480" },
      { airline: "International Airline", flightNumber: "IA012", departure: `${departureCity} 22:45`, arrival: `${destination} 01:15`, price: "$400" },
      { airline: "Regional Airline", flightNumber: "RA345", departure: `${departureCity} 16:30`, arrival: `${destination} 19:00`, price: "$380" }
    ],
    dailySchedule: [
      {
        day: "Day 1",
        activities: [
          { time: "09:00 AM", activity: "Breakfast", location: "Local café" },
          { time: "10:30 AM", activity: "Visit main attraction", location: "City center" },
          { time: "01:00 PM", activity: "Lunch", location: "Traditional restaurant" },
          { time: "03:00 PM", activity: "Explore historic district", location: "Old Town" },
          { time: "07:00 PM", activity: "Dinner", location: "Recommended restaurant" }
        ]
      },
      {
        day: "Day 2",
        activities: [
          { time: "08:30 AM", activity: "Breakfast", location: "Hotel" },
          { time: "10:00 AM", activity: "Cultural museum visit", location: "Museum district" },
          { time: "01:00 PM", activity: "Lunch", location: "Local eatery" },
          { time: "03:00 PM", activity: "Shopping", location: "Main shopping street" },
          { time: "08:00 PM", activity: "Dinner", location: "Upscale restaurant" }
        ]
      },
      {
        day: "Day 3",
        activities: [
          { time: "09:00 AM", activity: "Breakfast", location: "Hotel" },
          { time: "10:30 AM", activity: "Nature walk", location: "City park" },
          { time: "01:00 PM", activity: "Lunch", location: "Park café" },
          { time: "03:00 PM", activity: "Visit secondary attraction", location: "Tourist area" },
          { time: "07:30 PM", activity: "Dinner", location: "Local favorite restaurant" }
        ]
      }
    ],
    restaurants: [
      { name: "Fine Dining Restaurant", cuisine: "Local cuisine", priceRange: "€€€€", address: "City Center" },
      { name: "Popular Bistro", cuisine: "Traditional food", priceRange: "€€€", address: "Tourist District" },
      { name: "Local Eatery", cuisine: "Street food", priceRange: "€", address: "Old Town" },
      { name: "Specialty Restaurant", cuisine: "Fusion", priceRange: "€€€", address: "Trendy Neighborhood" },
      { name: "Quick Bite", cuisine: "Fast casual", priceRange: "€", address: "Shopping District" }
    ],
    tips: [
      "Research local transportation options",
      "Check for any local festivals or events during your visit",
      "Consider purchasing a city pass for attractions",
      "Learn a few phrases in the local language",
      "Check the weather forecast before packing",
      "Be aware of local customs and etiquette",
      "Keep important documents secure"
    ]
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(
      null,
      { 
        status: 204,
        headers: corsHeaders
      }
    );
  }
  
  try {
    // Extract the body from the request
    console.log("Received request");
    const requestData = await req.json() as ItineraryRequest;
    console.log("Request data:", JSON.stringify(requestData));
    
    if (!requestData.destination || !requestData.departureCity) {
      console.error("Error: Destination and departure city are required");
      return new Response(
        JSON.stringify({ error: "Destination and departure city are required" }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Build the interests string from available parameters
    let interests = requestData.interests || "";
    if (requestData.duration) {
      interests += interests ? `. Duration: ${requestData.duration}` : `Duration: ${requestData.duration}`;
    }
    
    if (requestData.journeyDate) {
      interests += interests ? `. Date: ${requestData.journeyDate}` : `Date: ${requestData.journeyDate}`;
    }
    
    if (requestData.budget && requestData.budget >= 500) {
      interests += interests ? `. Budget: $${requestData.budget}` : `Budget: $${requestData.budget}`;
    }
    
    console.log(`Generating itinerary from ${requestData.departureCity} to ${requestData.destination} with details: ${interests}`);
    
    // Generate detailed itinerary using our internal function with all parameters
    const generatedItinerary = generateDetailedItinerary(
      requestData.destination, 
      requestData.departureCity, 
      interests,
      requestData.duration,
      requestData.journeyDate,
      requestData.budget,
      requestData.isPersonalized
    );

    // Return the response with the generated itinerary
    console.log("Returning generated itinerary");
    return new Response(
      JSON.stringify({ 
        success: true, 
        itinerary: generatedItinerary
      }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error generating itinerary:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate itinerary" }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
