
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface GradioRequest {
  city: string;
  interests: string;
}

serve(async (req) => {
  try {
    // Extract the body from the request
    const { city, interests } = await req.json() as GradioRequest;
    
    if (!city) {
      return new Response(
        JSON.stringify({ error: "City is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

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
      throw new Error(`Gradio API returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Return the response from Gradio
    return new Response(
      JSON.stringify({ success: true, result: data.data, pdfUrl: data.data }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // CORS header
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
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
          "Access-Control-Allow-Origin": "*", // CORS header
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  }
});
