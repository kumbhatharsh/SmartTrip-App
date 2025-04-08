
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Send, CloudSun, BellRing, ArrowRight, X, Calendar, MapPin, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Trip planning states
type PlanningState = 
  | "idle" 
  | "askingDestination" 
  | "askingDepartureCity"
  | "askingStartDate"
  | "askingEndDate"
  | "askingTravelers"
  | "askingBudget"
  | "askingPreferences"
  | "generatingItinerary"
  | "displayingResults";

interface TripPlan {
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  preferences: string;
}

const defaultTripPlan: TripPlan = {
  destination: "",
  departureCity: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  budget: 0,
  preferences: ""
};

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [planningState, setPlanningState] = useState<PlanningState>("idle");
  const [tripPlan, setTripPlan] = useState<TripPlan>(defaultTripPlan);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetTripPlanningState = () => {
    setPlanningState("idle");
    setTripPlan(defaultTripPlan);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = message;
    setConversation(prev => [...prev, {role: 'user', content: userMessage}]);
    setMessage("");
    setLoading(true);
    
    // Handle conversation based on current planning state
    if (planningState === "askingDestination") {
      setTripPlan(prev => ({ ...prev, destination: userMessage }));
      setPlanningState("askingDepartureCity");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Great! You want to visit ${userMessage}. Where will you be departing from?`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingDepartureCity") {
      setTripPlan(prev => ({ ...prev, departureCity: userMessage }));
      setPlanningState("askingStartDate");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Perfect. When will your trip start? (Please provide a date in YYYY-MM-DD format)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingStartDate") {
      // Simple date validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      if (!dateRegex.test(userMessage)) {
        setTimeout(() => {
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `Please provide the start date in YYYY-MM-DD format (e.g., 2025-06-15).`
          }]);
          setLoading(false);
        }, 500);
        return;
      }
      
      setTripPlan(prev => ({ ...prev, startDate: userMessage }));
      setPlanningState("askingEndDate");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `When will your trip end? (Please provide a date in YYYY-MM-DD format)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingEndDate") {
      // Simple date validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      if (!dateRegex.test(userMessage)) {
        setTimeout(() => {
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `Please provide the end date in YYYY-MM-DD format (e.g., 2025-06-20).`
          }]);
          setLoading(false);
        }, 500);
        return;
      }
      
      setTripPlan(prev => ({ ...prev, endDate: userMessage }));
      setPlanningState("askingTravelers");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `How many travelers will be on this trip?`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingTravelers") {
      const travelers = parseInt(userMessage);
      
      if (isNaN(travelers) || travelers <= 0) {
        setTimeout(() => {
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `Please provide a valid number of travelers.`
          }]);
          setLoading(false);
        }, 500);
        return;
      }
      
      setTripPlan(prev => ({ ...prev, travelers: travelers }));
      setPlanningState("askingBudget");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `What's your approximate budget for this trip (in USD)?`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingBudget") {
      const budget = parseInt(userMessage.replace(/[^0-9]/g, ''));
      
      if (isNaN(budget)) {
        setTimeout(() => {
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `Please provide a valid budget amount.`
          }]);
          setLoading(false);
        }, 500);
        return;
      }
      
      setTripPlan(prev => ({ ...prev, budget: budget }));
      setPlanningState("askingPreferences");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Any specific preferences or interests for your trip? (e.g., outdoor activities, cultural attractions, food experiences, etc.)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingPreferences") {
      setTripPlan(prev => ({ ...prev, preferences: userMessage }));
      setPlanningState("generatingItinerary");
      
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: `Thank you for providing all the details! I'm now generating a custom PDF itinerary for your trip to ${tripPlan.destination}. This will take a moment...`
      }]);
      
      try {
        // Calculate trip duration in days
        const startDate = new Date(tripPlan.startDate);
        const endDate = new Date(tripPlan.endDate);
        const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        
        // Call the edge function to generate the PDF
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: tripPlan.destination,
            departureCity: tripPlan.departureCity,
            startDate: tripPlan.startDate,
            endDate: tripPlan.endDate,
            travelers: tripPlan.travelers,
            budget: tripPlan.budget,
            preferences: tripPlan.preferences,
            interests: `${tripDuration} days trip from ${tripPlan.startDate} to ${tripPlan.endDate} for ${tripPlan.travelers} travelers with budget $${tripPlan.budget}. Preferences: ${tripPlan.preferences}`
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to generate itinerary");
        }
        
        const data = await response.json();
        
        // Check if the API returned a result property containing the PDF URL
        if (data.result) {
          setPlanningState("displayingResults");
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `I've created your custom itinerary for your trip to ${tripPlan.destination}! Your browser should open it in a new tab. If it doesn't, you can access it here: ${data.result}`
          }]);
          
          // Open the PDF in a new tab
          window.open(data.result, "_blank");
          
          // Save the trip details
          try {
            // Try to find existing itineraries
            const { data: itineraries, error } = await supabase
              .from('Itinerary')
              .select('*')
              .ilike('destination', `%${tripPlan.destination}%`)
              .order('price', { ascending: true });
            
            if (error) throw error;
            
            if (itineraries && itineraries.length > 0) {
              // Save itineraries to sessionStorage for the itineraries page
              sessionStorage.setItem('searchedItineraries', JSON.stringify(itineraries));
              sessionStorage.setItem('searchDestination', tripPlan.destination);
              sessionStorage.setItem('searchDuration', tripDuration.toString());
              
              setConversation(prev => [...prev, {
                role: 'assistant', 
                content: `I've also found ${itineraries.length} pre-made itineraries for ${tripPlan.destination}. Would you like to see them?`
              }]);
            }
          } catch (error) {
            console.error("Error finding itineraries:", error);
          }
        } else {
          throw new Error("No PDF URL in the response");
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
        setPlanningState("idle");
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `I'm sorry, I had trouble generating your PDF itinerary. Please try again later.`
        }]);
      } finally {
        setLoading(false);
      }
      
      return;
    }
    
    // Handle displaying results state
    if (planningState === "displayingResults") {
      if (userMessage.toLowerCase().includes("yes") && userMessage.toLowerCase().includes("see")) {
        // Navigate to itineraries page
        navigate('/itineraries');
        setLoading(false);
        return;
      }
    }

    // Handle general messages or trigger the travel planning flow
    const lowerMessage = userMessage.toLowerCase();
    if (
      lowerMessage.includes("travel") || 
      lowerMessage.includes("trip") || 
      lowerMessage.includes("vacation") || 
      lowerMessage.includes("visit") ||
      lowerMessage.includes("itinerary") ||
      lowerMessage.includes("plan")
    ) {
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: "I'd be happy to help plan your trip! Let's collect some details to create a personalized itinerary. Where would you like to go?"
        }]);
        setPlanningState("askingDestination");
        setLoading(false);
      }, 800);
    } else {
      // General assistant response
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: "I can help you plan your perfect trip! Just ask me to plan a trip, and I'll collect all the necessary details to create a personalized PDF itinerary for you. You can also use the form for quicker input."
        }]);
        setLoading(false);
      }, 800);
    }
  };

  // Function for preset queries
  const handlePresetQuery = (query: string) => {
    setMessage(query);
    
    // Set focus on the input so the user can press Enter
    const inputElement = document.getElementById("chat-input") as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  // Function to start travel planning
  const startTravelPlanning = () => {
    setConversation(prev => [...prev, {
      role: 'assistant', 
      content: "I'd be happy to help plan your trip! Let's collect some details to create a personalized itinerary. Where would you like to go?"
    }]);
    setPlanningState("askingDestination");
  };

  // Function to generate PDF directly
  const openDetailedForm = () => {
    setShowDetailedForm(true);
  };

  // Handle form submission 
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripPlan.destination) {
      toast({
        title: "Missing information",
        description: "Please provide a destination",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingPdf(true);
    setShowDetailedForm(false);
    
    // Add messages to conversation
    setConversation(prev => [
      ...prev, 
      {
        role: 'user', 
        content: `I want to plan a trip to ${tripPlan.destination} from ${tripPlan.departureCity}.`
      },
      {
        role: 'assistant', 
        content: `Thank you for providing your trip details! I'm now generating a custom PDF itinerary for your trip to ${tripPlan.destination}. This will take a moment...`
      }
    ]);
    
    try {
      // Calculate trip duration in days
      const startDate = new Date(tripPlan.startDate);
      const endDate = new Date(tripPlan.endDate);
      const tripDuration = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
      
      // Call the edge function to generate the PDF
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: tripPlan.destination,
          departureCity: tripPlan.departureCity,
          startDate: tripPlan.startDate,
          endDate: tripPlan.endDate,
          travelers: tripPlan.travelers,
          budget: tripPlan.budget,
          preferences: tripPlan.preferences,
          interests: `${tripDuration} days trip from ${tripPlan.startDate || "flexible date"} to ${tripPlan.endDate || "flexible date"} for ${tripPlan.travelers} travelers with budget $${tripPlan.budget || "flexible"}. Preferences: ${tripPlan.preferences}`
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate itinerary");
      }
      
      const data = await response.json();
      
      // Check if the API returned a result property containing the PDF URL
      if (data.result) {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `I've created your custom itinerary for your trip to ${tripPlan.destination}! Your browser should open it in a new tab. If it doesn't, you can access it here: ${data.result}`
        }]);
        
        // Open the PDF in a new tab
        window.open(data.result, "_blank");
        
        toast({
          title: "Success",
          description: "Your custom itinerary has been generated",
        });
      } else {
        throw new Error("No PDF URL in the response");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: `I'm sorry, I had trouble generating your PDF itinerary. Please try again later.`
      }]);
      
      toast({
        title: "Error",
        description: "Failed to generate your custom itinerary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {chatOpen ? (
        <Card className="w-80 md:w-96 shadow-lg relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setChatOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardContent className="p-4 pt-8">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-ocean-500 to-teal-500 rounded-full p-2 mr-3">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Travel Assistant</h3>
                <p className="text-sm text-gray-500">I can help plan your perfect trip</p>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="border rounded-lg p-3 mb-4 bg-gray-50 max-h-64 overflow-y-auto">
              {conversation.length === 0 ? (
                <>
                  <div className="flex items-start mb-2">
                    <CloudSun className="h-4 w-4 text-ocean-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">I can help you plan a custom itinerary. Let me know your travel details!</p>
                  </div>
                  <div className="flex items-start">
                    <BellRing className="h-4 w-4 text-sunset-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">Ask me about destinations, or try the form for a detailed itinerary.</p>
                  </div>
                </>
              ) : (
                <>
                  {conversation.map((msg, index) => (
                    <div key={index} className={`flex items-start mb-2 ${msg.role === 'assistant' ? '' : 'justify-end'}`}>
                      {msg.role === 'assistant' && <Settings className="h-4 w-4 text-ocean-500 mr-2 mt-0.5 flex-shrink-0" />}
                      <p className={`text-sm p-2 rounded-lg ${
                        msg.role === 'assistant' 
                          ? 'bg-white border text-gray-700' 
                          : 'bg-ocean-500 text-white'
                      } max-w-[85%]`}>
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                id="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  planningState === "askingDestination" ? "Enter destination..." : 
                  planningState === "askingDepartureCity" ? "Enter departure city..." :
                  planningState === "askingStartDate" ? "Enter start date (YYYY-MM-DD)..." :
                  planningState === "askingEndDate" ? "Enter end date (YYYY-MM-DD)..." :
                  planningState === "askingTravelers" ? "Enter number of travelers..." :
                  planningState === "askingBudget" ? "Enter your budget..." :
                  planningState === "askingPreferences" ? "Enter your preferences..." :
                  "Ask me about your trip..."
                }
                className="flex-1"
                disabled={loading || generatingPdf || planningState === "generatingItinerary"}
              />
              <Button type="submit" size="icon" disabled={loading || generatingPdf || planningState === "generatingItinerary"}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Preset Queries */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handlePresetQuery("I want to plan a trip")}
              >
                <span>Plan a trip</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={openDetailedForm}
              >
                <span>Use detailed form</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handlePresetQuery("Recommend destinations in Europe")}
              >
                <span>Recommend destinations</span>
              </Button>
            </div>

            {/* Planning action buttons */}
            {planningState === "idle" && conversation.length === 0 && (
              <div className="mt-4 grid grid-cols-1 gap-2">
                <Button 
                  className="w-full bg-gradient-to-r from-ocean-500 to-teal-500"
                  onClick={startTravelPlanning}
                >
                  <MapPin className="h-4 w-4 mr-2" /> Start Planning Your Trip
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-sunset-500 to-sunset-600"
                  onClick={openDetailedForm}
                >
                  <FileText className="h-4 w-4 mr-2" /> Use Quick Trip Form
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              className="h-14 w-14 rounded-full bg-gradient-to-r from-ocean-500 to-teal-500 shadow-lg"
              onClick={() => setChatOpen(true)}
            >
              <Settings className="h-6 w-6 text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64 p-3">
            <div className="flex items-center">
              <p className="text-sm font-medium">Need help planning your trip?</p>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Detailed Form Dialog */}
      <Dialog open={showDetailedForm} onOpenChange={setShowDetailedForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Plan Your Perfect Trip</DialogTitle>
            <DialogDescription>
              Enter your travel details and I'll generate a custom PDF itinerary for you.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-right">
                  Destination <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="destination"
                  placeholder="Paris, Tokyo, etc."
                  value={tripPlan.destination}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, destination: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departureCity">
                  Departure City
                </Label>
                <Input
                  id="departureCity"
                  placeholder="Where are you departing from?"
                  value={tripPlan.departureCity}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, departureCity: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={tripPlan.startDate}
                    onChange={(e) => setTripPlan(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={tripPlan.endDate}
                    onChange={(e) => setTripPlan(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travelers">
                    Travelers
                  </Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    value={tripPlan.travelers}
                    onChange={(e) => setTripPlan(prev => ({ ...prev, travelers: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">
                    Budget (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={tripPlan.budget || ""}
                    onChange={(e) => setTripPlan(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferences">
                  Trip Preferences
                </Label>
                <Textarea
                  id="preferences"
                  placeholder="Activities, attractions, dining preferences, etc."
                  value={tripPlan.preferences}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, preferences: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowDetailedForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={generatingPdf}>
                {generatingPdf ? "Generating..." : "Generate Itinerary"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAssistant;
