import { z } from 'zod';

export const tripFormSchema = z
  .object({
    destination: z
      .string()
      .min(2, 'Destination must be at least 2 characters')
      .max(100, 'Destination is too long'),

    startDate: z.string().min(1, 'Start date is required'),

    endDate: z.string().min(1, 'End date is required'),

    budget: z.coerce
      .number()
      .positive('Budget must be greater than 0')
      .max(1_000_000, 'Budget seems unrealistic'),

    currency: z.string().min(1, 'Currency is required'),

    travelers: z.coerce
      .number()
      .int('Must be a whole number')
      .min(1, 'At least 1 traveler')
      .max(50, 'Maximum 50 travelers'),

    travelStyle: z.enum(['budget', 'standard', 'luxury'], {
      message: 'Select a travel style',
    }),

    interests: z
      .array(z.string())
      .min(1, 'Select at least 1 interest'),

    accommodation: z.string().min(1, 'Select accommodation preference'),

    transportation: z.string().min(1, 'Select transportation preference'),

    notes: z.string().max(1000, 'Notes must be under 1000 characters').optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export type TripFormValues = z.infer<typeof tripFormSchema>;

// ── Option constants ──

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'AED', label: 'AED — UAE Dirham' },
];

export const TRAVEL_STYLE_OPTIONS = [
  {
    value: 'budget',
    label: 'Budget',
    description: 'Hostels, street food, public transit',
    emoji: '🎒',
  },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Hotels, restaurants, mixed transport',
    emoji: '🏨',
  },
  {
    value: 'luxury',
    label: 'Luxury',
    description: 'Premium stays, fine dining, private cars',
    emoji: '👑',
  },
];

export const INTEREST_OPTIONS = [
  { value: 'adventure', label: 'Adventure', emoji: '🧗' },
  { value: 'beach', label: 'Beach', emoji: '🏖️' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'history', label: 'History', emoji: '🏛️' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { value: 'hiking', label: 'Hiking', emoji: '🥾' },
];

export const ACCOMMODATION_OPTIONS = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'resort', label: 'Resort' },
  { value: 'airbnb', label: 'Airbnb / Vacation Rental' },
  { value: 'villa', label: 'Villa' },
  { value: 'camping', label: 'Camping' },
  { value: 'no_preference', label: 'No Preference' },
];

export const TRANSPORTATION_OPTIONS = [
  { value: 'flight', label: 'Flight' },
  { value: 'train', label: 'Train' },
  { value: 'bus', label: 'Bus' },
  { value: 'car_rental', label: 'Car Rental' },
  { value: 'rideshare', label: 'Rideshare' },
  { value: 'public_transit', label: 'Public Transit' },
  { value: 'no_preference', label: 'No Preference' },
];
