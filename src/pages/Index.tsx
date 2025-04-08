
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import HotelCard from "@/components/HotelCard";
import FlightCard from "@/components/FlightCard";
import ItineraryCard from "@/components/ItineraryCard";
import WeatherAlerts from "@/components/WeatherAlerts";
import LocalEvents from "@/components/LocalEvents";
import { Button } from "@/components/ui/button";
import { popularDestinations, popularHotels, popularFlights, popularItineraries } from "@/lib/mockData";
import { MapPin, ArrowRight, Plane, Hotel, Calendar } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />

        {/* Popular Destinations */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Popular Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDestinations.map((destination) => (
                <div 
                  key={destination.id} 
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow relative group cursor-pointer"
                  onClick={() => navigate("/itineraries")}
                >
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Hotels */}
        <section className="py-14 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center">
                <Hotel className="h-6 w-6 text-ocean-600 mr-2" />
                <h2 className="text-3xl font-bold">Popular Hotels</h2>
              </div>
              <Button variant="link" className="text-ocean-600 flex items-center" onClick={() => navigate("/hotels")}>
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Flights */}
        <section className="py-14 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center">
                <Plane className="h-6 w-6 text-ocean-600 mr-2" />
                <h2 className="text-3xl font-bold">Popular Flights</h2>
              </div>
              <Button variant="link" className="text-ocean-600 flex items-center" onClick={() => navigate("/flights")}>
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        </section>

        {/* AI-Created Itineraries */}
        <section className="py-14 px-4 bg-gradient-to-r from-teal-500 to-ocean-600 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="h-7 w-7 mr-2" />
                <h2 className="text-3xl font-bold">AI-Powered Itineraries</h2>
              </div>
              <p className="max-w-2xl mx-auto text-white/90">
                Discover perfect travel plans crafted by our AI to match your preferences, 
                complete with suggestions for flights, hotels, and must-visit attractions.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button 
                variant="outline" 
                className="bg-white text-teal-700 hover:bg-white/90 px-8"
                onClick={() => navigate("/itineraries")}
              >
                Create Custom Itinerary
              </Button>
            </div>
          </div>
        </section>

        {/* Weather and Events */}
        <section className="py-14 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Travel Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WeatherAlerts />
              <LocalEvents />
            </div>
          </div>
        </section>

        {/* App features */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Why Choose JourneyWave</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                  <Plane className="h-8 w-8 text-ocean-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Booking</h3>
                <p className="text-gray-600">
                  Find and book the best flights and hotels with our intelligent search algorithms.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Itineraries</h3>
                <p className="text-gray-600">
                  Get personalized travel plans created by our advanced AI, tailored to your preferences.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-sunset-100 flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-sunset-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
                <p className="text-gray-600">
                  Stay informed with weather alerts and local events that may affect your travel plans.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
      <Toaster />
    </div>
  );
};

export default Index;
