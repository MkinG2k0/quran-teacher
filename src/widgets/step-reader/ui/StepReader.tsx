"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { StepDetail } from "@/entities/step";
import { useCompleteStep } from "@/features/step-complete/model/use-complete-step";
import { isStepCompleted } from "@/shared/lib/student-progress-storage";
import { useStepWindowScroll } from "@/shared/lib/use-persisted-scroll";
import { GeomPattern } from "@/shared/ui/geom-pattern";

interface StepReaderProps {
  step: StepDetail;
  nextStepId: number | null;
  onClose?: () => void;
  onOpenStep?: (stepId: number) => void;
}

function blockImageSrc(block: StepDetail["blocks"][number]) {
  return block.imageUrl ?? block.src ?? "";
}

export function StepReader({
  step,
  nextStepId,
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

  useStepWindowScroll(step.id);

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
        background: "#0D1117",
        color: "#E8E0D0",
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
          borderBottom: "1px solid #181818",
          background: "rgba(13,17,23,0.95)",
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
              background: "#141414",
              border: "1px solid #222",
              color: "#6B6555",
              cursor: "pointer",
              fontSize: 14,
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
                fontSize: 10,
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
                fontSize: 18,
                fontWeight: 600,
                color: "#E8E0D0",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {step.title}
            </h1>
          </div>
        </div>

        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: "#1A1A1A",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(step.order / total) * 100}%`,
              background: "linear-gradient(90deg, #4A7A30, #C9A84C)",
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
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "#C0B8A8",
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
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#E8E0D0",
                    marginTop: 4,
                    paddingLeft: 12,
                    borderLeft: "2px solid #C9A84C",
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
                    border: "1px solid #1E1E1E",
                    background: "#F5F0E8",
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
                        fontSize: 11,
                        color: "var(--quran-fg-secondary)",
                        textAlign: "center",
                        padding: "8px 16px 12px",
                        borderTop: "1px solid #1A1A1A",
                        background: "#0F0F0F",
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
                    background: "linear-gradient(135deg, #0F140A, #141A0E)",
                    border: "1px solid #2A3420",
                    borderRadius: 12,
                    padding: 20,
                    textAlign: "center",
                  }}
                >
                  <p
                    className="font-display"
                    style={{
                      fontSize: 32,
                      color: "#C9A84C",
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
                          background: "#2A3420",
                          margin: "0 auto 10px",
                        }}
                      />
                      <p
                        className="font-body"
                        style={{
                          fontSize: 13,
                          color: "#6A7A58",
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
                    background: "linear-gradient(135deg, #1A1208, #201808)",
                    border: "1px solid #3A2E10",
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
                      background: "linear-gradient(180deg, #C9A84C, #8B6914)",
                      alignSelf: "stretch",
                      minHeight: 40,
                    }}
                  />
                  <p
                    className="font-body"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "#A89870",
                    }}
                  >
                    {block.value}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#181818", margin: "28px 0" }} />

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
              color: "#0D1117",
              background: "linear-gradient(135deg, #8B6914, #C9A84C)",
              cursor: isPending ? "default" : "pointer",
            }}
          >
            <span
              className="font-display"
              style={{ fontSize: 16, fontWeight: 700 }}
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
            background: "rgba(13,17,23,0.92)",
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
              background: "linear-gradient(135deg, #131A10, #1A2010)",
              border: "1px solid rgba(201,168,76,0.3)",
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
              style={{ fontSize: 48, color: "#C9A84C", marginBottom: 4 }}
            >
              ✓
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#E8E0D0",
                marginBottom: 8,
              }}
            >
              Шаг пройден!
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: 13,
                color: "#6B6555",
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
                  background: "#141414",
                  border: "1px solid #222",
                  borderRadius: 10,
                  color: "#6B6555",
                  cursor: "pointer",
                  fontSize: 13,
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
                  background: "linear-gradient(135deg, #8B6914, #C9A84C)",
                  border: "none",
                  borderRadius: 10,
                  color: "#0D1117",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14,
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
