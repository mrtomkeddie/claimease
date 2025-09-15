
import type { FormValues } from './formSchema';

export const LOCAL_STORAGE_KEY = 'claim-ease-progress';

export const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Personal Details',
    fields: ['fullName'],
  },
  {
    id: 'health',
    title: 'Health Conditions',
    fields: ['mainCondition', 'otherConditions', 'medications'],
  },
  {
    id: 'daily',
    title: 'Daily Living',
    fields: [
      'preparingFood',
      'eatingAndDrinking',
      'managingTreatments',
      'washingAndBathing',
      'managingToiletNeeds',
      'dressingAndUndressing',
    ],
  },
  {
    id: 'mobility',
    title: 'Mobility',
    fields: ['planningAndFollowingJourneys', 'movingAround', 'additionalInfo'],
  },
  {
    id: 'review',
    title: 'Review & Submit',
    fields: [],
  },
] as const;

export type StepId = (typeof FORM_STEPS)[number]['id'];

export type StepField = keyof FormValues;
