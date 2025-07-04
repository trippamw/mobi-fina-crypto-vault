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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cards: {
        Row: {
          card_type: Database["public"]["Enums"]["card_type"]
          cardholder_name: string
          created_at: string | null
          expiry_month: number
          expiry_year: number
          id: string
          masked_number: string
          spending_limit: number | null
          status: Database["public"]["Enums"]["card_status"] | null
          updated_at: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          card_type: Database["public"]["Enums"]["card_type"]
          cardholder_name: string
          created_at?: string | null
          expiry_month: number
          expiry_year: number
          id?: string
          masked_number: string
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          card_type?: Database["public"]["Enums"]["card_type"]
          cardholder_name?: string
          created_at?: string | null
          expiry_month?: number
          expiry_year?: number
          id?: string
          masked_number?: string
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          expires_at: string | null
          id: string
          invitation_type: Database["public"]["Enums"]["invitation_type"]
          invited_at: string | null
          invitee_email: string
          invitee_phone: string | null
          inviter_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["invitation_status"] | null
          village_bank_id: string | null
        }
        Insert: {
          expires_at?: string | null
          id?: string
          invitation_type: Database["public"]["Enums"]["invitation_type"]
          invited_at?: string | null
          invitee_email: string
          invitee_phone?: string | null
          inviter_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          village_bank_id?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          invitation_type?: Database["public"]["Enums"]["invitation_type"]
          invited_at?: string | null
          invitee_email?: string
          invitee_phone?: string | null
          inviter_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          village_bank_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_village_bank_id_fkey"
            columns: ["village_bank_id"]
            isOneToOne: false
            referencedRelation: "village_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string
          id: string
          kyc_documents_uploaded: boolean | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          phone_number: string | null
          selfie_uploaded: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name: string
          id: string
          kyc_documents_uploaded?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone_number?: string | null
          selfie_uploaded?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string
          id?: string
          kyc_documents_uploaded?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone_number?: string | null
          selfie_uploaded?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string | null
          currency_code: string
          current_amount: number | null
          description: string | null
          id: string
          is_active: boolean | null
          target_amount: number
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency_code: string
          current_amount?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_amount: number
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency_code?: string
          current_amount?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_amount?: number
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency_code: string
          description: string | null
          exchange_rate: number | null
          fee: number | null
          from_wallet_id: string | null
          id: string
          metadata: Json | null
          recipient_user_id: string | null
          reference_number: string
          status: Database["public"]["Enums"]["transaction_status"] | null
          to_wallet_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency_code: string
          description?: string | null
          exchange_rate?: number | null
          fee?: number | null
          from_wallet_id?: string | null
          id?: string
          metadata?: Json | null
          recipient_user_id?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_wallet_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency_code?: string
          description?: string | null
          exchange_rate?: number | null
          fee?: number | null
          from_wallet_id?: string | null
          id?: string
          metadata?: Json | null
          recipient_user_id?: string | null
          reference_number?: string
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_wallet_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_from_wallet_id_fkey"
            columns: ["from_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_wallet_id_fkey"
            columns: ["to_wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_security: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          id: string
          is_2fa_enabled: boolean | null
          totp_secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_2fa_enabled?: boolean | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          id?: string
          is_2fa_enabled?: boolean | null
          totp_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      village_bank_contributions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          transaction_id: string | null
          user_id: string
          village_bank_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          transaction_id?: string | null
          user_id: string
          village_bank_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          transaction_id?: string | null
          user_id?: string
          village_bank_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "village_bank_contributions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "village_bank_contributions_village_bank_id_fkey"
            columns: ["village_bank_id"]
            isOneToOne: false
            referencedRelation: "village_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      village_bank_members: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string | null
          total_contributed: number | null
          user_id: string
          village_bank_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          total_contributed?: number | null
          user_id: string
          village_bank_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          total_contributed?: number | null
          user_id?: string
          village_bank_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "village_bank_members_village_bank_id_fkey"
            columns: ["village_bank_id"]
            isOneToOne: false
            referencedRelation: "village_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      village_banks: {
        Row: {
          contribution_amount: number | null
          contribution_frequency: string | null
          created_at: string | null
          creator_id: string
          currency_code: string
          current_amount: number | null
          current_members: number | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_members: number | null
          name: string
          start_date: string | null
          target_amount: number | null
          updated_at: string | null
        }
        Insert: {
          contribution_amount?: number | null
          contribution_frequency?: string | null
          created_at?: string | null
          creator_id: string
          currency_code: string
          current_amount?: number | null
          current_members?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          name: string
          start_date?: string | null
          target_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          contribution_amount?: number | null
          contribution_frequency?: string | null
          created_at?: string | null
          creator_id?: string
          currency_code?: string
          current_amount?: number | null
          current_members?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          name?: string
          start_date?: string | null
          target_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          currency_code: string
          id: string
          is_primary: boolean | null
          updated_at: string | null
          user_id: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency_code: string
          id?: string
          is_primary?: boolean | null
          updated_at?: string | null
          user_id: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency_code?: string
          id?: string
          is_primary?: boolean | null
          updated_at?: string | null
          user_id?: string
          wallet_type?: Database["public"]["Enums"]["wallet_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      card_status: "active" | "inactive" | "blocked" | "expired"
      card_type: "virtual" | "physical"
      invitation_status: "pending" | "accepted" | "declined" | "expired"
      invitation_type: "app" | "village_bank"
      kyc_status: "pending" | "approved" | "rejected"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "send"
        | "receive"
        | "deposit"
        | "withdraw"
        | "exchange"
        | "goal_contribution"
        | "village_bank_contribution"
      wallet_type: "fiat" | "crypto"
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
    Enums: {
      app_role: ["admin", "user"],
      card_status: ["active", "inactive", "blocked", "expired"],
      card_type: ["virtual", "physical"],
      invitation_status: ["pending", "accepted", "declined", "expired"],
      invitation_type: ["app", "village_bank"],
      kyc_status: ["pending", "approved", "rejected"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "send",
        "receive",
        "deposit",
        "withdraw",
        "exchange",
        "goal_contribution",
        "village_bank_contribution",
      ],
      wallet_type: ["fiat", "crypto"],
    },
  },
} as const
