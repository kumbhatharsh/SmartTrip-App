
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import HotelCard from "@/components/HotelCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  availableRooms: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  image?: string;
}

const Hotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [starRating, setStarRating] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Using the correct table name "Hotel" instead of "hotels"
        const { data, error } = await supabase
          .from("Hotel")
          .select("*")
          .order("createdAt", { ascending: false });

        if (error) {
          console.error("Error fetching hotels:", error);
          toast({
            title: "Error",
            description: "Failed to fetch hotels. Please try again.",
            variant: "destructive",
          });
        }

        if (data) {
          // Ensure the data matches our Hotel interface
          const formattedHotels = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            location: item.location,
            description: item.description,
            price: item.price,
            rating: item.rating,
            availableRooms: item.availableRooms,
            amenities: item.amenities || [],
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            image: item.image
          }));
          setHotels(formattedHotels);
        }
      } catch (error) {
        console.error("Unexpected error fetching hotels:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred while fetching hotels.",
          variant: "destructive",
        });
      }
    };

    fetchHotels();
  }, [toast]);

  // Filter hotels based on search, price, and rating
  const filteredHotels = hotels.filter((hotel) => {
    return (
      (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      hotel.price >= priceRange[0] &&
      hotel.price <= priceRange[1] &&
      hotel.rating >= starRating
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <Label htmlFor="price-range" className="block mb-2 text-sm font-medium">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <Slider
              id="price-range"
              min={0}
              max={500}
              step={10}
              defaultValue={priceRange}
              onValueChange={(value) => setPriceRange(value)}
            />

            <Label htmlFor="star-rating" className="block mt-4 mb-2 text-sm font-medium">
              Star Rating: {starRating} stars
            </Label>
            <Slider
              id="star-rating"
              min={0}
              max={5}
              step={1}
              defaultValue={[starRating]}
              onValueChange={(value) => setStarRating(value[0])}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Hotels;
