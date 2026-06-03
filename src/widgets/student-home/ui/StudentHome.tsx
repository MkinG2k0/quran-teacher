"use client";

import Link from "next/link";

import type { StepListItem } from "@/entities/step";
import { BookmarksPanelButton } from "@/features/step-bookmarks";
import {
	qCard,
	qColors,
	qElevatedBtn,
	qGradientAccent,
	qProgressFill,
	qProgressTrack,
	qShell,
	qText,
} from "@/shared/lib/quran-tailwind";
import { cn } from "@/shared/lib/utils";
import { GeomPattern } from "@/shared/ui/geom-pattern";

import { ProgramStepList } from "./ProgramStepList";

interface StudentHomeProps {
  userName: string;
  totalPublished: number;
  completedCount: number;
  currentStep: StepListItem | null;
  steps: StepListItem[];
  page: number;
  totalPages: number;
  isLoadingSteps: boolean;
  onPageChange: (page: number) => void;
  onOpenStep: (step: StepListItem) => void;
  onOpenBookmark: (stepId: number, scrollTop: number) => void;
}

export function StudentHome({
  userName,
  totalPublished,
  completedCount,
  currentStep,
  steps,
  page,
  totalPages,
  isLoadingSteps,
  onPageChange,
  onOpenStep,
  onOpenBookmark,
}: StudentHomeProps) {
  const progressPct =
    totalPublished > 0
      ? Math.round((completedCount / totalPublished) * 100)
      : 0;

  const handleStepClick = (step: StepListItem) => {
    onOpenStep(step);
  };

  return (
    <div className={qShell}>
      <GeomPattern />
      <div className="relative z-[2] flex items-center justify-between gap-2 px-5 pt-3">
        <BookmarksPanelButton onOpenBookmark={onOpenBookmark} />
        <Link
          href="/profile"
          prefetch
          className={cn("font-body", qElevatedBtn, qText(12))}
          aria-label="Профиль и настройки"
        >
          Настройки
        </Link>
      </div>
      <div
        className="pointer-events-none absolute -top-[200px] -right-[200px] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06)_0%,transparent_70%)]"
        aria-hidden
      />

      <main className="relative z-[1] mx-auto max-w-[480px] px-5 pt-2.5 pb-8">
        <div className={cn(qCard, "mb-4")}>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p
                className={cn(
                  "font-body mb-1 tracking-[0.2em] uppercase",
                  qText(10),
                  qColors.fgSubtle,
                )}
              >
                Общий прогресс
              </p>
              <p className={cn("font-display leading-none", qText(36), qColors.accent)}>
                {completedCount}
                <span className={cn("ml-1", qText(16), qColors.fgSubtle)}>
                  / {totalPublished}
                </span>
              </p>
            </div>
            <p
              className={cn(
                "font-display leading-none font-bold",
                qText(42),
                qColors.accent,
              )}
            >
              {progressPct}%
            </p>
          </div>
          <div className={qProgressTrack}>
            <div
              className={qProgressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className={cn("font-body mt-2", qText(11), qColors.fgSubtle)}>
            {totalPublished - completedCount} шагов до завершения программы
          </p>
        </div>

        {currentStep && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleStepClick(currentStep)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-xl border-none px-5 py-4 text-left",
                qGradientAccent,
              )}
            >
              <div>
                <p
                  className={cn(
                    "font-body mb-1 tracking-[0.2em] uppercase text-black/50",
                    qText(10),
                  )}
                >
                  Продолжить
                </p>
                <p
                  className={cn(
                    "font-display font-bold",
                    qText(17),
                    qColors.onAccent,
                  )}
                >
                  Шаг {currentStep.order} — {currentStep.title}
                </p>
                {currentStep.subtitle && (
                  <p
                    className={cn(
                      "font-body mt-0.5 text-black/45",
                      qText(12),
                    )}
                  >
                    {currentStep.subtitle}
                  </p>
                )}
              </div>
              <span className={cn(qText(20), qColors.onAccent, "opacity-60")}>
                →
              </span>
            </button>
          </div>
        )}

        <div>
          <p
            className={cn(
              "font-body mb-3 tracking-[0.2em] uppercase",
              qText(10),
              qColors.fgSecondary,
            )}
          >
            Программа обучения
          </p>

          <ProgramStepList
            steps={steps}
            page={page}
            totalPages={totalPages}
            totalPublished={totalPublished}
            isLoading={isLoadingSteps}
            onPageChange={onPageChange}
            onSelectStep={handleStepClick}
          />
        </div>
      </main>
    </div>
  );
}
