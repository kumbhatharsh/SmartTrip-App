
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import HotelCard from "@/components/HotelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search, Hotel, MapPin, Star, DollarSign, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Hotels = () => {
  const [priceRange, setPriceRange] = useState([50, 300]);
  const [searchQuery, setSearchQuery] = useState("");
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  // Function to fetch hotels from Supabase
  const searchHotels = async () => {
    if (!destination.trim()) {
      toast({
        title: "Please enter a destination",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      // Basic query with destination filter
      let query = supabase
        .from('Hotel')
        .select('*')
        .ilike('location', `%${destination}%`);
      
      // Add price range filter if set
      if (priceRange && priceRange.length === 2) {
        query = query
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setHotels(data);
        toast({
          title: `Found ${data.length} hotels in ${destination}`,
        });
      } else {
        setHotels([]);
        toast({
          title: "No hotels found",
          description: "Try different search criteria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast({
        title: "Error fetching hotels",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-ocean-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <Hotel className="h-7 w-7 mr-2" />
              <h1 className="text-3xl font-bold">Find Your Perfect Stay</h1>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input 
                    placeholder="Where do you want to stay?" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-white text-gray-800"
                  />
                </div>
                <div>
                  <Input 
                    type="date" 
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="bg-white text-gray-800"
                    placeholder="Check-in"
                  />
                </div>
                <div>
                  <Input 
                    type="date" 
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="bg-white text-gray-800"
                    placeholder="Check-out"
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-sunset-500 hover:bg-sunset-600"
                onClick={searchHotels}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Search Hotels
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Filters</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </h3>
                  <Input 
                    placeholder="Destination" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    Check-in / Check-out
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                    <Input 
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price Range
                  </h3>
                  <Slider
                    defaultValue={[50, 300]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Star className="h-4 w-4 mr-1" />
                    Star Rating
                  </h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`star-${rating}`}
                          className="mr-2"
                        />
                        <label htmlFor={`star-${rating}`} className="text-sm flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-gray-300" />
                          ))}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-ocean-600 hover:bg-ocean-700"
                  onClick={searchHotels}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Apply Filters'
                  )}
                </Button>
              </div>
            </div>
            
            {/* Hotel Listings */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {searched ? 
                    `Hotels in ${destination || 'All Destinations'}` : 
                    'Popular Hotels'
                  }
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {hotels.length} results
                </div>
              </div>
              
              {hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Hotel className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-xl font-medium text-gray-900 mb-1">No hotels found</h3>
                  <p className="text-gray-500 mb-4">
                    {searched ? 
                      'Try adjusting your search criteria' : 
                      'Search for hotels to see results'
                    }
                  </p>
                </div>
              )}
              
              {hotels.length > 0 && (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline" className="border-ocean-500 text-ocean-600">
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Hotels;
