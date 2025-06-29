// Mock Airtable API Service for ClaimEase (Development/Demo Version)
// This simulates Airtable's API using localStorage for testing without real credentials

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

export interface ClaimSummary {
  id?: string;
  user_id: string;
  generated_summary: string;
  exported_pdf_url?: string;
  export_date: string;
}

// Mock data storage using localStorage
class MockAirtableStorage {
  private generateId(): string {
    return 'rec' + Math.random().toString(36).substr(2, 14);
  }

  private getStorageKey(table: string): string {
    return `claimease_${table.toLowerCase()}`;
  }

  private getRecords(table: string): any[] {
    const key = this.getStorageKey(table);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private saveRecords(table: string, records: any[]): void {
    const key = this.getStorageKey(table);
    localStorage.setItem(key, JSON.stringify(records));
  }

  create(table: string, fields: any): any {
    const records = this.getRecords(table);
    const newRecord = {
      id: this.generateId(),
      fields: { ...fields },
      createdTime: new Date().toISOString()
    };
    records.push(newRecord);
    this.saveRecords(table, records);
    return newRecord;
  }

  findByFilter(table: string, filterFunction: (record: any) => boolean): any[] {
    const records = this.getRecords(table);
    return records.filter(filterFunction);
  }

  update(table: string, id: string, fields: any): any {
    const records = this.getRecords(table);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Record not found');
    }
    
    records[index].fields = { ...records[index].fields, ...fields };
    this.saveRecords(table, records);
    return records[index];
  }

  delete(table: string, id: string): boolean {
    const records = this.getRecords(table);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }
    
    records.splice(index, 1);
    this.saveRecords(table, records);
    return true;
  }
}

const mockStorage = new MockAirtableStorage();

// Create a new user in mock storage
export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUsers = mockStorage.findByFilter('Users', 
      (record: any) => record.fields.email === userData.email
    );

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    const record = mockStorage.create('Users', {
      name: userData.name,
      email: userData.email,
      timezone: userData.timezone,
      pip_focus: userData.pip_focus.join(', '),
      created_at: new Date().toISOString()
    });

    return {
      id: record.id,
      name: record.fields.name,
      email: record.fields.email,
      timezone: record.fields.timezone,
      pip_focus: record.fields.pip_focus ? record.fields.pip_focus.split(', ').filter((c: string) => c.trim()) : [],
      created_at: record.fields.created_at,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = mockStorage.findByFilter('Users', 
      (record: any) => record.fields.email === email
    );

    if (users.length === 0) {
      return null;
    }

    const record = users[0];
    return {
      id: record.id,
      name: record.fields.name,
      email: record.fields.email,
      timezone: record.fields.timezone,
      pip_focus: record.fields.pip_focus ? record.fields.pip_focus.split(', ').filter((c: string) => c.trim()) : [],
      created_at: record.fields.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Create a new journal entry
export async function createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntry> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check if entry already exists for this date and user
    const existingEntries = mockStorage.findByFilter('JournalEntries',
      (record: any) => record.fields.user_id === entryData.user_id && record.fields.entry_date === entryData.entry_date
    );

    if (existingEntries.length > 0) {
      throw new Error('An entry already exists for this date');
    }

    const now = new Date().toISOString();
    const record = mockStorage.create('JournalEntries', {
      user_id: entryData.user_id,
      entry_date: entryData.entry_date,
      pain_level: entryData.pain_level,
      fatigue_level: entryData.fatigue_level,
      mental_health: entryData.mental_health,
      mobility_difficulty: entryData.mobility_difficulty,
      notes: entryData.notes || '',
      medications: entryData.medications ? entryData.medications.join(', ') : '',
      appointments: entryData.appointments || '',
      created_at: now,
      updated_at: now,
    });

    return {
      id: record.id,
      user_id: record.fields.user_id,
      entry_date: record.fields.entry_date,
      pain_level: record.fields.pain_level,
      fatigue_level: record.fields.fatigue_level,
      mental_health: record.fields.mental_health,
      mobility_difficulty: record.fields.mobility_difficulty,
      notes: record.fields.notes,
      medications: record.fields.medications ? record.fields.medications.split(', ').filter((m: string) => m.trim()) : [],
      appointments: record.fields.appointments,
      created_at: record.fields.created_at,
      updated_at: record.fields.updated_at,
    };
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
}

// Get journal entries for a user
export async function getJournalEntriesByUser(userId: string): Promise<JournalEntry[]> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const entries = mockStorage.findByFilter('JournalEntries',
      (record: any) => record.fields.user_id === userId
    );

    // Sort by entry_date descending
    entries.sort((a, b) => new Date(b.fields.entry_date).getTime() - new Date(a.fields.entry_date).getTime());

    return entries.map((record: any) => ({
      id: record.id,
      user_id: record.fields.user_id,
      entry_date: record.fields.entry_date,
      pain_level: record.fields.pain_level,
      fatigue_level: record.fields.fatigue_level,
      mental_health: record.fields.mental_health,
      mobility_difficulty: record.fields.mobility_difficulty,
      notes: record.fields.notes,
      medications: record.fields.medications ? record.fields.medications.split(', ').filter((m: string) => m.trim()) : [],
      appointments: record.fields.appointments,
      created_at: record.fields.created_at,
      updated_at: record.fields.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
}

// Check if journal entry exists for user and date
export async function getJournalEntryByDate(userId: string, date: string): Promise<JournalEntry | null> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const entries = mockStorage.findByFilter('JournalEntries',
      (record: any) => record.fields.user_id === userId && record.fields.entry_date === date
    );

    if (entries.length === 0) {
      return null;
    }

    const record = entries[0];
    return {
      id: record.id,
      user_id: record.fields.user_id,
      entry_date: record.fields.entry_date,
      pain_level: record.fields.pain_level,
      fatigue_level: record.fields.fatigue_level,
      mental_health: record.fields.mental_health,
      mobility_difficulty: record.fields.mobility_difficulty,
      notes: record.fields.notes,
      medications: record.fields.medications ? record.fields.medications.split(', ').filter((m: string) => m.trim()) : [],
      appointments: record.fields.appointments,
      created_at: record.fields.created_at,
      updated_at: record.fields.updated_at,
    };
  } catch (error) {
    console.error('Error fetching journal entry by date:', error);
    throw error;
  }
}

// Update a journal entry
export async function updateJournalEntry(id: string, entryData: Partial<Omit<JournalEntry, 'id' | 'created_at'>>): Promise<JournalEntry> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const updateFields: any = {
      updated_at: new Date().toISOString()
    };

    if (entryData.pain_level !== undefined) updateFields.pain_level = entryData.pain_level;
    if (entryData.fatigue_level !== undefined) updateFields.fatigue_level = entryData.fatigue_level;
    if (entryData.mental_health !== undefined) updateFields.mental_health = entryData.mental_health;
    if (entryData.mobility_difficulty !== undefined) updateFields.mobility_difficulty = entryData.mobility_difficulty;
    if (entryData.notes !== undefined) updateFields.notes = entryData.notes;
    if (entryData.medications !== undefined) updateFields.medications = entryData.medications.join(', ');
    if (entryData.appointments !== undefined) updateFields.appointments = entryData.appointments;

    const record = mockStorage.update('JournalEntries', id, updateFields);

    return {
      id: record.id,
      user_id: record.fields.user_id,
      entry_date: record.fields.entry_date,
      pain_level: record.fields.pain_level,
      fatigue_level: record.fields.fatigue_level,
      mental_health: record.fields.mental_health,
      mobility_difficulty: record.fields.mobility_difficulty,
      notes: record.fields.notes,
      medications: record.fields.medications ? record.fields.medications.split(', ').filter((m: string) => m.trim()) : [],
      appointments: record.fields.appointments,
      created_at: record.fields.created_at,
      updated_at: record.fields.updated_at,
    };
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }
}

// Create a claim summary
export async function createClaimSummary(summaryData: Omit<ClaimSummary, 'id'>): Promise<ClaimSummary> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const record = mockStorage.create('ClaimSummaries', {
      user_id: summaryData.user_id,
      generated_summary: summaryData.generated_summary,
      exported_pdf_url: summaryData.exported_pdf_url || '',
      export_date: summaryData.export_date,
    });

    return {
      id: record.id,
      user_id: record.fields.user_id,
      generated_summary: record.fields.generated_summary,
      exported_pdf_url: record.fields.exported_pdf_url,
      export_date: record.fields.export_date,
    };
  } catch (error) {
    console.error('Error creating claim summary:', error);
    throw error;
  }
}

// Get claim summaries for a user
export async function getClaimSummariesByUser(userId: string): Promise<ClaimSummary[]> {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const summaries = mockStorage.findByFilter('ClaimSummaries',
      (record: any) => record.fields.user_id === userId
    );

    // Sort by export_date descending
    summaries.sort((a, b) => new Date(b.fields.export_date).getTime() - new Date(a.fields.export_date).getTime());

    return summaries.map((record: any) => ({
      id: record.id,
      user_id: record.fields.user_id,
      generated_summary: record.fields.generated_summary,
      exported_pdf_url: record.fields.exported_pdf_url,
      export_date: record.fields.export_date,
    }));
  } catch (error) {
    console.error('Error fetching claim summaries:', error);
    throw error;
  }
}

// Utility function to clear all demo data (useful for testing)
export function clearAllDemoData(): void {
  localStorage.removeItem('claimease_users');
  localStorage.removeItem('claimease_journalentries');
  localStorage.removeItem('claimease_claimsummaries');
  console.log('All demo data cleared');
}

// Initialize with some demo data if storage is empty
export function initializeDemoData(): void {
  const users = mockStorage.getRecords('Users');
  if (users.length === 0) {
    console.log('ClaimEase initialized with mock data storage (localStorage)');
    console.log('This simulates Airtable API for demo purposes');
  }
}

// Call initialization
initializeDemoData();