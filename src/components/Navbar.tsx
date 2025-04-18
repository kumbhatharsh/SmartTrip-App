
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Plane, 
  Hotel, 
  Calendar, 
  MapPin, 
  User, 
  Search,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
              SmartTrip
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
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user.user_metadata?.firstName || 'User'}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-ocean-500 text-ocean-600 hover:bg-ocean-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <NavLink to="/signin">
                <Button variant="outline" size="sm" className="rounded-full border-ocean-500 text-ocean-600 hover:bg-ocean-50">
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/signup">
                <Button size="sm" className="rounded-full bg-ocean-600 hover:bg-ocean-700">
                  Sign Up
                </Button>
              </NavLink>
            </>
          )}
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
              {user ? (
                <Button 
                  variant="outline" 
                  className="w-full rounded-full border-ocean-500 text-ocean-600 hover:bg-ocean-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <NavLink to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full border-ocean-500 text-ocean-600 hover:bg-ocean-50">
                      Sign In
                    </Button>
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-ocean-600 hover:bg-ocean-700">
                      Sign Up
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
