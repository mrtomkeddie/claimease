'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'stagger' | 'on-appear';
  delay?: number;
  threshold?: number;
  rootMargin?: string;
}

export function AnimatedSection({
  children,
  className,
  animation = 'on-appear',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={cn(
        `animate-${animation}`,
        isIntersecting && 'animate-in',
        className
      )}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}