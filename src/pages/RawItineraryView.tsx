
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RawItineraryView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rawContent, setRawContent] = useState<string>("");

  useEffect(() => {
    if (location.state?.rawResponse) {
      setRawContent(location.state.rawResponse);
    } else {
      // If no raw response is available, redirect to the itineraries page
      navigate("/itineraries");
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Raw Itinerary</h1>
          <p className="text-gray-600 mb-6">
            This is the raw output from the itinerary generation API.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 whitespace-pre-wrap font-mono text-sm overflow-auto">
          {rawContent}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RawItineraryView;
