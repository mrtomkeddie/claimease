
import { z } from 'zod';

export const formSchema = z.object({
  // Personal Details
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  dateOfBirth: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "Please enter a valid date of birth.",
  }),
  address: z.string().min(10, "Please enter a complete address."),
  nationalInsurance: z.string()
    .regex(/^[A-CEGHJ-PR-TW-Z]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[A-D]{1}$/i, "Please enter a valid National Insurance number format (e.g., QQ 12 34 56 C).")
    .transform(value => value.toUpperCase().replace(/\s/g, '')),

  // Health Conditions
  mainCondition: z.string().min(5, "Please describe your main health condition or disability."),
  otherConditions: z.string().optional(),
  medications: z.string().min(3, "Please list your medications, or enter 'None'."),

  // Daily Living
  preparingFood: z.string().min(10, "Please describe how your condition affects preparing food."),
  eatingAndDrinking: z.string().min(10, "Please describe how your condition affects eating and drinking."),
  managingTreatments: z.string().min(10, "Please describe how your condition affects managing treatments."),
  washingAndBathing: z.string().min(10, "Please describe how your condition affects washing and bathing."),
  managingToiletNeeds: z.string().min(10, "Please describe how your condition affects managing toilet needs."),
  dressingAndUndressing: z.string().min(10, "Please describe how your condition affects dressing and undressing."),

  // Mobility
  planningAndFollowingJourneys: z.string().min(10, "Please describe how your condition affects planning and following journeys."),
  movingAround: z.string().min(10, "Please describe how your condition affects moving around."),

  // Additional Information
  additionalInfo: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
