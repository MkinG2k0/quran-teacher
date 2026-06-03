"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";

import type { StepDetail } from "@/entities/step";
import { AddStepBookmarkButton } from "@/features/step-bookmarks";
import { useCompleteStep } from "@/features/step-complete/model/use-complete-step";
import { isStepCompleted } from "@/shared/lib/student-progress-storage";
import {
  headerIconButtonClass,
  qColors,
  qGradientAccent,
  qProgressTrack,
  qShell,
  qText,
} from "@/shared/lib/quran-tailwind";
import { useStepWindowScroll } from "@/shared/lib/use-persisted-scroll";
import { cn } from "@/shared/lib/utils";
import { GeomPattern } from "@/shared/ui/geom-pattern";

interface StepReaderProps {
  step: StepDetail;
  nextStepId: number | null;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  onClose?: () => void;
  onOpenStep?: (stepId: number) => void;
}

function blockImageSrc(block: StepDetail["blocks"][number]) {
  return block.imageUrl ?? block.src ?? "";
}

export function StepReader({
  step,
  nextStepId,
  scrollContainerRef,
  onClose,
  onOpenStep,
}: StepReaderProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) onClose();
    else router.push("/");
  };

  const handleGoNext = () => {
    setShowDone(false);
    if (nextStepId) {
      if (onOpenStep) onOpenStep(nextStepId);
      else router.push(`/step/${nextStepId}`);
    } else {
      handleClose();
    }
  };

  const [completed, setCompleted] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const { completeStep, isPending } = useCompleteStep();

  const total = step.totalPublished ?? step.order;

  useStepWindowScroll(step.id, scrollContainerRef);

  useEffect(() => {
    setShowDone(false);
    setCompleted(isStepCompleted(step.id));
  }, [step.id]);

  const handleComplete = async () => {
    if (isPending) return;
    const ok = await completeStep(step.id);
    if (!ok) return;
    setCompleted(true);
    setShowDone(true);
  };

  const progressPct = (step.order / total) * 100;

  return (
    <div className={cn(qShell, "mx-auto max-w-[480px]")}>
      <GeomPattern opacity={0.035} />

      <header className="sticky top-0 z-20 border-b border-[var(--quran-border)] bg-[var(--quran-header-bg)] px-5 pt-5 pb-3.5 backdrop-blur-[8px]">
        <div className="mb-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className={cn(headerIconButtonClass(), qText(14))}
          >
            ←
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <p
                className={cn(
                  "font-body m-0 min-w-0 flex-1 tracking-[2px] uppercase",
                  qText(10),
                  qColors.fgSecondary,
                )}
              >
                Шаг {step.order} из {total}
              </p>
              <AddStepBookmarkButton
                stepId={step.id}
                order={step.order}
                title={step.title}
              />
            </div>
            <h1
              className={cn(
                "font-display truncate font-semibold leading-tight",
                qText(18),
                qColors.fg,
              )}
            >
              {step.title}
            </h1>
          </div>
        </div>

        <div className={cn(qProgressTrack, "h-[3px] rounded-sm")}>
          <div
            className="h-full bg-[image:var(--quran-gradient-progress)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <main className="relative z-1 px-5 pt-6 pb-2">
        {/* <div
          className="font-display quran-fade-up"
          style={{
            textAlign: "center",
            color: "#C9A84C",
            fontSize: 22,
            marginBottom: 24,
            opacity: 0.5,
            letterSpacing: 6,
          }}
        >
          ـ ﴾ ﴿ ـ
        </div> */}

        <div className="flex flex-col gap-5">
          {step.blocks.map((block, i) => (
            <div
              key={block.id ?? i}
              className="quran-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {block.type === "TEXT" && (
                <p
                  className={cn(
                    "font-body font-light leading-[1.75]",
                    qText(15),
                    qColors.body,
                  )}
                >
                  {block.value}
                </p>
              )}

              {block.type === "HEADING" && (
                <h2
                  className={cn(
                    "font-display mt-1 border-l-2 border-[var(--quran-accent)] pl-3 font-semibold",
                    qText(20),
                    qColors.fg,
                  )}
                >
                  {block.value}
                </h2>
              )}

              {block.type === "IMAGE" && blockImageSrc(block) && (
                <div className="overflow-hidden rounded-[10px] border border-[var(--quran-border)] bg-[var(--quran-image-frame-bg)]">
                  <Image
                    src={blockImageSrc(block)}
                    alt={block.caption ?? ""}
                    width={400}
                    height={200}
                    unoptimized
                    className="block w-full max-h-[200px] object-contain p-5"
                  />
                  {block.caption && (
                    <p
                      className={cn(
                        "font-body border-t border-[var(--quran-border)] bg-[var(--quran-image-caption-bg)] px-4 pt-2 pb-3 text-center",
                        qText(11),
                        qColors.fgSecondary,
                      )}
                    >
                      {block.caption}
                    </p>
                  )}
                </div>
              )}

              {block.type === "ARABIC" && (
                <div className="rounded-xl border border-[var(--quran-arabic-border)] bg-[image:var(--quran-arabic-bg)] p-5 text-center">
                  <p
                    className={cn(
                      "font-display mb-2.5 leading-[1.6] tracking-[12px] [direction:rtl]",
                      qText(32),
                      qColors.accent,
                    )}
                  >
                    {block.value}
                  </p>
                  {block.translation && (
                    <>
                      <div className="mx-auto mb-2.5 h-px w-10 bg-[var(--quran-arabic-divider)]" />
                      <p
                        className={cn(
                          "font-body tracking-[4px] text-[var(--quran-arabic-translation)]",
                          qText(13),
                        )}
                      >
                        {block.translation}
                      </p>
                    </>
                  )}
                </div>
              )}

              {block.type === "HIGHLIGHT" && (
                <div className="flex items-start gap-3 rounded-[10px] border border-[var(--quran-highlight-border)] bg-[image:var(--quran-highlight-bg)] py-4 pr-4 pl-3.5">
                  <div className="min-h-10 w-[3px] shrink-0 self-stretch rounded-sm bg-[image:var(--quran-gradient-accent)]" />
                  <p
                    className={cn(
                      "font-body leading-[1.65] text-[var(--quran-highlight-text)]",
                      qText(13),
                    )}
                  >
                    {block.value}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="my-7 h-px bg-[var(--quran-border)]" />

        <div className="pb-8">
          <button
            type="button"
            disabled={isPending}
            onClick={handleComplete}
            className={cn(
              "w-full cursor-pointer rounded-xl border-none p-4",
              qGradientAccent,
              qColors.onAccent,
              isPending && "cursor-default",
            )}
          >
            <span className={cn("font-display font-bold", qText(16))}>
              {completed ? "✓ Шаг завершён" : "Завершить шаг"}
            </span>
          </button>
        </div>
      </main>

      {showDone && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--quran-modal-overlay)] p-6 backdrop-blur-md">
          <div
            className={cn(
              "quran-success-pop w-full max-w-[400px] rounded-[20px] border border-[var(--quran-row-current-border)] bg-[image:var(--quran-modal-bg)] px-8 py-9 text-center shadow-[0_0_60px_rgba(201,168,76,0.15)]",
            )}
          >
            <div
              className={cn("font-display mb-1", qText(48), qColors.accent)}
            >
              ✓
            </div>
            <h2
              className={cn(
                "font-display mb-2 font-semibold",
                qText(26),
                qColors.fg,
              )}
            >
              Шаг пройден!
            </h2>
            <p
              className={cn(
                "font-body mb-6 leading-[1.6]",
                qText(13),
                qColors.fgSecondary,
              )}
            >
              Вы завершили шаг {step.order}.
              <br />
              Следующий шаг уже разблокирован.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDone(false)}
                className={cn(
                  "font-body flex-1 cursor-pointer rounded-[10px] border px-[11px] py-[11px]",
                  qColors.borderStrong,
                  qColors.elevated,
                  qColors.fgSecondary,
                  qText(13),
                )}
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={handleGoNext}
                className={cn(
                  "font-display flex-[2] cursor-pointer rounded-[10px] border-none px-[11px] py-[11px] font-bold",
                  qGradientAccent,
                  qColors.onAccent,
                  qText(14),
                )}
              >
                {nextStepId ? "Следующий шаг →" : "На главную →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
