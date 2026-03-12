export interface PrintingItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PrintingCategory {
  id: string;
  label: string;
  icon: string;
  items: PrintingItem[];
}

export interface PrintingEstimatePayload {
  category: string;
  item_ids: string[];
  quantity: number;
  is_emergency: boolean;
}

export interface PrintingEstimateResponse {
  estimatedTotal: number;
  currency: string;
  minimumLeadDays: number;
  maximumLeadDays: number;
}

export interface AddPrintingCartItemPayload {
  category: string;
  item_ids: string[];
  quantity: number;
  is_emergency: boolean;
  budget?: number | null;
  required_by?: string | null;
  notes?: string;
  primary_file?: File | null;
  secondary_file?: File | null;
}

export interface PrintingCartItem {
  id: number;
  item_id: string;
  item_name: string;
  item_icon: string;
  item_description: string;
  category_id: string;
  category_label: string;
  quantity: number;
  unit_price: string;
  is_emergency: boolean;
  budget: string | null;
  required_by: string | null;
  notes: string;
  primary_file_url?: string | null;
  secondary_file_url?: string | null;
  line_total: number;
  added_at: string;
}

export interface PrintingCartResponse {
  total_items: number;
  total_quantity: number;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  currency: string;
  items: PrintingCartItem[];
}

export interface UpdatePrintingCartItemPayload {
  quantity?: number;
  is_emergency?: boolean;
  budget?: number | null;
  required_by?: string | null;
  notes?: string;
  primary_file?: File | null;
  secondary_file?: File | null;
  clear_primary_file?: boolean;
  clear_secondary_file?: boolean;
}

export interface PrintingCheckoutPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  city: string;
  district: string;
  postal_code: string;
  notes?: string;
  payment_method: string;
}

export interface PrintingOrderItem {
  id: number;
  category_id_snapshot: string;
  category_label: string;
  item_id_snapshot: string;
  item_name: string;
  item_icon: string;
  quantity: number;
  unit_price: string;
  is_emergency: boolean;
  emergency_fee: string;
  line_total: string;
  notes: string;
  primary_file_url?: string | null;
  secondary_file_url?: string | null;
}

export interface PrintingCheckoutResponse {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  district: string;
  postal_code: string;
  notes: string;
  payment_method: string;
  status: string;
  subtotal: string;
  delivery_charge: string;
  total_amount: string;
  submitted_at: string;
  order_items: PrintingOrderItem[];
}
