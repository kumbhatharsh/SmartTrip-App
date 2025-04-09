import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import AIAssistant from "@/components/AIAssistant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Search, BedDouble, Star, Filter, Wifi, Car, Utensils, Users, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
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
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Hotels = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchLocation, setSearchLocation] = useState("");
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [amenities, setAmenities] = useState({
    wifi: false,
    parking: false,
    restaurant: false,
    pool: false,
    spa: false,
    gym: false,
  });
  const [sortBy, setSortBy] = useState("recommended");
  const [guests, setGuests] = useState(2);
  
  useEffect(() => {
    fetchHotels();
  }, []);
  
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Hotel')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      const hotelsWithImages = data.map(hotel => ({
        ...hotel,
        image: hotel.image || `https://source.unsplash.com/random/800x600/?hotel,${hotel.name.split(' ')[0].toLowerCase()}`
      }));
      
      setHotels(hotelsWithImages);
      setFilteredHotels(hotelsWithImages);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    if (!searchLocation.trim() && !date) return;
    
    setLoading(true);
    
    let filtered = [...hotels];
    
    if (searchLocation.trim()) {
      filtered = filtered.filter(hotel => 
        hotel.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        hotel.name.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    filtered = filtered.filter(hotel => 
      hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    );
    
    if (selectedRating !== null) {
      filtered = filtered.filter(hotel => 
        Math.floor(hotel.rating) === selectedRating
      );
    }
    
    const selectedAmenities = Object.entries(amenities)
      .filter(([_, isSelected]) => isSelected)
      .map(([name, _]) => name);
    
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel => 
        selectedAmenities.every(amenity => {
          const amenityMap = {
            wifi: ["wifi", "wi-fi", "free wifi"],
            parking: ["parking", "free parking", "valet"],
            restaurant: ["restaurant", "dining", "breakfast"],
            pool: ["pool", "swimming pool"],
            spa: ["spa", "massage"],
            gym: ["gym", "fitness"],
          };
          
          const searchTerms = amenityMap[amenity as keyof typeof amenityMap];
          return hotel.amenities.some(hotelAmenity => 
            searchTerms.some(term => hotelAmenity.toLowerCase().includes(term))
          );
        })
      );
    }
    
    switch(sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredHotels(filtered);
    setLoading(false);
  };
  
  const resetFilters = () => {
    setSearchLocation("");
    setPriceRange([50, 500]);
    setSelectedRating(null);
    setAmenities({
      wifi: false,
      parking: false,
      restaurant: false,
      pool: false,
      spa: false,
      gym: false,
    });
    setSortBy("recommended");
    setGuests(2);
    setFilteredHotels(hotels);
  };
  
  const handleRatingClick = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };
  
  useEffect(() => {
    handleSearch();
  }, [priceRange, selectedRating, amenities, sortBy]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-ocean-500 to-ocean-700 py-14 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Find Your Perfect Stay</h1>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Destination</Label>
                  <div className="relative">
                    <Input 
                      id="location"
                      placeholder="City, region or hotel name" 
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                    <BedDouble className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Check-in / Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        className="flex"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guests">Guests</Label>
                  <div className="relative">
                    <Select value={String(guests)} onValueChange={(value) => setGuests(parseInt(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                    <Users className="absolute right-8 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex items-end gap-3">
                  <Button 
                    className="flex-1 gap-2 bg-ocean-600 hover:bg-ocean-700"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(showFilters && "border-ocean-500 text-ocean-500")}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {showFilters && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset all
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Price range (per night)</h4>
                      <Slider
                        min={0}
                        max={1000}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Star rating</h4>
                      <div className="flex gap-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <Button
                            key={rating}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "flex items-center gap-1 border rounded-full px-3",
                              selectedRating === rating 
                                ? "bg-ocean-50 border-ocean-500 text-ocean-700" 
                                : "text-gray-500"
                            )}
                            onClick={() => handleRatingClick(rating)}
                          >
                            {rating}
                            <Star className="h-3.5 w-3.5 fill-current" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sort results by</h4>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Recommended" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recommended">Recommended</SelectItem>
                          <SelectItem value="price-low">Price (low to high)</SelectItem>
                          <SelectItem value="price-high">Price (high to low)</SelectItem>
                          <SelectItem value="rating">Rating (high to low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="wifi" 
                          checked={amenities.wifi}
                          onCheckedChange={(checked) => 
                            setAmenities({...amenities, wifi: checked === true})
                          }
                        />
                        <label htmlFor="wifi" className="text-sm flex items-center cursor-pointer">
                          <Wifi className="h-3.5 w-3.5 mr-1.5" />
                          Wi-Fi
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="parking" 
                          checked={amenities.parking}
                          onCheckedChange={(checked) => 
                            setAmenities({...amenities, parking: checked === true})
                          }
                        />
                        <label htmlFor="parking" className="text-sm flex items-center cursor-pointer">
                          <Car className="h-3.5 w-3.5 mr-1.5" />
                          Parking
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="restaurant" 
                          checked={amenities.restaurant}
                          onCheckedChange={(checked) => 
                            setAmenities({...amenities, restaurant: checked === true})
                          }
                        />
                        <label htmlFor="restaurant" className="text-sm flex items-center cursor-pointer">
                          <Utensils className="h-3.5 w-3.5 mr-1.5" />
                          Restaurant
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pool" 
                          checked={amenities.pool}
                          onCheckedChange={(checked) => 
                            setAmenities({...amenities, pool: checked === true})
                          }
                        />
                        <label htmlFor="pool" className="text-sm flex items-center cursor-pointer">
                          Pool
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="spa" 
                          checked={amenities.spa}
                          onCheckedChange={(checked) => 
                            setAmenities({...amenities, spa: checked === true})
                          }
                        />
                        <label htmlFor="spa" className="text-sm flex items-center cursor-pointer">
                          Spa
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="gym" 
                          checked={amenities.gym}
                          onCheckedChange={(checked) => 
                            setAmenities({...amenities, gym: checked === true})
                          }
                        />
                        <label htmlFor="gym" className="text-sm flex items-center cursor-pointer">
                          Gym
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-16 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                {loading 
                  ? "Finding hotels..." 
                  : `${filteredHotels.length} Hotels ${searchLocation ? `in ${searchLocation}` : "available"}`
                }
              </h2>
              {date?.from && date?.to && (
                <p className="text-gray-500 text-sm mt-1">
                  {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")} · {guests} guest{guests !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {selectedRating !== null && (
                <Badge variant="outline" className="bg-white">
                  {selectedRating} <Star className="h-3 w-3 ml-1 fill-current" />
                </Badge>
              )}
              {Object.entries(amenities).some(([_, isSelected]) => isSelected) && (
                <Badge variant="outline" className="bg-white">
                  {Object.entries(amenities).filter(([_, isSelected]) => isSelected).length} Amenities
                </Badge>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-ocean-500 animate-spin mb-4" />
              <p className="text-gray-500">Finding the best hotels for you...</p>
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BedDouble className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No hotels found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
              <Button onClick={resetFilters}>Reset all filters</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIAssistant />
      <Toaster />
    </div>
  );
};

export default Hotels;
