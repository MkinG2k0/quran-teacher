"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useFontSettings } from "@/features/font-settings";
import {
  headerIconButtonClass,
  qColors,
  qElevatedBtn,
  qModalOverlay,
  qModalPanel,
  qText,
} from "@/shared/lib/quran-tailwind";
import { cn } from "@/shared/lib/utils";

import { useStepBookmarks } from "../model/use-step-bookmarks";

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
        className={cn("font-body cursor-pointer", qElevatedBtn, qText(12))}
      >
        <Bookmark size={px(14)} strokeWidth={1.75} />
        Закладки
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Список закладок"
          className={qModalOverlay}
          onClick={() => setOpen(false)}
        >
          <div
            className={cn("font-body", qModalPanel)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--quran-border)] px-[18px] pt-4 pb-3">
              <h2
                className={cn(
                  "font-display font-semibold",
                  qText(18),
                  qColors.fg,
                )}
              >
                Закладки
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className={headerIconButtonClass()}
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto px-3 pt-2 pb-4">
              {bookmarks.length === 0 ? (
                <p
                  className={cn(
                    "px-3 py-6 text-center leading-normal",
                    qText(13),
                    qColors.fgSecondary,
                  )}
                >
                  Пока нет закладок. В уроке нажмите иконку закладки справа от
                  номера шага.
                </p>
              ) : (
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {bookmarks.map((bookmark) => (
                    <li
                      key={bookmark.id}
                      className="flex items-stretch gap-2 overflow-hidden rounded-[10px] border border-[var(--quran-border)] bg-[var(--quran-elevated)]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleSelect(bookmark.stepId, bookmark.scrollTop)
                        }
                        className={cn(
                          "min-w-0 flex-1 cursor-pointer border-none bg-transparent px-3.5 py-3 text-left",
                          qColors.fg,
                        )}
                      >
                        <p
                          className={cn(
                            "mb-1 tracking-wide uppercase",
                            qText(10),
                            qColors.fgSecondary,
                          )}
                        >
                          Шаг {bookmark.order}
                        </p>
                        <p
                          className={cn(
                            "font-display truncate font-semibold leading-tight",
                            qText(15),
                          )}
                        >
                          {bookmark.title}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBookmark(bookmark.id)}
                        aria-label="Удалить закладку"
                        className={cn(
                          "flex w-11 shrink-0 cursor-pointer items-center justify-center border-none border-l border-[var(--quran-border)] bg-transparent",
                          qColors.fgSecondary,
                        )}
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
