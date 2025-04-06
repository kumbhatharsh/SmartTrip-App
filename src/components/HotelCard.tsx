
import { Hotel } from "@/lib/mockData";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-3 right-3 bg-white/90 text-ocean-700 hover:bg-white">
          ${hotel.price}/night
        </Badge>
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{hotel.location}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{hotel.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full bg-ocean-600 hover:bg-ocean-700">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
