import { z } from "zod";

export const printingOrderSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  item_ids: z.array(z.string()).min(1, "Please select at least one item"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  is_emergency: z.boolean(),
  budget: z
    .union([z.coerce.number().positive(), z.null(), z.literal("")])
    .optional(),
  required_by: z.string().optional(),
  notes: z.string().optional(),
});

export const printingCheckoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_phone: z.string().min(11, "Phone number is required"),
  customer_email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  shipping_address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  notes: z.string().optional(),
  payment_method: z.string().min(1, "Select a payment method"),
});
