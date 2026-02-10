import { z } from "zod";

// === Auth Schemas ===
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// === Address Schema ===
export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "County/State is required"),
  pinCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

// === Contact Schema ===
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// === Newsletter Schema ===
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// === Review Schema ===
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .optional(),
});

// === Promo Code Schema ===
export const promoCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Please enter a promo code")
    .transform((val) => val.toUpperCase().trim()),
});

// Type exports derived from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type PromoCodeFormData = z.infer<typeof promoCodeSchema>;
