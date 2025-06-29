import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays, isSameDay, isToday, parseISO, isAfter, startOfDay } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  entryDates?: string[]; // Dates that have journal entries
}

export function DateSelector({ selectedDate, onDateChange, entryDates = [] }: DateSelectorProps) {
  const today = startOfDay(new Date());
  
  // Generate 7 days with selected date in the center (position 3, 0-indexed)
  const generateCenteredDays = (centerDate: Date) => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(centerDate, i));
    }
    return days;
  };

  const [displayDays, setDisplayDays] = useState(() => generateCenteredDays(selectedDate));

  // Update display days when selected date changes
  useEffect(() => {
    setDisplayDays(generateCenteredDays(selectedDate));
  }, [selectedDate]);

  // Check if selected date is in the future and auto-correct to today
  useEffect(() => {
    if (isAfter(startOfDay(selectedDate), today)) {
      onDateChange(today);
    }
  }, [selectedDate, onDateChange, today]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(selectedDate, 1) 
      : addDays(selectedDate, 1);
    
    // Prevent navigating to future dates
    if (isAfter(startOfDay(newDate), today)) {
      return;
    }
    
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(today);
  };

  const hasEntry = (date: Date) => {
    return entryDates.some(entryDate => 
      isSameDay(parseISO(entryDate), date)
    );
  };

  const isFutureDate = (date: Date) => {
    return isAfter(startOfDay(date), today);
  };

  const handleDateClick = (date: Date) => {
    // Prevent selecting future dates
    if (isFutureDate(date)) {
      return;
    }
    onDateChange(date);
  };

  // Check if next navigation should be disabled
  const isNextDisabled = isAfter(startOfDay(addDays(selectedDate, 1)), today);

  return (
    <div className="space-y-6">
      {/* Date Selected Info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Date Selected:</div>
          <div className="text-lg font-medium">
            {format(selectedDate, 'EEE, d MMMM yyyy')}
          </div>
        </div>
        <Button 
          variant="link" 
          onClick={goToToday}
          className="text-warning hover:text-warning/80 p-0 h-auto"
        >
          Go To Today
        </Button>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateDate('prev')}
          className="h-10 w-10 p-0 hover:bg-muted/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-3 flex-1 justify-center">
          {displayDays.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentDay = isToday(date);
            const hasJournalEntry = hasEntry(date);
            const isFuture = isFutureDate(date);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                disabled={isFuture}
                className={`
                  relative flex flex-col items-center gap-1 p-4 rounded-xl min-w-[70px] transition-all
                  ${isFuture
                    ? 'bg-muted/10 border border-muted/20 opacity-40'
                    : isSelected
                    ? 'bg-primary/10 border border-primary/30' 
                    : hasJournalEntry
                    ? 'bg-success/10 border border-success hover:bg-success/20 hover:border-success shadow-md'
                    : 'bg-muted/30 border border-transparent hover:bg-muted/50'
                  }
                `}
              >
                {/* Today indicator - positioned above the content */}
                {isCurrentDay && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-warning rounded-full border-2 border-background shadow-sm" />
                )}

                {/* Day of week */}
                <span className={`
                  text-xs uppercase tracking-wide font-medium
                  ${isFuture
                    ? 'text-muted-foreground/50'
                    : isSelected || hasJournalEntry
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                  }
                `}>
                  {format(date, 'EEE')}
                </span>
                
                {/* Date number */}
                <span className={`
                  text-lg font-bold
                  ${isFuture
                    ? 'text-muted-foreground/50'
                    : 'text-foreground'
                  }
                `}>
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateDate('next')}
          disabled={isNextDisabled}
          className={`
            h-10 w-10 p-0 
            ${isNextDisabled 
              ? 'opacity-40' 
              : 'hover:bg-muted/50'
            }
          `}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}