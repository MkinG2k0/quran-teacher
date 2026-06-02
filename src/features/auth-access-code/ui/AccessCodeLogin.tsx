"use client";

import { GeomPattern } from "@/shared/ui/geom-pattern";

import { useAdminLogin } from "../model/use-admin-login";

export function AccessCodeLogin() {
  const { password, status, shake, handleSubmit, handlePasswordChange } =
    useAdminLogin();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0D1117",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      <GeomPattern />

      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {status === "success" ? (
        <div
          className="quran-success-pop"
          style={{ textAlign: "center", maxWidth: "300px" }}
        >
          <div
            className="font-display"
            style={{
              fontSize: "64px",
              color: "#78C040",
              marginBottom: "8px",
              lineHeight: 1,
            }}
          >
            ✓
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "30px",
              fontWeight: 600,
              color: "#E8E0D0",
              marginBottom: "8px",
            }}
          >
            Добро пожаловать!
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: "13px",
              color: "var(--quran-fg-secondary)",
              lineHeight: 1.7,
            }}
          >
            Переходим в панель администратора...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "360px", textAlign: "center" }}
        >
          <div
            className="font-display quran-fade-up"
            style={{
              fontSize: "36px",
              color: "#C9A84C",
              opacity: 0.5,
              letterSpacing: "8px",
              marginBottom: "28px",
            }}
          >
            ﷽
          </div>

          <h1
            className="font-display quran-fade-up"
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#E8E0D0",
              marginBottom: "8px",
            }}
          >
            Вход администратора
          </h1>
          <p
            className="font-body quran-fade-up"
            style={{
              fontSize: "13px",
              color: "var(--quran-fg-secondary)",
              lineHeight: 1.6,
              marginBottom: "36px",
            }}
          >
            Введите пароль для доступа к управлению материалами
          </p>

          <div className={shake ? "quran-shake" : ""}>
            <input
              className="quran-fade-up font-body"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Пароль"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: 15,
                color: "#E8E0D0",
                borderRadius: 12,
                outline: "none",
                caretColor: "#C9A84C",
                background: "#0F0F0F",
                border: `1px solid ${status === "error" ? "#8B2020" : "#1E1E1E"}`,
                marginBottom: 16,
              }}
            />
          </div>

          <div
            style={{
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {status === "checking" && <span className="quran-spinner" />}
            {status === "error" && (
              <p
                className="font-body"
                style={{ fontSize: 12, color: "#8B2020", letterSpacing: 1 }}
              >
                Неверный пароль. Попробуйте снова.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password.trim() || status === "checking"}
            className="font-body quran-fade-up"
            style={{
              width: "100%",
              padding: "14px 20px",
              border: "none",
              borderRadius: 12,
              cursor: password.trim() ? "pointer" : "not-allowed",
              fontSize: 14,
              fontWeight: 600,
              color: "#0D1117",
              background:
                password.trim() && status !== "checking"
                  ? "linear-gradient(135deg, #8B6914, #C9A84C)"
                  : "#2A2418",
              opacity: password.trim() && status !== "checking" ? 1 : 0.5,
            }}
          >
            {status === "checking" ? "Проверяем..." : "Войти"}
          </button>
        </form>
      )}
    </div>
  );
}
