import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Plane, Hotel, Utensils, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

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

const parisItinerary: DetailedItinerary = {
  destination: "Paris, France",
  duration: "5 days",
  dates: "Flexible dates",
  attractions: [
    { name: "Eiffel Tower", description: "Iconic iron tower offering spectacular city views", recommendedTime: "2-3 hours" },
    { name: "Louvre Museum", description: "World's largest art museum and home to the Mona Lisa", recommendedTime: "Half day" },
    { name: "Notre-Dame Cathedral", description: "Medieval Catholic cathedral with Gothic architecture", recommendedTime: "1-2 hours" },
    { name: "Champs-Élysées", description: "Elegant avenue known for luxury shopping and cafés", recommendedTime: "2-3 hours" },
    { name: "Montmartre", description: "Historic district with bohemian atmosphere and Sacré-Cœur Basilica", recommendedTime: "Half day" }
  ],
  hotels: [
    { name: "Hôtel Plaza Athénée", address: "25 Avenue Montaigne, 75008 Paris", price: "€850/night", rating: 5 },
    { name: "Le Meurice", address: "228 Rue de Rivoli, 75001 Paris", price: "€750/night", rating: 5 },
    { name: "Hôtel de Crillon", address: "10 Place de la Concorde, 75008 Paris", price: "€800/night", rating: 5 },
    { name: "Relais Christine", address: "3 Rue Christine, 75006 Paris", price: "€350/night", rating: 4 },
    { name: "Hôtel des Grands Boulevards", address: "17 Boulevard Poissonnière, 75002 Paris", price: "€200/night", rating: 4 }
  ],
  flights: [
    { airline: "Air France", flightNumber: "AF217", departure: "Mumbai 23:15", arrival: "Paris 04:30", price: "€650" },
    { airline: "Lufthansa", flightNumber: "LH761", departure: "Mumbai 03:25", arrival: "Paris 12:45", price: "€580" },
    { airline: "Emirates", flightNumber: "EK501", departure: "Mumbai 04:30", arrival: "Paris 13:15", price: "€720" },
    { airline: "Qatar Airways", flightNumber: "QR556", departure: "Mumbai 03:55", arrival: "Paris 14:05", price: "€690" },
    { airline: "Etihad Airways", flightNumber: "EY205", departure: "Mumbai 04:15", arrival: "Paris 15:30", price: "€650" }
  ],
  dailySchedule: [
    {
      day: "Day 1",
      activities: [
        { time: "09:00 AM", activity: "Breakfast at local café", location: "Le Marais district" },
        { time: "10:30 AM", activity: "Visit Louvre Museum", location: "Rue de Rivoli" },
        { time: "02:00 PM", activity: "Lunch at Café Marly", location: "93 Rue de Rivoli" },
        { time: "04:00 PM", activity: "Seine River Cruise", location: "Near Pont Neuf" },
        { time: "07:30 PM", activity: "Dinner", location: "Le Jules Verne at Eiffel Tower" }
      ]
    },
    {
      day: "Day 2",
      activities: [
        { time: "08:30 AM", activity: "Breakfast", location: "Hotel" },
        { time: "10:00 AM", activity: "Visit Eiffel Tower", location: "Champ de Mars" },
        { time: "01:00 PM", activity: "Lunch", location: "Le Suffren" },
        { time: "03:00 PM", activity: "Arc de Triomphe and Champs-Élysées", location: "8th arrondissement" },
        { time: "08:00 PM", activity: "Dinner", location: "L'Avenue" }
      ]
    },
    {
      day: "Day 3",
      activities: [
        { time: "09:00 AM", activity: "Breakfast", location: "Hotel" },
        { time: "10:30 AM", activity: "Montmartre and Sacré-Cœur", location: "18th arrondissement" },
        { time: "01:30 PM", activity: "Lunch", location: "La Maison Rose" },
        { time: "03:30 PM", activity: "Musée d'Orsay", location: "1 Rue de la Légion d'Honneur" },
        { time: "07:00 PM", activity: "Dinner", location: "Le Grand Véfour" }
      ]
    },
    {
      day: "Day 4",
      activities: [
        { time: "09:30 AM", activity: "Breakfast", location: "Hotel" },
        { time: "11:00 AM", activity: "Notre-Dame Cathedral", location: "Île de la Cité" },
        { time: "02:00 PM", activity: "Lunch", location: "Aux Anysetiers du Roy" },
        { time: "03:30 PM", activity: "Luxembourg Gardens", location: "6th arrondissement" },
        { time: "07:30 PM", activity: "Dinner", location: "L'Ambroisie" }
      ]
    },
    {
      day: "Day 5",
      activities: [
        { time: "08:30 AM", activity: "Breakfast", location: "Hotel" },
        { time: "10:00 AM", activity: "Versailles Palace (day trip)", location: "Versailles" },
        { time: "02:00 PM", activity: "Lunch", location: "La Flottille" },
        { time: "06:00 PM", activity: "Return to Paris", location: "" },
        { time: "08:30 PM", activity: "Farewell dinner", location: "Le Cinq" }
      ]
    }
  ],
  restaurants: [
    { name: "Le Jules Verne", cuisine: "French fine dining", priceRange: "€€€€", address: "Eiffel Tower, 2nd floor" },
    { name: "Septime", cuisine: "Modern French", priceRange: "€€€", address: "80 Rue de Charonne" },
    { name: "Breizh Café", cuisine: "French (crêpes)", priceRange: "€€", address: "109 Rue Vieille du Temple" },
    { name: "L'As du Fallafel", cuisine: "Middle Eastern", priceRange: "€", address: "34 Rue des Rosiers" },
    { name: "Le Comptoir du Relais", cuisine: "French bistro", priceRange: "€€€", address: "9 Carrefour de l'Odéon" }
  ],
  tips: [
    "Paris Museum Pass can save money if you plan to visit multiple museums",
    "Metro is the most efficient way to travel around the city",
    "Most attractions are closed on either Monday or Tuesday",
    "Tipping is not required but rounding up for good service is appreciated",
    "Learn a few basic French phrases - locals appreciate the effort",
    "Be aware of pickpockets in tourist areas and on public transport",
    "Make dinner reservations in advance, especially for high-end restaurants"
  ]
};

const ItineraryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerary, setItinerary] = useState<DetailedItinerary | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      console.log("Location state:", location.state);
      if (location.state?.itinerary) {
        console.log("Itinerary data found in location state:", location.state.itinerary);
        setItinerary(location.state.itinerary);
      } else {
        console.log("No itinerary data in location state, using fallback");
        setItinerary(parisItinerary);
        toast({
          title: "Using default itinerary",
          description: "We're showing a sample Paris itinerary because no specific itinerary was provided.",
          duration: 5000,
        });
      }

      if (location.state?.pdfUrl) {
        console.log("PDF URL found:", location.state.pdfUrl);
        setPdfUrl(location.state.pdfUrl);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error processing itinerary data:", error);
      setItinerary(parisItinerary);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error loading itinerary",
        description: "There was a problem loading your itinerary. We've loaded a sample one instead.",
        duration: 5000,
      });
    }
  }, [location.state, toast]);

  const handlePdfAction = () => {
    if (!pdfUrl) {
      toast({
        variant: "destructive",
        title: "No PDF available",
        description: "The PDF version of this itinerary is not available.",
      });
      return;
    }
    
    console.log("Opening PDF URL:", pdfUrl);
    window.open(pdfUrl, "_blank");
    
    toast({
      title: "Opening PDF",
      description: "The PDF is opening in a new tab",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Loading Itinerary...</h1>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">No Itinerary Data Found</h1>
            <p className="mb-6">Please return to the previous page and try generating an itinerary again.</p>
            <Button onClick={() => navigate("/itineraries")}>Go to Itineraries</Button>
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
                    className="bg-sunset-500 hover:bg-sunset-600 flex items-center"
                    onClick={handlePdfAction}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full PDF Itinerary
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

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
      <Toaster />
    </div>
  );
};

export default ItineraryDetails;
