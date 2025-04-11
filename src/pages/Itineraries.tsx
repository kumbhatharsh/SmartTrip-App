
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ItineraryCard from "@/components/ItineraryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { popularItineraries } from "@/lib/mockData";
import { Search, Calendar, MapPin, DollarSign, UsersRound, ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface DetailedItinerary {
  destination: string;
  duration: string;
  dates: string;
  attractions: Array<{name: string; description: string; recommendedTime: string}>;
  hotels: Array<{name: string; address: string; price: string; rating: number}>;
  flights: Array<{airline: string; flightNumber: string; departure: string; arrival: string; price: string}>;
  dailySchedule: Array<{day: string; activities: Array<{time: string; activity: string; location: string}>}>;
  restaurants: Array<{name: string; cuisine: string; priceRange: string; address: string}>;
  tips: string[];
}

// Interface for Itinerary from supabase
interface SupabaseItinerary {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  activities: string[] | null;
  createdAt: string;
  updatedAt: string;
}

const Itineraries = () => {
  const [durationRange, setDurationRange] = useState([3, 10]);
  const [priceRange, setPriceRange] = useState([500, 2000]);
  const [searchResults, setSearchResults] = useState<SupabaseItinerary[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDuration, setSearchDuration] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for search results from the AI assistant
  useEffect(() => {
    const searchedItineraries = sessionStorage.getItem('searchedItineraries');
    const destination = sessionStorage.getItem('searchDestination');
    const duration = sessionStorage.getItem('searchDuration');

    if (searchedItineraries && destination) {
      try {
        const itineraries = JSON.parse(searchedItineraries);
        setSearchResults(itineraries);
        setSearchPerformed(true);
        setSearchDestination(destination);
        setSearchDuration(duration || "");
        
        // Clear the session storage so it doesn't persist on refresh
        sessionStorage.removeItem('searchedItineraries');
        sessionStorage.removeItem('searchDestination');
        sessionStorage.removeItem('searchDuration');
      } catch (error) {
        console.error("Error parsing search results:", error);
      }
    }
  }, []);

  // Handle manual search
  const handleSearch = async () => {
    if (!destinationInput.trim()) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('Itinerary')
        .select('*')
        .ilike('destination', `%${destinationInput}%`);
      
      // Add duration filter if duration input is provided
      if (durationInput && durationInput.trim() !== '') {
        const durationValue = parseInt(durationInput);
        if (!isNaN(durationValue)) {
          query = query.eq('duration', durationValue);
        }
      }
      
      const { data: itineraries, error } = await query;
      
      if (error) throw error;
      
      setSearchResults(itineraries || []);
      setSearchPerformed(true);
      setSearchDestination(destinationInput);
      setSearchDuration(durationInput);
      setLoading(false);
    } catch (error) {
      console.error("Error searching itineraries:", error);
      setLoading(false);
    }
  };

  // Clear search results
  const clearSearch = () => {
    setSearchResults([]);
    setSearchPerformed(false);
    setSearchDestination("");
    setSearchDuration("");
    setDestinationInput("");
    setDurationInput("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-ocean-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-7 w-7 mr-2" />
              <h1 className="text-3xl font-bold">Discover AI-Powered Itineraries</h1>
            </div>
            <p className="text-center max-w-2xl mx-auto mb-8 text-white/90">
              Let our AI create the perfect travel plan for you, with curated experiences,
              accommodations and flights based on your preferences.
            </p>
            <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white mb-1 block">Destination</Label>
                  <Input 
                    placeholder="Where do you want to go?" 
                    className="bg-white text-gray-800" 
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-white mb-1 block">Duration</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="Number of days" 
                    className="bg-white text-gray-800" 
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-white mb-1 block">Travelers</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    defaultValue="2" 
                    className="bg-white text-gray-800" 
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button 
                  className="bg-sunset-500 hover:bg-sunset-600 px-8"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  Find Itineraries
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Section */}
        {searchPerformed && (
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2" 
                  onClick={clearSearch}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h2 className="text-2xl font-bold">Search Results</h2>
              </div>
              <div className="flex gap-2">
                {searchDestination && (
                  <Badge variant="outline" className="bg-white">
                    <MapPin className="h-3 w-3 mr-1" /> {searchDestination}
                  </Badge>
                )}
                {searchDuration && (
                  <Badge variant="outline" className="bg-white">
                    <Calendar className="h-3 w-3 mr-1" /> {searchDuration} days
                  </Badge>
                )}
              </div>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map((itinerary) => {
                  // Convert to the format expected by the ItineraryCard component
                  const formattedItinerary = {
                    ...itinerary,
                    highlights: itinerary.activities || [],
                    // Convert the duration to a string for the ItineraryCard component
                    duration: String(itinerary.duration),
                    // Add startDate and endDate properties (required by ItineraryCard)
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setDate(new Date().getDate() + itinerary.duration)).toISOString(),
                    image: `https://source.unsplash.com/random/800x600/?${itinerary.destination.toLowerCase()}`
                  };
                  return <ItineraryCard key={itinerary.id} itinerary={formattedItinerary} />;
                })}
              </div>
            ) : (
              <Alert className="mb-6">
                <AlertDescription>
                  No itineraries found for your search criteria. Try different location or parameters.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Main Content (only show if not viewing search results) */}
        {!searchPerformed && (
          <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-6">Filters</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      Region
                    </h3>
                    <div className="space-y-2">
                      {["Europe", "Asia", "North America", "South America", "Africa", "Oceania"].map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox id={`region-${region}`} />
                          <Label htmlFor={`region-${region}`} className="text-sm">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      Duration (days)
                    </h3>
                    <Slider
                      defaultValue={[3, 10]}
                      max={21}
                      step={1}
                      value={durationRange}
                      onValueChange={setDurationRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{durationRange[0]} days</span>
                      <span>{durationRange[1]} days</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium flex items-center mb-3">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Budget
                    </h3>
                    <Slider
                      defaultValue={[500, 2000]}
                      max={5000}
                      step={100}
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
                      <UsersRound className="h-4 w-4 mr-1" />
                      Trip Type
                    </h3>
                    <div className="space-y-2">
                      {["Family", "Couples", "Solo", "Friends", "Business"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={`type-${type}`} />
                          <Label htmlFor={`type-${type}`} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Apply Filters
                  </Button>
                </div>
              </div>
              
              {/* Itinerary Listings */}
              <div className="lg:w-3/4">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Popular Itineraries</h2>
                  <div className="text-sm text-gray-500">
                    Showing {popularItineraries.length} results
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {popularItineraries.map((itinerary, index) => (
                    <ItineraryCard key={`${itinerary.id}-${index}`} itinerary={itinerary} />
                  ))}
                </div>
                
                <div className="flex justify-center space-x-4 mt-12">
                  <Button 
                    className="bg-gradient-to-r from-teal-500 to-ocean-500 hover:from-teal-600 hover:to-ocean-600"
                    onClick={() => {
                      // Scroll to top to focus on the form
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Create Custom Itinerary
                  </Button>
                  <Button variant="outline" className="border-teal-500 text-teal-600">
                    Load More
                  </Button>
                </div>
                
                <div className="mt-16 bg-gray-50 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Need personalized recommendations?</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI assistant can help create a custom itinerary based on your preferences.
                  </p>
                  <Button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-sunset-500 hover:bg-sunset-600"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Itineraries;
