"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { StepLessonView } from "@/widgets/step-lesson";

import { useStepNav } from "../model/step-nav-context";

export function StepNavOverlay() {
  const { activeStepId, openStep, closeStep } = useStepNav();
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!activeStepId) return;
    scrollRef.current?.scrollTo(0, 0);
  }, [activeStepId]);

  useEffect(() => {
    if (!activeStepId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeStepId]);

  if (!activeStepId) return null;

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[#0D1117]"
    >
      <StepLessonView
        stepId={activeStepId}
        scrollContainerRef={scrollRef}
        onClose={closeStep}
        onOpenStep={openStep}
      />
    </div>
  );
}
