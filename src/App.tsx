
import Index from "@/pages/Index";
import Flights from "@/pages/Flights";
import Hotels from "@/pages/Hotels";
import Itineraries from "@/pages/Itineraries";
import ItineraryDetails from "@/pages/ItineraryDetails";
import RawItineraryView from "@/pages/RawItineraryView";
import MyTrips from "@/pages/MyTrips";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Signup from "@/pages/Signup";
import Signin from "@/pages/Signin";
import NotFound from "@/pages/NotFound";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Debug loading to check if App is rendering properly
    console.log("App component mounted and rendering");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/itineraries" element={<Itineraries />} />
      <Route path="/itinerary-details" element={<ItineraryDetails />} />
      <Route path="/raw-itinerary" element={<RawItineraryView />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
