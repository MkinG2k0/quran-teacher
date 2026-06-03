"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type RefObject } from "react";

import type { StepDetail } from "@/entities/step";
import { FontSizePicker, useFontSettings } from "@/features/font-settings";
import { useCompleteStep } from "@/features/step-complete/model/use-complete-step";
import { isStepCompleted } from "@/shared/lib/student-progress-storage";
import { useStepWindowScroll } from "@/shared/lib/use-persisted-scroll";
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
  const { px } = useFontSettings();

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--quran-bg)",
        color: "var(--quran-fg)",
        position: "relative",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <GeomPattern opacity={0.035} />

      <header
        style={{
          position: "sticky",
          top: 0,
          padding: "20px 20px 14px",
          borderBottom: "1px solid var(--quran-border)",
          background: "var(--quran-header-bg)",
          backdropFilter: "blur(8px)",
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--quran-elevated)",
              border: "1px solid var(--quran-border-strong)",
              color: "var(--quran-fg-secondary)",
              cursor: "pointer",
              fontSize: px(14),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ←
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              className="font-body"
              style={{
                fontSize: px(10),
                color: "var(--quran-fg-secondary)",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Шаг {step.order} из {total}
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: px(18),
                fontWeight: 600,
                color: "var(--quran-fg)",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {step.title}
            </h1>
          </div>

          <FontSizePicker variant="compact" />
        </div>

        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: "var(--quran-progress-track)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(step.order / total) * 100}%`,
              background: "var(--quran-gradient-progress)",
            }}
          />
        </div>
      </header>

      <main
        style={{
          padding: "24px 20px 8px",
          position: "relative",
          zIndex: 1,
        }}
      >
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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {step.blocks.map((block, i) => (
            <div
              key={block.id ?? i}
              className="quran-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {block.type === "TEXT" && (
                <p
                  className="font-body"
                  style={{
                    fontSize: px(15),
                    lineHeight: 1.75,
                    color: "var(--quran-body-text)",
                    fontWeight: 300,
                  }}
                >
                  {block.value}
                </p>
              )}

              {block.type === "HEADING" && (
                <h2
                  className="font-display"
                  style={{
                    fontSize: px(20),
                    fontWeight: 600,
                    color: "var(--quran-fg)",
                    marginTop: 4,
                    paddingLeft: 12,
                    borderLeft: "2px solid var(--quran-accent)",
                  }}
                >
                  {block.value}
                </h2>
              )}

              {block.type === "IMAGE" && blockImageSrc(block) && (
                <div
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid var(--quran-border)",
                    background: "var(--quran-image-frame-bg)",
                  }}
                >
                  <Image
                    src={blockImageSrc(block)}
                    alt={block.caption ?? ""}
                    width={400}
                    height={200}
                    unoptimized
                    style={{
                      width: "100%",
                      display: "block",
                      maxHeight: 200,
                      objectFit: "contain",
                      padding: 20,
                    }}
                  />
                  {block.caption && (
                    <p
                      className="font-body"
                      style={{
                        fontSize: px(11),
                        color: "var(--quran-fg-secondary)",
                        textAlign: "center",
                        padding: "8px 16px 12px",
                        borderTop: "1px solid var(--quran-border)",
                        background: "var(--quran-image-caption-bg)",
                      }}
                    >
                      {block.caption}
                    </p>
                  )}
                </div>
              )}

              {block.type === "ARABIC" && (
                <div
                  style={{
                    background: "var(--quran-arabic-bg)",
                    border: "1px solid var(--quran-arabic-border)",
                    borderRadius: 12,
                    padding: 20,
                    textAlign: "center",
                  }}
                >
                  <p
                    className="font-display"
                    style={{
                      fontSize: px(32),
                      color: "var(--quran-accent)",
                      letterSpacing: 12,
                      marginBottom: 10,
                      direction: "rtl",
                      lineHeight: 1.6,
                    }}
                  >
                    {block.value}
                  </p>
                  {block.translation && (
                    <>
                      <div
                        style={{
                          width: 40,
                          height: 1,
                          background: "var(--quran-arabic-divider)",
                          margin: "0 auto 10px",
                        }}
                      />
                      <p
                        className="font-body"
                        style={{
                          fontSize: px(13),
                          color: "var(--quran-arabic-translation)",
                          letterSpacing: 4,
                        }}
                      >
                        {block.translation}
                      </p>
                    </>
                  )}
                </div>
              )}

              {block.type === "HIGHLIGHT" && (
                <div
                  style={{
                    background: "var(--quran-highlight-bg)",
                    border: "1px solid var(--quran-highlight-border)",
                    borderRadius: 10,
                    padding: "16px 16px 16px 14px",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      borderRadius: 2,
                      flexShrink: 0,
                      background: "var(--quran-gradient-accent)",
                      alignSelf: "stretch",
                      minHeight: 40,
                    }}
                  />
                  <p
                    className="font-body"
                    style={{
                      fontSize: px(13),
                      lineHeight: 1.65,
                      color: "var(--quran-highlight-text)",
                    }}
                  >
                    {block.value}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: "var(--quran-border)",
            margin: "28px 0",
          }}
        />

        <div style={{ paddingBottom: 32 }}>
          <button
            type="button"
            disabled={isPending}
            onClick={handleComplete}
            style={{
              width: "100%",
              padding: 16,
              border: "none",
              borderRadius: 12,
              color: "var(--quran-on-accent)",
              background: "var(--quran-gradient-accent)",
              cursor: isPending ? "default" : "pointer",
            }}
          >
            <span
              className="font-display"
              style={{ fontSize: px(16), fontWeight: 700 }}
            >
              {completed ? "✓ Шаг завершён" : "Завершить шаг"}
            </span>
          </button>
        </div>
      </main>

      {showDone && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "var(--quran-modal-overlay)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            className="quran-success-pop"
            style={{
              background: "var(--quran-modal-bg)",
              border: "1px solid var(--quran-row-current-border)",
              borderRadius: 20,
              padding: "36px 32px",
              textAlign: "center",
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 0 60px rgba(201,168,76,0.15)",
            }}
          >
            <div
              className="font-display"
              style={{
                fontSize: px(48),
                color: "var(--quran-accent)",
                marginBottom: 4,
              }}
            >
              ✓
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: px(26),
                fontWeight: 600,
                color: "var(--quran-fg)",
                marginBottom: 8,
              }}
            >
              Шаг пройден!
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: px(13),
                color: "var(--quran-fg-secondary)",
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Вы завершили шаг {step.order}.
              <br />
              Следующий шаг уже разблокирован.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => setShowDone(false)}
                className="font-body"
                style={{
                  flex: 1,
                  padding: 11,
                  background: "var(--quran-elevated)",
                  border: "1px solid var(--quran-border-strong)",
                  borderRadius: 10,
                  color: "var(--quran-fg-secondary)",
                  cursor: "pointer",
                  fontSize: px(13),
                }}
              >
                ← Назад
              </button>
              <button
                type="button"
                onClick={handleGoNext}
                className="font-display"
                style={{
                  flex: 2,
                  padding: 11,
                  background: "var(--quran-gradient-accent)",
                  border: "none",
                  borderRadius: 10,
                  color: "var(--quran-on-accent)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: px(14),
                }}
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
