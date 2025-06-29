import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronRight, X } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: AssessmentOption[];
}

interface AssessmentOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

interface DailyLivingAssessmentProps {
  onComplete: (responses: Record<string, string[]>) => void;
  onClose: () => void;
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'dressing',
    question: 'What made dressing difficult today?',
    subtitle: 'Select all that apply',
    options: [
      {
        id: 'physical_help',
        label: 'I needed physical help with clothes',
        icon: '🤝',
        description: 'Someone had to help me put on or take off clothing'
      },
      {
        id: 'reminding',
        label: 'I needed reminding or encouragement',
        icon: '📢',
        description: 'I needed prompts to get dressed or stay motivated'
      },
      {
        id: 'aids',
        label: 'I used aids like a shoehorn or dressing tool',
        icon: '🦶',
        description: 'I needed special equipment to help me dress'
      },
      {
        id: 'fatigued',
        label: 'I felt too fatigued or overwhelmed',
        icon: '🧠',
        description: 'The task felt too difficult due to tiredness or stress'
      },
      {
        id: 'no_difficulty',
        label: 'I had no difficulty today',
        icon: '✅',
        description: 'I was able to dress myself without any problems'
      }
    ]
  },
  {
    id: 'washing',
    question: 'How was washing and bathing today?',
    subtitle: 'Select all that apply',
    options: [
      {
        id: 'help_needed',
        label: 'I needed help washing myself',
        icon: '🛁',
        description: 'Someone had to help me wash or bathe'
      },
      {
        id: 'safety_concerns',
        label: 'I was worried about safety',
        icon: '⚠️',
        description: 'I felt unsafe or worried about falling'
      },
      {
        id: 'equipment_used',
        label: 'I used grab rails or shower seat',
        icon: '🚿',
        description: 'I needed special equipment to wash safely'
      },
      {
        id: 'avoided_washing',
        label: 'I avoided washing due to difficulty',
        icon: '🚫',
        description: 'I skipped washing because it felt too hard'
      },
      {
        id: 'no_difficulty',
        label: 'I had no difficulty today',
        icon: '✅',
        description: 'I was able to wash myself without any problems'
      }
    ]
  },
  {
    id: 'eating',
    question: 'How was preparing and eating food today?',
    subtitle: 'Select all that apply',
    options: [
      {
        id: 'help_cooking',
        label: 'I needed help preparing food',
        icon: '👨‍🍳',
        description: 'Someone had to help me cook or prepare meals'
      },
      {
        id: 'simple_meals',
        label: 'I could only manage simple meals',
        icon: '🍞',
        description: 'I stuck to easy foods like sandwiches or ready meals'
      },
      {
        id: 'eating_difficulty',
        label: 'I had difficulty eating or drinking',
        icon: '🍽️',
        description: 'I struggled to hold utensils or swallow food'
      },
      {
        id: 'no_appetite',
        label: 'I had no appetite or forgot to eat',
        icon: '😔',
        description: 'I didn\'t feel like eating or forgot about meals'
      },
      {
        id: 'no_difficulty',
        label: 'I had no difficulty today',
        icon: '✅',
        description: 'I was able to prepare and eat meals normally'
      }
    ]
  },
  {
    id: 'mobility',
    question: 'How was moving around today?',
    subtitle: 'Select all that apply',
    options: [
      {
        id: 'mobility_aid',
        label: 'I used a walking aid or wheelchair',
        icon: '🦽',
        description: 'I needed equipment to help me move around'
      },
      {
        id: 'help_walking',
        label: 'I needed help from another person',
        icon: '🤝',
        description: 'Someone had to support or guide me while walking'
      },
      {
        id: 'pain_walking',
        label: 'Walking caused significant pain',
        icon: '😣',
        description: 'Moving around was very painful'
      },
      {
        id: 'limited_distance',
        label: 'I could only walk short distances',
        icon: '📏',
        description: 'I had to stop frequently or couldn\'t walk far'
      },
      {
        id: 'no_difficulty',
        label: 'I had no difficulty today',
        icon: '✅',
        description: 'I was able to move around without any problems'
      }
    ]
  }
];

export function DailyLivingAssessment({ onComplete, onClose }: DailyLivingAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

  const handleOptionToggle = (optionId: string) => {
    const questionId = currentQuestion.id;
    const currentSelections = responses[questionId] || [];
    
    // If selecting "no difficulty", clear other selections
    if (optionId === 'no_difficulty') {
      setResponses(prev => ({
        ...prev,
        [questionId]: currentSelections.includes(optionId) ? [] : [optionId]
      }));
    } else {
      // If selecting other options, remove "no difficulty" if it exists
      const filteredSelections = currentSelections.filter(id => id !== 'no_difficulty');
      
      if (filteredSelections.includes(optionId)) {
        setResponses(prev => ({
          ...prev,
          [questionId]: filteredSelections.filter(id => id !== optionId)
        }));
      } else {
        setResponses(prev => ({
          ...prev,
          [questionId]: [...filteredSelections, optionId]
        }));
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(responses);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentSelections = responses[currentQuestion.id] || [];
  const hasSelections = currentSelections.length > 0;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 glass-effect border-b contrast-border">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground font-medium">
            {new Date().toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted/70 flex items-center justify-center transition-all duration-200 hover-lift"
          aria-label="Close assessment"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="px-6 pt-6 gradient-dark-brand">
        <div className="flex items-center gap-2">
          {ASSESSMENT_QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                index <= currentQuestionIndex 
                  ? 'gradient-primary glow-primary' 
                  : 'bg-muted/30'
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-3 font-medium">
          Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col mobile-spacing pt-8">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="space-y-8 flex-1">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-medium text-foreground leading-tight">
                {currentQuestion.question}
              </h1>
              <p className="text-muted-foreground text-xl">
                {currentQuestion.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = currentSelections.includes(option.id);
                const isNodifficulty = option.id === 'no_difficulty';
                
                return (
                  <Card
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 hover-lift border-2 ${
                      isSelected
                        ? isNodifficulty
                          ? 'border-success bg-success/10 glow-accent card-shadow-lg'
                          : 'border-primary bg-primary/10 glow-primary card-shadow-lg'
                        : 'contrast-border hover:border-primary/50 hover:bg-primary/5 bg-card/80'
                    }`}
                    onClick={() => handleOptionToggle(option.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0 mt-1">
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-xl leading-tight transition-colors ${
                            isSelected 
                              ? isNodifficulty 
                                ? 'text-success' 
                                : 'text-primary'
                              : 'text-foreground'
                          }`}>
                            {option.label}
                          </h3>
                          {option.description && (
                            <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                              {option.description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                              isNodifficulty 
                                ? 'bg-success glow-accent' 
                                : 'bg-primary glow-primary'
                            }`}>
                              <span className="text-white font-medium">✓</span>
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

          {/* Navigation buttons */}
          <div className="flex gap-4 pt-8">
            {currentQuestionIndex > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 py-6 text-lg border-border hover:border-primary/50 hover:bg-primary/5"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!hasSelections}
              className={`py-6 text-lg transition-all duration-200 hover-lift ${
                currentQuestionIndex === 0 ? 'flex-1' : 'flex-1'
              } ${
                hasSelections
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground glow-primary'
                  : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isLastQuestion ? 'Complete Assessment' : 'Next'}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}