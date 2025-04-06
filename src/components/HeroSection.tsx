
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Plane, Hotel, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const [date, setDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  );
  
  // Add state for itinerary dates
  const [itineraryStartDate, setItineraryStartDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [itineraryEndDate, setItineraryEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1920&h=1080')",
          filter: "brightness(0.65)"
        }}
      />
      
      <div className="relative z-10 px-4 py-16 md:py-28 container mx-auto text-white">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Discover Your Perfect <span className="text-sunset-400">Journey</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Book hotels, flights, and AI-powered itineraries for your dream vacation
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-card rounded-xl p-4 md:p-6">
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="flights" className="py-3 text-base">
                <Plane className="mr-2 h-5 w-5" />
                Flights
              </TabsTrigger>
              <TabsTrigger value="hotels" className="py-3 text-base">
                <Hotel className="mr-2 h-5 w-5" />
                Hotels
              </TabsTrigger>
              <TabsTrigger value="itineraries" className="py-3 text-base">
                <MapPin className="mr-2 h-5 w-5" />
                Itineraries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flights" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <Input 
                    placeholder="Departure City" 
                    className="bg-white/80 backdrop-blur-sm border-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <Input 
                    placeholder="Destination City" 
                    className="bg-white/80 backdrop-blur-sm border-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Departure</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-0 w-full",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Return</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-0 w-full",
                          !returnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full mt-6 bg-sunset-500 hover:bg-sunset-600 text-lg py-6">
                <Search className="mr-2 h-5 w-5" /> Search Flights
              </Button>
            </TabsContent>

            <TabsContent value="hotels" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input 
                    placeholder="Where are you going?" 
                    className="bg-white/80 backdrop-blur-sm border-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-0 w-full",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-0 w-full",
                          !returnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="w-full mt-6 bg-sunset-500 hover:bg-sunset-600 text-lg py-6">
                <Search className="mr-2 h-5 w-5" /> Search Hotels
              </Button>
            </TabsContent>

            <TabsContent value="itineraries" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input 
                    placeholder="Where do you want to go?" 
                    className="bg-white/80 backdrop-blur-sm border-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Duration</label>
                  <Input 
                    placeholder="How many days?" 
                    type="number" 
                    min="1" 
                    className="bg-white/80 backdrop-blur-sm border-0" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-0 w-full",
                          !itineraryStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {itineraryStartDate ? format(itineraryStartDate, "PPP") : <span>Pick a start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={itineraryStartDate}
                        onSelect={setItineraryStartDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-0 w-full",
                          !itineraryEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {itineraryEndDate ? format(itineraryEndDate, "PPP") : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={itineraryEndDate}
                        onSelect={setItineraryEndDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-sunset-500 hover:bg-sunset-600 text-lg py-6">
                <Search className="mr-2 h-5 w-5" /> Find Itineraries
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
