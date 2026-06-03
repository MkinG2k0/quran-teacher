"use client";

import { qColors, qText } from "@/shared/lib/quran-tailwind";
import { cn } from "@/shared/lib/utils";

import { formatSectionRange, STEPS_PER_SECTION } from "../lib/step-sections";

interface ProgramStepPaginationProps {
  page: number;
  totalPages: number;
  totalPublished: number;
  onPageChange: (page: number) => void;
}

export function ProgramStepPagination({
  page,
  totalPages,
  totalPublished,
  onPageChange,
}: ProgramStepPaginationProps) {
  const rangeLabel = formatSectionRange(
    page - 1,
    STEPS_PER_SECTION,
    totalPublished,
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const handlePrev = () => {
    if (canGoPrev) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (canGoNext) onPageChange(page + 1);
  };

  const navBtnClass = (enabled: boolean) =>
    cn(
      "size-9 rounded-lg border border-[var(--quran-panel-border)]",
      qText(16),
      enabled
        ? "cursor-pointer bg-[var(--quran-pagination-active-bg)] text-[var(--quran-accent)]"
        : cn("cursor-default bg-transparent", qColors.fgDisabled),
    );

  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--quran-border)] bg-[var(--quran-pagination-bg)] px-3 py-2.5">
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Предыдущий блок"
        className={navBtnClass(canGoPrev)}
      >
        ←
      </button>

      <div className="min-w-0 text-center">
        <p className={cn("font-body font-semibold", qText(12), qColors.fg)}>
          {rangeLabel}
        </p>
        <p className={cn("font-body mt-0.5", qText(10), qColors.fgMuted)}>
          Блок {page} из {totalPages}
        </p>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Следующий блок"
        className={navBtnClass(canGoNext)}
      >
        →
      </button>
    </div>
  );
}
