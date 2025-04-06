
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Send, CloudSun, BellRing, ArrowRight, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setLoading(false);
      setMessage("");
      toast({
        title: "AI Assistant",
        description: "I've analyzed your preferences and found some great options for your trip!",
      });
    }, 1500);
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

            <div className="border rounded-lg p-3 mb-4 bg-gray-50">
              <div className="flex items-start mb-2">
                <CloudSun className="h-4 w-4 text-ocean-500 mr-2 mt-0.5" />
                <p className="text-sm text-gray-600">Weather alert for Paris: Sunny days expected during your travel dates!</p>
              </div>
              <div className="flex items-start">
                <BellRing className="h-4 w-4 text-sunset-500 mr-2 mt-0.5" />
                <p className="text-sm text-gray-600">Paris Fashion Week is happening during your stay. Would you like tickets?</p>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me about your trip..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <span>Find hotels near Eiffel Tower</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <span>Weather for my trip</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <span>Recommend restaurants</span>
              </Button>
            </div>
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
