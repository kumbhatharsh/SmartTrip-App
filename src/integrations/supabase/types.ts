export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Booking: {
        Row: {
          createdAt: string
          endDate: string
          flightId: string | null
          hotelId: string | null
          id: string
          startDate: string
          status: string
          totalPrice: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          endDate: string
          flightId?: string | null
          hotelId?: string | null
          id: string
          startDate: string
          status: string
          totalPrice: number
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          endDate?: string
          flightId?: string | null
          hotelId?: string | null
          id?: string
          startDate?: string
          status?: string
          totalPrice?: number
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Booking_flightId_fkey"
            columns: ["flightId"]
            isOneToOne: false
            referencedRelation: "Flight"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_hotelId_fkey"
            columns: ["hotelId"]
            isOneToOne: false
            referencedRelation: "Hotel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Flight: {
        Row: {
          airline: string
          arrival: string
          arrivalTime: string
          availableSeats: number
          createdAt: string
          departure: string
          departureTime: string
          flightNumber: string
          id: string
          price: number
          updatedAt: string
        }
        Insert: {
          airline: string
          arrival: string
          arrivalTime: string
          availableSeats: number
          createdAt?: string
          departure: string
          departureTime: string
          flightNumber: string
          id: string
          price: number
          updatedAt: string
        }
        Update: {
          airline?: string
          arrival?: string
          arrivalTime?: string
          availableSeats?: number
          createdAt?: string
          departure?: string
          departureTime?: string
          flightNumber?: string
          id?: string
          price?: number
          updatedAt?: string
        }
        Relationships: []
      }
      Hotel: {
        Row: {
          amenities: string[] | null
          availableRooms: number
          createdAt: string
          description: string
          id: string
          location: string
          name: string
          price: number
          rating: number
          updatedAt: string
        }
        Insert: {
          amenities?: string[] | null
          availableRooms: number
          createdAt?: string
          description: string
          id: string
          location: string
          name: string
          price: number
          rating: number
          updatedAt: string
        }
        Update: {
          amenities?: string[] | null
          availableRooms?: number
          createdAt?: string
          description?: string
          id?: string
          location?: string
          name?: string
          price?: number
          rating?: number
          updatedAt?: string
        }
        Relationships: []
      }
      Itinerary: {
        Row: {
          activities: string[] | null
          createdAt: string
          description: string
          destination: string
          duration: number
          id: string
          price: number
          title: string
          updatedAt: string
        }
        Insert: {
          activities?: string[] | null
          createdAt?: string
          description: string
          destination: string
          duration: number
          id: string
          price: number
          title: string
          updatedAt: string
        }
        Update: {
          activities?: string[] | null
          createdAt?: string
          description?: string
          destination?: string
          duration?: number
          id?: string
          price?: number
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Trip: {
        Row: {
          createdAt: string
          endDate: string
          id: string
          itineraryId: string
          startDate: string
          status: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          endDate: string
          id: string
          itineraryId: string
          startDate: string
          status: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          endDate?: string
          id?: string
          itineraryId?: string
          startDate?: string
          status?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Trip_itineraryId_fkey"
            columns: ["itineraryId"]
            isOneToOne: false
            referencedRelation: "Itinerary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Trip_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          firstName: string
          id: string
          lastName: string
          password: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          firstName: string
          id: string
          lastName: string
          password: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          firstName?: string
          id?: string
          lastName?: string
          password?: string
          updatedAt?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
