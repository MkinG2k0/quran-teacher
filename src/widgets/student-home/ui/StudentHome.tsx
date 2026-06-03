"use client";

import Link from "next/link";

import type { StepListItem } from "@/entities/step";
import { BookmarksPanelButton } from "@/features/step-bookmarks";
import { useFontSettings } from "@/features/font-settings";
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
  const { px } = useFontSettings();
  const progressPct =
    totalPublished > 0
      ? Math.round((completedCount / totalPublished) * 100)
      : 0;

  const handleStepClick = (step: StepListItem) => {
    onOpenStep(step);
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GeomPattern />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          padding: "12px 20px 0",
        }}
      >
        <BookmarksPanelButton onOpenBookmark={onOpenBookmark} />
        <Link
          href="/profile"
          prefetch
          className="font-body"
          aria-label="Профиль и настройки"
          style={{
            fontSize: px(12),
            color: "var(--quran-fg-secondary)",
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid var(--quran-panel-border)",
            background: "var(--quran-elevated)",
          }}
        >
          Настройки
        </Link>
      </div>
      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* <header
				style={{
					padding: '20px 24px 0',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					zIndex: 1,
				}}
			>
				<div>
					<p
						className="font-body"
						style={{
							color: '#6B6555',
							fontSize: 11,
							letterSpacing: 2,
							textTransform: 'uppercase',
							marginBottom: 2,
						}}
					>
						Ассаламу алейкум
					</p>
					<h1
						className="font-display"
						style={{ fontSize: 22, fontWeight: 600, color: '#E8E0D0' }}
					>
						{userName}
					</h1>
				</div>
			</header> */}
      {/* 
      <div
        className="font-display"
        style={{
          textAlign: "center",
          color: "#C9A84C",
          fontSize: 26,
          padding: "16px 0 8px",
          opacity: 0.7,
          letterSpacing: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        ﷽
      </div> */}

      <main
        style={{
          padding: "10px 20px 32px",
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "var(--quran-card-bg)",
            border: "1px solid var(--quran-card-border)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 12,
            }}
          >
            <div>
              <p
                className="font-body"
                style={{
                  fontSize: px(10),
                  color: "var(--quran-fg-subtle)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Общий прогресс
              </p>
              <p
                className="font-display"
                style={{
                  fontSize: px(36),
                  color: "var(--quran-accent)",
                  lineHeight: 1,
                }}
              >
                {completedCount}
                <span
                  style={{
                    fontSize: px(16),
                    color: "var(--quran-fg-subtle)",
                    marginLeft: 4,
                  }}
                >
                  / {totalPublished}
                </span>
              </p>
            </div>
            <p
              className="font-display"
              style={{
                fontSize: px(42),
                color: "var(--quran-accent)",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {progressPct}%
            </p>
          </div>
          <div
            style={{
              background: "var(--quran-progress-track)",
              borderRadius: 4,
              height: 6,
              overflow: "hidden",
            }}
          >
            <div
              className="quran-progress-fill"
              style={{ width: `${progressPct}%`, height: "100%" }}
            />
          </div>
          <p
            className="font-body"
            style={{
              fontSize: px(11),
              color: "var(--quran-fg-subtle)",
              marginTop: 8,
            }}
          >
            {totalPublished - completedCount} шагов до завершения программы
          </p>
        </div>

        {currentStep && (
          <div style={{ marginBottom: 24 }}>
            <button
              type="button"
              className="continue-btn"
              onClick={() => handleStepClick(currentStep)}
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--quran-gradient-accent)",
              }}
            >
              <div>
                <p
                  className="font-body"
                  style={{
                    fontSize: px(10),
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Продолжить
                </p>
                <p
                  className="font-display"
                  style={{
                    fontSize: px(17),
                    color: "var(--quran-on-accent)",
                    fontWeight: 700,
                  }}
                >
                  Шаг {currentStep.order} — {currentStep.title}
                </p>
                {currentStep.subtitle && (
                  <p
                    className="font-body"
                    style={{
                      fontSize: px(12),
                      color: "rgba(0,0,0,0.45)",
                      marginTop: 2,
                    }}
                  >
                    {currentStep.subtitle}
                  </p>
                )}
              </div>
              <span
                style={{
                  fontSize: px(20),
                  color: "var(--quran-on-accent)",
                  opacity: 0.6,
                }}
              >
                →
              </span>
            </button>
          </div>
        )}

        <div>
          <p
            className="font-body"
            style={{
              fontSize: px(10),
              color: "var(--quran-fg-secondary)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
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
