import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Flame, Clock, CheckCircle2, Target, Award, Calendar, Scale, Plus, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { UserProfile } from "./onboarding";
import { sql } from "../../lib/db";
import { Auth } from "../../lib/auth";

interface ProgressProps {
  profile: UserProfile;
}

interface SessionLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  title: string;
  category: string;
  durationMinutes: number;
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const QUICK_LOG_OPTIONS = [
  { title: "Morning Yoga", category: "yoga", duration: 20 },
  { title: "Meditation", category: "meditation", duration: 10 },
  { title: "Breathwork", category: "breathwork", duration: 10 },
  { title: "Pilates", category: "pilates", duration: 30 },
  { title: "Stretching", category: "stretching", duration: 15 },
  { title: "Sleep Yoga", category: "sleep", duration: 20 },
];

const ACHIEVEMENTS = [
  {
    id: "first_session",
    title: "First Step",
    desc: "Log your very first session",
    emoji: "🌱",
    check: (logs: SessionLog[]) => logs.length >= 1,
  },
  {
    id: "five_sessions",
    title: "Getting Started",
    desc: "Complete 5 sessions",
    emoji: "✨",
    check: (logs: SessionLog[]) => logs.length >= 5,
  },
  {
    id: "ten_sessions",
    title: "Dedicated Practice",
    desc: "Complete 10 sessions",
    emoji: "🏅",
    check: (logs: SessionLog[]) => logs.length >= 10,
  },
  {
    id: "streak_3",
    title: "3-Day Streak",
    desc: "Practice 3 days in a row",
    emoji: "🔥",
    check: (logs: SessionLog[]) => calcStreak(logs) >= 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    desc: "Practice 7 days in a row",
    emoji: "⚡",
    check: (logs: SessionLog[]) => calcStreak(logs) >= 7,
  },
  {
    id: "hour_total",
    title: "1 Hour Club",
    desc: "Accumulate 60+ minutes of practice",
    emoji: "⏱️",
    check: (logs: SessionLog[]) => logs.reduce((s, l) => s + l.durationMinutes, 0) >= 60,
  },
  {
    id: "yoga_5",
    title: "Yoga Flow",
    desc: "Complete 5 yoga sessions",
    emoji: "🧘",
    check: (logs: SessionLog[]) => logs.filter(l => l.category === "yoga").length >= 5,
  },
  {
    id: "mindful_5",
    title: "Mindful Mind",
    desc: "Complete 5 meditation sessions",
    emoji: "🌙",
    check: (logs: SessionLog[]) => logs.filter(l => l.category === "meditation").length >= 5,
  },
];

function calcStreak(logs: SessionLog[]): number {
  if (!logs.length) return 0;
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse();
  const today = getTodayStr();
  let streak = 0;
  let current = today;
  for (const d of dates) {
    if (d === current) {
      streak++;
      const prev = new Date(current);
      prev.setDate(prev.getDate() - 1);
      current = prev.toISOString().slice(0, 10);
    } else if (d < current) {
      break;
    }
  }
  return streak;
}

function LogModal({ onClose, onLog }: { onClose: () => void; onLog: (s: SessionLog) => void }) {
  const [selected, setSelected] = useState<typeof QUICK_LOG_OPTIONS[0] | null>(null);
  const [custom, setCustom] = useState({ title: "", duration: "20" });
  const [mode, setMode] = useState<"quick" | "custom">("quick");

  const handleLog = () => {
    if (mode === "quick" && selected) {
      onLog({
        id: Date.now().toString(),
        date: getTodayStr(),
        title: selected.title,
        category: selected.category,
        durationMinutes: selected.duration,
      });
    } else if (mode === "custom" && custom.title) {
      onLog({
        id: Date.now().toString(),
        date: getTodayStr(),
        title: custom.title,
        category: "yoga",
        durationMinutes: parseInt(custom.duration) || 20,
      });
    }
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
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px", margin: "0 auto",
          backgroundColor: "var(--background)",
          borderRadius: "24px 24px 0 0",
          padding: "8px 20px 40px",
        }}
      >
        <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: "var(--border)", margin: "0 auto 20px" }} />
        <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--foreground)", marginBottom: "16px" }}>Log a Session</h3>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {(["quick", "custom"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px", borderRadius: "10px", border: "1.5px solid",
              borderColor: mode === m ? "var(--wellness-teal)" : "var(--border)",
              backgroundColor: mode === m ? "var(--wellness-teal)15" : "transparent",
              color: mode === m ? "var(--wellness-teal)" : "var(--muted-foreground)",
              cursor: "pointer", fontWeight: "600", fontSize: "13px",
            }}>
              {m === "quick" ? "Quick Log" : "Custom"}
            </button>
          ))}
        </div>

        {mode === "quick" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
            {QUICK_LOG_OPTIONS.map(opt => (
              <button key={opt.title} onClick={() => setSelected(opt)} style={{
                padding: "12px", borderRadius: "12px", border: "1.5px solid",
                borderColor: selected?.title === opt.title ? "var(--wellness-teal)" : "var(--border)",
                backgroundColor: selected?.title === opt.title ? "var(--wellness-teal)15" : "var(--card)",
                cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>{opt.title}</div>
                <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>{opt.duration} min</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              placeholder="Session name (e.g. Evening Stretch)"
              value={custom.title}
              onChange={e => setCustom(c => ({ ...c, title: e.target.value }))}
              style={{
                width: "100%", padding: "12px", borderRadius: "12px",
                border: "1.5px solid var(--border)", backgroundColor: "var(--card)",
                color: "var(--foreground)", fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>Duration (min)</label>
              <input
                type="number"
                value={custom.duration}
                onChange={e => setCustom(c => ({ ...c, duration: e.target.value }))}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: "1.5px solid var(--border)", backgroundColor: "var(--card)",
                  color: "var(--foreground)", fontSize: "14px",
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleLog}
          disabled={mode === "quick" ? !selected : !custom.title}
          style={{
            width: "100%", padding: "14px", borderRadius: "14px", border: "none",
            background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
            color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer",
            opacity: (mode === "quick" ? !selected : !custom.title) ? 0.4 : 1,
          }}
        >
          Log Session
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Progress({ profile }: ProgressProps) {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    async function loadSessions() {
      const uid = Auth.getUserId();
      if (!uid) return;
      try {
        const dbSessions = await sql`
          SELECT id, to_char(date, 'YYYY-MM-DD') as date, title, category, duration_minutes as "durationMinutes"
          FROM sessions
          WHERE user_id = ${Number(uid)}
          ORDER BY date DESC, created_at DESC
        `;
        setLogs(dbSessions || []);
      } catch (err) {
        console.error('[progress] Error loading sessions:', err);
      }
    }
    loadSessions();
  }, []);

  const today = getTodayStr();
  const weekDates = getWeekDates(weekOffset);

  const handleLog = async (session: SessionLog) => {
    const uid = Auth.getUserId();
    if (!uid) return;

    // Optimistic Update: Add log and close modal instantly
    const updated = [...logs, session];
    setLogs(updated);
    setShowLog(false);

    try {
      await sql`
        INSERT INTO sessions (id, user_id, date, title, category, duration_minutes)
        VALUES (${session.id}, ${Number(uid)}, ${session.date}, ${session.title}, ${session.category}, ${session.durationMinutes})
      `;
    } catch (err) {
      console.error('[progress] Error saving session:', err);
      // Rollback state on error
      setLogs(logs);
    }
  };

  const removeLog = async (id: string) => {
    const uid = Auth.getUserId();
    if (!uid) return;

    // Optimistic Update: Remove log instantly
    const previousLogs = [...logs];
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);

    try {
      await sql`
        DELETE FROM sessions
        WHERE id = ${id} AND user_id = ${Number(uid)}
      `;
    } catch (err) {
      console.error('[progress] Error removing session:', err);
      // Rollback state on error
      setLogs(previousLogs);
    }
  };

  // Stats
  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((s, l) => s + l.durationMinutes, 0);
  const streak = calcStreak(logs);
  const activeDays = new Set(logs.map(l => l.date)).size;

  // Weekly bar chart data
  const weeklyChartData = weekDates.map((date, i) => {
    const dayLogs = logs.filter(l => l.date === date);
    return {
      day: DAY_LABELS[i],
      minutes: dayLogs.reduce((s, l) => s + l.durationMinutes, 0),
      sessions: dayLogs.length,
      isToday: date === today,
    };
  });

  // Calendar
  const calLogDates = new Set(logs.map(l => l.date));
  const firstDay = new Date(calMonth.year, calMonth.month, 1);
  const lastDay = new Date(calMonth.year, calMonth.month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
  const calDays: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => i + 1),
  ];
  const calDateStr = (d: number) =>
    `${calMonth.year}-${String(calMonth.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // Achievements
  const earned = ACHIEVEMENTS.filter(a => a.check(logs));
  const locked = ACHIEVEMENTS.filter(a => !a.check(logs));

  // Recent logs (last 5)
  const recentLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 8);

  const isEmpty = logs.length === 0;

  return (
    <div style={{ paddingBottom: "90px", minHeight: "100dvh", backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 20px", background: "linear-gradient(135deg, var(--wellness-teal)18, transparent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", marginBottom: "4px" }}>Your Progress</h1>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Track every step of your journey</p>
          </div>
          <button
            onClick={() => setShowLog(true)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
              color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer",
              boxShadow: "0 4px 12px var(--wellness-teal)55",
            }}
          >
            <Plus size={15} />
            Log
          </button>
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
          {[
            { icon: Flame, label: "Streak", value: streak > 0 ? `${streak}d` : "—", color: "#FF6B6B" },
            { icon: CheckCircle2, label: "Sessions", value: totalSessions || "—", color: "var(--wellness-teal)" },
            { icon: Clock, label: "Minutes", value: totalMinutes > 0 ? totalMinutes : "—", color: "var(--wellness-indigo)" },
            { icon: Calendar, label: "Active Days", value: activeDays || "—", color: "var(--wellness-gold)" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{
                backgroundColor: "var(--card)", borderRadius: "14px",
                padding: "12px 8px", textAlign: "center",
                border: "1px solid var(--border)",
              }}>
                <Icon size={16} color={stat.color} style={{ marginBottom: "6px" }} />
                <div style={{ fontSize: "17px", fontWeight: "800", color: "var(--foreground)", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "3px" }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* BMI Card */}
        {profile.bmi && (
          <div style={{
            backgroundColor: "var(--card)", borderRadius: "16px",
            padding: "16px", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "14px",
              background: "linear-gradient(135deg, var(--wellness-sage)30, var(--wellness-sage)10)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Scale size={20} color="var(--wellness-sage)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "2px" }}>BMI from Profile</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--foreground)" }}>{profile.bmi.toFixed(1)}</span>
                <span style={{
                  fontSize: "12px", fontWeight: "600", padding: "2px 8px", borderRadius: "20px",
                  backgroundColor: profile.bmiCategory === "Healthy" ? "var(--wellness-teal)25" : "var(--wellness-gold)25",
                  color: profile.bmiCategory === "Healthy" ? "var(--wellness-teal)" : "var(--wellness-gold)",
                }}>{profile.bmiCategory}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "2px" }}>
                {profile.height}cm · {profile.weight}kg
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Goal</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginTop: "2px" }}>
                {profile.goals.slice(0, 1).map(g => g.replace(/-/g, " ")).join("") || "Wellness"}
              </div>
            </div>
          </div>
        )}

        {/* Weekly Activity Chart */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", padding: "16px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>Weekly Activity</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button onClick={() => setWeekOffset(o => o - 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px" }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: "12px", color: "var(--muted-foreground)", minWidth: "60px", textAlign: "center" }}>
                {weekOffset === 0 ? "This Week" : weekOffset === -1 ? "Last Week" : `${Math.abs(weekOffset)}w ago`}
              </span>
              <button onClick={() => setWeekOffset(o => Math.min(0, o + 1))} style={{ background: "none", border: "none", cursor: "pointer", color: weekOffset === 0 ? "var(--border)" : "var(--muted-foreground)", padding: "4px" }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {isEmpty && weekOffset === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted-foreground)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌿</div>
              <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>No sessions yet</div>
              <div style={{ fontSize: "12px" }}>Tap "Log" above to record your first session</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyChartData} barSize={24}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`${v} min`, "Practice"]}
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "12px" }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                  {weeklyChartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.isToday ? "var(--wellness-teal)" : entry.minutes > 0 ? "var(--wellness-teal)80" : "var(--border)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>
                {weeklyChartData.reduce((s, d) => s + d.minutes, 0)}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>min</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>
                {weeklyChartData.reduce((s, d) => s + d.sessions, 0)}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>sessions</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>
                {weeklyChartData.filter(d => d.sessions > 0).length}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>active days</div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", padding: "16px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>
              {MONTH_NAMES[calMonth.month]} {calMonth.year}
            </h3>
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => setCalMonth(m => {
                const d = new Date(m.year, m.month - 1, 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px" }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setCalMonth(m => {
                const d = new Date(m.year, m.month + 1, 1);
                const now = new Date();
                if (d > now) return m;
                return { year: d.getFullYear(), month: d.getMonth() };
              })} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: "4px" }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center" }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} style={{ fontSize: "11px", color: "var(--muted-foreground)", padding: "4px 0", fontWeight: "600" }}>{d}</div>
            ))}
            {calDays.map((d, i) => {
              if (!d) return <div key={i} />;
              const ds = calDateStr(d);
              const hasLog = calLogDates.has(ds);
              const isToday = ds === today;
              return (
                <div key={i} style={{
                  aspectRatio: "1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "8px",
                  backgroundColor: hasLog ? "var(--wellness-teal)" : isToday ? "var(--wellness-teal)20" : "transparent",
                  border: isToday && !hasLog ? "1.5px solid var(--wellness-teal)" : "none",
                  fontSize: "12px", fontWeight: hasLog || isToday ? "700" : "400",
                  color: hasLog ? "#fff" : isToday ? "var(--wellness-teal)" : "var(--foreground)",
                }}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Sessions */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", padding: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", marginBottom: "12px" }}>Recent Sessions</h3>
          {recentLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted-foreground)", fontSize: "13px" }}>
              No sessions logged yet. Tap "Log" to get started!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentLogs.map(log => (
                <div key={log.id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "12px",
                  backgroundColor: "var(--background)", border: "1px solid var(--border)",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: "linear-gradient(135deg, var(--wellness-teal)30, var(--wellness-teal)10)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontSize: "16px",
                  }}>
                    {log.category === "yoga" ? "🧘" : log.category === "meditation" ? "🌙" : log.category === "breathwork" ? "🌬️" : log.category === "pilates" ? "💪" : log.category === "stretching" ? "🤸" : "😴"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                      {log.date === today ? "Today" : log.date === new Date(Date.now() - 86400000).toISOString().slice(0, 10) ? "Yesterday" : log.date} · {log.durationMinutes} min
                    </div>
                  </div>
                  <button onClick={() => removeLog(log.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--muted-foreground)", padding: "4px", flexShrink: 0, fontSize: "16px",
                  }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals from Profile */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", padding: "16px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Target size={16} color="var(--wellness-teal)" />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>Your Goals</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(profile.goals || []).map(goal => (
              <span key={goal} style={{
                padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                backgroundColor: "var(--wellness-teal)18", color: "var(--wellness-teal)",
                border: "1px solid var(--wellness-teal)40",
              }}>
                {goal.replace(/-/g, " ")}
              </span>
            ))}
            {(profile.goals || []).length === 0 && (
              <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>No goals set in profile.</span>
            )}
          </div>
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)", display: "flex", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Level</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginTop: "2px", textTransform: "capitalize" }}>{(profile.skillLevel || "").replace(/-/g, " ") || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Daily Time</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginTop: "2px" }}>{profile.dailyTime || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Per Week</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginTop: "2px" }}>{profile.weeklyCommitment || "—"}x</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", padding: "16px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Award size={16} color="var(--wellness-gold)" />
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)" }}>Achievements</h3>
            <span style={{ fontSize: "12px", color: "var(--muted-foreground)", marginLeft: "auto" }}>{earned.length}/{ACHIEVEMENTS.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {earned.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "12px",
                backgroundColor: "var(--wellness-gold)12", border: "1px solid var(--wellness-gold)35",
              }}>
                <span style={{ fontSize: "20px" }}>{a.emoji}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{a.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{a.desc}</div>
                </div>
              </div>
            ))}
            {locked.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "12px",
                backgroundColor: "var(--background)", border: "1px solid var(--border)", opacity: 0.6,
              }}>
                <span style={{ fontSize: "20px", filter: "grayscale(1)" }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted-foreground)" }}>{a.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{a.desc}</div>
                </div>
                <Lock size={13} color="var(--muted-foreground)" />
              </div>
            ))}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {showLog && <LogModal onClose={() => setShowLog(false)} onLog={handleLog} />}
      </AnimatePresence>
    </div>
  );
}
