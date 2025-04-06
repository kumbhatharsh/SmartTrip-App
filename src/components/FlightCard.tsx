
import { Flight } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Airplane, Clock } from "lucide-react";

interface FlightCardProps {
  flight: Flight;
}

const FlightCard = ({ flight }: FlightCardProps) => {
  // Format dates
  const departureTime = new Date(flight.departureDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const arrivalTime = new Date(flight.arrivalDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const departureDate = new Date(flight.departureDate).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <Airplane className="h-4 w-4 text-ocean-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">{flight.airline}</span>
            </div>
            <Badge variant="outline" className="mt-2 bg-ocean-50 text-ocean-700 border-ocean-200">
              ${flight.price}
            </Badge>
          </div>
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{flight.duration}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <div className="text-center">
            <div className="text-xl font-bold">{departureTime}</div>
            <div className="text-sm text-gray-500">{flight.from}</div>
            <div className="text-xs text-gray-400">{departureDate}</div>
          </div>
          
          <div className="flex-1 mx-4 relative">
            <div className="border-t border-dashed border-gray-300"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ocean-100 flex items-center justify-center">
              <Airplane className="h-3 w-3 text-ocean-600 transform rotate-90" />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold">{arrivalTime}</div>
            <div className="text-sm text-gray-500">{flight.to}</div>
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
