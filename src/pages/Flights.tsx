
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import FlightCard from "@/components/FlightCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plane, ArrowLeftRight, DollarSign, Clock, Luggage, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Flights = () => {
  const [priceRange, setPriceRange] = useState([200, 800]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const { toast } = useToast();

  // Function to search flights
  const searchFlights = async () => {
    if (!departureCity.trim() || !arrivalCity.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both departure and arrival cities",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      // Basic query with from/to filters
      let query = supabase
        .from('Flight')
        .select('*')
        .ilike('departure', `%${departureCity}%`)
        .ilike('arrival', `%${arrivalCity}%`);
      
      // Add price range filter if set
      if (priceRange && priceRange.length === 2) {
        query = query
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform the data to match the expected Flight structure
        const formattedFlights = data.map(flight => ({
          ...flight,
          id: flight.id,
          from: flight.departure,
          to: flight.arrival,
          departureDate: flight.departureTime,
          arrivalDate: flight.arrivalTime,
          price: flight.price,
          duration: calculateDuration(flight.departureTime, flight.arrivalTime),
          airline: flight.airline,
          flightNumber: flight.flightNumber
        }));
        
        setFlights(formattedFlights);
        toast({
          title: `Found ${data.length} flights from ${departureCity} to ${arrivalCity}`,
        });
      } else {
        setFlights([]);
        toast({
          title: "No flights found",
          description: "Try different search criteria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      toast({
        title: "Error fetching flights",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate flight duration
  const calculateDuration = (departure, arrival) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMs = arrivalTime - departureTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Swap departure and arrival cities
  const swapCities = () => {
    const temp = departureCity;
    setDepartureCity(arrivalCity);
    setArrivalCity(temp);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-ocean-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-6">
              <Plane className="h-7 w-7 mr-2" />
              <h1 className="text-3xl font-bold">Find Your Flight</h1>
            </div>
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="roundtrip" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-ocean-700/50">
                  <TabsTrigger value="roundtrip" className="data-[state=active]:bg-white data-[state=active]:text-ocean-600">
                    Round Trip
                  </TabsTrigger>
                  <TabsTrigger value="oneway" className="data-[state=active]:bg-white data-[state=active]:text-ocean-600">
                    One Way
                  </TabsTrigger>
                  <TabsTrigger value="multicity" className="data-[state=active]:bg-white data-[state=active]:text-ocean-600">
                    Multi-City
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="roundtrip" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-1 block">From</Label>
                        <Input 
                          placeholder="Departure City" 
                          className="bg-white text-gray-800" 
                          value={departureCity}
                          onChange={(e) => setDepartureCity(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Label className="text-white mb-1 block">To</Label>
                        <Input 
                          placeholder="Arrival City" 
                          className="bg-white text-gray-800" 
                          value={arrivalCity}
                          onChange={(e) => setArrivalCity(e.target.value)}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-8 -right-6 h-6 w-6 rounded-full bg-white text-ocean-600"
                          onClick={swapCities}
                        >
                          <ArrowLeftRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-white mb-1 block">Departure</Label>
                      <Input 
                        type="date" 
                        className="bg-white text-gray-800"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-1 block">Return</Label>
                      <Input 
                        type="date" 
                        className="bg-white text-gray-800"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      className="bg-sunset-500 hover:bg-sunset-600 px-8"
                      onClick={searchFlights}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" /> Search Flights
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="oneway" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-1 block">From</Label>
                        <Input 
                          placeholder="Departure City" 
                          className="bg-white text-gray-800"
                          value={departureCity}
                          onChange={(e) => setDepartureCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-1 block">To</Label>
                        <Input 
                          placeholder="Arrival City" 
                          className="bg-white text-gray-800"
                          value={arrivalCity}
                          onChange={(e) => setArrivalCity(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white mb-1 block">Departure</Label>
                      <Input 
                        type="date" 
                        className="bg-white text-gray-800"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-1 block">Passengers</Label>
                      <Input type="number" min="1" defaultValue="1" className="bg-white text-gray-800" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      className="bg-sunset-500 hover:bg-sunset-600 px-8"
                      onClick={searchFlights}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" /> Search Flights
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="multicity" className="mt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-white mb-1 block">From</Label>
                        <Input 
                          placeholder="Departure City" 
                          className="bg-white text-gray-800"
                          value={departureCity}
                          onChange={(e) => setDepartureCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-1 block">To</Label>
                        <Input 
                          placeholder="Arrival City" 
                          className="bg-white text-gray-800"
                          value={arrivalCity}
                          onChange={(e) => setArrivalCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-1 block">Departure</Label>
                        <Input 
                          type="date" 
                          className="bg-white text-gray-800"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button variant="outline" className="w-full bg-white text-ocean-600 hover:bg-white/90">
                          Add Flight
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      className="bg-sunset-500 hover:bg-sunset-600 px-8"
                      onClick={searchFlights}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" /> Search Flights
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
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
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price Range
                  </h3>
                  <Slider
                    defaultValue={[200, 800]}
                    max={1500}
                    step={50}
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
                    <Clock className="h-4 w-4 mr-1" />
                    Flight Times
                  </h3>
                  <div className="space-y-2">
                    {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox id={`time-${time}`} />
                        <Label htmlFor={`time-${time}`} className="text-sm">
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Plane className="h-4 w-4 mr-1" />
                    Airlines
                  </h3>
                  <div className="space-y-2">
                    {["Air France", "Lufthansa", "Emirates", "Qatar Airways", "Etihad Airways"].map((airline) => (
                      <div key={airline} className="flex items-center space-x-2">
                        <Checkbox id={`airline-${airline}`} />
                        <Label htmlFor={`airline-${airline}`} className="text-sm">
                          {airline}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Luggage className="h-4 w-4 mr-1" />
                    Luggage Included
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="luggage" />
                    <Label htmlFor="luggage" className="text-sm">Show only</Label>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-ocean-600 hover:bg-ocean-700"
                  onClick={searchFlights}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    'Apply Filters'
                  )}
                </Button>
              </div>
            </div>
            
            {/* Flight Listings */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {searched ? 
                    `Flights from ${departureCity} to ${arrivalCity}` : 
                    'Available Flights'
                  }
                </h2>
                <div className="text-sm text-gray-500">
                  Showing {flights.length} results
                </div>
              </div>
              
              {flights.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Plane className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-xl font-medium text-gray-900 mb-1">No flights found</h3>
                  <p className="text-gray-500 mb-4">
                    {searched ? 
                      'Try adjusting your search criteria' : 
                      'Search for flights to see results'
                    }
                  </p>
                </div>
              )}
              
              {flights.length > 0 && (
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

export default Flights;
