import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { createJournalEntry, getJournalEntriesByUser, JournalEntry } from '../services/airtable';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner@2.0.3';
import { 
  Calendar, 
  Plus, 
  Save, 
  Activity, 
  Brain, 
  Zap, 
  Users, 
  Pill, 
  Stethoscope,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function DailyJournal() {
  const { user } = useUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [currentEntry, setCurrentEntry] = useState({
    pain: [3],
    fatigue: [3],
    mentalHealth: [3],
    mobility: [3],
    medications: '',
    appointments: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      if (!user) return;
      const userEntries = await getJournalEntriesByUser(user.id!);
      setEntries(userEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const entry = await createJournalEntry({
        user_id: user.id!,
        entry_date: new Date().toISOString().split('T')[0],
        pain_level: currentEntry.pain[0],
        fatigue_level: currentEntry.fatigue[0],
        mental_health: currentEntry.mentalHealth[0],
        mobility_difficulty: currentEntry.mobility[0],
        medications: currentEntry.medications ? [currentEntry.medications] : [],
        appointments: currentEntry.appointments,
        notes: currentEntry.notes
      });

      setEntries(prev => [entry, ...prev]);
      
      // Reset form
      setCurrentEntry({
        pain: [3],
        fatigue: [3],
        mentalHealth: [3],
        mobility: [3],
        medications: '',
        appointments: '',
        notes: ''
      });

      toast.success('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save journal entry');
    } finally {
      setIsSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-success';
    if (score <= 6) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Mild';
    if (score <= 6) return 'Moderate';
    return 'Severe';
  };

  const formatEntryDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM do');
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.medications && Array.isArray(entry.medications) && entry.medications.join(' ').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.appointments && entry.appointments.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high-pain' && entry.pain_level >= 7) ||
      (selectedFilter === 'recent' && new Date(entry.entry_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesFilter;
  });

  const averageScores = entries.length > 0 ? {
    pain: Math.round(entries.reduce((sum, entry) => sum + entry.pain_level, 0) / entries.length),
    fatigue: Math.round(entries.reduce((sum, entry) => sum + entry.fatigue_level, 0) / entries.length),
    mentalHealth: Math.round(entries.reduce((sum, entry) => sum + entry.mental_health, 0) / entries.length),
    mobility: Math.round(entries.reduce((sum, entry) => sum + entry.mobility_difficulty, 0) / entries.length)
  } : null;

  return (
    <div className="min-h-screen gradient-dashboard pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header with Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center glow-primary">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-medium">Daily Journal</h1>
                  <p className="text-muted-foreground text-lg">
                    Track your daily experiences and build evidence for your PIP claim
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="card-elevated">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-primary">{entries.length}</div>
                    <div className="text-sm text-muted-foreground">Total Entries</div>
                    <Badge className="bg-success/20 text-success border-success/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Building Evidence
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Entry Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Today's Entry
                  </CardTitle>
                  <CardDescription>
                    Record how you're feeling today. Be as detailed as possible for stronger evidence.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Symptom Scales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-destructive" />
                        Pain Level: {currentEntry.pain[0]}/10
                        <Badge className={`${getScoreColor(currentEntry.pain[0])} bg-transparent border-current`}>
                          {getScoreLabel(currentEntry.pain[0])}
                        </Badge>
                      </Label>
                      <Slider
                        value={currentEntry.pain}
                        onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, pain: value }))}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-warning" />
                        Fatigue Level: {currentEntry.fatigue[0]}/10
                        <Badge className={`${getScoreColor(currentEntry.fatigue[0])} bg-transparent border-current`}>
                          {getScoreLabel(currentEntry.fatigue[0])}
                        </Badge>
                      </Label>
                      <Slider
                        value={currentEntry.fatigue}
                        onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, fatigue: value }))}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-accent" />
                        Mental Health: {currentEntry.mentalHealth[0]}/10
                        <Badge className={`${getScoreColor(currentEntry.mentalHealth[0])} bg-transparent border-current`}>
                          {getScoreLabel(currentEntry.mentalHealth[0])}
                        </Badge>
                      </Label>
                      <Slider
                        value={currentEntry.mentalHealth}
                        onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mentalHealth: value }))}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-tertiary" />
                        Mobility Impact: {currentEntry.mobility[0]}/10
                        <Badge className={`${getScoreColor(currentEntry.mobility[0])} bg-transparent border-current`}>
                          {getScoreLabel(currentEntry.mobility[0])}
                        </Badge>
                      </Label>
                      <Slider
                        value={currentEntry.mobility}
                        onValueChange={(value) => setCurrentEntry(prev => ({ ...prev, mobility: value }))}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        Medications Taken
                      </Label>
                      <Input
                        placeholder="List medications and dosages..."
                        value={currentEntry.medications}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, medications: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-accent" />
                        Medical Appointments
                      </Label>
                      <Input
                        placeholder="Any appointments or treatments..."
                        value={currentEntry.appointments}
                        onChange={(e) => setCurrentEntry(prev => ({ ...prev, appointments: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Daily Notes & Challenges</Label>
                    <Textarea
                      placeholder="Describe your day, challenges faced, help needed, activities affected..."
                      value={currentEntry.notes}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Include specific examples of difficulties with daily tasks, time taken, help needed, and impact on your life.
                    </p>
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full glow-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving Entry...' : 'Save Today\'s Entry'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Stats and Quick Actions */}
            <div className="space-y-6">
              
              {/* Average Scores */}
              {averageScores && (
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Average Scores</CardTitle>
                    <CardDescription>Based on your recent entries</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-2">
                          <Activity className="h-3 w-3 text-destructive" />
                          Pain
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{averageScores.pain}/10</span>
                          <Badge className={`${getScoreColor(averageScores.pain)} bg-transparent border-current text-xs`}>
                            {getScoreLabel(averageScores.pain)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-2">
                          <Zap className="h-3 w-3 text-warning" />
                          Fatigue
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{averageScores.fatigue}/10</span>
                          <Badge className={`${getScoreColor(averageScores.fatigue)} bg-transparent border-current text-xs`}>
                            {getScoreLabel(averageScores.fatigue)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-2">
                          <Brain className="h-3 w-3 text-accent" />
                          Mental Health
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{averageScores.mentalHealth}/10</span>
                          <Badge className={`${getScoreColor(averageScores.mentalHealth)} bg-transparent border-current text-xs`}>
                            {getScoreLabel(averageScores.mentalHealth)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-2">
                          <Users className="h-3 w-3 text-tertiary" />
                          Mobility
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{averageScores.mobility}/10</span>
                          <Badge className={`${getScoreColor(averageScores.mobility)} bg-transparent border-current text-xs`}>
                            {getScoreLabel(averageScores.mobility)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Tips */}
              <Card className="gradient-dark-brand border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-medium">Evidence Tips</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Be specific about tasks you struggle with</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Note how long activities take you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Record help needed from others</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Document bad days AND good days</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Summary */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Entries logged</span>
                      <span className="font-medium">
                        {entries.filter(entry => new Date(entry.entry_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}/7
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">High symptom days</span>
                      <span className="font-medium text-destructive">
                        {entries.filter(entry => 
                          new Date(entry.entry_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && 
                          (entry.pain_level >= 7 || entry.fatigue_level >= 7)
                        ).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Evidence strength</span>
                      <Badge className="bg-success/20 text-success border-success/30 text-xs">
                        Building
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Entry History */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Entry History
                  </CardTitle>
                  <CardDescription>
                    Review your previous entries and track patterns
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={selectedFilter === 'recent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter('recent')}
                    >
                      Recent
                    </Button>
                    <Button
                      variant={selectedFilter === 'high-pain' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFilter('high-pain')}
                    >
                      High Symptoms
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading entries...</div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || selectedFilter !== 'all' ? 'No entries match your filters' : 'No entries yet. Start by adding your first entry above!'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEntries.slice(0, 12).map((entry) => (
                    <Card key={entry.id} className="card-subtle hover-lift">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{formatEntryDate(entry.entry_date)}</h4>
                          <Badge variant="outline" className="text-xs">
                            {format(parseISO(entry.entry_date), 'MMM d')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Pain:</span>
                            <span className={`font-medium ${getScoreColor(entry.pain_level)}`}>
                              {entry.pain_level}/10
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Fatigue:</span>
                            <span className={`font-medium ${getScoreColor(entry.fatigue_level)}`}>
                              {entry.fatigue_level}/10
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Mental:</span>
                            <span className={`font-medium ${getScoreColor(entry.mental_health)}`}>
                              {entry.mental_health}/10
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Mobility:</span>
                            <span className={`font-medium ${getScoreColor(entry.mobility_difficulty)}`}>
                              {entry.mobility_difficulty}/10
                            </span>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {entry.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          {entry.medications && Array.isArray(entry.medications) && entry.medications.length > 0 && entry.medications[0] && (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                              <Pill className="h-2 w-2 mr-1" />
                              Meds
                            </Badge>
                          )}
                          {entry.appointments && (
                            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                              <Stethoscope className="h-2 w-2 mr-1" />
                              Appt
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {filteredEntries.length > 12 && (
                <div className="text-center pt-6">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All {filteredEntries.length} Entries
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}