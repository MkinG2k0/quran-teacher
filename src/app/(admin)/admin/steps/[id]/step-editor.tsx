"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  adminButtonSecondary,
  adminCard,
  adminField,
  adminSelectContent,
} from "../../admin-ui";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

const BLOCK_TYPES = [
  "TEXT",
  "HEADING",
  "IMAGE",
  "ARABIC",
  "HIGHLIGHT",
] as const;

interface BlockDraft {
  type: (typeof BLOCK_TYPES)[number];
  value: string;
  imageUrl: string;
  caption: string;
  translation: string;
}

interface StepEditorProps {
  step: {
    id: number;
    title: string;
    subtitle: string | null;
    isPublished: boolean;
    blocks: {
      type: string;
      value: string | null;
      imageUrl: string | null;
      caption: string | null;
      translation: string | null;
    }[];
  };
}

export function StepEditor({ step }: StepEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(step.title);
  const [subtitle, setSubtitle] = useState(step.subtitle ?? "");
  const [isPublished, setIsPublished] = useState(step.isPublished);
  const [blocks, setBlocks] = useState<BlockDraft[]>(
    step.blocks.map((b) => ({
      type: b.type as BlockDraft["type"],
      value: b.value ?? "",
      imageUrl: b.imageUrl ?? "",
      caption: b.caption ?? "",
      translation: b.translation ?? "",
    })),
  );
  const [isPending, setIsPending] = useState(false);

  const updateBlock = (index: number, patch: Partial<BlockDraft>) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    );
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= blocks.length) return;
    setBlocks((prev) => {
      const copy = [...prev];
      const tmp = copy[index];
      copy[index] = copy[next];
      copy[next] = tmp;
      return copy;
    });
  };

  const handleUpload = async (index: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.imageUrl) updateBlock(index, { imageUrl: data.imageUrl });
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/steps/${step.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle: subtitle || null,
          isPublished,
          blocks: blocks.map((b) => ({
            type: b.type,
            value: b.value || null,
            imageUrl: b.imageUrl || null,
            caption: b.caption || null,
            translation: b.translation || null,
          })),
        }),
      });
      if (res.ok) router.push("/admin");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={adminCard}>
        <CardHeader>
          <CardTitle className="font-display text-lg">Основное</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Заголовок</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(adminField, "mt-1")}
            />
          </div>
          <div>
            <Label>Подзаголовок</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={cn(adminField, "mt-1")}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#E8E0D0]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Опубликован
          </label>
        </CardContent>
      </Card>

      {blocks.map((block, i) => (
        <Card key={i} className={adminCard}>
          <CardHeader className="flex flex-row items-center justify-between mb-1">
            <CardTitle className="text-sm">Блок {i + 1}</CardTitle>
            <div className="flex gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => moveBlock(i, -1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => moveBlock(i, 1)}
              >
                ↓
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={block.type}
              onValueChange={(v) =>
                updateBlock(i, { type: v as BlockDraft["type"] })
              }
            >
              <SelectTrigger className={cn(adminField, "w-full")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={adminSelectContent}>
                {BLOCK_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(block.type === "TEXT" ||
              block.type === "HEADING" ||
              block.type === "ARABIC" ||
              block.type === "HIGHLIGHT") && (
              <Textarea
                value={block.value}
                onChange={(e) => updateBlock(i, { value: e.target.value })}
                className={adminField}
              />
            )}

            {block.type === "ARABIC" && (
              <Input
                placeholder="Перевод"
                value={block.translation}
                onChange={(e) =>
                  updateBlock(i, { translation: e.target.value })
                }
                className={adminField}
              />
            )}

            {block.type === "IMAGE" && (
              <>
                <Input
                  placeholder="URL изображения"
                  value={block.imageUrl}
                  onChange={(e) => updateBlock(i, { imageUrl: e.target.value })}
                  className={adminField}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUpload(i, f);
                  }}
                />
                <Input
                  placeholder="Подпись"
                  value={block.caption}
                  onChange={(e) => updateBlock(i, { caption: e.target.value })}
                  className={adminField}
                />
              </>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className={adminButtonSecondary}
        onClick={() =>
          setBlocks((prev) => [
            ...prev,
            {
              type: "TEXT",
              value: "",
              imageUrl: "",
              caption: "",
              translation: "",
            },
          ])
        }
      >
        + Блок
      </Button>

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Сохраняем..." : "Сохранить"}
      </Button>
    </div>
  );
}
