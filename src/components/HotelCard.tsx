
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

interface HotelProps {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  image?: string;
  amenities?: string[];
  availableRooms?: number;
}

interface HotelCardProps {
  hotel: HotelProps;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  // Generate a random image if none is provided
  const hotelImage = hotel.image || 
    `https://source.unsplash.com/random/800x600/?hotel,${hotel.name.toLowerCase().replace(/\s+/g, ',')}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={hotelImage} 
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
        
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{hotel.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
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
