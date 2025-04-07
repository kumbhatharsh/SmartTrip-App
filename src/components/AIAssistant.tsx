import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Send, CloudSun, BellRing, ArrowRight, X, Calendar, MapPin, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [askingDestination, setAskingDestination] = useState(false);
  const [askingDuration, setAskingDuration] = useState(false);
  const [travelDestination, setTravelDestination] = useState("");
  const [travelDuration, setTravelDuration] = useState(0);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetTravelQuery = () => {
    setAskingDestination(false);
    setAskingDuration(false);
    setTravelDestination("");
    setTravelDuration(0);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = message;
    setConversation(prev => [...prev, {role: 'user', content: userMessage}]);
    setMessage("");
    setLoading(true);
    
    // Handle destination query
    if (askingDestination) {
      setTravelDestination(userMessage);
      setAskingDestination(false);
      setAskingDuration(true);
      
      // Bot response
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `Great! You want to visit ${userMessage}. How many days are you planning to travel?`
        }]);
        setLoading(false);
      }, 500);
      return;
    }

    // Handle duration query
    if (askingDuration) {
      const days = parseInt(userMessage);
      if (isNaN(days)) {
        setTimeout(() => {
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `I need a number for your travel duration. How many days are you planning to stay?`
          }]);
          setLoading(false);
        }, 500);
        return;
      }
      
      setTravelDuration(days);
      setAskingDuration(false);
      
      // Try to find itineraries
      try {
        const { data: itineraries, error } = await supabase
          .from('Itinerary')
          .select('*')
          .ilike('destination', `%${travelDestination}%`)
          .order('price', { ascending: true });
        
        if (error) throw error;
        
        if (itineraries && itineraries.length > 0) {
          // Save itineraries to sessionStorage for the itineraries page
          sessionStorage.setItem('searchedItineraries', JSON.stringify(itineraries));
          sessionStorage.setItem('searchDestination', travelDestination);
          sessionStorage.setItem('searchDuration', days.toString());
          
          // Ask if the user wants to generate a PDF
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `I found ${itineraries.length} itineraries for ${travelDestination}. Opening them for you now. Would you also like me to generate a custom PDF itinerary for your ${days}-day trip to ${travelDestination}?`
          }]);
          
          // Navigate to itineraries page
          setTimeout(() => {
            navigate('/itineraries');
            setLoading(false);
          }, 1000);
        } else {
          // No itineraries found
          setConversation(prev => [...prev, {
            role: 'assistant', 
            content: `I couldn't find any pre-made itineraries for ${travelDestination}. Would you like me to generate a custom PDF itinerary for your ${days}-day trip to ${travelDestination}?`
          }]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `I'm sorry, I had trouble finding itineraries. Could you try again later?`
        }]);
        resetTravelQuery();
        setLoading(false);
      }
      
      return;
    }

    // Handle PDF generation request
    if (userMessage.toLowerCase().includes("yes") && 
        travelDestination && 
        travelDuration > 0 &&
        conversation.length > 0 && 
        conversation[conversation.length-1].content.includes("generate a custom PDF")) {
      
      setGeneratingPdf(true);
      setConversation(prev => [...prev, {
        role: 'assistant', 
        content: `Great! I'm generating a custom PDF itinerary for your ${travelDuration}-day trip to ${travelDestination}. This will take a moment...`
      }]);
      
      try {
        // Call the edge function to generate the PDF
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: travelDestination,
            interests: `${travelDuration} days trip`,
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
            content: `I've created your custom itinerary! Your browser should open it in a new tab. If it doesn't, you can access it here: ${data.result}`
          }]);
          
          // Open the PDF in a new tab
          window.open(data.result, "_blank");
        } else {
          throw new Error("No PDF URL in the response");
        }
        
        resetTravelQuery();
      } catch (error) {
        console.error("Error generating PDF:", error);
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: `I'm sorry, I had trouble generating your PDF itinerary. You can try again from the itineraries page.`
        }]);
        resetTravelQuery();
      } finally {
        setGeneratingPdf(false);
        setLoading(false);
      }
      
      return;
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
          content: "I'd be happy to help plan your trip! Which destination are you interested in visiting?"
        }]);
        setAskingDestination(true);
        setLoading(false);
      }, 800);
    } else {
      // General assistant response
      setTimeout(() => {
        setConversation(prev => [...prev, {
          role: 'assistant', 
          content: "I can help you plan your perfect trip! Ask me about destinations, travel plans, or specific itineraries. I can even generate a custom PDF itinerary for you."
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
      content: "I'd be happy to help plan your trip! Which destination are you interested in visiting?"
    }]);
    setAskingDestination(true);
  };

  // Function to generate PDF directly
  const startPdfGeneration = () => {
    setConversation(prev => [...prev, {
      role: 'assistant', 
      content: "I can create a custom PDF itinerary for you. Which destination are you interested in visiting?"
    }]);
    setAskingDestination(true);
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
                    <p className="text-sm text-gray-600">Weather alert for Paris: Sunny days expected during your travel dates!</p>
                  </div>
                  <div className="flex items-start">
                    <BellRing className="h-4 w-4 text-sunset-500 mr-2 mt-0.5" />
                    <p className="text-sm text-gray-600">Paris Fashion Week is happening during your stay. Would you like tickets?</p>
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
                placeholder={askingDestination 
                  ? "Enter destination..." 
                  : askingDuration 
                    ? "Enter number of days..." 
                    : "Ask me about your trip..."}
                className="flex-1"
                disabled={loading || generatingPdf}
              />
              <Button type="submit" size="icon" disabled={loading || generatingPdf}>
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
                onClick={() => handlePresetQuery("Generate a PDF itinerary")}
              >
                <span>Generate PDF</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handlePresetQuery("Recommend restaurants in Paris")}
              >
                <span>Recommend restaurants</span>
              </Button>
            </div>

            {/* Planning action buttons */}
            {!askingDestination && !askingDuration && conversation.length === 0 && (
              <div className="mt-4 grid grid-cols-1 gap-2">
                <Button 
                  className="w-full bg-gradient-to-r from-ocean-500 to-teal-500"
                  onClick={startTravelPlanning}
                >
                  <MapPin className="h-4 w-4 mr-2" /> Start Planning Your Trip
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-sunset-500 to-sunset-600"
                  onClick={startPdfGeneration}
                >
                  <FileText className="h-4 w-4 mr-2" /> Generate PDF Itinerary
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
    </div>
  );
};

export default AIAssistant;
