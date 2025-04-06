import { NavLink } from "react-router-dom";
import { Plane, Hotel, Calendar, MapPin, User, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ocean-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">JourneyWave</h3>
            <p className="text-ocean-100 mb-4">
              Your intelligent travel companion that combines hotel and flight booking with AI-powered itinerary planning.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <NavLink to="/" className="text-ocean-100 hover:text-white transition-colors flex items-center">
                  <Plane className="h-4 w-4 mr-2" />
                  Find Flights
                </NavLink>
              </li>
              <li>
                <NavLink to="/hotels" className="text-ocean-100 hover:text-white transition-colors flex items-center">
                  <Hotel className="h-4 w-4 mr-2" />
                  Book Hotels
                </NavLink>
              </li>
              <li>
                <NavLink to="/itineraries" className="text-ocean-100 hover:text-white transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Explore Itineraries
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-trips" className="text-ocean-100 hover:text-white transition-colors flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  My Trips
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-ocean-100 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
            <p className="text-ocean-100 mb-3">
              Get special offers and travel inspiration directly to your inbox.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-l-md text-gray-800 w-full focus:outline-none"
              />
              <button
                type="submit"
                className="bg-sunset-500 px-4 py-2 rounded-r-md hover:bg-sunset-600 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-ocean-800 mt-10 pt-6 text-center text-ocean-200 text-sm">
          <p>© {new Date().getFullYear()} JourneyWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
