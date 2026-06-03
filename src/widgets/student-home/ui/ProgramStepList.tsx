"use client";

import type { StepListItem } from "@/entities/step";
import { qColors, qText } from "@/shared/lib/quran-tailwind";
import { cn } from "@/shared/lib/utils";

import { ProgramStepPagination } from "./ProgramStepPagination";
import { ProgramStepRow } from "./ProgramStepRow";

interface ProgramStepListProps {
  steps: StepListItem[];
  page: number;
  totalPages: number;
  totalPublished: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSelectStep: (step: StepListItem) => void;
}

export function ProgramStepList({
  steps,
  page,
  totalPages,
  totalPublished,
  isLoading,
  onPageChange,
  onSelectStep,
}: ProgramStepListProps) {
  if (!isLoading && steps.length === 0 && totalPages <= 1) {
    return (
      <p
        className={cn(
          "font-body p-4 text-center",
          qText(12),
          qColors.fgMuted,
        )}
      >
        Шаги программы пока не опубликованы
      </p>
    );
  }

  const completedOnPage = steps.filter(
    (step) => step.status === "completed",
  ).length;

  return (
    <div className="flex flex-col gap-2">
      {totalPages > 1 && (
        <ProgramStepPagination
          page={page}
          totalPages={totalPages}
          totalPublished={totalPublished}
          onPageChange={onPageChange}
        />
      )}

      {isLoading ? (
        <p
          className={cn(
            "font-body p-6 text-center",
            qText(12),
            qColors.fgMuted,
          )}
        >
          Загрузка шагов...
        </p>
      ) : (
        <>
          {steps.length > 0 && (
            <p className={cn("font-body mb-1", qText(10), qColors.fgMuted)}>
              {completedOnPage} из {steps.length} пройдено в этом блоке
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            {steps.map((step) => (
              <ProgramStepRow
                key={step.id}
                step={step}
                onSelect={onSelectStep}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
