
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Plane, Hotel, Utensils, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Attraction {
  name: string;
  description: string;
  recommendedTime: string;
}

interface Hotel {
  name: string;
  address: string;
  price: string;
  rating: number;
}

interface Flight {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  price: string;
}

interface DayActivity {
  time: string;
  activity: string;
  location: string;
}

interface DaySchedule {
  day: string;
  activities: DayActivity[];
}

interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  address: string;
}

interface DetailedItinerary {
  destination: string;
  duration: string;
  dates: string;
  attractions: Attraction[];
  hotels: Hotel[];
  flights: Flight[];
  dailySchedule: DaySchedule[];
  restaurants: Restaurant[];
  tips: string[];
}

const ItineraryDetails = () => {
  const location = useLocation();
  const [itinerary, setItinerary] = useState<DetailedItinerary | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Extract itinerary data from location state
    if (location.state?.itinerary) {
      setItinerary(location.state.itinerary);
    }

    if (location.state?.pdfUrl) {
      setPdfUrl(location.state.pdfUrl);
    }
  }, [location.state]);

  // If no itinerary was found in state, show error
  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">No Itinerary Data Found</h1>
            <p className="mb-6">Please return to the previous page and try generating an itinerary again.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section with destination and quick details */}
        <div className="bg-gradient-to-r from-teal-500 to-ocean-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {itinerary.destination} Itinerary
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                  <Calendar className="h-4 w-4 mr-1" /> {itinerary.duration}
                </Badge>
                {itinerary.dates && (
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                    <Clock className="h-4 w-4 mr-1" /> {itinerary.dates}
                  </Badge>
                )}
              </div>

              {pdfUrl && (
                <div className="mb-6">
                  <Button 
                    className="bg-sunset-500 hover:bg-sunset-600"
                    onClick={() => window.open(pdfUrl, "_blank")}
                  >
                    Download PDF Itinerary
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content with tabs */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="schedule" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              {itinerary.flights.length > 0 && (
                <TabsTrigger value="flights">Flights</TabsTrigger>
              )}
              <TabsTrigger value="dining">Dining</TabsTrigger>
            </TabsList>

            {/* Daily Schedule */}
            <TabsContent value="schedule" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Daily Schedule</h2>
              {itinerary.dailySchedule.map((day, index) => (
                <Card key={index} className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{day.day}</h3>
                    <div className="space-y-4">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-start pb-4 border-b last:border-0">
                          <div className="bg-teal-100 text-teal-700 font-medium rounded-md px-2 py-1 min-w-24 text-center mr-4">
                            {activity.time}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.activity}</p>
                            {activity.location && (
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" /> {activity.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Attractions */}
            <TabsContent value="attractions" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Must-See Attractions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {itinerary.attractions.map((attraction, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
                      <p className="text-gray-600 mb-3">{attraction.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Recommended time: {attraction.recommendedTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Hotels */}
            <TabsContent value="hotels" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Recommended Hotels</h2>
              <div className="space-y-4">
                {itinerary.hotels.map((hotel, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {hotel.address}
                          </p>
                          <div className="mt-2">
                            {Array.from({ length: Math.round(hotel.rating) }).map((_, i) => (
                              <span key={i} className="text-yellow-400 text-lg">★</span>
                            ))}
                            <span className="ml-2 text-gray-600">{hotel.rating}/5</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-ocean-600">{hotel.price}</div>
                          <Button className="mt-2" variant="outline">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Flights */}
            {itinerary.flights.length > 0 && (
              <TabsContent value="flights" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Flight Options</h2>
                <div className="space-y-4">
                  {itinerary.flights.map((flight, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between flex-wrap gap-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{flight.airline}</h3>
                            <p className="text-gray-600">Flight #{flight.flightNumber}</p>
                            <div className="flex items-center gap-6 mt-3">
                              <div>
                                <div className="font-medium">{flight.departure}</div>
                              </div>
                              <div className="text-gray-400">✈</div>
                              <div>
                                <div className="font-medium">{flight.arrival}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-ocean-600">{flight.price}</div>
                            <Button className="mt-2" variant="outline">Book Flight</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Dining */}
            <TabsContent value="dining" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Dining Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {itinerary.restaurants.map((restaurant, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-600">{restaurant.cuisine}</p>
                        <p className="text-gray-600">{restaurant.priceRange}</p>
                      </div>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {restaurant.address}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Travel Tips */}
          <div className="max-w-4xl mx-auto mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-ocean-500" />
              Travel Tips
            </h2>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-ocean-500 mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ItineraryDetails;
