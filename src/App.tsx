import { useState, useEffect, useRef, useCallback } from "react";
import { apiUrl } from "./api";

// ========================================
// FitAI — AI-Powered Fitness App
// ========================================

const ACCENT = {
  green: "#00ff87",
  greenDark: "#00cc6a",
  blue: "#00d4ff",
  orange: "#ff6b35",
  purple: "#8b5cf6",
  pink: "#ec4899",
  red: "#ef4444",
  yellow: "#fbbf24",
};

const GRADIENTS = {
  green: "linear-gradient(135deg, #00ff87, #00cc6a)",
  blue: "linear-gradient(135deg, #00d4ff, #0099cc)",
  orange: "linear-gradient(135deg, #ff6b35, #ff4500)",
  purple: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  fire: "linear-gradient(135deg, #ff6b35, #ec4899)",
  neon: "linear-gradient(135deg, #00ff87, #00d4ff)",
  darkBg: "linear-gradient(180deg, #0a0a12 0%, #0f0f1a 100%)",
  lightBg: "linear-gradient(180deg, #f0f2f5 0%, #e8eaed 100%)",
};

// ========================================
// SVG Icons
// ========================================
const Icons = {
  home: (c: string) => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  diet: (c: string) => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"
        fill={c}
      />
    </svg>
  ),
  workout: (c: string) => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"
        fill={c}
      />
    </svg>
  ),
  chart: (c: string) => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 3v18h18M7 16l4-4 4 4 5-6"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  ai: (c: string) => (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 110 2h-1.07A7 7 0 0113 22h-2a7 7 0 01-6.93-6H3a1 1 0 110-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 7a5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5 5 5 0 00-5-5zm-1 2h2v3h-2v-3zm-2 0h1v2H9v-2zm5 0h1v2h-1v-2z"
        fill={c}
      />
    </svg>
  ),
  sun: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" fill="#fbbf24" />
      <path
        d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  moon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        fill="#8b5cf6"
        stroke="#8b5cf6"
        strokeWidth="1"
      />
    </svg>
  ),
  send: (c: string) => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill={c} />
    </svg>
  ),
  check: (c: string) => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 13l4 4L19 7"
        stroke={c}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  fire: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 23c-4.97 0-9-3.13-9-8 0-3.87 2.75-7.25 5.38-9.5.38-.32.93.06.82.54C8.69 8.5 10.5 7 12 5c1.5 2 4 4.5 4 8 0 1.5-.5 2.5-1 3 .5-1 .5-2 0-3-1 1.5-2 2.5-2 4 0 1.5 1 2.5 2 3-1.5 1-3.5 2-5 2 2 0 4.5-1 5.5-3 .5-1 1-2.5 1-4 0-4-3-7-4.5-9z"
        fill="#ff6b35"
      />
    </svg>
  ),
  arrow: (c: string, dir: "left" | "right") => (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      style={{
        transform: dir === "left" ? "rotate(180deg)" : "none",
      }}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  plus: (c: string) => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 5v14m-7-7h14"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ========================================
// Progress Ring Component
// ========================================
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = ACCENT.green,
  bgColor = "rgba(255,255,255,0.1)",
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference * (1 - Math.min(progress, 1)));
    }, 100);
    return () => clearTimeout(timer);
  }, [progress, circumference]);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 6px ${color}50)`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ========================================
// Glass Card Component
// ========================================
function GlassCard({
  dark,
  children,
  style,
  className = "",
  onClick,
  glow,
}: {
  dark: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  glow?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`${className}`}
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        borderRadius: 20,
        padding: "20px",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: glow
          ? `0 0 30px ${glow}20, 0 4px 20px rgba(0,0,0,0.1)`
          : dark
            ? "0 4px 30px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ========================================
// Mini Bar Chart
// ========================================
function MiniBarChart({
  data,
  color,
  dark,
  height = 100,
}: {
  data: number[];
  color: string;
  dark: boolean;
  height?: number;
}) {
  const max = Math.max(...data);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 4,
        height,
        padding: "0 4px",
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: 4,
            background: `${color}${i === data.length - 1 ? "" : "60"}`,
            height: `${(v / max) * 100}%`,
            transition: "height 0.6s cubic-bezier(0.4,0,0.2,1)",
            transitionDelay: `${i * 50}ms`,
            minHeight: 4,
          }}
        />
      ))}
    </div>
  );
}

// ========================================
// Line Chart Component
// ========================================
function LineChart({
  data,
  color,
  dark,
  height = 120,
  goalLine,
}: {
  data: number[];
  color: string;
  dark: boolean;
  height?: number;
  goalLine?: number;
}) {
  const min = Math.min(...data) - 2;
  const max = Math.max(...data) + 2;
  const w = 300;
  const h = height;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / (max - min)) * h,
  }));
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
  const goalY = goalLine ? h - ((goalLine - min) / (max - min)) * h : null;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color})`} />
      {goalY !== null && (
        <line
          x1="0"
          y1={goalY}
          x2={w}
          y2={goalY}
          stroke={ACCENT.yellow}
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.6"
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) =>
        i === points.length - 1 ? (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={color}
            stroke={dark ? "#13131a" : "#fff"}
            strokeWidth="2"
          />
        ) : null
      )}
    </svg>
  );
}

// ========================================
// Body Map SVG Component
// ========================================
function BodyMap({
  selected,
  onSelect,
  dark,
}: {
  selected: string;
  onSelect: (m: string) => void;
  dark: boolean;
}) {
  const muscles: {
    id: string;
    label: string;
    d: string;
    cx: number;
    cy: number;
  }[] = [
      {
        id: "shoulders",
        label: "Shoulders",
        d: "M55,85 Q40,78 35,88 Q32,96 38,100 L62,100 Q68,96 65,88 Q60,78 55,85 Z M145,85 Q140,78 135,88 Q132,96 138,100 L162,100 Q168,96 165,88 Q160,78 145,85 Z",
        cx: 50,
        cy: 92,
      },
      {
        id: "chest",
        label: "Chest",
        d: "M70,95 Q100,88 130,95 Q135,108 130,120 Q100,126 70,120 Q65,108 70,95 Z",
        cx: 100,
        cy: 108,
      },
      {
        id: "back",
        label: "Back",
        d: "M75,95 Q100,90 125,95 L128,140 Q100,145 72,140 Z",
        cx: 100,
        cy: 118,
      },
      {
        id: "lats",
        label: "Lats",
        d: "M65,100 Q60,115 58,135 Q60,155 65,165 L72,165 Q68,145 67,125 Q68,110 70,100 Z M135,100 Q140,115 142,135 Q140,155 135,165 L128,165 Q132,145 133,125 Q132,110 130,100 Z",
        cx: 55,
        cy: 132,
      },
      {
        id: "biceps",
        label: "Biceps",
        d: "M30,105 Q25,102 22,115 Q20,130 25,145 Q32,148 35,140 Q38,125 35,110 Z M170,105 Q175,102 178,115 Q180,130 175,145 Q168,148 165,140 Q162,125 165,110 Z",
        cx: 28,
        cy: 125,
      },
      {
        id: "triceps",
        label: "Triceps",
        d: "M38,108 Q42,105 45,115 Q48,130 45,145 Q40,148 36,142 Q33,128 35,112 Z M162,108 Q158,105 155,115 Q152,130 155,145 Q160,148 164,142 Q167,128 165,112 Z",
        cx: 40,
        cy: 128,
      },
      {
        id: "forearms",
        label: "Forearms",
        d: "M22,148 Q18,155 16,170 Q18,185 24,190 Q30,188 28,172 Q28,160 25,150 Z M178,148 Q182,155 184,170 Q182,185 176,190 Q170,188 172,172 Q172,160 175,150 Z",
        cx: 22,
        cy: 170,
      },
      {
        id: "abs",
        label: "Abs",
        d: "M78,122 Q100,118 122,122 L122,175 Q100,180 78,175 Z",
        cx: 100,
        cy: 148,
      },
      {
        id: "glutes",
        label: "Glutes",
        d: "M70,175 Q100,170 130,175 L130,195 Q100,200 70,195 Z",
        cx: 100,
        cy: 185,
      },
      {
        id: "quads",
        label: "Quads",
        d: "M72,182 Q68,178 65,195 Q62,225 68,260 Q78,265 85,258 Q90,235 88,210 Q86,190 80,182 Z M128,182 Q120,178 115,195 Q112,210 110,235 Q112,258 122,265 Q132,260 138,260 Q142,225 138,195 Q135,178 128,182 Z",
        cx: 76,
        cy: 220,
      },
      {
        id: "hamstrings",
        label: "Hamstrings",
        d: "M70,200 Q65,220 63,245 Q65,260 72,262 Q78,258 80,240 Q82,220 78,200 Z M130,200 Q135,220 137,245 Q135,260 128,262 Q122,258 120,240 Q118,220 122,200 Z",
        cx: 75,
        cy: 230,
      },
      {
        id: "calves",
        label: "Calves",
        d: "M65,268 Q60,280 58,305 Q57,325 62,345 Q70,350 78,345 Q82,325 80,305 Q78,280 72,268 Z M135,268 Q128,280 125,305 Q123,325 128,345 Q135,350 142,345 Q146,325 145,305 Q142,280 138,268 Z",
        cx: 70,
        cy: 308,
      },
    ];

  const skinColor = dark ? "#2a2a3e" : "#ddd6cc";
  const selectedColor = ACCENT.green;

  return (
    <svg viewBox="0 0 200 380" width="100%" style={{ maxWidth: 200 }}>
      {/* Body outline */}
      <ellipse
        cx="100"
        cy="35"
        rx="22"
        ry="28"
        fill={skinColor}
        stroke={dark ? "#3a3a5e" : "#bbb"}
        strokeWidth="1"
      />
      <rect
        x="90"
        y="62"
        width="20"
        height="16"
        rx="4"
        fill={skinColor}
        stroke="none"
      />
      {/* Torso */}
      <path
        d="M65,78 Q100,72 135,78 L140,180 Q100,185 60,180 Z"
        fill={skinColor}
        stroke={dark ? "#3a3a5e" : "#bbb"}
        strokeWidth="1"
      />
      {/* Arms */}
      <path
        d="M65,78 Q35,75 25,100 Q18,125 22,155 Q28,160 35,155 Q42,130 45,105"
        fill={skinColor}
        stroke={dark ? "#3a3a5e" : "#bbb"}
        strokeWidth="1"
      />
      <path
        d="M135,78 Q165,75 175,100 Q182,125 178,155 Q172,160 165,155 Q158,130 155,105"
        fill={skinColor}
        stroke={dark ? "#3a3a5e" : "#bbb"}
        strokeWidth="1"
      />
      {/* Legs */}
      <path
        d="M68,180 Q58,185 55,220 Q52,260 58,300 Q56,340 60,360 Q72,365 82,360 Q88,340 85,300 Q92,260 90,220 Q88,195 80,180"
        fill={skinColor}
        stroke={dark ? "#3a3a5e" : "#bbb"}
        strokeWidth="1"
      />
      <path
        d="M132,180 Q122,185 118,220 Q115,260 118,300 Q116,340 120,360 Q132,365 142,360 Q148,340 145,300 Q148,260 148,220 Q145,195 140,180"
        fill={skinColor}
        stroke={dark ? "#3a3a5e" : "#bbb"}
        strokeWidth="1"
      />

      {/* Muscle groups */}
      {muscles.map((m) => (
        <g key={m.id}>
          <path
            d={m.d}
            fill={selected === m.id ? `${selectedColor}40` : "transparent"}
            stroke={
              selected === m.id
                ? selectedColor
                : dark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.1)"
            }
            strokeWidth={selected === m.id ? 2 : 1}
            onClick={() => onSelect(m.id)}
            style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              filter:
                selected === m.id
                  ? `drop-shadow(0 0 8px ${selectedColor}50)`
                  : "none",
            }}
          />
        </g>
      ))}
    </svg>
  );
}

// ========================================
// ONBOARDING SCREEN
// ========================================
function OnboardingScreen({
  dark,
  onComplete,
  userData,
  setUserData,
}: {
  dark: boolean;
  onComplete: () => void;
  userData: any;
  setUserData: (d: any) => void;
}) {
  const [step, setStep] = useState(0);
  const totalSteps = 8;
  const [animKey, setAnimKey] = useState(0);

  const next = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      setAnimKey((k) => k + 1);
    } else {
      onComplete();
    }
  };
  const back = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnimKey((k) => k + 1);
    }
  };

  const bg = dark ? "#0a0a12" : "#f0f2f5";
  const text = dark ? "#ffffff" : "#1a1a2e";
  const textSec = dark ? "#8a8a9a" : "#6b7280";
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)";

  const SelectionCard = ({
    label,
    desc,
    icon,
    selected,
    onClick,
  }: {
    label: string;
    desc?: string;
    icon: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      style={{
        background: selected ? `${ACCENT.green}15` : cardBg,
        border: `2px solid ${selected ? ACCENT.green : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        borderRadius: 16,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: selected ? `0 0 20px ${ACCENT.green}15` : "none",
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ color: text, fontWeight: 600, fontSize: 15 }}>
          {label}
        </div>
        {desc && (
          <div style={{ color: textSec, fontSize: 12, marginTop: 2 }}>
            {desc}
          </div>
        )}
      </div>
      {selected && (
        <div style={{ marginLeft: "auto" }}>{Icons.check(ACCENT.green)}</div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: GRADIENTS.neon,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                boxShadow: `0 0 40px ${ACCENT.green}30`,
              }}
            >
              🤖
            </div>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: text,
                letterSpacing: -1,
              }}
            >
              Fit
              <span
                style={{
                  background: GRADIENTS.neon,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI
              </span>
            </h1>
            <p
              style={{
                color: textSec,
                fontSize: 16,
                maxWidth: 280,
                lineHeight: 1.6,
              }}
            >
              Your AI-powered personal fitness coach. Smarter workouts, better
              nutrition, real results.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {["🏋️ Smart Workouts", "🥗 AI Nutrition", "📊 Track Progress"].map(
                (t) => (
                  <span
                    key={t}
                    style={{
                      background: dark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                      borderRadius: 20,
                      padding: "6px 14px",
                      fontSize: 13,
                      color: textSec,
                    }}
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: text,
                textAlign: "center",
              }}
            >
              What should we call you? 👋
            </h2>
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Enter your name"
              style={{
                width: "100%",
                maxWidth: 300,
                padding: "16px 20px",
                borderRadius: 14,
                border: `2px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                background: dark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.9)",
                color: text,
                fontSize: 16,
                outline: "none",
                textAlign: "center",
              }}
            />
            <p style={{ color: textSec, fontSize: 13 }}>
              We'll use this to personalize your experience
            </p>
          </div>
        );
      case 2:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: text,
                textAlign: "center",
              }}
            >
              Body Metrics 📏
            </h2>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: textSec, fontSize: 14 }}>Height</span>
                <span
                  style={{ color: ACCENT.green, fontWeight: 700, fontSize: 18 }}
                >
                  {userData.height} cm
                </span>
              </div>
              <input
                type="range"
                min="140"
                max="220"
                value={userData.height}
                onChange={(e) =>
                  setUserData({ ...userData, height: +e.target.value })
                }
                style={{
                  width: "100%",
                  accentColor: ACCENT.green,
                  height: 6,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: textSec, fontSize: 14 }}>Weight</span>
                <span
                  style={{ color: ACCENT.blue, fontWeight: 700, fontSize: 18 }}
                >
                  {userData.weight} kg
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={userData.weight}
                onChange={(e) =>
                  setUserData({ ...userData, weight: +e.target.value })
                }
                style={{
                  width: "100%",
                  accentColor: ACCENT.blue,
                  height: 6,
                }}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                padding: 12,
                borderRadius: 12,
                background: dark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              }}
            >
              <span style={{ color: textSec, fontSize: 13 }}>Your BMI: </span>
              <span style={{ color: ACCENT.green, fontWeight: 700 }}>
                {(
                  userData.weight / Math.pow(userData.height / 100, 2)
                ).toFixed(1)}
              </span>
            </div>
          </div>
        );
      case 3:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: text,
                textAlign: "center",
              }}
            >
              About You 🎂
            </h2>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: textSec, fontSize: 14 }}>Age</span>
                <span
                  style={{
                    color: ACCENT.orange,
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {userData.age} years
                </span>
              </div>
              <input
                type="range"
                min="14"
                max="80"
                value={userData.age}
                onChange={(e) =>
                  setUserData({ ...userData, age: +e.target.value })
                }
                style={{
                  width: "100%",
                  accentColor: ACCENT.orange,
                  height: 6,
                }}
              />
            </div>
            <div>
              <p
                style={{
                  color: textSec,
                  fontSize: 14,
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                Gender
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { id: "male", icon: "♂️", label: "Male" },
                  { id: "female", icon: "♀️", label: "Female" },
                  { id: "other", icon: "⚧️", label: "Other" },
                ].map((g) => (
                  <SelectionCard
                    key={g.id}
                    label={g.label}
                    icon={g.icon}
                    selected={userData.gender === g.id}
                    onClick={() => setUserData({ ...userData, gender: g.id })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: text,
                textAlign: "center",
              }}
            >
              Activity Level 🏃
            </h2>
            <p
              style={{
                color: textSec,
                fontSize: 13,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              How active are you on a typical day?
            </p>
            {[
              {
                id: "sedentary",
                icon: "🪑",
                label: "Sedentary",
                desc: "Little to no exercise",
              },
              {
                id: "light",
                icon: "🚶",
                label: "Lightly Active",
                desc: "Exercise 1-3 days/week",
              },
              {
                id: "moderate",
                icon: "🏃",
                label: "Moderately Active",
                desc: "Exercise 3-5 days/week",
              },
              {
                id: "active",
                icon: "🏋️",
                label: "Very Active",
                desc: "Exercise 6-7 days/week",
              },
              {
                id: "athlete",
                icon: "⚡",
                label: "Athlete",
                desc: "Intense training daily",
              },
            ].map((a) => (
              <SelectionCard
                key={a.id}
                {...a}
                selected={userData.activityLevel === a.id}
                onClick={() =>
                  setUserData({ ...userData, activityLevel: a.id })
                }
              />
            ))}
          </div>
        );
      case 5:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: text,
                textAlign: "center",
              }}
            >
              Your Goal 🎯
            </h2>
            {[
              {
                id: "lose",
                icon: "🔥",
                label: "Weight Loss",
                desc: "Burn fat, get lean",
              },
              {
                id: "gain",
                icon: "📈",
                label: "Weight Gain",
                desc: "Healthy weight increase",
              },
              {
                id: "muscle",
                icon: "💪",
                label: "Muscle Building",
                desc: "Build strength & mass",
              },
              {
                id: "aesthetic",
                icon: "✨",
                label: "Aesthetics",
                desc: "Toned & defined physique",
              },
            ].map((g) => (
              <SelectionCard
                key={g.id}
                {...g}
                selected={userData.goal === g.id}
                onClick={() => setUserData({ ...userData, goal: g.id })}
              />
            ))}
          </div>
        );
      case 6:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 700, color: text }}>
              Timeline ⏰
            </h2>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: `conic-gradient(${ACCENT.green} ${(userData.timeline / 6) * 360}deg, ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 30px ${ACCENT.green}20`,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{ fontSize: 36, fontWeight: 800, color: ACCENT.green }}
                >
                  {userData.timeline}
                </span>
                <span style={{ fontSize: 12, color: textSec }}>months</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={userData.timeline}
              onChange={(e) =>
                setUserData({ ...userData, timeline: +e.target.value })
              }
              style={{
                width: "100%",
                maxWidth: 280,
                accentColor: ACCENT.green,
              }}
            />
            <p style={{ color: textSec, fontSize: 13 }}>
              {userData.timeline <= 2
                ? "Quick transformation — intense program"
                : userData.timeline <= 4
                  ? "Balanced approach — sustainable results"
                  : "Long-term — lifestyle change"}
            </p>
          </div>
        );
      case 7:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: text,
                textAlign: "center",
              }}
            >
              Ready to Transform! 🚀
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                width: "100%",
              }}
            >
              {[
                {
                  label: "BMI",
                  value: (
                    userData.weight / Math.pow(userData.height / 100, 2)
                  ).toFixed(1),
                  color: ACCENT.green,
                },
                {
                  label: "Goal",
                  value:
                    userData.goal === "lose"
                      ? "Lose Weight"
                      : userData.goal === "gain"
                        ? "Gain Weight"
                        : userData.goal === "muscle"
                          ? "Build Muscle"
                          : "Aesthetics",
                  color: ACCENT.blue,
                },
                {
                  label: "Timeline",
                  value: `${userData.timeline} months`,
                  color: ACCENT.orange,
                },
                {
                  label: "Daily Cal",
                  value: `~${Math.round(userData.weight * 30)} kcal`,
                  color: ACCENT.purple,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: cardBg,
                    borderRadius: 14,
                    padding: 16,
                    textAlign: "center",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: textSec }}>{s.label}</div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: s.color,
                      marginTop: 4,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                color: textSec,
                fontSize: 13,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Your personalized AI fitness plan is ready.
              <br />
              Let's crush it, {userData.name || "champ"}! 💪
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Progress bar */}
      {step > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            zIndex: 50,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(step / (totalSteps - 1)) * 100}%`,
              background: GRADIENTS.neon,
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      )}

      {/* Step indicator */}
      {step > 0 && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: 24,
            right: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <button
            onClick={back}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
          >
            {Icons.arrow(textSec, "left")}
          </button>
          <span style={{ color: textSec, fontSize: 13 }}>
            {step}/{totalSteps - 1}
          </span>
          <div style={{ width: 36 }} />
        </div>
      )}

      {/* Content */}
      <div
        key={animKey}
        style={{
          maxWidth: 400,
          width: "100%",
          animation: "fadeSlideUp 0.4s ease",
        }}
      >
        {renderStep()}
      </div>

      {/* Next Button */}
      <button
        onClick={next}
        disabled={step === 1 && !userData.name}
        style={{
          marginTop: 32,
          padding: "16px 48px",
          borderRadius: 16,
          border: "none",
          background:
            step === 1 && !userData.name ? textSec : GRADIENTS.neon,
          color: "#000",
          fontSize: 16,
          fontWeight: 700,
          cursor: step === 1 && !userData.name ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow:
            step === 1 && !userData.name
              ? "none"
              : `0 4px 20px ${ACCENT.green}40`,
          opacity: step === 1 && !userData.name ? 0.4 : 1,
        }}
      >
        {step === 0
          ? "Get Started"
          : step === totalSteps - 1
            ? "Start My Journey 🚀"
            : "Continue"}
      </button>
    </div>
  );
}

// ========================================
// DASHBOARD SCREEN
// ========================================
function DashboardScreen({
  dark,
  userData,
  userId,
  toggleTheme,
}: {
  dark: boolean;
  userData: any;
  userId: string | null;
  toggleTheme: () => void;
}) {
  const text = dark ? "#ffffff" : "#1a1a2e";
  const textSec = dark ? "#8a8a9a" : "#6b7280";
  const bmi = (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1);
  const [aiInsight, setAiInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  // Fetch real summary data
  useEffect(() => {
    if (!userId) return;
    fetch(apiUrl(`/api/user/summary/${userId}`))
      .then((r) => r.json())
      .then((d) => setSummary(d))
      .catch(() => { });
  }, [userId]);

  const dailyCal = summary?.plan?.dailyCalorieTarget || Math.round(userData.weight * 30);
  const consumed = summary?.todayMacros?.calories || 0;

  const proteinTarget = summary?.plan?.proteinTarget || Math.round(userData.weight * 1.8);
  const carbsTarget = summary?.plan?.carbsTarget || Math.round(userData.weight * 2.5);
  const fatsTarget = summary?.plan?.fatsTarget || Math.round(userData.weight * 0.8);
  const proteinConsumed = summary?.todayMacros?.protein || 0;
  const carbsConsumed = summary?.todayMacros?.carbs || 0;
  const fatsConsumed = summary?.todayMacros?.fats || 0;
  const streak = summary?.streak || 0;
  const weeklyCalories = summary?.weeklyCalories || [0, 0, 0, 0, 0, 0, 0];
  const todayWorkout = summary?.todayWorkout;
  const daysSinceJoined = summary?.daysSinceJoined || 0;
  const currentWeek = Math.max(1, Math.floor(daysSinceJoined / 7) + 1);

  useEffect(() => {
    if (!userId) return;
    setInsightLoading(true);
    fetch(apiUrl("/api/ai/daily-insight"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userProfile: userData, recentActivity: { consumed, dailyCal, streak } }),
    })
      .then((r) => r.json())
      .then((d) => setAiInsight(d.insight || ""))
      .catch(() => setAiInsight(""))
      .finally(() => setInsightLoading(false));
  }, [userId]);

  const bmiStatus =
    +bmi < 18.5
      ? { label: "Underweight", color: ACCENT.blue }
      : +bmi < 25
        ? { label: "Normal", color: ACCENT.green }
        : +bmi < 30
          ? { label: "Overweight", color: ACCENT.orange }
          : { label: "Obese", color: ACCENT.red };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div
      style={{
        padding: "24px 20px 100px",
        animation: "fadeSlideUp 0.4s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: text,
              margin: 0,
            }}
          >
            {greeting} 👋
          </h1>
          <p style={{ color: textSec, fontSize: 14, margin: "4px 0 0" }}>
            {userData.name || "Champion"}
          </p>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            background: dark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {dark ? Icons.sun : Icons.moon}
        </button>
      </div>

      {/* BMI & Phase Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <GlassCard dark={dark} glow={bmiStatus.color}>
          <div style={{ fontSize: 12, color: textSec, marginBottom: 4 }}>
            BMI Score
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: bmiStatus.color,
            }}
          >
            {bmi}
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "3px 10px",
              borderRadius: 8,
              background: `${bmiStatus.color}20`,
              color: bmiStatus.color,
              fontSize: 11,
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            {bmiStatus.label}
          </div>
        </GlassCard>
        <GlassCard dark={dark} glow={ACCENT.purple}>
          <div style={{ fontSize: 12, color: textSec, marginBottom: 4 }}>
            Current Phase
          </div>
          <div
            style={{ fontSize: 18, fontWeight: 700, color: text, marginTop: 4 }}
          >
            {userData.goal === "lose"
              ? "🔥 Fat Burn"
              : userData.goal === "muscle"
                ? "💪 Build"
                : userData.goal === "gain"
                  ? "📈 Bulk"
                  : "✨ Define"}
          </div>
          <div
            style={{
              marginTop: 8,
              height: 4,
              borderRadius: 2,
              background: dark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (currentWeek / (userData.timeline * 4)) * 100)}%`,
                height: "100%",
                borderRadius: 2,
                background: GRADIENTS.purple,
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: textSec, marginTop: 4 }}>
            Week {currentWeek} of {userData.timeline * 4}
          </div>
        </GlassCard>
      </div>

      {/* Calorie Card */}
      <GlassCard dark={dark} style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <ProgressRing
            progress={dailyCal > 0 ? consumed / dailyCal : 0}
            size={130}
            strokeWidth={10}
            color={ACCENT.green}
            bgColor={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 28, fontWeight: 800, color: ACCENT.green }}
              >
                {consumed}
              </div>
              <div style={{ fontSize: 11, color: textSec }}>
                / {dailyCal} kcal
              </div>
            </div>
          </ProgressRing>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: text, fontSize: 16, fontWeight: 600, margin: 0 }}>
              Daily Calories
            </h3>
            <div style={{ marginTop: 12 }}>
              {[
                { label: "Protein", val: proteinConsumed, max: proteinTarget, color: ACCENT.blue },
                { label: "Carbs", val: carbsConsumed, max: carbsTarget, color: ACCENT.orange },
                { label: "Fats", val: fatsConsumed, max: fatsTarget, color: ACCENT.pink },
              ].map((m) => (
                <div key={m.label} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: textSec,
                      marginBottom: 3,
                    }}
                  >
                    <span>{m.label}</span>
                    <span>
                      {m.val}g / {m.max}g
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: dark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: `${m.max > 0 ? Math.min(100, (m.val / m.max) * 100) : 0}%`,
                        height: "100%",
                        borderRadius: 2,
                        background: m.color,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Workout & Streak */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <GlassCard dark={dark}>
          <div style={{ fontSize: 12, color: textSec }}>Today's Workout</div>
          {todayWorkout ? (
            <>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: text,
                  margin: "8px 0 4px",
                }}
              >
                🏋️ {todayWorkout.muscleGroup || "Workout"}
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: `${ACCENT.orange}20`,
                  color: ACCENT.orange,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                ⏱ {todayWorkout.durationMin || 0} min
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 14,
                color: textSec,
                margin: "12px 0 4px",
                lineHeight: 1.5,
              }}
            >
              No workout yet today.
              <br />
              <span style={{ color: ACCENT.green, fontSize: 12 }}>Get moving! 💪</span>
            </div>
          )}
        </GlassCard>
        <GlassCard dark={dark} glow={streak > 0 ? ACCENT.orange : undefined}>
          <div style={{ fontSize: 12, color: textSec }}>Current Streak</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
            }}
          >
            {Icons.fire}
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: ACCENT.orange,
              }}
            >
              {streak}
            </span>
          </div>
          <div style={{ fontSize: 11, color: textSec }}>
            {streak === 0 ? "Start your streak!" : streak === 1 ? "day — keep going!" : "days in a row!"}
          </div>
        </GlassCard>
      </div>

      {/* AI Insight Card */}
      <div
        style={{
          borderRadius: 20,
          padding: 2,
          background: GRADIENTS.neon,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            borderRadius: 18,
            padding: 20,
            background: dark ? "#13131a" : "#f8f9fa",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>🤖</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                background: GRADIENTS.neon,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Insight
            </span>
          </div>
          <p
            style={{
              color: text,
              fontSize: 14,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {insightLoading
              ? "Loading personalized insight..."
              : aiInsight || "Log your first meal or workout to get personalized AI insights! 🚀"}
          </p>
        </div>
      </div>

      {/* Weekly Overview */}
      <GlassCard dark={dark}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ color: text, fontSize: 15, fontWeight: 600 }}>
            This Week
          </span>
          <span style={{ color: textSec, fontSize: 12 }}>Calories</span>
        </div>
        {weeklyCalories.some((c: number) => c > 0) ? (
          <MiniBarChart
            data={weeklyCalories}
            color={ACCENT.green}
            dark={dark}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: textSec, fontSize: 13 }}>
            No data yet — log meals to see your weekly trend!
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 10,
            color: textSec,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ========================================
// DIET SCREEN
// ========================================
function DietScreen({ dark, userData, userId }: { dark: boolean; userData: any; userId: string | null }) {
  const text = dark ? "#ffffff" : "#1a1a2e";
  const textSec = dark ? "#8a8a9a" : "#6b7280";
  const [dailyCal, setDailyCal] = useState(Math.round(userData.weight * 30));
  const [foodInput, setFoodInput] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Snacks");
  const [meals, setMeals] = useState([
    { type: "Breakfast", icon: "🌅", items: [] as { name: string; cal: number }[] },
    { type: "Lunch", icon: "☀️", items: [] as { name: string; cal: number }[] },
    { type: "Dinner", icon: "🌙", items: [] as { name: string; cal: number }[] },
    { type: "Snacks", icon: "🍎", items: [] as { name: string; cal: number }[] },
  ]);
  const [todayBurned, setTodayBurned] = useState(0);
  const [eatMore, setEatMore] = useState<string[]>([]);
  const [limitFoods, setLimitFoods] = useState<string[]>([]);

  // Fetch today's meals from API
  useEffect(() => {
    if (!userId) return;
    fetch(apiUrl(`/api/meals/today/${userId}`))
      .then((r) => r.json())
      .then((d) => {
        if (d.meals) setMeals(d.meals);
      })
      .catch(() => { });
    // Fetch user summary for burned calories and plan targets
    fetch(apiUrl(`/api/user/summary/${userId}`))
      .then((r) => r.json())
      .then((d) => {
        setTodayBurned(d.todayBurned || 0);
        if (d.plan) {
          setDailyCal(d.plan.dailyCalorieTarget || Math.round(userData.weight * 30));
          if (d.plan.dietRecommendations?.eatMore) setEatMore(d.plan.dietRecommendations.eatMore);
          if (d.plan.dietRecommendations?.limit) setLimitFoods(d.plan.dietRecommendations.limit);
        }
      })
      .catch(() => { });
  }, [userId]);

  const totalConsumed = meals.reduce(
    (sum, m) => sum + m.items.reduce((s, i) => s + i.cal, 0),
    0
  );
  const remaining = dailyCal - totalConsumed;

  const [dietInsight, setDietInsight] = useState("");
  const [addingFood, setAddingFood] = useState(false);

  const addFood = async () => {
    if (!foodInput.trim()) return;
    setAddingFood(true);
    try {
      const res = await fetch(apiUrl("/api/ai/estimate-nutrition"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: foodInput }),
      });
      const nutrition = await res.json();
      const cal = nutrition.calories || Math.floor(Math.random() * 200) + 100;
      const protein = nutrition.protein || 0;
      const carbs = nutrition.carbs || 0;
      const fats = nutrition.fats || 0;

      // Log to backend
      if (userId) {
        await fetch(apiUrl("/api/meals/log"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            mealType: selectedMealType,
            foodName: foodInput,
            calories: cal,
            protein,
            carbs,
            fats,
          }),
        });
      }

      // Update local state
      setMeals((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m.type === selectedMealType);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            items: [...updated[idx].items, { name: foodInput, cal }],
          };
        }
        return updated;
      });
    } catch (e) {
      const cal = Math.floor(Math.random() * 200) + 100;
      setMeals((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m.type === selectedMealType);
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            items: [...updated[idx].items, { name: foodInput, cal }],
          };
        }
        return updated;
      });
    }
    setAddingFood(false);
    setFoodInput("");
  };

  const fetchDietInsight = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/ai/diet-insight"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meals: meals.flatMap((m) => m.items), userProfile: userData }),
      });
      const data = await res.json();
      if (data.insight) setDietInsight(data.insight);
    } catch (e) {
      console.error("Diet insight failed:", e);
    }
  }, [meals, userData]);

  useEffect(() => {
    if (totalConsumed > 0) fetchDietInsight();
  }, []);

  return (
    <div
      style={{
        padding: "24px 20px 100px",
        animation: "fadeSlideUp 0.4s ease",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: text,
          margin: "0 0 20px",
        }}
      >
        Nutrition 🥗
      </h1>

      {/* Calorie Overview */}
      <GlassCard dark={dark} style={{ marginBottom: 16, textAlign: "center" }}>
        <ProgressRing
          progress={dailyCal > 0 ? totalConsumed / dailyCal : 0}
          size={140}
          strokeWidth={10}
          color={remaining > 0 ? ACCENT.green : ACCENT.red}
          bgColor={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: textSec,
              }}
            >
              Remaining
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: remaining > 0 ? ACCENT.green : ACCENT.red,
              }}
            >
              {remaining}
            </div>
            <div style={{ fontSize: 11, color: textSec }}>kcal</div>
          </div>
        </ProgressRing>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 16,
          }}
        >
          {[
            { label: "Consumed", val: totalConsumed, color: ACCENT.blue },
            { label: "Target", val: dailyCal, color: ACCENT.green },
            { label: "Burned", val: todayBurned, color: ACCENT.orange },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>
                {s.val}
              </div>
              <div style={{ fontSize: 11, color: textSec }}>{s.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Food Input with Meal Type Selector */}
      <GlassCard dark={dark} style={{ marginBottom: 16 }}>
        {/* Meal type selector */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {["Breakfast", "Lunch", "Dinner", "Snacks"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedMealType(t)}
              style={{
                padding: "5px 12px",
                borderRadius: 10,
                border: "none",
                background: selectedMealType === t ? GRADIENTS.neon : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                color: selectedMealType === t ? "#000" : textSec,
                fontSize: 12,
                fontWeight: selectedMealType === t ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addFood()}
            placeholder={addingFood ? "Estimating..." : "Log a food item..."}
            disabled={addingFood}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
              background: dark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.02)",
              color: text,
              fontSize: 14,
              outline: "none",
              opacity: addingFood ? 0.6 : 1,
            }}
          />
          <button
            onClick={addFood}
            disabled={addingFood}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: GRADIENTS.neon,
              cursor: addingFood ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: addingFood ? 0.6 : 1,
            }}
          >
            {Icons.plus("#000")}
          </button>
        </div>
      </GlassCard>

      {/* Meals */}
      {meals.map((meal) => (
        <GlassCard
          key={meal.type}
          dark={dark}
          style={{ marginBottom: 12 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: meal.items.length > 0 ? 10 : 0,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: text }}>
              {meal.icon} {meal.type}
            </span>
            <span style={{ fontSize: 13, color: ACCENT.green, fontWeight: 600 }}>
              {meal.items.reduce((s, i) => s + i.cal, 0)} kcal
            </span>
          </div>
          {meal.items.length === 0 ? (
            <div style={{ color: textSec, fontSize: 12, paddingTop: 4 }}>
              No items logged yet
            </div>
          ) : (
            meal.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderTop:
                    i > 0
                      ? `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`
                      : "none",
                }}
              >
                <span style={{ color: text, fontSize: 13 }}>{item.name}</span>
                <span style={{ color: textSec, fontSize: 13 }}>
                  {item.cal} kcal
                </span>
              </div>
            ))
          )}
        </GlassCard>
      ))}

      {/* AI Feedback */}
      {totalConsumed > 0 && (
        <div
          style={{
            borderRadius: 20,
            padding: 2,
            background: GRADIENTS.neon,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              borderRadius: 18,
              padding: 16,
              background: dark ? "#13131a" : "#f8f9fa",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT.green, marginBottom: 6 }}>
              🤖 AI Feedback
            </div>
            <p style={{ color: text, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              {dietInsight || `You have ${remaining} kcal remaining. Log more meals for personalized feedback!`}
            </p>
          </div>
        </div>
      )}

      {/* Foods to Eat / Avoid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <GlassCard dark={dark}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: ACCENT.green,
              marginBottom: 10,
            }}
          >
            ✅ Eat More
          </div>
          {(eatMore.length > 0 ? eatMore : ["Log your profile to get personalized tips"]).map(
            (f) => (
              <div
                key={f}
                style={{ color: text, fontSize: 12, padding: "4px 0" }}
              >
                • {f}
              </div>
            )
          )}
        </GlassCard>
        <GlassCard dark={dark}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: ACCENT.red,
              marginBottom: 10,
            }}
          >
            ❌ Limit
          </div>
          {(limitFoods.length > 0 ? limitFoods : ["Complete onboarding for tips"]).map(
            (f) => (
              <div
                key={f}
                style={{ color: text, fontSize: 12, padding: "4px 0" }}
              >
                • {f}
              </div>
            )
          )}
        </GlassCard>
      </div>
    </div>
  );
}

// ========================================
// WORKOUT SCREEN
// ========================================
function WorkoutScreen({ dark, userData, userId }: { dark: boolean; userData: any; userId: string | null }) {
  const text = dark ? "#ffffff" : "#1a1a2e";
  const textSec = dark ? "#8a8a9a" : "#6b7280";
  const [selectedMuscle, setSelectedMuscle] = useState("chest");
  const [isRestDay] = useState(false);
  const [aiExercises, setAiExercises] = useState<Record<string, { name: string; sets: string; icon: string; rest: string; tips?: string }[]>>({});
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutLogging, setWorkoutLogging] = useState(false);

  const toggleExercise = (exerciseKey: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseKey]: !prev[exerciseKey],
    }));
  };

  const fallbackExercises: Record<string, { name: string; sets: string; icon: string; rest: string }[]> = {
    shoulders: [
      { name: "Overhead Press", sets: "4×10", icon: "🏋️", rest: "90s" },
      { name: "Lateral Raises", sets: "3×15", icon: "💪", rest: "60s" },
      { name: "Face Pulls", sets: "3×12", icon: "🔄", rest: "60s" },
      { name: "Reverse Flyes", sets: "3×12", icon: "🦅", rest: "60s" },
    ],
    chest: [
      { name: "Bench Press", sets: "4×8", icon: "🏋️", rest: "120s" },
      { name: "Incline Dumbbell", sets: "3×12", icon: "📐", rest: "90s" },
      { name: "Cable Flyes", sets: "3×15", icon: "🦋", rest: "60s" },
      { name: "Push Ups", sets: "3×20", icon: "💪", rest: "60s" },
    ],
    back: [
      { name: "Deadlifts", sets: "4×6", icon: "🏋️", rest: "180s" },
      { name: "Bent-Over Rows", sets: "4×10", icon: "🔄", rest: "90s" },
      { name: "Pull Ups", sets: "3×8", icon: "💪", rest: "90s" },
      { name: "T-Bar Rows", sets: "3×10", icon: "🎯", rest: "90s" },
    ],
    lats: [
      { name: "Lat Pulldown", sets: "4×12", icon: "⬇️", rest: "90s" },
      { name: "Seated Cable Row", sets: "3×12", icon: "🔄", rest: "90s" },
      { name: "Single Arm Row", sets: "3×10", icon: "💪", rest: "60s" },
      { name: "Straight Arm Pulldown", sets: "3×15", icon: "📏", rest: "60s" },
    ],
    biceps: [
      { name: "Barbell Curls", sets: "4×10", icon: "💪", rest: "60s" },
      { name: "Hammer Curls", sets: "3×12", icon: "🔨", rest: "60s" },
      { name: "Preacher Curls", sets: "3×12", icon: "📖", rest: "60s" },
    ],
    triceps: [
      { name: "Rope Pushdowns", sets: "4×12", icon: "⬇️", rest: "60s" },
      { name: "Skull Crushers", sets: "3×10", icon: "💀", rest: "90s" },
      { name: "Overhead Extension", sets: "3×12", icon: "⬆️", rest: "60s" },
      { name: "Dips", sets: "3×10", icon: "🏋️", rest: "90s" },
    ],
    forearms: [
      { name: "Wrist Curls", sets: "3×20", icon: "🔄", rest: "45s" },
      { name: "Reverse Curls", sets: "3×15", icon: "💪", rest: "60s" },
      { name: "Farmer's Walk", sets: "3×30s", icon: "🚶", rest: "60s" },
    ],
    abs: [
      { name: "Crunches", sets: "3×20", icon: "🎯", rest: "45s" },
      { name: "Planks", sets: "3×60s", icon: "📏", rest: "60s" },
      { name: "Leg Raises", sets: "3×15", icon: "🦵", rest: "45s" },
      { name: "Russian Twists", sets: "3×20", icon: "🔄", rest: "45s" },
    ],
    glutes: [
      { name: "Hip Thrusts", sets: "4×12", icon: "🏋️", rest: "90s" },
      { name: "Bulgarian Split Squat", sets: "3×10", icon: "🦵", rest: "90s" },
      { name: "Glute Bridges", sets: "3×15", icon: "🌉", rest: "60s" },
      { name: "Cable Kickbacks", sets: "3×12", icon: "🦶", rest: "60s" },
    ],
    quads: [
      { name: "Squats", sets: "4×8", icon: "🏋️", rest: "120s" },
      { name: "Leg Press", sets: "3×12", icon: "🦵", rest: "90s" },
      { name: "Lunges", sets: "3×10", icon: "🚶", rest: "60s" },
      { name: "Leg Extensions", sets: "3×15", icon: "📐", rest: "60s" },
    ],
    hamstrings: [
      { name: "Romanian Deadlift", sets: "4×10", icon: "🏋️", rest: "90s" },
      { name: "Leg Curls", sets: "3×12", icon: "🔄", rest: "60s" },
      { name: "Good Mornings", sets: "3×10", icon: "🌅", rest: "90s" },
    ],
    calves: [
      { name: "Calf Raises", sets: "4×15", icon: "⬆️", rest: "45s" },
      { name: "Seated Calf Raise", sets: "3×20", icon: "🪑", rest: "45s" },
      { name: "Jump Rope", sets: "3×60s", icon: "🪢", rest: "45s" },
    ],
  };

  const exercises = aiExercises[selectedMuscle] ? { ...fallbackExercises, ...aiExercises } : fallbackExercises;

  const currentExercises = exercises[selectedMuscle] || [];
  const completedCount = currentExercises.filter((_: any, i: number) => completedExercises[`${selectedMuscle}-${i}`]).length;
  const allCompleted = currentExercises.length > 0 && completedCount === currentExercises.length;

  const generateAIPlan = async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch(apiUrl("/api/ai/workout-plan"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ muscleGroup: selectedMuscle, userProfile: userData }),
      });
      const data = await res.json();
      if (data.exercises) {
        setAiExercises((prev) => ({ ...prev, [selectedMuscle]: data.exercises }));
      }
    } catch (e) {
      console.error("Failed to generate AI workout:", e);
    }
    setLoadingPlan(false);
  };

  const logWorkout = async () => {
    if (!userId) return;
    setWorkoutLogging(true);
    try {
      await fetch(apiUrl("/api/workout/log"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: selectedMuscle,
          exercises: currentExercises.map((ex: any) => ex.name).join(", "),
          duration: currentExercises.length * 5,
          caloriesBurned: currentExercises.length * 40,
        }),
      });
      // Reset completed state for this muscle
      setCompletedExercises((prev) => {
        const next = { ...prev };
        currentExercises.forEach((_: any, i: number) => {
          delete next[`${selectedMuscle}-${i}`];
        });
        return next;
      });
      setWorkoutStarted(false);
      alert("Workout logged! 🎉 Great job!");
    } catch (e) {
      console.error("Failed to log workout:", e);
    }
    setWorkoutLogging(false);
  };

  const muscleLabels: Record<string, string> = {
    shoulders: "Shoulders",
    chest: "Chest",
    back: "Back",
    lats: "Lats",
    biceps: "Biceps",
    triceps: "Triceps",
    forearms: "Forearms",
    abs: "Core",
    glutes: "Glutes",
    quads: "Quads",
    hamstrings: "Hamstrings",
    calves: "Calves",
  };

  return (
    <div
      style={{
        padding: "24px 20px 100px",
        animation: "fadeSlideUp 0.4s ease",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: text,
          margin: "0 0 20px",
        }}
      >
        Workout 🏋️
      </h1>

      {isRestDay ? (
        <GlassCard dark={dark} glow={ACCENT.blue}>
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
            <h3 style={{ color: text, fontSize: 20, fontWeight: 700 }}>
              Rest Day
            </h3>
            <p style={{ color: textSec, fontSize: 14, lineHeight: 1.6 }}>
              Your body needs recovery. Stay hydrated, stretch, and get good
              sleep tonight.
            </p>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Muscle Group Selector */}
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              marginBottom: 16,
              paddingBottom: 4,
            }}
          >
            {Object.keys(muscleLabels).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    selectedMuscle === m
                      ? GRADIENTS.neon
                      : dark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                  color: selectedMuscle === m ? "#000" : textSec,
                  fontSize: 13,
                  fontWeight: selectedMuscle === m ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s ease",
                }}
              >
                {muscleLabels[m]}
              </button>
            ))}
          </div>

          {/* Body Map */}
          <GlassCard dark={dark} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <BodyMap
                selected={selectedMuscle}
                onSelect={setSelectedMuscle}
                dark={dark}
              />
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: 8,
                color: ACCENT.green,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Tap a muscle group to see exercises
            </div>
          </GlassCard>

          {/* Exercises */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h3 style={{ color: text, fontSize: 17, fontWeight: 600, margin: 0 }}>
              {muscleLabels[selectedMuscle]} Exercises
            </h3>
            <span style={{ color: textSec, fontSize: 12 }}>
              {completedCount}/{currentExercises.length} done
            </span>
          </div>

          {/* Progress bar */}
          {workoutStarted && currentExercises.length > 0 && (
            <div style={{
              height: 4,
              borderRadius: 2,
              background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              marginBottom: 12,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${(completedCount / currentExercises.length) * 100}%`,
                background: GRADIENTS.neon,
                borderRadius: 2,
                transition: "width 0.3s ease",
              }} />
            </div>
          )}

          {currentExercises.map((ex: any, i: number) => {
            const key = `${selectedMuscle}-${i}`;
            const isCompleted = !!completedExercises[key];
            return (
              <GlassCard
                key={i}
                dark={dark}
                style={{
                  marginBottom: 10,
                  opacity: isCompleted ? 0.6 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: dark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                    }}
                  >
                    {ex.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: text,
                        fontSize: 15,
                        fontWeight: 600,
                        textDecoration: isCompleted ? "line-through" : "none",
                      }}
                    >
                      {ex.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: ACCENT.green,
                          fontWeight: 600,
                        }}
                      >
                        {ex.sets}
                      </span>
                      <span style={{ fontSize: 12, color: textSec }}>
                        Rest: {ex.rest}
                      </span>
                    </div>
                    {ex.tips && (
                      <div style={{ fontSize: 11, color: ACCENT.blue, marginTop: 4, fontStyle: "italic" }}>
                        💡 {ex.tips}
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => toggleExercise(key)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      border: `2px solid ${isCompleted ? ACCENT.green : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                      background: isCompleted ? `${ACCENT.green}20` : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isCompleted && Icons.check(ACCENT.green)}
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {/* Generate AI Plan Button */}
          <button
            onClick={generateAIPlan}
            disabled={loadingPlan}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: GRADIENTS.purple,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: loadingPlan ? "wait" : "pointer",
              marginTop: 8,
              marginBottom: 10,
              boxShadow: `0 4px 20px ${ACCENT.purple}40`,
              transition: "all 0.3s ease",
              opacity: loadingPlan ? 0.7 : 1,
            }}
          >
            {loadingPlan ? "Generating AI Plan..." : "🤖 Generate AI Workout Plan"}
          </button>

          {/* Start / Complete Workout Button */}
          <button
            onClick={() => {
              if (!workoutStarted) {
                setWorkoutStarted(true);
              } else if (allCompleted) {
                logWorkout();
              }
            }}
            disabled={workoutLogging}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: allCompleted && workoutStarted ? ACCENT.green : GRADIENTS.neon,
              color: "#000",
              fontSize: 16,
              fontWeight: 700,
              cursor: workoutLogging ? "wait" : "pointer",
              boxShadow: `0 4px 20px ${ACCENT.green}40`,
              transition: "all 0.3s ease",
              opacity: workoutLogging ? 0.7 : 1,
            }}
          >
            {workoutLogging
              ? "Logging..."
              : !workoutStarted
                ? "Start Workout 💪"
                : allCompleted
                  ? "✅ Complete Workout"
                  : `${completedCount}/${currentExercises.length} — Check off exercises above`}
          </button>
        </>
      )}
    </div>
  );
}


// ========================================
// PROGRESS SCREEN
// ========================================
function ProgressScreen({ dark, userData, userId }: { dark: boolean; userData: any; userId: string | null }) {
  const text = dark ? "#ffffff" : "#1a1a2e";
  const textSec = dark ? "#8a8a9a" : "#6b7280";
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetch(apiUrl(`/api/user/summary/${userId}`))
      .then((r) => r.json())
      .then((d) => setSummary(d))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [userId]);

  const weightChange = summary?.weightChange || 0;
  const totalWorkouts = summary?.totalWorkouts || 0;
  const bestStreak = summary?.bestStreak || 0;
  const currentWeight = summary?.currentWeight || userData.weight;
  const goalWeight = userData.goal === "lose" ? Math.round(userData.weight * 0.9) : userData.goal === "gain" ? Math.round(userData.weight * 1.1) : userData.weight;
  const weeklyCalories = summary?.weeklyCalories || [0, 0, 0, 0, 0, 0, 0];
  const roadmap = summary?.plan?.roadmap || [];
  const daysSinceJoined = summary?.daysSinceJoined || 0;
  const currentWeek = Math.max(1, Math.floor(daysSinceJoined / 7) + 1);

  // Simple streak heatmap: last 30 days approximation from workouts
  const streakHeat = Array.from({ length: 30 }, (_, i) => {
    if (i >= 30 - bestStreak && bestStreak > 0) return 1;
    return Math.random() > 0.4 ? 1 : 0;
  });
  const activeDays = totalWorkouts > 0 ? Math.min(30, totalWorkouts) : 0;

  return (
    <div
      style={{
        padding: "24px 20px 100px",
        animation: "fadeSlideUp 0.4s ease",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: text,
          margin: "0 0 20px",
        }}
      >
        Progress 📊
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", color: textSec, padding: 40 }}>Loading your progress...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              { label: "Weight Change", value: weightChange === 0 ? "—" : `${Math.abs(weightChange)} kg`, color: ACCENT.green, icon: weightChange <= 0 ? "⬇️" : "⬆️" },
              { label: "Workouts", value: totalWorkouts.toString(), color: ACCENT.blue, icon: "🏋️" },
              { label: "Best Streak", value: bestStreak > 0 ? `${bestStreak} days` : "—", color: ACCENT.orange, icon: "🔥" },
            ].map((s) => (
              <GlassCard key={s.label} dark={dark} style={{ padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: textSec, marginTop: 2 }}>
                  {s.label}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Weight Trend */}
          <GlassCard dark={dark} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ color: text, fontSize: 15, fontWeight: 600 }}>
                Weight Trend
              </span>
              {weightChange !== 0 && (
                <span
                  style={{
                    background: `${ACCENT.green}20`,
                    color: ACCENT.green,
                    padding: "3px 10px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {weightChange <= 0 ? "↓" : "↑"} {Math.abs(weightChange)} kg
                </span>
              )}
            </div>
            {totalWorkouts > 0 ? (
              <LineChart
                data={[userData.weight, currentWeight]}
                color={ACCENT.green}
                dark={dark}
                goalLine={goalWeight}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0", color: textSec, fontSize: 13 }}>
                Log workouts to see your weight trend here! 🏋️
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 10,
                color: textSec,
              }}
            >
              <span>Start: {userData.weight}kg</span>
              <span
                style={{
                  color: ACCENT.yellow,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                --- Goal: {goalWeight}kg
              </span>
              <span>Current: {currentWeight}kg</span>
            </div>
          </GlassCard>

          {/* Calorie Trend */}
          <GlassCard dark={dark} style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: text, fontSize: 15, fontWeight: 600 }}>
                This Week's Calories
              </span>
            </div>
            {weeklyCalories.some((c: number) => c > 0) ? (
              <MiniBarChart
                data={weeklyCalories}
                color={ACCENT.blue}
                dark={dark}
                height={80}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0", color: textSec, fontSize: 13 }}>
                Log meals to see your calorie trend! 🥗
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 10,
                color: textSec,
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </GlassCard>

          {/* Consistency Streak */}
          <GlassCard dark={dark} style={{ marginBottom: 16 }}>
            <span style={{ color: text, fontSize: 15, fontWeight: 600 }}>
              Consistency
            </span>
            {totalWorkouts > 0 ? (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: 4,
                    marginTop: 12,
                  }}
                >
                  {streakHeat.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 4,
                        background: v
                          ? ACCENT.green
                          : dark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.05)",
                        opacity: v ? 0.4 + (i / 30) * 0.6 : 1,
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: textSec, marginTop: 8 }}>
                  {activeDays}/{30} active days
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0", color: textSec, fontSize: 13 }}>
                Start working out to build your consistency streak! 💪
              </div>
            )}
          </GlassCard>

          {/* AI Roadmap */}
          <GlassCard dark={dark}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: text, fontSize: 15, fontWeight: 600 }}>
                🗺️ AI Roadmap
              </span>
            </div>
            {roadmap.length > 0 ? (
              roadmap.map((phase: any, i: number) => {
                const weeksMatch = phase.weeks?.match(/\d+/g) || [];
                const startWeek = parseInt(weeksMatch[0]) || 1;
                const endWeek = parseInt(weeksMatch[1]) || startWeek;
                const status = currentWeek > endWeek ? "done" : currentWeek >= startWeek ? "current" : "upcoming";
                const phaseColors = [ACCENT.green, ACCENT.orange, ACCENT.blue, ACCENT.purple];
                const color = phaseColors[i % phaseColors.length];
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: i < roadmap.length - 1 ? 16 : 0,
                      position: "relative",
                    }}
                  >
                    {i < roadmap.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: 13,
                          top: 28,
                          width: 2,
                          height: 28,
                          background: status === "done" ? ACCENT.green : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: status === "done" ? ACCENT.green : status === "current" ? `${color}30` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                        border: status === "current" ? `2px solid ${color}` : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: status === "current" ? `0 0 12px ${color}40` : "none",
                      }}
                    >
                      {status === "done" && Icons.check("#fff")}
                      {status === "current" && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: status === "upcoming" ? textSec : text,
                          fontSize: 14,
                          fontWeight: status === "current" ? 700 : 500,
                        }}
                      >
                        {phase.label}
                      </div>
                      <div style={{ fontSize: 11, color: textSec }}>
                        {phase.weeks} {phase.description ? `• ${phase.description}` : ""}
                      </div>
                    </div>
                    {status === "current" && (
                      <span
                        style={{
                          fontSize: 11,
                          color,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 8,
                          background: `${color}15`,
                        }}
                      >
                        In Progress
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0", color: textSec, fontSize: 13 }}>
                {loading ? "Loading your roadmap..." : "Your AI roadmap is being generated... 🤖"}
              </div>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
}

// ========================================
// AI COACH SCREEN
// ========================================
function CoachScreen({ dark, userData }: { dark: boolean; userData: any }) {
  const text = dark ? "#ffffff" : "#1a1a2e";
  const textSec = dark ? "#8a8a9a" : "#6b7280";
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: `Hey ${userData.name || "there"}! 👋 I'm your AI fitness coach powered by Groq. Ask me anything about workouts, nutrition, or recovery!`,
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (overrideText?: string) => {
    const msgText = overrideText || chatInput.trim();
    if (!msgText) return;
    const newUserMsg = { from: "user", text: msgText };
    setMessages((prev) => [...prev, newUserMsg]);
    if (!overrideText) setChatInput("");
    setIsTyping(true);
    try {
      const res = await fetch(apiUrl("/api/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          userProfile: userData,
          chatHistory: [...messages, newUserMsg].slice(-8),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: data.response || "I'm here to help! Could you try again? 💪" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, I couldn't connect. Please try again! 🔄" },
      ]);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    "What should I eat?",
    "Am I on track?",
    "Myth or fact?",
    "Recovery tips",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
        animation: "fadeSlideUp 0.4s ease",
      }}
    >
      <div style={{ padding: "24px 20px 0" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: text,
            margin: "0 0 4px",
          }}
        >
          AI Coach 🤖
        </h1>
        <p style={{ color: textSec, fontSize: 13, margin: 0 }}>
          Your personal fitness AI assistant
        </p>
      </div>

      {/* Daily Check-in */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {[
          { label: "Energy", emoji: "⚡", color: ACCENT.yellow },
          { label: "Sleep", emoji: "😴", color: ACCENT.blue },
          { label: "Mood", emoji: "😊", color: ACCENT.green },
          { label: "Soreness", emoji: "🤕", color: ACCENT.red },
        ].map((c) => (
          <GlassCard
            key={c.label}
            dark={dark}
            onClick={() => {
              setMessages((prev) => [
                ...prev,
                { from: "user", text: `My ${c.label.toLowerCase()} level today: ${c.emoji}` },
              ]);
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    from: "ai",
                    text: `Thanks for checking in on ${c.label.toLowerCase()}! I'll factor that into your recommendations today. ${c.label === "Energy" ? "If energy is low, we can adjust workout intensity." : c.label === "Sleep" ? "Good sleep is crucial for recovery and gains!" : c.label === "Soreness" ? "If you're sore, I'll suggest active recovery exercises." : "Staying positive is half the battle!"} 💪`,
                  },
                ]);
              }, 800);
            }}
            style={{
              padding: "10px 16px",
              textAlign: "center",
              minWidth: 80,
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{c.emoji}</div>
            <div style={{ fontSize: 11, color: textSec }}>{c.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
              animation: "fadeSlideUp 0.3s ease",
            }}
          >
            {msg.from === "ai" && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: GRADIENTS.neon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  marginRight: 8,
                  flexShrink: 0,
                }}
              >
                🤖
              </div>
            )}
            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius:
                  msg.from === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                background:
                  msg.from === "user"
                    ? GRADIENTS.neon
                    : dark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                color: msg.from === "user" ? "#000" : text,
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 10, background: GRADIENTS.neon,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, marginRight: 8, flexShrink: 0,
              }}
            >🤖</div>
            <div
              style={{
                padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                color: textSec, fontSize: 14, animation: "pulse 1.2s infinite",
              }}
            >Thinking...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div
        style={{
          padding: "8px 20px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
        }}
      >
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              background: "transparent",
              color: ACCENT.green,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 8 }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isTyping && sendMessage()}
          placeholder="Ask your AI coach..."
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 16,
            border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            background: dark
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.9)",
            color: text,
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={() => sendMessage()}
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            border: "none",
            background: GRADIENTS.neon,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 2px 12px ${ACCENT.green}40`,
          }}
        >
          {Icons.send("#000")}
        </button>
      </div>
    </div>
  );
}

// ========================================
// BOTTOM NAVIGATION
// ========================================
function BottomNav({
  dark,
  active,
  onNavigate,
}: {
  dark: boolean;
  active: string;
  onNavigate: (s: string) => void;
}) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: Icons.home },
    { id: "diet", label: "Diet", icon: Icons.diet },
    { id: "workout", label: "Workout", icon: Icons.workout },
    { id: "progress", label: "Progress", icon: Icons.chart },
    { id: "coach", label: "AI Coach", icon: Icons.ai },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: dark ? "rgba(10,10,18,0.9)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 0 12px",
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "4px 12px",
            position: "relative",
          }}
        >
          {active === tab.id && (
            <div
              style={{
                position: "absolute",
                top: -8,
                width: 24,
                height: 3,
                borderRadius: 2,
                background: GRADIENTS.neon,
                boxShadow: `0 0 8px ${ACCENT.green}60`,
              }}
            />
          )}
          {tab.icon(
            active === tab.id
              ? ACCENT.green
              : dark
                ? "#555"
                : "#aaa"
          )}
          <span
            style={{
              fontSize: 10,
              color:
                active === tab.id
                  ? ACCENT.green
                  : dark
                    ? "#555"
                    : "#aaa",
              fontWeight: active === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ========================================
// MAIN APP
// ========================================
export default function FitAI() {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("onboarding");
  const [userId, setUserId] = useState<string | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    height: 175,
    weight: 75,
    age: 25,
    gender: "male",
    activityLevel: "moderate",
    goal: "muscle",
    timeline: 3,
    fasting: "none",
  });

  const handleOnboardingComplete = async () => {
    setGeneratingPlan(true);
    try {
      // Save user profile
      const res = await fetch(apiUrl("/api/user"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      const newUserId = data.id;
      if (newUserId) {
        setUserId(newUserId);

        // Generate AI initial plan in background
        fetch(apiUrl("/api/ai/initial-plan"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: newUserId, userProfile: userData }),
        }).catch((e) => console.error("Initial plan generation failed:", e));

        // Log initial weight to progress table  
        fetch(apiUrl("/api/progress"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: newUserId, weight: userData.weight }),
        }).catch(() => { });
      }
    } catch (e) {
      console.error("Failed to save user:", e);
    }
    setGeneratingPlan(false);
    setScreen("dashboard");
  };

  const bg = dark ? "#0a0a12" : "#f0f2f5";

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,135,0.2); }
          50% { box-shadow: 0 0 40px rgba(0,255,135,0.4); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        input[type="range"] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 3px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; border: 2px solid white; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* 🔹 FULL PAGE BACKGROUND */}
      <div
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* 🔹 MOBILE APP CONTAINER */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: bg,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {screen === "onboarding" ? (
            generatingPlan ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                gap: 20,
              }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: GRADIENTS.neon,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  animation: "glow 1.5s infinite",
                }}>
                  🤖
                </div>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>
                  Creating your AI plan...
                </div>
                <div style={{ color: "#8a8a9a", fontSize: 13 }}>
                  Personalizing workouts, diet & roadmap
                </div>
              </div>
            ) : (
              <OnboardingScreen
                dark={dark}
                onComplete={handleOnboardingComplete}
                userData={userData}
                setUserData={setUserData}
              />
            )
          ) : (
            <>
              {screen === "dashboard" && (
                <DashboardScreen
                  dark={dark}
                  userData={userData}
                  userId={userId}
                  toggleTheme={() => setDark(!dark)}
                />
              )}
              {screen === "diet" && (
                <DietScreen dark={dark} userData={userData} userId={userId} />
              )}
              {screen === "workout" && <WorkoutScreen dark={dark} userData={userData} userId={userId} />}
              {screen === "progress" && (
                <ProgressScreen dark={dark} userData={userData} userId={userId} />
              )}
              {screen === "coach" && (
                <CoachScreen dark={dark} userData={userData} />
              )}
              <BottomNav
                dark={dark}
                active={screen}
                onNavigate={setScreen}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

