// This file now uses Supabase for data persistence.
// The filename is a remnant of the old mock service.
// Ensure you have a Supabase project with the correct tables and RLS policies.

import { supabase } from '@/lib/supabaseClient';

// User-related types and interfaces
export interface User {
  id?: string;
  name: string;
  email: string;
  timezone: string;
  pip_focus: string[];
  created_at: string;
}

export interface JournalEntry {
  id?: string;
  user_id: string;
  entry_date: string;
  pain_level: number;
  fatigue_level: number;
  mental_health: number;
  mobility_difficulty: number;
  notes?: string;
  medications?: string[];
  appointments?: string;
  created_at?: string;
  updated_at?: string;
}

// Create a new user in Supabase
export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: userData.name,
      email: userData.email,
      timezone: userData.timezone,
      pip_focus: userData.pip_focus,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }

  return data as User;
}

// Get user by email from Supabase
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is not an error here.
    console.error('Error fetching user:', error);
    throw new Error(error.message);
  }

  return data;
}

// Create a new journal entry in Supabase
export async function createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: entryData.user_id,
      entry_date: entryData.entry_date,
      pain_level: entryData.pain_level,
      fatigue_level: entryData.fatigue_level,
      mental_health: entryData.mental_health,
      mobility_difficulty: entryData.mobility_difficulty,
      notes: entryData.notes,
      medications: entryData.medications,
      appointments: entryData.appointments,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating journal entry:', error);
    throw new Error(error.message);
  }

  return data as JournalEntry;
}

// Get journal entries for a user from Supabase
export async function getJournalEntriesByUser(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Get journal entry for a user by date from Supabase
export async function getJournalEntryByDate(userId: string, date: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('entry_date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching journal entry by date:', error);
    throw new Error(error.message);
  }

  return data;
}

// Update a journal entry in Supabase
export async function updateJournalEntry(id: string, entryData: Partial<Omit<JournalEntry, 'id' | 'created_at'>>): Promise<JournalEntry> {
  const updateFields: { [key: string]: any } = {
      updated_at: new Date().toISOString(),
  };

  // Only add fields to the update object if they are defined in entryData
  if (entryData.pain_level !== undefined) updateFields.pain_level = entryData.pain_level;
  if (entryData.fatigue_level !== undefined) updateFields.fatigue_level = entryData.fatigue_level;
  if (entryData.mental_health !== undefined) updateFields.mental_health = entryData.mental_health;
  if (entryData.mobility_difficulty !== undefined) updateFields.mobility_difficulty = entryData.mobility_difficulty;
  if (entryData.notes !== undefined) updateFields.notes = entryData.notes;
  if (entryData.medications !== undefined) updateFields.medications = entryData.medications;
  if (entryData.appointments !== undefined) updateFields.appointments = entryData.appointments;

  const { data, error } = await supabase
    .from('journal_entries')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating journal entry:', error);
    throw new Error(error.message);
  }

  return data as JournalEntry;
}
