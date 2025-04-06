
import { Itinerary } from "@/lib/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, CheckCircle } from "lucide-react";

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard = ({ itinerary }: ItineraryCardProps) => {
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
        <Button className="w-full bg-teal-600 hover:bg-teal-700">
          View Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItineraryCard;
