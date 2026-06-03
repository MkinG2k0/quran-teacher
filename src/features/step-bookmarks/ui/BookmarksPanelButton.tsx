"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useFontSettings } from "@/features/font-settings";

import { useStepBookmarks } from "../model/use-step-bookmarks";
import { headerIconButtonStyle } from "./header-icon-button-styles";

interface BookmarksPanelButtonProps {
  onOpenBookmark: (stepId: number, scrollTop: number) => void;
}

export function BookmarksPanelButton({
  onOpenBookmark,
}: BookmarksPanelButtonProps) {
  const { px } = useFontSettings();
  const { bookmarks, removeBookmark } = useStepBookmarks();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSelect = (stepId: number, scrollTop: number) => {
    setOpen(false);
    onOpenBookmark(stepId, scrollTop);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Закладки"
        title="Закладки"
        className="font-body"
        style={{
          fontSize: px(12),
          color: "var(--quran-fg-secondary)",
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid var(--quran-panel-border)",
          background: "var(--quran-elevated)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Bookmark size={px(14)} strokeWidth={1.75} />
        Закладки
        {/* {bookmarks.length > 0 ? (
          <span
            style={{
              fontSize: px(10),
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: "var(--quran-accent)",
              color: "var(--quran-on-accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5px",
            }}
          >
            {bookmarks.length}
          </span>
        ) : null} */}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Список закладок"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "var(--quran-modal-overlay)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="font-body"
            style={{
              width: "100%",
              maxWidth: 480,
              maxHeight: "min(70vh, 520px)",
              background: "var(--quran-modal-bg)",
              border: "1px solid var(--quran-panel-border)",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 18px 12px",
                borderBottom: "1px solid var(--quran-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                className="font-display"
                style={{
                  fontSize: px(18),
                  fontWeight: 600,
                  color: "var(--quran-fg)",
                }}
              >
                Закладки
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                style={headerIconButtonStyle(px)}
              >
                ×
              </button>
            </div>

            <div style={{ overflowY: "auto", padding: "8px 12px 16px" }}>
              {bookmarks.length === 0 ? (
                <p
                  style={{
                    fontSize: px(13),
                    color: "var(--quran-fg-secondary)",
                    textAlign: "center",
                    padding: "24px 12px",
                    lineHeight: 1.5,
                  }}
                >
                  Пока нет закладок. В уроке нажмите иконку закладки справа от
                  номера шага.
                </p>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {bookmarks.map((bookmark) => (
                    <li
                      key={bookmark.id}
                      style={{
                        display: "flex",
                        alignItems: "stretch",
                        gap: 8,
                        borderRadius: 10,
                        border: "1px solid var(--quran-border)",
                        background: "var(--quran-elevated)",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleSelect(bookmark.stepId, bookmark.scrollTop)
                        }
                        style={{
                          flex: 1,
                          minWidth: 0,
                          textAlign: "left",
                          padding: "12px 14px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--quran-fg)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: px(10),
                            color: "var(--quran-fg-secondary)",
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          Шаг {bookmark.order}
                        </p>
                        <p
                          className="font-display"
                          style={{
                            fontSize: px(15),
                            fontWeight: 600,
                            lineHeight: 1.25,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {bookmark.title}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBookmark(bookmark.id)}
                        aria-label="Удалить закладку"
                        style={{
                          width: 44,
                          flexShrink: 0,
                          border: "none",
                          borderLeft: "1px solid var(--quran-border)",
                          background: "transparent",
                          color: "var(--quran-fg-secondary)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={px(16)} strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
