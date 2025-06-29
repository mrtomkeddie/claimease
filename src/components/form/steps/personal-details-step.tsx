
"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FormValues } from '@/lib/formSchema';
import { FormFieldWrapper } from '../form-field-wrapper';
import { Calendar } from 'lucide-react';

interface PersonalDetailsStepProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

export default function PersonalDetailsStep({ form }: PersonalDetailsStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-foreground">Personal Details</h2>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="fullName"
              label="Full Name"
              guidance="Please enter your full legal name as it appears on official documents."
            >
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="dateOfBirth"
              label="Date of Birth"
              guidance="Use the format YYYY-MM-DD."
            >
              <FormControl>
                <div className="relative">
                  <Input type="date" {...field} />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="address"
              label="Full Address"
              guidance="Include your house number, street, city, and postcode."
            >
              <FormControl>
                <Input placeholder="e.g., 123 Main Street, Anytown, AT1 2BC" {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nationalInsurance"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="nationalInsurance"
              label="National Insurance Number"
              guidance="You can find this on payslips or letters from HMRC."
            >
              <FormControl>
                <Input placeholder="e.g., QQ 12 34 56 C" {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
