import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { TopMenu } from './components/TopMenu';
import { PipQuestionModal } from './components/PipQuestionModal';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { 
  Calendar, 
  Plus, 
  Eye,
  AlertCircle,
  CheckCircle,
  BarChart3,
  BookOpen,
  Shield,
  Ban,
  Home,
  Upload,
  CloudUpload,
  File,
  FileText,
  Paperclip,
  ChevronRight,
  Target,
  Award,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  Stethoscope,
  Pill,
  Users,
  Edit3,
  FolderPlus,
  User,
  ChefHat,
  MapPin,
  Shirt,
  Pill as PillIcon,
  UtensilsCrossed,
  Bath,
  MessageCircle,
  BookOpenIcon,
  UserIcon,
  DollarSign,
  Phone,
  HeadphonesIcon,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  LifeBuoy,
  FileSearch,
  Clock,
  Wrench,
  Brain,
  MessageCircleMore
,
  FileSearch,
  Clock,
  Wrench,
  Brain,
  MessageCircleMore
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Local User type definition to avoid import issues
interface User {
  id?: string;
  name: string;
  email: string;
  timezone: string;
  pip_focus: string[];
  created_at: string;
}

// PIP Activity data with tracking
interface PipActivityStatus {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
  description: string;
  score?: number;
  answers?: any;
}

// Support Questions data with tracking
interface SupportQuestionStatus {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
  description: string;
  aiSuggestions: boolean;
}

const initialPipActivities: PipActivityStatus[] = [
  {
    id: 'preparing-food',
    title: 'Preparing Food',
    icon: ChefHat,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'moving-around',
    title: 'Moving Around',
    icon: MapPin,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'washing-dressing',
    title: 'Washing & Dressing',
    icon: Shirt,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'managing-treatments',
    title: 'Managing Treatments',
    icon: PillIcon,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'eating-drinking',
    title: 'Eating & Drinking',
    icon: UtensilsCrossed,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'toilet-use',
    title: 'Toilet Use',
    icon: Bath,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'speaking-understanding',
    title: 'Speaking & Understanding',
    icon: MessageCircle,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'reading',
    title: 'Reading',
    icon: BookOpenIcon,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'social-interaction',
    title: 'Social Interaction',
    icon: UserIcon,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'managing-money',
    title: 'Managing Money',
    icon: DollarSign,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'planning-journeys',
    title: 'Planning & Following Journeys',
    icon: MapPin,
    completed: false,
    description: 'Click to start building your answer'
  },
  {
    id: 'engaging-others',
    title: 'Engaging With Others',
    icon: Phone,
    completed: false,
    description: 'Click to start building your answer'
  }
];

const initialSupportQuestions: SupportQuestionStatus[] = [
  {
    id: 'about-conditions',
    title: 'About Your Conditions',
    icon: Brain,
    completed: false,
    description: 'Describe your physical or mental health conditions',
    aiSuggestions: true
  },
  {
    id: 'medications-treatments',
    title: 'Medications & Treatments',
    icon: PillIcon,
    completed: false,
    description: 'List your medications, dosages, and any side effects',
    aiSuggestions: true
  },
  {
    id: 'medical-evidence',
    title: 'Medical Evidence',
    icon: FileSearch,
    completed: false,
    description: 'Upload medical reports, letters, or summaries from your GP, consultants, or specialists',
    aiSuggestions: true
  },
  {
    id: 'professionals-involved',
    title: 'Professionals Involved',
    icon: Stethoscope,
    completed: false,
    description: 'Share details about professionals, therapists, or other professionals helping with your condition',
    aiSuggestions: true
  },
  {
    id: 'condition-history',
    title: 'History of Your Condition',
    icon: Clock,
    completed: false,
    description: 'When did it start? Has it changed, worsened, or relapsed?',
    aiSuggestions: true
  },
  {
    id: 'appointments-stays',
    title: 'Appointments & Hospital Stays',
    icon: CalendarIcon,
    completed: false,
    description: 'Include significant letters of treatment, hospital stays or assessments',
    aiSuggestions: true
  },
  {
    id: 'aids-adaptations',
    title: 'Aids & Adaptations',
    icon: Wrench,
    completed: false,
    description: 'Mention any tools, equipment, or home modifications you use',
    aiSuggestions: true
  },
  {
    id: 'help-from-others',
    title: 'Help from Others',
    icon: Users,
    completed: false,
    description: 'Who supports you? What kind of help do they provide?',
    aiSuggestions: true
  },
  {
    id: 'anything-else',
    title: 'Anything Else?',
    icon: MessageCircleMore,
    completed: false,
    description: 'Add any final comments that could help your claim',
    aiSuggestions: true
  }
];

function Dashboard() {
  const { user, setUser } = useUser();
  const [currentView, setCurrentView] = useState<'home' | 'upload' | 'build' | 'support' | 'settings'>('home');
  const [pipActivities, setPipActivities] = useState<PipActivityStatus[]>(initialPipActivities);
  const [supportQuestions, setSupportQuestions] = useState<SupportQuestionStatus[]>(initialSupportQuestions);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);

  // Mock user if none exists
  useEffect(() => {
    if (!user) {
      const mockUser: User = {
        id: 'demo-user-1',
        name: 'Lydia',
        email: 'lydia@claimease.app',
        timezone: 'Europe/London',
        pip_focus: ['Daily Living', 'Mobility'],
        created_at: new Date().toISOString()
      };
      setUser(mockUser);
    }
  }, [user, setUser]);

  // Calculate scores for home page display
  const calculateScores = () => {
    const dailyLivingActivities = ['preparing-food', 'washing-dressing', 'managing-treatments', 'eating-drinking', 'toilet-use', 'reading', 'social-interaction', 'managing-money', 'engaging-others'];
    const mobilityActivities = ['moving-around', 'planning-journeys'];

    const dailyLivingScore = pipActivities
      .filter(activity => dailyLivingActivities.includes(activity.id) && activity.completed)
      .reduce((total, activity) => total + (activity.score || 0), 0);

    const mobilityScore = pipActivities
      .filter(activity => mobilityActivities.includes(activity.id) && activity.completed)
      .reduce((total, activity) => total + (activity.score || 0), 0);

    return { dailyLivingScore, mobilityScore };
  };

  const handleStartActivity = (activityId: string) => {
    setCurrentActivityId(activityId);
    setQuestionModalOpen(true);
  };

  const handleCompleteActivity = (activityId: string, score: number, answers: any) => {
    setPipActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { 
            ...activity, 
            completed: true, 
            description: 'Answer completed',
            score,
            answers 
          }
        : activity
    ));
    setQuestionModalOpen(false);
    setCurrentActivityId(null);
  };

  const handleStartSupportQuestion = (questionId: string) => {
    // For now, just mark as completed since we don't have the modal for support questions yet
    setSupportQuestions(prev => prev.map(question => 
      question.id === questionId 
        ? { 
            ...question, 
            completed: true, 
            description: 'Answer completed'
          }
        : question
    ));
    toast.success('Support question completed!');
  };

  const { dailyLivingScore, mobilityScore } = calculateScores();
  const dailyLivingPercentage = Math.min((dailyLivingScore / 12) * 100, 100);
  const mobilityPercentage = Math.min((mobilityScore / 12) * 100, 100);

  const renderHomeView = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-medium">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground text-lg">
          Let's build strong, evidence-backed answers for your PIP form
        </p>
      </div>

      {/* PIP Entitlement Estimation */}
      <Card className="card-elevated">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Estimated PIP Entitlement</CardTitle>
          </div>
          <CardDescription className="text-base">
            Based on your current answers and the official PIP scoring system. This is just an estimate to help you understand where you might stand.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Progress Bars Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Daily Living Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Daily Living</h3>
                    <p className="text-sm text-muted-foreground">{dailyLivingScore} Points</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${dailyLivingPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Mobility Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mobility</h3>
                    <p className="text-sm text-muted-foreground">{mobilityScore} Points</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${mobilityPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text with Tooltip */}
          <div className="flex items-start gap-2 p-4 bg-muted/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-medium cursor-help underline decoration-dotted underline-offset-2 hover:text-primary transition-colors">
                      How is this calculated?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm p-3">
                    <p className="text-sm">
                      This estimate is based on your answers to the PIP activities and uses the official PIP scoring criteria to provide guidance on where you might stand.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Three Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step 1: Upload Documents */}
        <Card className="card-elevated hover:card-shadow-lg transition-all">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Step 1:</h3>
                  <h4 className="text-lg font-medium">Upload Documents</h4>
                </div>
              </div>
              
              <p className="text-muted-foreground">
                Add your GP letters, prescriptions, or assessments so our AI can help you foster.
              </p>

              {/* Progress indicator */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: '25%' }}
                ></div>
              </div>

              <Button 
                onClick={() => setCurrentView('upload')}
                className="w-full glow-primary"
              >
                Go To Step 1
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Build Your Main Answers */}
        <Card className="card-elevated hover:card-shadow-lg transition-all">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Edit3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Step 2:</h3>
                  <h4 className="text-lg font-medium">Build Your Main Answers</h4>
                </div>
              </div>
              
              <p className="text-muted-foreground">
                Answer the 12 key questions that are scored in your PIP assessment.
              </p>

              {/* Progress indicator */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: '60%' }}
                ></div>
              </div>

              <Button 
                onClick={() => setCurrentView('build')}
                className="w-full glow-primary"
              >
                Go To Step 2
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Add Supporting Details */}
        <Card className="card-elevated hover:card-shadow-lg transition-all">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <FolderPlus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Step 3:</h3>
                  <h4 className="text-lg font-medium">Add Supporting Details</h4>
                </div>
              </div>
              
              <p className="text-muted-foreground">
                Answer the rest of the form questions that help explain your condition and support your claim.
              </p>

              {/* Progress indicator */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: '15%' }}
                ></div>
              </div>

              <Button 
                onClick={() => setCurrentView('support')}
                className="w-full glow-primary"
              >
                Go To Step 3
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUploadView = () => (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-medium">Step 1: Upload Documents</h1>
        <p className="text-muted-foreground text-lg">
          Add your GP letters, prescriptions, or assessments so our AI can help you foster.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="card-elevated">
        <CardContent className="p-12">
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-6 hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Upload Medical Documents</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Drag and drop your files here, or click to browse. 
                Accepted formats: PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>
            <Button size="lg" className="glow-primary">
              <Paperclip className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Card className="card-elevated hover:card-shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-medium">Medical Reports</h3>
                <p className="text-sm text-muted-foreground">GP letters, specialist reports</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">0 documents</div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:card-shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-medium">Test Results</h3>
                <p className="text-sm text-muted-foreground">Blood tests, scans, X-rays</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">0 documents</div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:card-shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Pill className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium">Prescriptions</h3>
                <p className="text-sm text-muted-foreground">Medication lists, repeat prescriptions</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">0 documents</div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:card-shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-medium">PIP Forms</h3>
                <p className="text-sm text-muted-foreground">Application forms, assessments</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">0 documents</div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:card-shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Support Letters</h3>
                <p className="text-sm text-muted-foreground">Family, friends, carers</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">0 documents</div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:card-shadow-lg transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center">
                <File className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Other Documents</h3>
                <p className="text-sm text-muted-foreground">Photos, additional evidence</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">0 documents</div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="gradient-dark-brand border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium">Document Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Keep original documents safe - upload clear scans or photos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Include all pages of multi-page documents</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Organize by category for easier management</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>


    </div>
  );

  const renderBuildView = () => {
    const completedActivities = pipActivities.filter(activity => activity.completed).length;
    const totalActivities = pipActivities.length;
    const progressPercentage = Math.round((completedActivities / totalActivities) * 100);

    return (
      <div className="space-y-8">
        {/* Step Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Step 2: Build Your Main Answers</h1>
          <p className="text-muted-foreground text-lg">
            Answer the 12 key questions that are scored in your PIP assessment.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Your Progress</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedActivities} of {totalActivities} activities complete
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {progressPercentage}% complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Answer Instructions */}
        <Card className="gradient-dark-brand border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-medium text-primary">How to Answer</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>PIP assessments are based on how your condition affects daily life.</strong><br />
                Please answer honestly, based on your typical bad days. You do not need to struggle every day for it to count - just most of the time.
              </p>
              <p>
                These are the 12 key activities that the PIP form is scored on. The more accurate your answers, the better we can help you build strong, legally-aligned responses.
              </p>
              <div>
                <p className="font-medium text-foreground mb-2">Each question will ask:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Can you do this activity safely and reliably?</li>
                  <li>Do you need aids, prompts, or help?</li>
                  <li>How often is it difficult?</li>
                </ul>
              </div>
              <p className="font-medium text-warning">
                Answer honestly - not based on your best days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PIP Activities */}
        <div className="space-y-6">
          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card 
                  key={activity.id}
                  className={`card-elevated hover:card-shadow-lg transition-all cursor-pointer ${
                    activity.completed ? 'border-success/30 bg-success/5' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Icon and Status */}
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          activity.completed 
                            ? 'bg-success/20 text-success' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {activity.completed && (
                          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-medium">{activity.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>

                      {/* Score Display */}
                      {activity.completed && activity.score !== undefined && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {activity.score} points
                          </Badge>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className={`w-full ${
                          activity.completed 
                            ? 'bg-muted hover:bg-muted/80 text-foreground' 
                            : 'glow-primary'
                        }`}
                        onClick={() => {
                          if (activity.completed) {
                            handleStartActivity(activity.id);
                          } else {
                            handleStartActivity(activity.id);
                          }
                        }}
                      >
                        {activity.completed ? 'Review Answer' : 'Answer Question'}
                      </Button>

                      {/* Additional Info for Completed */}
                      {activity.completed && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-success">
                            <CheckCircle className="h-3 w-3" />
                            <span>Answer complete</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Review how this will appear on the PIP form
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* PIP Question Modal */}
        <PipQuestionModal
          isOpen={questionModalOpen}
          onClose={() => setQuestionModalOpen(false)}
          activityId={currentActivityId}
          onComplete={handleCompleteActivity}
        />

      </div>
    );
  };

  const renderSupportView = () => {
    const completedQuestions = supportQuestions.filter(question => question.completed).length;
    const totalQuestions = supportQuestions.length;
    const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

    return (
      <div className="space-y-8">
        {/* Step Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Step 3: Add Supporting Details</h1>
          <p className="text-muted-foreground text-lg">
            Answer the rest of the form questions that help explain your condition and support your claim.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Your Progress</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedQuestions} of {totalQuestions} questions complete
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {progressPercentage}% complete
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="gradient-dark-brand border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-medium text-primary">Other Parts of the PIP Form</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Answer the rest of the questions from your PIP form with help from AI.</strong><br />
                These answers give more context about your condition and help strengthen your claim.
              </p>
              <p>
                The questions below cover important supporting information that helps assessors understand your situation better, including your medical history, treatments, and daily support needs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support Questions Grid */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportQuestions.map((question) => {
              const Icon = question.icon;
              return (
                <Card 
                  key={question.id}
                  className={`card-elevated hover:card-shadow-lg transition-all cursor-pointer ${
                    question.completed ? 'border-success/30 bg-success/5' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Icon and Status */}
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          question.completed 
                            ? 'bg-success/20 text-success' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {question.completed && (
                          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-medium">{question.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {question.description}
                      </p>

                      {/* Action Button */}
                      <Button 
                        className={`w-full ${
                          question.completed 
                            ? 'bg-muted hover:bg-muted/80 text-foreground' 
                            : 'glow-primary'
                        }`}
                        onClick={() => handleStartSupportQuestion(question.id)}
                      >
                        {question.completed ? 'Review Answer' : 'Start'}
                      </Button>

                      {/* AI Suggestions Indicator */}
                      {question.aiSuggestions && (
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <AlertCircle className="h-3 w-3" />
                          <span>AI suggestions available from documents</span>
                        </div>
                      )}

                      {/* Additional Info for Completed */}
                      {question.completed && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-success">
                            <CheckCircle className="h-3 w-3" />
                            <span>Answer complete</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline">
            View All Saved Answers
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              Save All Changes
            </Button>
            <Button className="glow-primary">
              Export Progress
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsView = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center">
          <SettingsIcon className="h-6 w-6 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-medium">Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <div className="p-3 bg-muted/30 rounded-lg">
                {user?.name || 'Demo User'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <div className="p-3 bg-muted/30 rounded-lg">
                {user?.email || 'demo@claimease.app'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen gradient-dashboard">
      <TopMenu 
        currentAppView="dashboard"
        onAppViewChange={() => {}}
        currentDashboardView={currentView}
        onDashboardViewChange={setCurrentView}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'home' && renderHomeView()}
          {currentView === 'upload' && renderUploadView()}
          {currentView === 'build' && renderBuildView()}
          {currentView === 'support' && renderSupportView()}
          {currentView === 'settings' && renderSettingsView()}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <UserProvider>
      <Dashboard />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            fontSize: '16px',
            boxShadow: '0 8px 32px rgba(78, 185, 185, 0.3)',
          },
        }}
      />
    </UserProvider>
  );
}

export default function App() {
  return <AppContent />;
}