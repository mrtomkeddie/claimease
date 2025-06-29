import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowLeft, ArrowRight, Save, CheckCircle, MessageSquare, ArrowDownRight, AlertTriangle } from 'lucide-react';

interface SmartJournalEntryProps {
  selectedDate: Date;
  onSave: (entryData: any) => void;
  existingEntry?: any;
  isSaving?: boolean;
}

interface JournalResponse {
  questionId: number;
  answer: string;
  followUpAnswer?: string;
  followUpText?: string;
}

interface JournalData {
  responses: JournalResponse[];
  additionalNotes: string;
}

const JOURNAL_QUESTIONS = [
  {
    id: 1,
    question: "Did you cook a simple meal today?",
    answers: [
      { value: "help_aids", label: "I needed help/aids", needsFollowUp: true },
      { value: "cooked_alone", label: "I cooked on my own", needsFollowUp: false },
      { value: "didnt_cook", label: "I didn't cook today", needsFollowUp: false },
      { value: "couldnt_do", label: "I couldn't do it", needsFollowUp: true }
    ],
    followUpQuestion: "What kind of support did you need today?",
    followUpAnswers: [
      "I used an aid (like a stool, adapted tools, or microwave)",
      "I needed prompting or reminding to cook",
      "I needed someone to supervise me while cooking",
      "I needed physical help with preparing or cooking the food"
    ]
  },
  {
    id: 2,
    question: "How far could you walk today?",
    subtitle: "(without pain, help, or needing to stop?)",
    answers: [
      { value: "supermarket", label: "Around a supermarket", needsFollowUp: false },
      { value: "end_street", label: "To the end of the street", needsFollowUp: true },
      { value: "around_house", label: "Just around the house", needsFollowUp: true },
      { value: "couldnt_walk", label: "I couldn't at all", needsFollowUp: true }
    ],
    followUpQuestion: "What made walking difficult today?",
    followUpAnswers: [
      "I needed a walking aid (like a stick, or scooter)",
      "I had to stop and rest often",
      "I needed help from another person",
      "I couldn't walk because of pain, fear, or risk"
    ]
  },
  {
    id: 3,
    question: "Did you wash or bathe yourself today?",
    answers: [
      { value: "washed_fully", label: "I washed fully by myself", needsFollowUp: false },
      { value: "needed_help", label: "I needed help or prompting", needsFollowUp: true },
      { value: "couldnt_wash", label: "I couldn't wash today", needsFollowUp: true },
      { value: "didnt_wash", label: "I didn't wash today", needsFollowUp: true }
    ],
    followUpQuestion: "What made washing difficult today?",
    followUpAnswers: [
      "I needed physical help to wash or get in/out safely",
      "I needed reminding or encouragement to wash",
      "I used aids like a shower seat or grab rail",
      "I felt too anxious, depressed, or overwhelmed"
    ]
  },
  {
    id: 4,
    question: "Could you dress yourself today?",
    answers: [
      { value: "dressed_fully", label: "I dressed fully on my own", needsFollowUp: false },
      { value: "needed_help", label: "I needed help or prompting", needsFollowUp: true },
      { value: "couldnt_dress", label: "I couldn't get dressed today", needsFollowUp: true },
      { value: "same_clothes", label: "I stayed in the same clothes", needsFollowUp: true }
    ],
    followUpQuestion: "What made dressing difficult today?",
    followUpAnswers: [
      "I needed physical help with clothes",
      "I needed reminding or encouragement",
      "I used aids like a shoehorn or dressing tool",
      "I felt too fatigued or overwhelmed"
    ]
  },
  {
    id: 5,
    question: "Did you handle your own medicine or treatment?",
    answers: [
      { value: "managed_everything", label: "I managed everything myself", needsFollowUp: false },
      { value: "needed_reminding", label: "I needed reminding or some help", needsFollowUp: true },
      { value: "couldnt_manage", label: "I couldn't manage it today", needsFollowUp: true },
      { value: "didnt_need", label: "I didn't need any today", needsFollowUp: false }
    ],
    followUpQuestion: "What made medicine or treatment difficult?",
    followUpAnswers: [],
    followUpIsText: true,
    followUpPlaceholder: "Was it a memory issue? Physical difficulty? Confusion? Let us know what happened."
  },
  {
    id: 6,
    question: "Could you use the toilet without help today?",
    answers: [
      { value: "managed_everything", label: "I managed everything myself", needsFollowUp: false },
      { value: "used_aids", label: "I used aids or needed support", needsFollowUp: true },
      { value: "accidents", label: "I had accidents or needed full help", needsFollowUp: true },
      { value: "didnt_use", label: "I didn't use the toilet today", needsFollowUp: true }
    ],
    followUpQuestion: "What made using the toilet difficult today?",
    followUpAnswers: [],
    followUpIsText: true,
    followUpPlaceholder: "If you used incontinence pads, had trouble cleaning, or felt rushed — share here."
  },
  {
    id: 7,
    question: "Did you struggle reading today?",
    answers: [
      { value: "read_fine", label: "I read and understood fine", needsFollowUp: false },
      { value: "needed_help", label: "I needed help or used visual aids", needsFollowUp: true },
      { value: "couldnt_understand", label: "I couldn't understand written info", needsFollowUp: true },
      { value: "didnt_read", label: "I didn't read anything today", needsFollowUp: false }
    ],
    followUpQuestion: "What made reading difficult today?",
    followUpAnswers: [],
    followUpIsText: true,
    followUpPlaceholder: "Was it due to vision issues, fatigue, or concentration problems?"
  },
  {
    id: 8,
    question: "Did you socialise or talk to anyone today?",
    answers: [
      { value: "managed_fine", label: "Yes, I managed fine", needsFollowUp: false },
      { value: "needed_reassurance", label: "I needed reassurance or someone with me", needsFollowUp: true },
      { value: "avoided_people", label: "I avoided people or couldn't cope", needsFollowUp: true },
      { value: "no_interaction", label: "I didn't interact with anyone today", needsFollowUp: false }
    ],
    followUpQuestion: "What made socializing difficult today?",
    followUpAnswers: [],
    followUpIsText: true,
    followUpPlaceholder: "Did anxiety, distress, or confusion affect how you handled social situations?"
  },
  {
    id: 9,
    question: "Did you make any financial decisions?",
    subtitle: "(without pain, help, or needing to stop?)",
    answers: [
      { value: "managed_everything", label: "Yes, I managed everything myself", needsFollowUp: false },
      { value: "needed_help", label: "I needed help or second opinions", needsFollowUp: true },
      { value: "avoided_decisions", label: "I avoided or couldn't manage any decisions", needsFollowUp: true },
      { value: "no_money_today", label: "I didn't deal with money today", needsFollowUp: false }
    ],
    followUpQuestion: "What made handling money difficult?",
    followUpAnswers: [],
    followUpIsText: true,
    followUpPlaceholder: "If you felt overwhelmed, forgot bills, or avoided decisions — describe it here."
  }
];

export function SmartJournalEntry({ selectedDate, onSave, existingEntry, isSaving = false }: SmartJournalEntryProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [journalData, setJournalData] = useState<JournalData>({
    responses: [],
    additionalNotes: ''
  });

  const currentQuestion = JOURNAL_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === JOURNAL_QUESTIONS.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (answer: string) => {
    const selectedAnswer = currentQuestion.answers.find(a => a.value === answer);
    
    // Update response data
    const newResponse: JournalResponse = {
      questionId: currentQuestion.id,
      answer: answer,
    };

    const updatedResponses = journalData.responses.filter(r => r.questionId !== currentQuestion.id);
    updatedResponses.push(newResponse);

    setJournalData(prev => ({
      ...prev,
      responses: updatedResponses
    }));

    // Check if follow-up is needed
    if (selectedAnswer?.needsFollowUp) {
      setShowFollowUpModal(true);
    } else {
      // Auto-advance if no follow-up needed
      setTimeout(() => {
        if (!isLastQuestion) {
          handleNextQuestion();
        }
      }, 300);
    }
  };

  const handleFollowUpSelect = (followUpAnswer: string) => {
    const updatedResponses = journalData.responses.map(r => {
      if (r.questionId === currentQuestion.id) {
        return { ...r, followUpAnswer };
      }
      return r;
    });

    setJournalData(prev => ({
      ...prev,
      responses: updatedResponses
    }));

    // Close modal and auto-advance
    setShowFollowUpModal(false);
    setTimeout(() => {
      if (!isLastQuestion) {
        handleNextQuestion();
      }
    }, 300);
  };

  const handleFollowUpTextChange = (text: string) => {
    const updatedResponses = journalData.responses.map(r => {
      if (r.questionId === currentQuestion.id) {
        return { ...r, followUpText: text };
      }
      return r;
    });

    setJournalData(prev => ({
      ...prev,
      responses: updatedResponses
    }));
  };

  const handleFollowUpComplete = () => {
    setShowFollowUpModal(false);
    setTimeout(() => {
      if (!isLastQuestion) {
        handleNextQuestion();
      }
    }, 300);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < JOURNAL_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinalSave = () => {
    // Convert responses to format expected by the database
    const processedResponses = journalData.responses.reduce((acc, response) => {
      const question = JOURNAL_QUESTIONS.find(q => q.id === response.questionId);
      if (question) {
        acc[`question_${response.questionId}`] = response.answer;
        if (response.followUpAnswer) {
          acc[`question_${response.questionId}_followup`] = response.followUpAnswer;
        }
        if (response.followUpText) {
          acc[`question_${response.questionId}_details`] = response.followUpText;
        }
      }
      return acc;
    }, {} as any);

    // Map responses to severity levels for database compatibility
    const entryData = {
      ...processedResponses,
      pain_level: calculateSeverityFromResponses(journalData.responses, 'physical'),
      fatigue_level: calculateSeverityFromResponses(journalData.responses, 'fatigue'),
      mental_health: calculateSeverityFromResponses(journalData.responses, 'mental'),
      mobility_difficulty: calculateSeverityFromResponses(journalData.responses, 'mobility'),
      medications: [],
      appointments: '',
      notes: journalData.additionalNotes || 'Completed PIP daily living assessment questionnaire.'
    };

    onSave(entryData);
  };

  const calculateSeverityFromResponses = (responses: JournalResponse[], category: string): number => {
    // Simple mapping logic - in a real app this would be more sophisticated
    const difficultResponses = responses.filter(r => {
      const answer = r.answer;
      return answer.includes('couldnt') || answer.includes('needed_help') || answer.includes('accidents');
    });

    if (difficultResponses.length === 0) return 2;
    if (difficultResponses.length <= 2) return 4;
    if (difficultResponses.length <= 4) return 6;
    return 8;
  };

  const getCurrentResponse = () => {
    return journalData.responses.find(r => r.questionId === currentQuestion.id);
  };

  const currentResponse = getCurrentResponse();

  const renderQuestion = () => (
    <div className="space-y-8">
      {/* Question Header - More Compact */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">{currentQuestion.id}</span>
          </div>
          <div className="text-left">
            <h2 className="text-xl font-medium text-primary">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentQuestion.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Answer Options - Cleaner Design */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = currentResponse?.answer === answer.value;
            
            return (
              <button
                key={answer.value}
                onClick={() => handleAnswerSelect(answer.value)}
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-200 border-2 relative
                  ${isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border hover:border-muted-foreground hover:bg-muted/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Clean Radio Button Style */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                    }
                  `}>
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  
                  {/* Answer Text */}
                  <span className={`
                    font-medium transition-all flex-1
                    ${isSelected ? 'text-primary' : 'text-foreground'}
                  `}>
                    {answer.label}
                  </span>

                  {/* Follow-up Indicator */}
                  {answer.needsFollowUp && isSelected && (
                    <div className="flex items-center gap-2 text-xs text-warning">
                      <AlertTriangle className="w-3 h-3" />
                      <span>More detail needed</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderFollowUpModal = () => (
    <Dialog open={showFollowUpModal} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl bg-card border-2 border-warning">
        <DialogHeader className="space-y-6 pb-6 border-b border-warning/50">
          {/* Enhanced breadcrumb with visual connection */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/50">
              <span className="text-primary font-medium">Question {currentQuestion.id}</span>
              <ArrowDownRight className="w-3 h-3 text-primary" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-warning/30 rounded-full border border-warning">
              <AlertTriangle className="w-3 h-3 text-warning" />
              <span className="text-warning font-medium">Follow-up Detail</span>
            </div>
          </div>

          {/* Follow-up question title with different styling */}
          <DialogTitle className="text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warning/30 rounded-xl flex items-center justify-center border border-warning">
                <MessageSquare className="w-6 w-6 text-warning" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-warning leading-tight">
                  {currentQuestion.followUpQuestion}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Help us understand your situation better by providing more specific details.
                </p>
              </div>
            </div>
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            This follow-up question helps provide more detailed information about your daily living situation, which is important for building comprehensive evidence for your PIP assessment.
          </DialogDescription>
          
          {/* Context card with enhanced styling */}
          <div className="bg-muted/30 border-2 border-primary/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Your response to:</span>
            </div>
            <div className="text-base font-medium text-primary">
              {currentQuestion.question}
            </div>
            <div className="flex items-center gap-2 text-sm bg-primary/20 rounded-lg p-3 border border-primary/50">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-foreground">
                {currentQuestion.answers.find(a => a.value === currentResponse?.answer)?.label}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {currentQuestion.followUpIsText ? (
            <div className="space-y-6">
              <div className="relative">
                <Textarea
                  placeholder={currentQuestion.followUpPlaceholder}
                  value={currentResponse?.followUpText || ''}
                  onChange={(e) => handleFollowUpTextChange(e.target.value)}
                  className="min-h-[150px] resize-none bg-muted/20 border-2 border-warning/50 focus:border-warning rounded-xl p-4 text-base"
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {currentResponse?.followUpText?.length || 0} characters
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleFollowUpComplete}
                  disabled={!currentResponse?.followUpText?.trim()}
                  className="bg-warning hover:bg-warning/90 text-warning-foreground px-8 py-3 rounded-xl"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentQuestion.followUpAnswers?.map((followUpAnswer, index) => {
                const isSelected = currentResponse?.followUpAnswer === followUpAnswer;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleFollowUpSelect(followUpAnswer)}
                    className={`
                      w-full p-5 rounded-xl text-left transition-all duration-200 border-2
                      ${isSelected
                        ? 'bg-warning/20 border-warning text-warning shadow-lg'
                        : 'bg-muted/20 border-warning/50 hover:border-warning hover:bg-warning/10'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isSelected ? 'border-warning bg-warning' : 'border-warning/70'}
                      `}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-warning-foreground" />}
                      </div>
                      <span className={`
                        font-medium transition-all text-base leading-relaxed
                        ${isSelected ? 'text-warning' : 'text-foreground'}
                      `}>
                        {followUpAnswer}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h3 className="text-xl font-medium">Additional Notes</h3>
        <p className="text-muted-foreground">
          Anything else you'd like to add about your day (optional)
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Textarea
          placeholder="Additional notes about your day, symptoms, or anything else relevant..."
          value={journalData.additionalNotes}
          onChange={(e) => setJournalData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          className="min-h-[120px] resize-none"
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleFinalSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </div>
    </div>
  );

  const showSummary = isLastQuestion && currentResponse && !showFollowUpModal;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / JOURNAL_QUESTIONS.length) * 100);

  return (
    <>
      <Card className="card-elevated">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {currentQuestionIndex + 1}/{JOURNAL_QUESTIONS.length}
                </span>
              </div>
              <span>Daily Living Assessment</span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8">
          {showSummary ? renderSummary() : renderQuestion()}

          {/* Navigation (only show for main questions, not summary) */}
          {!showSummary && (
            <div className="flex justify-between pt-8 border-t border-border/50 mt-8">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={isFirstQuestion}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={!currentResponse}
                className="flex items-center gap-2"
              >
                {isLastQuestion ? 'Finish' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow-up Modal */}
      {renderFollowUpModal()}
    </>
  );
}