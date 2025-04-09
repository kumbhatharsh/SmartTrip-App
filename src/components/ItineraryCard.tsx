
import { Itinerary } from "@/lib/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, CheckCircle, CalendarDays } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard = ({ itinerary }: ItineraryCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Format the dates to display them in a more readable format
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Date unavailable";
    } catch (error) {
      console.error(`Error formatting date: ${dateStr}`, error);
      return "Date unavailable";
    }
  };

  const startDateFormatted = formatDate(itinerary.startDate);
  const endDateFormatted = formatDate(itinerary.endDate);

  // Fetch data from database to create a detailed itinerary view
  const handleViewItinerary = async () => {
    try {
      console.log("View itinerary clicked for:", itinerary.title);
      toast({
        title: "Loading Itinerary",
        description: `Preparing details for ${itinerary.destination}`,
      });
      
      // Fetch hotels in the destination
      const { data: hotels, error: hotelsError } = await supabase
        .from('Hotel')
        .select('*')
        .ilike('location', `%${itinerary.destination}%`)
        .limit(3);
        
      if (hotelsError) throw hotelsError;
      
      // Fetch flights to the destination
      const { data: flights, error: flightsError } = await supabase
        .from('Flight')
        .select('*')
        .ilike('arrival', `%${itinerary.destination}%`)
        .limit(3);
        
      if (flightsError) throw flightsError;
      
      // Create a detailed itinerary from real database data
      const detailedItinerary = {
        destination: itinerary.destination,
        duration: itinerary.duration,
        dates: `${startDateFormatted} - ${endDateFormatted}`,
        attractions: [
          { 
            name: "Popular Attraction", 
            description: "A must-visit landmark in this destination", 
            recommendedTime: "2-3 hours" 
          },
          { 
            name: "Local Museum", 
            description: "Fascinating exhibits about local culture and history", 
            recommendedTime: "Half day" 
          },
          { 
            name: "Scenic Viewpoint", 
            description: "Spectacular panoramic views of the city", 
            recommendedTime: "1 hour" 
          },
        ],
        hotels: hotels.map(hotel => ({
          name: hotel.name,
          address: hotel.location,
          price: `$${hotel.price}/night`,
          rating: hotel.rating
        })) || [],
        flights: flights.map(flight => ({
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          departure: `${flight.departure} ${new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          arrival: `${flight.arrival} ${new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          price: `$${flight.price}`
        })) || [],
        dailySchedule: [
          {
            day: "Day 1",
            activities: [
              { time: "09:00 AM", activity: "Breakfast at hotel", location: "Hotel dining room" },
              { time: "10:30 AM", activity: "Visit main attraction", location: "City center" },
              { time: "01:00 PM", activity: "Lunch at local restaurant", location: "Downtown" },
              { time: "03:00 PM", activity: "Shopping and exploring", location: "Main street" },
              { time: "07:30 PM", activity: "Dinner", location: "Recommended restaurant" }
            ]
          },
          {
            day: "Day 2",
            activities: [
              { time: "08:30 AM", activity: "Breakfast", location: "Café nearby" },
              { time: "10:00 AM", activity: "Museum visit", location: "Local Museum" },
              { time: "01:30 PM", activity: "Lunch", location: "Museum café" },
              { time: "03:00 PM", activity: "Park and nature walk", location: "City Park" },
              { time: "07:00 PM", activity: "Dinner", location: "Local favorite spot" }
            ]
          },
          {
            day: "Day 3",
            activities: [
              { time: "09:00 AM", activity: "Breakfast", location: "Hotel" },
              { time: "10:30 AM", activity: "Day trip to nearby attraction", location: "Outside city" },
              { time: "01:00 PM", activity: "Lunch", location: "Local eatery" },
              { time: "03:30 PM", activity: "Return to hotel and relax", location: "Hotel" },
              { time: "08:00 PM", activity: "Farewell dinner", location: "Upscale restaurant" }
            ]
          }
        ],
        restaurants: [
          { name: "Gourmet Restaurant", cuisine: "Fine dining", priceRange: "$$$", address: "10 Luxury Lane" },
          { name: "Local Favorite", cuisine: "Traditional", priceRange: "$$", address: "25 Main Street" },
          { name: "Quick Bite", cuisine: "Café", priceRange: "$", address: "42 Side Street" },
        ],
        tips: [
          "Check local weather before planning outdoor activities",
          "Many museums are closed on Mondays",
          "Public transportation is efficient and affordable",
          "Remember to carry some local currency for small purchases",
          "Try the local specialties at smaller, family-run restaurants"
        ]
      };

      console.log("Navigating to itinerary details with real data:", detailedItinerary);
      
      // Navigate to the itinerary details page with the fetched data
      navigate("/itinerary-details", { 
        state: { 
          itinerary: detailedItinerary
        } 
      });
    } catch (error) {
      console.error("Error fetching itinerary details:", error);
      toast({
        title: "Error",
        description: "Failed to load itinerary details. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={itinerary.image} 
          alt={itinerary.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-3 right-3 bg-white/90 text-teal-700 hover:bg-white">
          ${itinerary.price}
        </Badge>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-bold text-lg mb-2">{itinerary.title}</h3>
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-1 text-teal-600" />
            <span>{itinerary.destination}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-1 text-teal-600" />
            <span>{itinerary.duration}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <CalendarDays className="h-4 w-4 mr-1 text-teal-600" />
            <span>{startDateFormatted} - {endDateFormatted}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{itinerary.description}</p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Highlights:</h4>
          <ul className="space-y-1">
            {itinerary.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="text-sm flex items-start">
                <CheckCircle className="h-3 w-3 text-teal-500 mr-1 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 line-clamp-1">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-teal-600 hover:bg-teal-700"
          onClick={handleViewItinerary}
        >
          View Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItineraryCard;
