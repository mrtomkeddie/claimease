import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function calculatePipEntitlement(dailyLivingScore: number, mobilityScore: number) {
  const dailyLivingRate = dailyLivingScore >= 8 ? (dailyLivingScore >= 12 ? 'Enhanced' : 'Standard') : 'None'
  const mobilityRate = mobilityScore >= 8 ? (mobilityScore >= 12 ? 'Enhanced' : 'Standard') : 'None'
  
  return {
    dailyLivingRate,
    mobilityRate,
    dailyLivingAmount: dailyLivingRate === 'Enhanced' ? 101.75 : dailyLivingRate === 'Standard' ? 68.10 : 0,
    mobilityAmount: mobilityRate === 'Enhanced' ? 71.00 : mobilityRate === 'Standard' ? 26.90 : 0,
  }
}