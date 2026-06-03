"use client";

import { GeomPattern } from "@/shared/ui/geom-pattern";
import { qText } from "@/shared/lib/quran-tailwind";
import { cn } from "@/shared/lib/utils";

import { useAdminLogin } from "../model/use-admin-login";

export function AccessCodeLogin() {
  const { password, status, shake, handleSubmit, handlePasswordChange } =
    useAdminLogin();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0D1117] p-6">
      <GeomPattern />

      <div
        className="pointer-events-none absolute top-[20%] left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.04)_0%,transparent_70%)]"
        aria-hidden
      />

      {status === "success" ? (
        <div className="quran-success-pop max-w-[300px] text-center">
          <div
            className={cn(
              "font-display mb-2 leading-none text-[#78C040]",
              qText(64),
            )}
          >
            ✓
          </div>
          <h2
            className={cn(
              "font-display mb-2 font-semibold text-[#E8E0D0]",
              qText(30),
            )}
          >
            Добро пожаловать!
          </h2>
          <p
            className={cn(
              "font-body leading-relaxed text-[var(--quran-fg-secondary)]",
              qText(13),
            )}
          >
            Переходим в панель администратора...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[360px] text-center"
        >
          <div
            className={cn(
              "font-display quran-fade-up mb-7 tracking-[0.5em] text-[#C9A84C] opacity-50",
              qText(36),
            )}
          >
            ﷽
          </div>

          <h1
            className={cn(
              "font-display quran-fade-up mb-2 font-semibold text-[#E8E0D0]",
              qText(32),
            )}
          >
            Вход администратора
          </h1>
          <p
            className={cn(
              "font-body quran-fade-up mb-9 leading-relaxed text-[var(--quran-fg-secondary)]",
              qText(13),
            )}
          >
            Введите пароль для доступа к управлению материалами
          </p>

          <div className={shake ? "quran-shake" : ""}>
            <input
              className={cn(
                "quran-fade-up font-body mb-4 w-full rounded-xl px-4 py-3.5 text-[#E8E0D0] outline-none caret-[#C9A84C] bg-[#0F0F0F]",
                qText(15),
                status === "error"
                  ? "border border-[#8B2020]"
                  : "border border-[#1E1E1E]",
              )}
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Пароль"
              autoComplete="current-password"
            />
          </div>

          <div className="mb-5 flex h-5 items-center justify-center">
            {status === "checking" && <span className="quran-spinner" />}
            {status === "error" && (
              <p
                className={cn(
                  "font-body tracking-wide text-[#8B2020]",
                  qText(12),
                )}
              >
                Неверный пароль. Попробуйте снова.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password.trim() || status === "checking"}
            className={cn(
              "font-body quran-fade-up w-full rounded-xl px-5 py-3.5 font-semibold text-[#0D1117]",
              qText(14),
              password.trim() && status !== "checking"
                ? "cursor-pointer bg-[linear-gradient(135deg,#8B6914,#C9A84C)] opacity-100"
                : "cursor-not-allowed bg-[#2A2418] opacity-50",
            )}
          >
            {status === "checking" ? "Проверяем..." : "Войти"}
          </button>
        </form>
      )}
    </div>
  );
}
