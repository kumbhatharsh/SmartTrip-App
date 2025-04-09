
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock } from "lucide-react";

interface FlightProps {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats?: number;
  departureDate?: string; // For backward compatibility
  arrivalDate?: string; // For backward compatibility
  from?: string; // For backward compatibility
  to?: string; // For backward compatibility
  duration?: string;
}

interface FlightCardProps {
  flight: FlightProps;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  // Format dates
  const departureTime = new Date(flight.departureTime || flight.departureDate || "").toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const arrivalTime = new Date(flight.arrivalTime || flight.arrivalDate || "").toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const departureDate = new Date(flight.departureTime || flight.departureDate || "").toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  // Calculate duration if not provided
  const getDuration = () => {
    if (flight.duration) return flight.duration;
    
    const depTime = new Date(flight.departureTime || flight.departureDate || "");
    const arrTime = new Date(flight.arrivalTime || flight.arrivalDate || "");
    
    // Check if dates are valid before calculating
    if (isNaN(depTime.getTime()) || isNaN(arrTime.getTime())) {
      return "N/A";
    }
    
    const durationMs = arrTime.getTime() - depTime.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Use departure/arrival or from/to fields
  const fromLocation = flight.departure || flight.from || "";
  const toLocation = flight.arrival || flight.to || "";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <Plane className="h-4 w-4 text-ocean-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">{flight.airline}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Flight: {flight.flightNumber}</div>
            <Badge variant="outline" className="mt-2 bg-ocean-50 text-ocean-700 border-ocean-200">
              ${flight.price}
            </Badge>
          </div>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{getDuration()}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-center">
            <div className="text-xl font-bold">{departureTime}</div>
            <div className="text-sm text-gray-500">{fromLocation}</div>
            <div className="text-xs text-gray-400">{departureDate}</div>
          </div>
          
          <div className="flex-1 mx-4 relative">
            <div className="border-t border-dashed border-gray-300"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ocean-100 flex items-center justify-center">
              <Plane className="h-3 w-3 text-ocean-600 transform rotate-90" />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold">{arrivalTime}</div>
            <div className="text-sm text-gray-500">{toLocation}</div>
            <div className="text-xs text-gray-400">{departureDate}</div>
          </div>
        </div>
        
        <Button className="w-full mt-5 bg-ocean-600 hover:bg-ocean-700">
          Select Flight
        </Button>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
