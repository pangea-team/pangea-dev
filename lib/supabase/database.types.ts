export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      books: {
        Row: {
          book_no: number
          cover_color: string | null
          cover_image: string
          created_at: string
          id: number
          keyword: string[]
          mood: string
          price: number
          season: number
          shipping_fee: number
          title: string
          type: string
        }
        Insert: {
          book_no: number
          cover_color?: string | null
          cover_image: string
          created_at?: string
          id?: number
          keyword: string[]
          mood: string
          price: number
          season: number
          shipping_fee: number
          title?: string
          type: string
        }
        Update: {
          book_no?: number
          cover_color?: string | null
          cover_image?: string
          created_at?: string
          id?: number
          keyword?: string[]
          mood?: string
          price?: number
          season?: number
          shipping_fee?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      feeds: {
        Row: {
          answer: string
          book_id: number
          created_at: string
          id: string
          images: string[]
          question_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          book_id: number
          created_at?: string
          id?: string
          images?: string[]
          question_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          book_id?: number
          created_at?: string
          id?: string
          images?: string[]
          question_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeds_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeds_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feeds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          book_id: number
          content: string
          created_at: string
          id: number
          order_no: number
        }
        Insert: {
          book_id: number
          content: string
          created_at?: string
          id?: number
          order_no: number
        }
        Update: {
          book_id?: number
          content?: string
          created_at?: string
          id?: number
          order_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          address_detail: string
          book_id: number
          created_at: string
          delivery_message: string | null
          id: string
          item_price: number
          order_number: string
          payment_due_at: string
          postal_code: string
          recipient_name: string
          recipient_phone: string
          saved_sentence_id: string | null
          shipping_fee: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          address_detail: string
          book_id: number
          created_at?: string
          delivery_message?: string | null
          id: string
          item_price: number
          order_number: string
          payment_due_at: string
          postal_code: string
          recipient_name: string
          recipient_phone: string
          saved_sentence_id?: string | null
          shipping_fee: number
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          address_detail?: string
          book_id?: number
          created_at?: string
          delivery_message?: string | null
          id?: string
          item_price?: number
          order_number?: string
          payment_due_at?: string
          postal_code?: string
          recipient_name?: string
          recipient_phone?: string
          saved_sentence_id?: string | null
          shipping_fee?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_saved_sentence_id_fkey"
            columns: ["saved_sentence_id"]
            isOneToOne: false
            referencedRelation: "saved_sentences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_sentences: {
        Row: {
          content_index: number
          created_at: string
          id: string
          note: string
          sentence_id: number
          user_id: string
        }
        Insert: {
          content_index: number
          created_at?: string
          id: string
          note: string
          sentence_id: number
          user_id: string
        }
        Update: {
          content_index?: number
          created_at?: string
          id?: string
          note?: string
          sentence_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_sentences_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "sentences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_sentences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sentences: {
        Row: {
          book_id: number
          content: string[]
          created_at: string
          id: number
          order_no: number
          page_no: number
        }
        Insert: {
          book_id: number
          content: string[]
          created_at?: string
          id?: number
          order_no: number
          page_no: number
        }
        Update: {
          book_id?: number
          content?: string[]
          created_at?: string
          id?: number
          order_no?: number
          page_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "sentences_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          kakao_id: string
          kakao_name: string | null
          name: string
          survey_answered_at: string | null
          trace: string
          updated_at: string
          wants_to_see_others: boolean | null
        }
        Insert: {
          created_at?: string
          id: string
          kakao_id: string
          kakao_name?: string | null
          name: string
          survey_answered_at?: string | null
          trace: string
          updated_at?: string
          wants_to_see_others?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          kakao_id?: string
          kakao_name?: string | null
          name?: string
          survey_answered_at?: string | null
          trace?: string
          updated_at?: string
          wants_to_see_others?: boolean | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
