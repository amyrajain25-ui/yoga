import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play, Flame, Droplets, Plus, Wind, Moon, Brain, Star,
  Clock, MessageSquare, Zap, X, ChevronRight, Check
} from "lucide-react";
import type { UserProfile } from "./onboarding";

interface HomeProps {
  profile: UserProfile;
  darkMode: boolean;
  onGoToLibrary: () => void;
}

const moods = [
  { id: "stressed", label: "Stressed", emoji: "😤", color: "#E88A7C" },
  { id: "tired", label: "Tired", emoji: "😴", color: "#B8A8D5" },
  { id: "anxious", label: "Anxious", emoji: "😰", color: "#7B9EC5" },
  { id: "unmotivated", label: "Unmotivated", emoji: "😑", color: "#C8B89A" },
  { id: "happy", label: "Happy", emoji: "😊", color: "#D4A853" },
  { id: "energetic", label: "Energetic", emoji: "⚡", color: "#A8D5BA" },
  { id: "sore", label: "Sore", emoji: "🤕", color: "#E8A87C" },
  { id: "calm", label: "Calm", emoji: "😌", color: "#6BB8A0" },
  { id: "overwhelmed", label: "Overwhelmed", emoji: "🤯", color: "#C97FA8" },
];

const moodRecs: Record<string, { title: string; desc: string; duration: string; videoId: string }> = {
  stressed: { title: "Stress Relief Flow", desc: "Gentle movements to release tension", duration: "15 min", videoId: "hJbRpHZr_d0" },
  tired: { title: "Gentle Wake-Up Yoga", desc: "Easy stretches to restore energy", duration: "10 min", videoId: "4C-gxOE0j7s" },
  anxious: { title: "Calming Breathwork", desc: "Box breathing to calm your nervous system", duration: "8 min", videoId: "tybOi4hjZFQ" },
  unmotivated: { title: "Energizing Vinyasa", desc: "Build momentum with flowing movement", duration: "20 min", videoId: "9kOCY0KNByw" },
  happy: { title: "Joyful Vinyasa Flow", desc: "Channel your good energy into movement", duration: "30 min", videoId: "9kOCY0KNByw" },
  energetic: { title: "Power Yoga Sculpt", desc: "Harness your energy with strength poses", duration: "45 min", videoId: "kGOKN6MLMTQ" },
  sore: { title: "Restorative Yin Yoga", desc: "Deep stretches to soothe tight muscles", duration: "20 min", videoId: "2MJGg-dUKh0" },
  calm: { title: "Deep Mindfulness Meditation", desc: "Deepen your calm with stillness", duration: "15 min", videoId: "ZToicYcHIOU" },
  overwhelmed: { title: "5-Minute Reset", desc: "Quick breathing and grounding practice", duration: "5 min", videoId: "inpok4MKVLM" },
};

const quotes = [
  "The body benefits from movement, and the mind benefits from stillness.",
  "Yoga is not about touching your toes. It's about what you learn on the way down.",
  "Inhale the future, exhale the past.",
  "Your body is your home. Keep it clean and tidy.",
  "Peace comes from within. Do not seek it without.",
];

// Quick action panel content
const quickActions = [
  {
    id: "breathe",
    label: "Breathe",
    icon: Wind,
    color: "#6BB8A0",
    title: "Box Breathing",
    subtitle: "4-4-4-4 breathing to calm your mind",
    steps: [
      { name: "Inhale", duration: 4, desc: "Breathe in slowly through your nose", color: "#6BB8A0" },
      { name: "Hold", duration: 4, desc: "Hold your breath gently", color: "#B8A8D5" },
      { name: "Exhale", duration: 4, desc: "Breathe out slowly through your mouth", color: "#7B9EC5" },
      { name: "Hold", duration: 4, desc: "Rest before the next breath", color: "#E8A87C" },
    ],
  },
  {
    id: "meditate",
    label: "Meditate",
    icon: Brain,
    color: "#B8A8D5",
    title: "Quick Meditation",
    subtitle: "5-minute mindfulness reset",
    videoId: "inpok4MKVLM",
    steps: [
      { name: "Sit comfortably", duration: 0, desc: "Find a comfortable seated position. Close your eyes.", color: "#B8A8D5" },
      { name: "Focus on breath", duration: 0, desc: "Notice each inhale and exhale. Don't control it.", color: "#7B9EC5" },
      { name: "Observe thoughts", duration: 0, desc: "When thoughts arise, gently return to your breath.", color: "#6BB8A0" },
      { name: "Body scan", duration: 0, desc: "Scan from head to toe, releasing tension you find.", color: "#E8A87C" },
      { name: "Gratitude", duration: 0, desc: "Think of 3 things you are grateful for right now.", color: "#D4A853" },
    ],
  },
  {
    id: "energize",
    label: "Energize",
    icon: Zap,
    color: "#D4A853",
    title: "Energy Boost Flow",
    subtitle: "Quick sequence to wake up your body",
    videoId: "4C-gxOE0j7s",
    steps: [
      { name: "Sun Salutation A", duration: 0, desc: "Flow through 3 rounds of Sun Salutation A", color: "#D4A853" },
      { name: "Standing Forward Fold", duration: 0, desc: "Hang heavy, release tension in hamstrings", color: "#6BB8A0" },
      { name: "Warrior I & II", duration: 0, desc: "Hold each warrior pose for 5 breaths per side", color: "#E88A7C" },
      { name: "Chair Pose", duration: 0, desc: "Hold chair pose for 10 breaths to build heat", color: "#B8A8D5" },
      { name: "Final Breath", duration: 0, desc: "3 energizing inhales through the nose, exhale through mouth", color: "#D4A853" },
    ],
  },
  {
    id: "sleep",
    label: "Sleep",
    icon: Moon,
    color: "#7B9EC5",
    title: "Sleep Prep Routine",
    subtitle: "Wind-down sequence for deep rest",
    videoId: "1vx8iUvfyCY",
    steps: [
      { name: "Legs Up the Wall", duration: 0, desc: "Lie with legs up the wall for 3–5 minutes", color: "#7B9EC5" },
      { name: "Supine Twist", duration: 0, desc: "Gently twist each side, 5 breaths per side", color: "#B8A8D5" },
      { name: "Child's Pose", duration: 0, desc: "Rest in child's pose for 10 slow breaths", color: "#6BB8A0" },
      { name: "4-7-8 Breathing", duration: 0, desc: "Inhale 4, hold 7, exhale 8. Repeat 4 times.", color: "#D4A853" },
      { name: "Body Scan", duration: 0, desc: "Scan your body from toes to head, letting go", color: "#7B9EC5" },
    ],
  },
];

function QuickActionPanel({ action, onClose }: { action: typeof quickActions[0]; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState(0);

  const startBreathing = () => {
    setBreathing(true);
    setPhase(0);
    setBreathCount(0);
    let p = 0;
    let t = 0;
    const steps = action.steps;
    const interval = setInterval(() => {
      t++;
      const dur = steps[p].duration || 4;
      if (t >= dur) {
        t = 0;
        p = (p + 1) % steps.length;
        if (p === 0) setBreathCount(c => c + 1);
        setPhase(p);
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px", margin: "0 auto",
          backgroundColor: "var(--background)",
          borderRadius: "24px 24px 0 0",
          maxHeight: "88dvh", overflowY: "auto",
          paddingBottom: "32px",
        }}
      >
        <div style={{ padding: "12px 20px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{
          margin: "16px 20px",
          background: `linear-gradient(135deg, ${action.color}, ${action.color}88)`,
          borderRadius: "20px", padding: "20px",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            backgroundColor: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <action.icon size={24} color="white" />
          </div>
          <div>
            <h3 style={{ color: "#fff", margin: 0 }}>{action.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: 0 }}>{action.subtitle}</p>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="white" />
          </button>
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Video option for non-breathing actions */}
          {"videoId" in action && action.videoId && (
            <div style={{ marginBottom: "16px" }}>
              <button
                onClick={() => window.open(`https://www.youtube.com/watch?v=${action.videoId}`, "_blank", "noopener,noreferrer")}
                style={{
                  width: "100%", padding: "14px", borderRadius: "14px", border: "none",
                  background: `linear-gradient(135deg, ${action.color}, ${action.color}88)`,
                  color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  fontFamily: "inherit",
                }}
              >
                <Play size={16} fill="white" /> Watch Guided Video on YouTube
              </button>
            </div>
          )}

          {/* Breathing animation for breathe action */}
          {action.id === "breathe" && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              {breathing ? (
                <div>
                  <motion.div
                    animate={{
                      scale: phase === 0 ? [1, 1.5] : phase === 1 ? 1.5 : phase === 2 ? [1.5, 1] : 1,
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    style={{
                      width: "120px", height: "120px", borderRadius: "50%",
                      backgroundColor: action.steps[phase].color + "33",
                      border: `3px solid ${action.steps[phase].color}`,
                      margin: "0 auto 16px",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "18px", fontWeight: "700", color: action.steps[phase].color }}>
                      {action.steps[phase].name}
                    </span>
                  </motion.div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "8px" }}>
                    {action.steps[phase].desc}
                  </p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "12px", marginBottom: "16px" }}>
                    Cycle {breathCount + 1}
                  </p>
                  <button onClick={() => setBreathing(false)} style={{
                    padding: "10px 24px", borderRadius: "12px", border: "none",
                    backgroundColor: "var(--muted)", color: "var(--muted-foreground)",
                    cursor: "pointer", fontSize: "14px", fontFamily: "inherit",
                  }}>Stop</button>
                </div>
              ) : (
                <button onClick={startBreathing} style={{
                  padding: "14px 32px", borderRadius: "14px", border: "none",
                  backgroundColor: action.color, color: "#fff",
                  fontSize: "15px", fontWeight: "600", cursor: "pointer",
                  fontFamily: "inherit",
                }}>Start Breathing Exercise</button>
              )}
            </div>
          )}

          {/* Steps */}
          <h4 style={{ color: "var(--foreground)", marginBottom: "12px", fontSize: "14px" }}>
            {action.id === "breathe" ? "How it works" : "Steps"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {action.steps.map((s, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: "14px", borderRadius: "14px", cursor: "pointer",
                  border: `1.5px solid ${activeStep === i ? s.color : "var(--border)"}`,
                  backgroundColor: activeStep === i ? s.color + "11" : "var(--card)",
                  display: "flex", gap: "12px", alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: s.color + "33", border: `2px solid ${s.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: "700", color: s.color,
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--foreground)", marginBottom: "3px" }}>
                    {s.name} {s.duration > 0 && <span style={{ fontSize: "12px", color: s.color, marginLeft: "4px" }}>{s.duration}s</span>}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--muted-foreground)", lineHeight: "1.4" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Video session modal — opens thumbnail preview then launches YouTube
function SessionModal({ title, videoId, onClose }: { title: string; videoId: string; onClose: () => void }) {
  const openYT = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank", "noopener,noreferrer");
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 80, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "480px", margin: "auto", padding: "0 16px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ color: "#fff", margin: 0, fontSize: "16px" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "10px", width: "34px", height: "34px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="white" />
          </button>
        </div>
        <div
          onClick={openYT}
          style={{
            borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9", cursor: "pointer",
            background: `url(https://img.youtube.com/vi/${videoId}/mqdefault.jpg) center/cover`,
            backgroundColor: "#1a1a1a", position: "relative",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Play size={28} fill="#FF0000" color="#FF0000" style={{ marginLeft: "4px" }} />
            </div>
            <div style={{
              padding: "6px 14px", borderRadius: "20px",
              backgroundColor: "rgba(0,0,0,0.65)",
              color: "#fff", fontSize: "13px", fontWeight: "600",
            }}>Tap to Watch on YouTube</div>
          </div>
        </div>
        <button
          onClick={openYT}
          style={{
            width: "100%", marginTop: "12px", padding: "14px", borderRadius: "14px", border: "none",
            backgroundColor: "#FF0000", color: "#fff",
            fontSize: "15px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            fontFamily: "inherit",
          }}
        >
          <Play size={16} fill="white" /> Open in YouTube
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Home({ profile, darkMode, onGoToLibrary }: HomeProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodConfirmed, setMoodConfirmed] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [activeQuickAction, setActiveQuickAction] = useState<typeof quickActions[0] | null>(null);
  const [sessionModal, setSessionModal] = useState<{ title: string; videoId: string } | null>(null);

  const wellnessScore = Math.min(100, 60 + (profile.goals?.length || 0) * 3 + (profile.bmi > 0 ? 5 : 0));
  const quote = quotes[new Date().getDay() % quotes.length];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const rec = selectedMood ? moodRecs[selectedMood] : null;

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, var(--wellness-teal) 0%, #2A7A68 100%)",
        padding: "52px 24px 28px",
        borderRadius: "0 0 28px 28px",
      }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", marginBottom: "4px" }}>{greeting}</p>
        <h2 style={{ color: "#fff", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
          {profile.name || "Wellness Seeker"} 🌿
        </h2>

        {/* Wellness Score */}
        <div style={{
          display: "flex", alignItems: "center", gap: "16px",
          backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "18px", padding: "14px 16px",
        }}>
          <div style={{ position: "relative", width: "58px", height: "58px", flexShrink: 0 }}>
            <svg viewBox="0 0 58 58" style={{ transform: "rotate(-90deg)", width: "58px", height: "58px" }}>
              <circle cx="29" cy="29" r="23" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
              <circle cx="29" cy="29" r="23" fill="none" stroke="#fff" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 23 * wellnessScore / 100} ${2 * Math.PI * 23}`}
                strokeLinecap="round" />
            </svg>
            <span style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              color: "#fff", fontSize: "13px", fontWeight: "700",
            }}>{wellnessScore}</span>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Wellness Score</div>
            <div style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginTop: "2px" }}>
              {wellnessScore >= 80 ? "Excellent!" : wellnessScore >= 65 ? "Great Progress!" : "Keep Going!"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", marginTop: "2px" }}>
              Based on your profile & goals
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "center" }}>
            <div style={{ color: "#fff", fontSize: "15px", fontWeight: "700" }}>{profile.goals?.length || 0}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>Goals set</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px 0" }}>
        {/* Mood Check-In */}
        <AnimatePresence>
          {!moodConfirmed && (
            <motion.div
              key="mood-check"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                backgroundColor: "var(--card)", borderRadius: "20px",
                padding: "18px", marginBottom: "20px",
                border: "1.5px solid var(--border)",
              }}
            >
              {!selectedMood ? (
                <>
                  <h3 style={{ color: "var(--foreground)", marginBottom: "4px", fontSize: "15px" }}>How are you feeling?</h3>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "14px" }}>
                    We'll personalize today's session for you
                  </p>
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {moods.map(m => (
                      <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{
                        flexShrink: 0, padding: "10px 12px", borderRadius: "12px",
                        border: "1.5px solid var(--border)", backgroundColor: "var(--muted)",
                        cursor: "pointer", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "4px", fontFamily: "inherit",
                      }}>
                        <span style={{ fontSize: "20px" }}>{m.emoji}</span>
                        <span style={{ fontSize: "10px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : rec ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                      {moods.find(m => m.id === selectedMood)?.emoji} Feeling {moods.find(m => m.id === selectedMood)?.label}
                    </span>
                    <button onClick={() => setSelectedMood(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: "12px", fontFamily: "inherit" }}>
                      Change
                    </button>
                  </div>
                  <div style={{
                    background: (moods.find(m => m.id === selectedMood)?.color || "#6BB8A0") + "15",
                    borderRadius: "14px", padding: "14px",
                    border: `1.5px solid ${moods.find(m => m.id === selectedMood)?.color || "#6BB8A0"}44`,
                  }}>
                    <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "4px" }}>Recommended for you</div>
                    <div style={{ fontWeight: "600", color: "var(--foreground)", marginBottom: "4px" }}>{rec.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "12px" }}>{rec.desc} · {rec.duration}</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setSessionModal({ title: rec.title, videoId: rec.videoId })} style={{
                        padding: "9px 16px", borderRadius: "10px", border: "none",
                        backgroundColor: "var(--wellness-teal)", color: "#fff",
                        fontSize: "13px", fontWeight: "600", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit",
                      }}>
                        <Play size={12} fill="white" /> Start Session
                      </button>
                      <button onClick={() => setMoodConfirmed(true)} style={{
                        padding: "9px 16px", borderRadius: "10px",
                        border: "1.5px solid var(--border)", backgroundColor: "transparent",
                        fontSize: "13px", color: "var(--muted-foreground)", cursor: "pointer", fontFamily: "inherit",
                      }}>
                        Skip
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Session */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ color: "var(--foreground)", margin: 0 }}>Today's Session</h3>
            <button onClick={onGoToLibrary} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--wellness-teal)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px", fontFamily: "inherit" }}>
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div style={{
            borderRadius: "20px", overflow: "hidden", position: "relative",
            background: "linear-gradient(135deg, #2A7A68, #1A5A50)", padding: "24px",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: "55%",
              background: "url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&auto=format) center/cover",
              opacity: 0.25,
            }} />
            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-block", padding: "4px 10px", borderRadius: "20px",
                backgroundColor: "rgba(255,255,255,0.2)", color: "#fff",
                fontSize: "10px", fontWeight: "700", marginBottom: "10px", letterSpacing: "0.5px",
              }}>DAILY PICK</div>
              <h3 style={{ color: "#fff", margin: "0 0 6px", fontFamily: "var(--font-display)" }}>Morning Flow Yoga</h3>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", margin: "0 0 14px" }}>
                Vinyasa · Beginner Friendly
              </p>
              <div style={{ display: "flex", gap: "14px", marginBottom: "18px" }}>
                {[
                  { icon: Clock, val: "20 min" },
                  { icon: Flame, val: "~150 cal" },
                  { icon: Star, val: "4.9 ★" },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.val} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Icon size={12} color="rgba(255,255,255,0.75)" />
                      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>{s.val}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setSessionModal({ title: "Morning Flow Yoga", videoId: "4C-gxOE0j7s" })}
                style={{
                  padding: "10px 20px", borderRadius: "12px", border: "none",
                  backgroundColor: "#fff", color: "var(--wellness-teal)",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px", fontFamily: "inherit",
                }}>
                <Play size={14} fill="var(--wellness-teal)" /> Start Session
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
          {quickActions.map(q => {
            const Icon = q.icon;
            return (
              <button key={q.id} onClick={() => setActiveQuickAction(q)} style={{
                padding: "14px 6px", borderRadius: "16px",
                border: "1.5px solid var(--border)", backgroundColor: "var(--card)",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: "7px", fontFamily: "inherit",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "12px",
                  backgroundColor: q.color + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={q.color} />
                </div>
                <span style={{ fontSize: "11px", color: "var(--foreground)", fontWeight: "500" }}>{q.label}</span>
              </button>
            );
          })}
        </div>

        {/* Water Tracker */}
        <div style={{
          backgroundColor: "var(--card)", borderRadius: "20px", padding: "18px",
          border: "1.5px solid var(--border)", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Droplets size={18} color="#7B9EC5" />
              <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--foreground)" }}>Water Intake</span>
            </div>
            <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{waterIntake}/8 glasses</span>
          </div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <button key={i} onClick={() => setWaterIntake(i + 1)} style={{
                flex: 1, height: "30px", borderRadius: "8px", border: "none", cursor: "pointer",
                backgroundColor: i < waterIntake ? "#7B9EC5" : "var(--muted)",
                transition: "background-color 0.2s",
              }} />
            ))}
          </div>
          <button onClick={() => setWaterIntake(Math.min(8, waterIntake + 1))} style={{
            width: "100%", padding: "10px", borderRadius: "10px",
            border: "1.5px solid #7B9EC533", backgroundColor: "#7B9EC511",
            color: "#7B9EC5", cursor: "pointer", fontSize: "13px", fontWeight: "500",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            fontFamily: "inherit",
          }}>
            <Plus size={14} /> Add Glass
          </button>
        </div>

        {/* Daily Quote */}
        <div style={{
          background: "linear-gradient(135deg, var(--wellness-lavender)22, var(--wellness-sage)22)",
          borderRadius: "20px", padding: "20px",
          border: "1.5px solid var(--wellness-lavender)33",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <MessageSquare size={20} color="var(--wellness-lavender)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p style={{
                color: "var(--foreground)", fontSize: "14px", lineHeight: "1.6", margin: 0,
                fontStyle: "italic", fontFamily: "var(--font-display)",
              }}>{quote}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "12px", margin: "8px 0 0" }}>Daily Wisdom</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div style={{
          backgroundColor: "var(--card)", borderRadius: "20px", padding: "18px",
          border: "1.5px solid var(--border)",
        }}>
          <h3 style={{ color: "var(--foreground)", margin: "0 0 14px", fontSize: "15px" }}>Your Profile</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {[
              { label: "Experience", value: profile.experience ? profile.experience.replace(/-/g, " ") : "Not set" },
              { label: "Skill Level", value: profile.skillLevel ? profile.skillLevel.replace(/-/g, " ") : "Not set" },
              { label: "Daily Time", value: profile.dailyTime || "Not set" },
              { label: "BMI", value: profile.bmi > 0 ? `${profile.bmi} (${profile.bmiCategory})` : "Not set" },
            ].map(item => (
              <div key={item.label} style={{
                padding: "12px", borderRadius: "12px", backgroundColor: "var(--muted)",
              }}>
                <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "3px" }}>{item.label}</div>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--foreground)", textTransform: "capitalize" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {(profile.goals?.length || 0) > 0 && (
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "8px" }}>Your Goals</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {profile.goals?.slice(0, 6).map(g => (
                  <span key={g} style={{
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11px",
                    backgroundColor: "var(--wellness-teal)22", color: "var(--wellness-teal)",
                    fontWeight: "500", textTransform: "capitalize",
                  }}>{g.replace(/-/g, " ")}</span>
                ))}
                {(profile.goals?.length || 0) > 6 && (
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
                    +{(profile.goals?.length || 0) - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Panel */}
      <AnimatePresence>
        {activeQuickAction && (
          <QuickActionPanel action={activeQuickAction} onClose={() => setActiveQuickAction(null)} />
        )}
      </AnimatePresence>

      {/* Session Modal */}
      <AnimatePresence>
        {sessionModal && (
          <SessionModal title={sessionModal.title} videoId={sessionModal.videoId} onClose={() => setSessionModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
