
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import HotelCard from "@/components/HotelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { popularHotels } from "@/lib/mockData";
import { Search, Hotel, MapPin, Star, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";

const Hotels = () => {
  const [priceRange, setPriceRange] = useState([50, 300]);
  const [searchQuery, setSearchQuery] = useState("");

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
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Where do you want to stay?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white text-gray-800"
                />
                <Button className="bg-sunset-500 hover:bg-sunset-600">
                  <Search className="h-4 w-4 mr-2" /> Search
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
                    Location
                  </h3>
                  <Input placeholder="Destination" />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    Check-in / Check-out
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" />
                    <Input type="date" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price Range
                  </h3>
                  <Slider
                    defaultValue={[50, 300]}
                    max={500}
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
                
                <Button className="w-full bg-ocean-600 hover:bg-ocean-700">
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Hotel Listings */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Available Hotels</h2>
                <div className="text-sm text-gray-500">
                  Showing {popularHotels.length} results
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {popularHotels.concat(popularHotels).map((hotel, index) => (
                  <HotelCard key={`${hotel.id}-${index}`} hotel={hotel} />
                ))}
              </div>
              
              <div className="mt-10 flex justify-center">
                <Button variant="outline" className="border-ocean-500 text-ocean-600">
                  Load More
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

export default Hotels;
