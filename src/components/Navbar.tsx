
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Airplane, 
  Hotel, 
  Calendar, 
  MapPin, 
  User, 
  Search,
  Settings 
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/hotels" },
    { name: "Flights", path: "/flights" },
    { name: "Itineraries", path: "/itineraries" },
    { name: "My Trips", path: "/my-trips" },
  ];

  return (
    <nav className="bg-white shadow-md py-3 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <NavLink to="/" className="text-2xl font-bold text-ocean-600 flex items-center gap-2">
            <span className="text-gradient-to-r from-ocean-600 to-teal-500">
              JourneyWave
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-medium transition-colors hover:text-ocean-600 ${
                  isActive ? "text-ocean-600" : "text-gray-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm" className="rounded-full border-ocean-500 text-ocean-600 hover:bg-ocean-50">
            Sign In
          </Button>
          <Button size="sm" className="rounded-full bg-ocean-600 hover:bg-ocean-700">
            Sign Up
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-2 pb-4 px-4 bg-white border-t">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `py-2 text-base font-medium transition-colors hover:text-ocean-600 ${
                    isActive ? "text-ocean-600" : "text-gray-600"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-3 flex flex-col space-y-3">
              <Button variant="outline" className="w-full rounded-full border-ocean-500 text-ocean-600 hover:bg-ocean-50">
                Sign In
              </Button>
              <Button className="w-full rounded-full bg-ocean-600 hover:bg-ocean-700">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
