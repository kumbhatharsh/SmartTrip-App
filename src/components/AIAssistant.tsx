import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Settings, Send, CloudSun, BellRing, ArrowRight, X, Calendar, 
  MapPin, FileText, Loader2, DollarSign, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { generateItinerary } from "@/services/itineraryService";
import { format } from "date-fns";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Trip planning states - simplified
type PlanningState = 
  | "idle" 
  | "askingDestination" 
  | "askingDepartureCity"
  | "askingDuration"
  | "askingJourneyDate"
  | "askingBudget"
  | "askingInterests"
  | "generatingItinerary"
  | "displayingResults";

// Simplified trip plan interface
interface TripPlan {
  destination: string;
  departureCity: string;
  duration: string;
  journeyDate: string;
  interests: string;
  isPersonalized: boolean;
  budget: number;
}

const defaultTripPlan: TripPlan = {
  destination: "",
  departureCity: "",
  duration: "5 days",
  journeyDate: "",
  interests: "",
  isPersonalized: true,
  budget: 500
};

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [planningState, setPlanningState] = useState<PlanningState>("idle");
  const [tripPlan, setTripPlan] = useState<TripPlan>(defaultTripPlan);
  const [generatingItinerary, setGeneratingItinerary] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [journeyDate, setJourneyDate] = useState<Date>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetTripPlanningState = () => {
    setPlanningState("idle");
    setTripPlan(defaultTripPlan);
    setJourneyDate(undefined);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setConversation(prev => [...prev, {role: 'user', content: userMessage}]);
    setMessage("");
    setLoading(true);
    
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
      setPlanningState("askingDuration");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Perfect. How long do you plan to stay? (e.g., 3 days, 1 week)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingDuration") {
      setTripPlan(prev => ({ ...prev, duration: userMessage }));
      setPlanningState("askingJourneyDate");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Great! When are you planning to travel? (e.g., June 2025, Next month, etc.)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingJourneyDate") {
      setTripPlan(prev => ({ ...prev, journeyDate: userMessage }));
      setPlanningState("askingBudget");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `What's your budget for this trip? (Enter a value of 500 or more)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingBudget") {
      let budgetValue = 500;
      try {
        const parsed = parseInt(userMessage);
        if (!isNaN(parsed) && parsed >= 500) {
          budgetValue = parsed;
        }
      } catch (error) {
        console.error("Error parsing budget:", error);
      }
      
      setTripPlan(prev => ({ ...prev, budget: budgetValue }));
      setPlanningState("askingInterests");
      
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Great! What are your interests or preferences for this trip? (e.g., museums, food, outdoor activities)`
        }]);
        setLoading(false);
      }, 500);
      return;
    }
    
    if (planningState === "askingInterests") {
      setTripPlan(prev => ({ ...prev, interests: userMessage }));
      setPlanningState("generatingItinerary");
      
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: `Thank you for providing all the details! I'm now generating a custom itinerary for your trip from ${tripPlan.departureCity} to ${tripPlan.destination} for ${tripPlan.duration}. This will take a moment...`
      }]);
      
      try {
        console.log("Generating itinerary using HuggingFace API with data:", tripPlan);
        
        const generatedItinerary = await generateItinerary({
          destination: tripPlan.destination,
          departureCity: tripPlan.departureCity,
          duration: tripPlan.duration,
          journeyDate: tripPlan.journeyDate,
          interests: tripPlan.interests,
          isPersonalized: tripPlan.isPersonalized,
          budget: tripPlan.budget
        });
        
        console.log("Generated itinerary:", generatedItinerary);
        
        setPlanningState("displayingResults");
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `I've created your custom itinerary for your trip to ${tripPlan.destination}!`
        }]);
        
        navigate("/itinerary-details", { 
          state: { itinerary: generatedItinerary }
        });
        
        toast({
          title: "Success!",
          description: "Your custom itinerary has been generated",
        });
      } catch (error) {
        console.error("Error generating itinerary:", error);
        setPlanningState("idle");
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `I'm sorry, I had trouble generating your itinerary. Please try again later. Error: ${error.message}`
        }]);
        
        toast({
          title: "Error",
          description: "Failed to generate your itinerary. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
      
      return;
    }
    
    if (planningState === "displayingResults") {
      if (userMessage.toLowerCase().includes("yes") && userMessage.toLowerCase().includes("see")) {
        navigate('/itineraries');
        setLoading(false);
        return;
      }
    }

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
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: "I can help you plan your perfect trip! Just ask me to plan a trip, and I'll collect all the necessary details to create a personalized itinerary for you. You can also use the form for quicker input."
        }]);
        setLoading(false);
      }, 800);
    }
  };

  const handlePresetQuery = (query: string) => {
    setMessage(query);
    
    const inputElement = document.getElementById("chat-input") as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  const startTravelPlanning = () => {
    setConversation(prev => [...prev, {
      role: 'assistant', 
      content: "I'd be happy to help plan your trip! Let's collect some details to create a personalized itinerary. Where would you like to go?"
    }]);
    setPlanningState("askingDestination");
  };

  const openDetailedForm = () => {
    setShowDetailedForm(true);
  };
  
  useEffect(() => {
    if (journeyDate) {
      setTripPlan(prev => ({
        ...prev,
        journeyDate: format(journeyDate, "MMMM yyyy")
      }));
    }
  }, [journeyDate]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripPlan.destination || !tripPlan.departureCity) {
      toast({
        title: "Missing information",
        description: "Please provide both destination and departure city",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingItinerary(true);
    setShowDetailedForm(false);
    
    setConversation(prev => [
      ...prev, 
      {
        role: 'user', 
        content: `I want to plan a trip from ${tripPlan.departureCity} to ${tripPlan.destination} for ${tripPlan.duration}.`
      },
      {
        role: 'assistant', 
        content: `Thank you for providing your trip details! I'm now generating a custom itinerary for your trip to ${tripPlan.destination}. This will take a moment...`
      }
    ]);
    
    try {
      console.log("Generating itinerary using HuggingFace API with form data:", tripPlan);
      
      const generatedItinerary = await generateItinerary({
        destination: tripPlan.destination,
        departureCity: tripPlan.departureCity,
        duration: tripPlan.duration,
        journeyDate: tripPlan.journeyDate,
        interests: tripPlan.interests,
        isPersonalized: tripPlan.isPersonalized,
        budget: tripPlan.budget
      });
      
      console.log("Generated itinerary:", generatedItinerary);
      
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: `I've created your custom itinerary for your trip to ${tripPlan.destination}!`
      }]);
      
      navigate("/itinerary-details", { 
        state: { itinerary: generatedItinerary }
      });
      
      toast({
        title: "Success",
        description: "Your custom itinerary has been generated",
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: `I'm sorry, I had trouble generating your itinerary. Please try again later. Error: ${error.message}`
      }]);
      
      toast({
        title: "Error",
        description: "Failed to generate your custom itinerary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingItinerary(false);
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

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                id="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  planningState === "askingDestination" ? "Enter destination..." : 
                  planningState === "askingDepartureCity" ? "Enter departure city..." :
                  planningState === "askingDuration" ? "Enter duration (e.g., 3 days, 1 week)..." :
                  planningState === "askingJourneyDate" ? "Enter travel date (e.g., June 2025)..." :
                  planningState === "askingBudget" ? "Enter budget (minimum 500)..." :
                  planningState === "askingInterests" ? "Enter your interests..." :
                  "Ask me about your trip..."
                }
                className="flex-1"
                disabled={loading || generatingItinerary || planningState === "generatingItinerary"}
              />
              <Button type="submit" size="icon" disabled={loading || generatingItinerary || planningState === "generatingItinerary"}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

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

      <Dialog open={showDetailedForm} onOpenChange={setShowDetailedForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Plan Your Perfect Trip</DialogTitle>
            <DialogDescription>
              Enter your travel details and I'll generate a custom itinerary for you.
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
                  Departure City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="departureCity"
                  placeholder="Where are you departing from?"
                  value={tripPlan.departureCity}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, departureCity: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration
                </Label>
                <Input
                  id="duration"
                  placeholder="5 days, 1 week, etc."
                  value={tripPlan.duration}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="journey-date">
                  Travel Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="journey-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !journeyDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {journeyDate ? format(journeyDate, "MMMM yyyy") : <span>Pick your travel month</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={journeyDate}
                      onSelect={setJourneyDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">
                  Budget (minimum 500)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  min={500}
                  placeholder="Enter your budget"
                  value={tripPlan.budget}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 500) {
                      setTripPlan(prev => ({ ...prev, budget: value }));
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="personalized">Personalized Itinerary</Label>
                  <Switch 
                    id="personalized"
                    checked={tripPlan.isPersonalized}
                    onCheckedChange={(checked) => setTripPlan(prev => ({ ...prev, isPersonalized: checked }))}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Create a custom itinerary based on your preferences
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests">
                  Interests
                </Label>
                <Textarea
                  id="interests"
                  placeholder="Museums, food, outdoor activities, etc."
                  value={tripPlan.interests}
                  onChange={(e) => setTripPlan(prev => ({ ...prev, interests: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowDetailedForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={generatingItinerary}>
                {generatingItinerary ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Itinerary
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAssistant;
