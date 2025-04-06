
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import ItineraryCard from "@/components/ItineraryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { popularItineraries } from "@/lib/mockData";
import { Search, Calendar, MapPin, DollarSign, UsersRound } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const Itineraries = () => {
  const [durationRange, setDurationRange] = useState([3, 10]);
  const [priceRange, setPriceRange] = useState([500, 2000]);

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
                  <Input placeholder="Where do you want to go?" className="bg-white text-gray-800" />
                </div>
                <div>
                  <Label className="text-white mb-1 block">Duration</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="Number of days" 
                    className="bg-white text-gray-800" 
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
              <div className="mt-4 flex justify-center">
                <Button className="bg-sunset-500 hover:bg-sunset-600 px-8">
                  <Search className="h-4 w-4 mr-2" /> Find Itineraries
                </Button>
              </div>
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
                {popularItineraries.concat(popularItineraries).map((itinerary, index) => (
                  <ItineraryCard key={`${itinerary.id}-${index}`} itinerary={itinerary} />
                ))}
              </div>
              
              <div className="flex justify-center space-x-4 mt-12">
                <Button className="bg-gradient-to-r from-teal-500 to-ocean-500 hover:from-teal-600 hover:to-ocean-600">
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
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Itineraries;
