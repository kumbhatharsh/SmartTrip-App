
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localEvents } from "@/lib/mockData";
import { Calendar, MapPin } from "lucide-react";

const LocalEvents = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Calendar className="h-5 w-5 mr-2 text-teal-600" />
          Local Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {localEvents.map((event) => (
          <div key={event.id} className="border-b last:border-0 pb-4 last:pb-0">
            <h3 className="font-bold text-base mb-1">{event.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LocalEvents;
