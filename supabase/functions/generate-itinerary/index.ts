
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ItineraryRequest {
  city: string;
  interests: string;
  destination?: string;
  departureCity?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  budget?: number;
  preferences?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
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
    const requestData = await req.json() as ItineraryRequest;
    
    if (!requestData.city && !requestData.destination) {
      return new Response(
        JSON.stringify({ error: "Destination is required" }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    // Use destination as city if provided
    const city = requestData.destination || requestData.city;
    
    // Build the interests string from all available parameters
    let interestsArray = [];
    
    if (requestData.interests) interestsArray.push(requestData.interests);
    if (requestData.departureCity) interestsArray.push(`Departing from ${requestData.departureCity}`);
    if (requestData.startDate && requestData.endDate) {
      interestsArray.push(`From ${requestData.startDate} to ${requestData.endDate}`);
    }
    if (requestData.travelers) interestsArray.push(`For ${requestData.travelers} travelers`);
    if (requestData.budget) interestsArray.push(`Budget around $${requestData.budget}`);
    if (requestData.preferences) interestsArray.push(requestData.preferences);
    
    // If interests array is empty, use duration as fallback
    if (interestsArray.length === 0 && requestData.interests) {
      interestsArray.push(requestData.interests);
    }
    
    const interests = interestsArray.join(". ");
    
    console.log(`Generating itinerary for ${city} with details: ${interests}`);
    
    // Define the Gradio endpoint
    const gradioEndpoint = "https://dfc9ecfbd25bebb4ed.gradio.live/predict";
    
    // Make a request to the Gradio API
    const response = await fetch(gradioEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [city, interests || ""]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gradio API error (${response.status}): ${errorText}`);
      throw new Error(`Gradio API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Gradio API response:", JSON.stringify(data));
    
    // The Gradio response contains the PDF URL in data.data
    const pdfUrl = data.data;
    
    // Return the response with the PDF URL
    return new Response(
      JSON.stringify({ success: true, result: pdfUrl }),
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
