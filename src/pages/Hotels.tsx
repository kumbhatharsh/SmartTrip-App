
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
import { Search, Calendar as CalendarIcon, MapPin, Bed, Star, Filter, ArrowUpDown } from "lucide-react";
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
  const [sortBy, setSortBy] = useState<"price" | "rating" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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
    toast({
      title: "Search Parameters",
      description: `Location: ${location}, Check-in: ${checkInDate ? format(checkInDate, 'PP') : 'Any'}, Check-out: ${checkOutDate ? format(checkOutDate, 'PP') : 'Any'}`,
    });
  };

  // Handle sort
  const handleSort = (criteria: "price" | "rating") => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortDirection("asc");
    }
  };

  // Filter and sort hotels based on search, price, rating, and sorting criteria
  const processedHotels = hotels
    .filter((hotel) => {
      return (
        (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (location === "" || hotel.location.toLowerCase().includes(location.toLowerCase())) &&
        hotel.price >= priceRange[0] &&
        hotel.price <= priceRange[1] &&
        hotel.rating >= starRating
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "rating") {
        return sortDirection === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="w-full h-56 bg-gradient-to-r from-ocean-600 to-teal-500 flex items-center justify-center">
        <div className="container text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Stay</h1>
          <p className="text-lg">Discover amazing hotels and accommodations for your next adventure</p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Search Bar Section */}
        <div className="bg-white rounded-lg shadow-md p-6 -mt-12 mb-8 relative z-10">
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
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Filter className="h-4 w-4 text-gray-500" />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="price-range" className="block mb-2 text-sm font-medium flex justify-between">
                      <span>Price Range</span>
                      <span>${priceRange[0]} - ${priceRange[1]}</span>
                    </Label>
                    <Slider
                      id="price-range"
                      min={0}
                      max={500}
                      step={10}
                      defaultValue={priceRange}
                      onValueChange={(value) => setPriceRange(value)}
                      className="my-4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="star-rating" className="block mb-2 text-sm font-medium flex justify-between">
                      <span>Star Rating</span>
                      <span>{starRating} stars+</span>
                    </Label>
                    <Slider
                      id="star-rating"
                      min={0}
                      max={5}
                      step={1}
                      defaultValue={[starRating]}
                      onValueChange={(value) => setStarRating(value[0])}
                      className="my-4"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="search-term" className="block mb-2 text-sm font-medium">
                      Hotel Name
                    </Label>
                    <Input
                      id="search-term"
                      type="text"
                      placeholder="Search hotel name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Sort By</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => handleSort("price")}
                      >
                        <span className="flex items-center">
                          <Bed className="h-4 w-4 mr-2" />
                          Price
                        </span>
                        {sortBy === "price" && (
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => handleSort("rating")}
                      >
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Rating
                        </span>
                        {sortBy === "rating" && (
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Results (Right Side) */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Available Hotels</h2>
              <p className="text-gray-600">{processedHotels.length} hotels found</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
              
              {processedHotels.length === 0 && (
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
