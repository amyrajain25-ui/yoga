import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Sparkles } from "lucide-react";
import type { UserProfile } from "./onboarding";

interface Message {
  id: string;
  role: "user" | "coach";
  text: string;
  recommendations?: {
    title: string;
    duration: string;
    level: string;
    videoId: string;
    reason: string;
    color: string;
  }[];
}

const quickQuestions = [
  "What yoga should I do today?",
  "I have back pain",
  "I only have 10 minutes",
  "Help me sleep better",
  "I'm feeling stressed",
  "Build my flexibility",
  "I'm a complete beginner",
  "Best morning routine?",
];

const coachResponses: Record<string, { text: string; recs: Message["recommendations"] }> = {
  default: {
    text: "Based on your profile, here are some great sessions for today. I've matched these to your goals and experience level.",
    recs: [
      { title: "Morning Flow Yoga", duration: "20 min", level: "Beginner", videoId: "4C-gxOE0j7s", reason: "Matches your morning preference and beginner level", color: "#6BB8A0" },
      { title: "Breathwork for Clarity", duration: "10 min", level: "All Levels", videoId: "tybOi4hjZFQ", reason: "Great for focus and stress relief goals", color: "#B8A8D5" },
    ],
  },
  yoga: {
    text: "Based on your goals and experience level, here are today's personalized yoga picks:",
    recs: [
      { title: "Vinyasa Flow for Energy", duration: "25 min", level: "Beginner", videoId: "9kOCY0KNByw", reason: "AI-selected for your flexibility and strength goals", color: "#6BB8A0" },
      { title: "Yin Yoga Deep Stretch", duration: "30 min", level: "All Levels", videoId: "2MJGg-dUKh0", reason: "Complements your weekly routine with deep release", color: "#E8A87C" },
    ],
  },
  pain: {
    text: "I've selected gentle, therapeutic sessions specifically designed for back care. These avoid any poses that could aggravate your condition.",
    recs: [
      { title: "Yoga for Lower Back Relief", duration: "20 min", level: "Beginner", videoId: "hJbRpHZr_d0", reason: "Gentle spinal decompression and strengthening", color: "#E88A7C" },
    ],
  },
  quick: {
    text: "10 minutes is enough to feel a real difference! Here are high-impact sessions designed for your limited time:",
    recs: [
      { title: "5-Minute Meditation Reset", duration: "5 min", level: "Beginner", videoId: "inpok4MKVLM", reason: "Quick mindfulness reset for busy days", color: "#B8A8D5" },
      { title: "Morning Energizer Flow", duration: "10 min", level: "Beginner", videoId: "4C-gxOE0j7s", reason: "Full body activation in minimal time", color: "#6BB8A0" },
    ],
  },
  sleep: {
    text: "Better sleep starts with a wind-down routine. Here's a calming sequence to prepare mind and body for deep rest:",
    recs: [
      { title: "Sleep Meditation for Deep Rest", duration: "30 min", level: "Beginner", videoId: "1vx8iUvfyCY", reason: "Clinically-inspired sleep meditation", color: "#7B9EC5" },
      { title: "Bedtime Yin Yoga", duration: "20 min", level: "All Levels", videoId: "2MJGg-dUKh0", reason: "Relaxes the nervous system before sleep", color: "#B8A8D5" },
    ],
  },
  stress: {
    text: "These sessions activate your parasympathetic nervous system — your body's natural calm response:",
    recs: [
      { title: "Stress Relief Flow", duration: "28 min", level: "Beginner", videoId: "hJbRpHZr_d0", reason: "Specifically designed for stress and anxiety relief", color: "#6BB8A0" },
      { title: "Guided Body Scan Meditation", duration: "15 min", level: "Beginner", videoId: "ZToicYcHIOU", reason: "Somatic relaxation technique for stress", color: "#B8A8D5" },
    ],
  },
  flexibility: {
    text: "Here's a progressive approach that will safely and effectively increase your range of motion:",
    recs: [
      { title: "Yin Yoga for Deep Release", duration: "45 min", level: "All Levels", videoId: "2MJGg-dUKh0", reason: "Long-held poses for deep connective tissue work", color: "#E8A87C" },
      { title: "Full Body Stretch Routine", duration: "20 min", level: "All Levels", videoId: "L_xrDAtykMI", reason: "Systematic flexibility work for all major muscle groups", color: "#6BB8A0" },
    ],
  },
  beginner: {
    text: "Welcome to your yoga journey! Here are the perfect sessions to build your foundation:",
    recs: [
      { title: "Yoga for Complete Beginners", duration: "20 min", level: "Beginner", videoId: "4C-gxOE0j7s", reason: "Foundational poses explained clearly with modifications", color: "#6BB8A0" },
      { title: "5-Minute Morning Meditation", duration: "5 min", level: "Beginner", videoId: "inpok4MKVLM", reason: "Build a simple mindfulness habit alongside your yoga", color: "#B8A8D5" },
    ],
  },
  morning: {
    text: "A powerful morning routine can transform your entire day. Here's your personalized AM sequence:",
    recs: [
      { title: "Morning Wake-Up Yoga", duration: "20 min", level: "Beginner", videoId: "4C-gxOE0j7s", reason: "Activates your body gently after sleep", color: "#D4A853" },
      { title: "Morning Breathwork", duration: "10 min", level: "All Levels", videoId: "tybOi4hjZFQ", reason: "Oxygen-rich breathing to boost energy and clarity", color: "#6BB8A0" },
    ],
  },
};

function getResponseKey(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("back") || lower.includes("knee") || lower.includes("pain") || lower.includes("injury")) return "pain";
  if (lower.includes("10 min") || lower.includes("quick") || lower.includes("short") || lower.includes("busy")) return "quick";
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("rest")) return "sleep";
  if (lower.includes("stress") || lower.includes("anxious") || lower.includes("anxiety") || lower.includes("calm")) return "stress";
  if (lower.includes("flex") || lower.includes("stretch") || lower.includes("tight")) return "flexibility";
  if (lower.includes("beginner") || lower.includes("new") || lower.includes("start")) return "beginner";
  if (lower.includes("morning") || lower.includes("wake") || lower.includes("energize")) return "morning";
  if (lower.includes("yoga") || lower.includes("today") || lower.includes("recommend")) return "yoga";
  return "default";
}

function RecCard({ rec }: { rec: NonNullable<Message["recommendations"]>[0] }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{
      backgroundColor: "var(--background)", borderRadius: "14px",
      border: `1.5px solid ${rec.color}44`, padding: "12px", marginTop: "8px",
    }}>
      {playing ? (
        <div style={{ borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9", marginBottom: "8px" }}>
          <iframe
            src={`https://www.youtube.com/embed/${rec.videoId}?autoplay=1`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          style={{
            borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9",
            marginBottom: "8px", cursor: "pointer", position: "relative",
            background: `url(https://img.youtube.com/vi/${rec.videoId}/mqdefault.jpg) center/cover`,
            backgroundColor: "var(--muted)",
          }}
          onClick={() => setPlaying(true)}
        >
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill={rec.color}>
                <path d="M2 1.5l11 5.5-11 5.5z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div style={{ fontWeight: "600", fontSize: "13px", color: "var(--foreground)", marginBottom: "4px" }}>{rec.title}</div>
      <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "8px" }}>
        {rec.duration} · {rec.level}
      </div>
      <div style={{
        fontSize: "11px", color: "var(--muted-foreground)", padding: "6px 8px",
        borderRadius: "6px", backgroundColor: rec.color + "11",
        borderLeft: `3px solid ${rec.color}`,
      }}>
        ✨ {rec.reason}
      </div>
    </div>
  );
}

export function AICoach({ profile }: { profile: UserProfile }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "coach",
      text: `Hey ${profile.name || "there"}! 👋 I'm Sage, your AI wellness coach. Ask me anything — what yoga to do today, how to handle back pain, sleep better, and more. I'll give you personalized video recommendations.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const key = getResponseKey(text);
      const resp = coachResponses[key] || coachResponses.default;
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(),
        role: "coach",
        text: resp.text,
        recommendations: resp.recs,
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100dvh - 62px)",
      backgroundColor: "var(--background)",
    }}>
      {/* Header */}
      <div style={{
        padding: "52px 24px 16px",
        background: "linear-gradient(160deg, var(--wellness-teal), #2A7A68)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "16px",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <div>
            <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>Sage AI Coach</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#A8D5BA" }} />
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Online · Personalized for you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            {msg.role === "coach" && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "10px",
                backgroundColor: "var(--wellness-teal)", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: "2px",
              }}>
                <Sparkles size={13} color="white" />
              </div>
            )}
            <div style={{ maxWidth: "82%" }}>
              <div style={{
                padding: "11px 14px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                backgroundColor: msg.role === "user" ? "var(--wellness-teal)" : "var(--card)",
                color: msg.role === "user" ? "#fff" : "var(--foreground)",
                border: msg.role === "coach" ? "1.5px solid var(--border)" : "none",
                fontSize: "14px", lineHeight: "1.5",
              }}>
                {msg.text}
              </div>
              {msg.recommendations?.map((rec, i) => <RecCard key={i} rec={rec} />)}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", alignItems: "flex-start" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "10px",
              backgroundColor: "var(--wellness-teal)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={13} color="white" />
            </div>
            <div style={{
              padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
              backgroundColor: "var(--card)", border: "1.5px solid var(--border)",
              display: "flex", gap: "4px", alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                  style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--muted-foreground)" }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts (only at start) */}
      {messages.length <= 1 && (
        <div style={{ paddingLeft: "16px", paddingRight: "16px", paddingBottom: "8px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
            {quickQuestions.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  flexShrink: 0, padding: "7px 13px", borderRadius: "20px",
                  border: "1.5px solid var(--wellness-teal)44",
                  backgroundColor: "var(--wellness-teal)11",
                  color: "var(--wellness-teal)", fontSize: "12px",
                  cursor: "pointer", whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >{q}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--background)",
        padding: "10px 16px 12px",
      }}>
        <div style={{
          display: "flex", gap: "10px", alignItems: "center",
          backgroundColor: "var(--card)",
          borderRadius: "14px",
          border: "1.5px solid var(--border)",
          padding: "10px 12px",
        }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask your wellness coach..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendMessage(input); }}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "var(--foreground)", fontSize: "14px",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            style={{
              width: "34px", height: "34px", borderRadius: "10px", border: "none",
              backgroundColor: input.trim() ? "var(--wellness-teal)" : "var(--muted)",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background-color 0.2s",
            }}
          >
            <Send size={14} color={input.trim() ? "white" : "var(--muted-foreground)"} />
          </button>
        </div>
      </div>
    </div>
  );
}
