
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import HotelCard from "@/components/HotelCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
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

  // Handle search
  const handleSearch = () => {
    // In a real application, you would send a request to your API with these search parameters
    toast({
      title: "Search Parameters",
      description: `Location: ${location}, Check-in: ${checkInDate ? format(checkInDate, 'PP') : 'Any'}, Check-out: ${checkOutDate ? format(checkOutDate, 'PP') : 'Any'}`,
    });
  };

  // Filter hotels based on search, price, and rating
  const filteredHotels = hotels.filter((hotel) => {
    return (
      (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (location === "" || hotel.location.toLowerCase().includes(location.toLowerCase())) &&
      hotel.price >= priceRange[0] &&
      hotel.price <= priceRange[1] &&
      hotel.rating >= starRating
    );
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Stay</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MapPin className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Where are you going?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left",
                    !checkInDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, "PPP") : <span>Check-in Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left",
                    !checkOutDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? format(checkOutDate, "PPP") : <span>Check-out Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button className="bg-ocean-600 hover:bg-ocean-700" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Section (Left Side) */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                <div className="mb-6">
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
                </div>

                <div>
                  <Label htmlFor="star-rating" className="block mb-2 text-sm font-medium">
                    Star Rating: {starRating} stars+
                  </Label>
                  <Slider
                    id="star-rating"
                    min={0}
                    max={5}
                    step={1}
                    defaultValue={[starRating]}
                    onValueChange={(value) => setStarRating(value[0])}
                  />
                </div>
                
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="Search hotel name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Results (Right Side) */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
              
              {filteredHotels.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No hotels found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Hotels;
