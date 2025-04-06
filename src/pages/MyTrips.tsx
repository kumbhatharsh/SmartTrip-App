import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plane, Calendar, MapPin, Hotel, AlertTriangle, CloudSun, Eye } from "lucide-react";
import { weatherAlerts } from "@/lib/mockData";

const MyTrips = () => {
  // Sample user trips data
  const upcomingTrips = [
    {
      id: '1',
      destination: 'Paris, France',
      startDate: '2025-06-22',
      endDate: '2025-06-28',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=500',
      hotel: 'City Lights Boutique Hotel',
      flight: 'LHR to CDG, British Airways',
    },
  ];

  const pastTrips = [
    {
      id: '2',
      destination: 'Bali, Indonesia',
      startDate: '2025-04-10',
      endDate: '2025-04-18',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&h=500',
      hotel: 'Ocean View Resort & Spa',
      flight: 'LHR to DPS, Singapore Airlines',
    },
    {
      id: '3',
      destination: 'New York, USA',
      startDate: '2025-03-05',
      endDate: '2025-03-12',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&h=500',
      hotel: 'Urban Oasis Hotel',
      flight: 'LHR to JFK, American Airlines',
    },
  ];

  // No trip booked state
  const hasTrips = upcomingTrips.length > 0 || pastTrips.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-ocean-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="mt-2 text-white/80">
              Manage and view all your travel plans in one place
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-12 px-4">
          {hasTrips ? (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
                <TabsTrigger value="past">Past Trips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingTrips.length > 0 ? (
                  <div className="space-y-8">
                    {upcomingTrips.map((trip) => (
                      <div key={trip.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-48 md:h-auto">
                              <img 
                                src={trip.image} 
                                alt={trip.destination}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <Badge className="mb-2 bg-ocean-100 text-ocean-700 hover:bg-ocean-200">
                                    Upcoming
                                  </Badge>
                                  <h2 className="text-2xl font-bold mb-4">{trip.destination}</h2>
                                </div>
                                <Badge variant="outline" className="bg-sunset-50 text-sunset-700 border-sunset-200">
                                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="flex items-start">
                                  <Hotel className="h-5 w-5 text-ocean-600 mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Hotel</p>
                                    <p className="text-gray-600 text-sm">{trip.hotel}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start">
                                  <Plane className="h-5 w-5 text-ocean-600 mr-2 mt-0.5" />
                                  <div>
                                    <p className="font-medium">Flight</p>
                                    <p className="text-gray-600 text-sm">{trip.flight}</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                          <CardFooter className="bg-gray-50 p-4 flex justify-between">
                            <Button variant="outline" className="text-ocean-600 border-ocean-500">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button className="bg-ocean-600 hover:bg-ocean-700">
                              Manage Trip
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <div className="space-y-4">
                          <Alert variant="default" className="bg-sunset-50 text-sunset-800 border-sunset-200">
                            <CloudSun className="h-4 w-4" />
                            <AlertTitle>Weather Alert</AlertTitle>
                            <AlertDescription>
                              {weatherAlerts.find(alert => alert.location.includes('Paris'))?.alert || 'No significant weather alerts for your trip.'}
                            </AlertDescription>
                          </Alert>
                          
                          <Alert variant="default" className="bg-ocean-50 text-ocean-800 border-ocean-200">
                            <Calendar className="h-4 w-4" />
                            <AlertTitle>Local Event</AlertTitle>
                            <AlertDescription>
                              Paris Fashion Week is happening during your stay.
                            </AlertDescription>
                          </Alert>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <h3 className="font-semibold mb-2">AI Travel Assistant</h3>
                              <p className="text-sm text-gray-600 mb-4">
                                Get personalized recommendations for your Paris trip
                              </p>
                              <Button className="w-full bg-gradient-to-r from-teal-500 to-ocean-500 hover:from-teal-600 hover:to-ocean-600">
                                Get Suggestions
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                    <p className="text-gray-600 mb-6">Time to plan your next adventure!</p>
                    <div className="flex justify-center gap-4">
                      <Button className="bg-ocean-600 hover:bg-ocean-700">
                        <Plane className="h-4 w-4 mr-2" />
                        Book a Flight
                      </Button>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Hotel className="h-4 w-4 mr-2" />
                        Find a Hotel
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTrips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={trip.image} 
                          alt={trip.destination}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-gray-800/70 text-white">
                          Past Trip
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{trip.destination}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Hotel className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                            <div className="text-sm text-gray-600">{trip.hotel}</div>
                          </div>
                          <div className="flex items-start">
                            <Plane className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                            <div className="text-sm text-gray-600">{trip.flight}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between gap-3">
                        <Button variant="outline" className="flex-1">
                          Trip Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Book Again
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6 inline-block p-6 bg-gray-100 rounded-full">
                <MapPin className="h-12 w-12 text-ocean-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No trips booked yet</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Start planning your journey by booking flights, hotels, or exploring our 
                AI-powered itineraries.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-ocean-600 hover:bg-ocean-700">
                  <Plane className="h-4 w-4 mr-2" />
                  Book a Flight
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Hotel className="h-4 w-4 mr-2" />
                  Find a Hotel
                </Button>
                <Button className="bg-sunset-600 hover:bg-sunset-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Explore Itineraries
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default MyTrips;
