import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Check, BookOpen, Heart, Wind, X, ChevronDown, ChevronRight } from "lucide-react";
import { sql } from "../../lib/db";
import { Auth } from "../../lib/auth";

export function BreathingTimer() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "hold2" | "idle">("idle");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phases: { name: typeof phase; label: string; duration: number; color: string }[] = [
    { name: "inhale", label: "Inhale", duration: 4, color: "#6BB8A0" },
    { name: "hold", label: "Hold", duration: 4, color: "#B8A8D5" },
    { name: "exhale", label: "Exhale", duration: 4, color: "#7B9EC5" },
    { name: "hold2", label: "Hold", duration: 4, color: "#E8A87C" },
  ];

  const currentPhase = phases.find(p => p.name === phase);
  const phaseIndex = phases.findIndex(p => p.name === phase);
  const progress = currentPhase ? count / currentPhase.duration : 0;

  useEffect(() => {
    if (!isRunning) return;
    let pi = 0;
    let c = 0;

    setPhase(phases[0].name);
    setCount(0);

    intervalRef.current = setInterval(() => {
      c++;
      if (c > phases[pi].duration) {
        pi = (pi + 1) % phases.length;
        if (pi === 0) setCycles(prev => prev + 1);
        c = 1;
        setPhase(phases[pi].name);
      }
      setCount(c);
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const stop = () => {
    setIsRunning(false);
    setPhase("idle");
    setCount(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const color = currentPhase?.color || "var(--wellness-teal)";
  const scale = phase === "inhale" ? 1 + (progress * 0.4) : phase === "exhale" ? 1.4 - (progress * 0.4) : phase === "hold" ? 1.4 : 1;

  return (
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "24px", padding: "24px",
      border: "1.5px solid var(--border)", textAlign: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
        <Wind size={18} color="var(--wellness-teal)" />
        <h3 style={{ color: "var(--foreground)", margin: 0 }}>Box Breathing</h3>
      </div>

      <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 20px" }}>
        <svg viewBox="0 0 160 160" style={{ position: "absolute", inset: 0 }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--muted)" strokeWidth="8" />
          {isRunning && currentPhase && (
            <circle
              cx="80" cy="80" r="70" fill="none"
              stroke={color} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 70 * progress} ${2 * Math.PI * 70}`}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px", transition: "stroke-dasharray 0.5s" }}
            />
          )}
        </svg>
        <motion.div
          animate={{ scale: isRunning ? scale : 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: "20px", borderRadius: "50%",
            backgroundColor: isRunning ? color + "33" : "var(--muted)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: "700", color: isRunning ? color : "var(--muted-foreground)" }}>
            {isRunning ? count : "4"}
          </span>
          <span style={{ fontSize: "12px", color: isRunning ? color : "var(--muted-foreground)" }}>
            {isRunning ? (currentPhase?.label || "") : "seconds"}
          </span>
        </motion.div>
      </div>

      {isRunning && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
          {phases.map((p, i) => (
            <div key={p.name} style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: i === phaseIndex ? p.color : "var(--muted)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      )}

      {isRunning && (
        <div style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "16px" }}>
          Cycle {cycles + 1} · {currentPhase?.label}
        </div>
      )}

      <button
        onClick={isRunning ? stop : () => setIsRunning(true)}
        style={{
          padding: "12px 32px", borderRadius: "14px", border: "none",
          backgroundColor: isRunning ? "var(--muted)" : "var(--wellness-teal)",
          color: isRunning ? "var(--muted-foreground)" : "#fff",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}
      >
        {isRunning ? "Stop" : "Start Breathing"}
      </button>
    </div>
  );
}

export function HabitTracker() {
  const [habits, setHabits] = useState<{ id: string; name: string; emoji: string; streak: number; done: boolean }[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadHabits() {
      const uid = Auth.getUserId();
      if (!uid) return;
      try {
        const dbHabits = await sql`
          SELECT id, name, emoji, streak, done
          FROM habits
          WHERE user_id = ${Number(uid)}
          ORDER BY created_at ASC
        `;
        if (!dbHabits || dbHabits.length === 0) {
          const defaults = [
            { id: "1", name: "Morning yoga", emoji: "🧘", streak: 7, done: true },
            { id: "2", name: "Drink 8 glasses", emoji: "💧", streak: 3, done: true },
            { id: "3", name: "10 min meditation", emoji: "🧠", streak: 5, done: false },
            { id: "4", name: "Gratitude journal", emoji: "📓", streak: 12, done: false },
            { id: "5", name: "Walk 10k steps", emoji: "👟", streak: 2, done: true },
          ];
          for (const item of defaults) {
            await sql`
              INSERT INTO habits (id, user_id, name, emoji, streak, done)
              VALUES (${item.id}, ${Number(uid)}, ${item.name}, ${item.emoji}, ${item.streak}, ${item.done})
            `;
          }
          setHabits(defaults);
        } else {
          setHabits(dbHabits);
        }
      } catch (err) {
        console.error('[habits] Error loading habits:', err);
      }
    }
    loadHabits();
  }, []);

  const toggle = async (id: string) => {
    const uid = Auth.getUserId();
    if (!uid) return;
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const nextDone = !habit.done;
    const nextStreak = nextDone ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    // Optimistic Update: Toggle checkbox state instantly in the UI
    const previousHabits = [...habits];
    setHabits(h => h.map(hab => hab.id === id ? { ...hab, done: nextDone, streak: nextStreak } : hab));

    try {
      await sql`
        UPDATE habits
        SET done = ${nextDone}, streak = ${nextStreak}
        WHERE id = ${id} AND user_id = ${Number(uid)}
      `;
    } catch (err) {
      console.error('[habits] Error toggling habit:', err);
      // Rollback state on error
      setHabits(previousHabits);
    }
  };

  const add = async () => {
    if (!newHabit.trim()) return;
    const uid = Auth.getUserId();
    if (!uid) return;
    const id = Date.now().toString();
    const item = { id, name: newHabit, emoji: "⭐", streak: 0, done: false };

    // Optimistic Update: Add habit and close input box instantly
    const previousHabits = [...habits];
    setHabits(h => [...h, item]);
    setNewHabit("");
    setAdding(false);

    try {
      await sql`
        INSERT INTO habits (id, user_id, name, emoji, streak, done)
        VALUES (${id}, ${Number(uid)}, ${item.name}, ${item.emoji}, ${item.streak}, ${item.done})
      `;
    } catch (err) {
      console.error('[habits] Error adding habit:', err);
      // Rollback state on error
      setHabits(previousHabits);
    }
  };

  const done = habits.filter(h => h.done).length;

  return (
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "24px", padding: "20px",
      border: "1.5px solid var(--border)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ color: "var(--foreground)", margin: "0 0 2px" }}>Daily Habits</h3>
          <p style={{ color: "var(--muted-foreground)", fontSize: "12px", margin: 0 }}>{done}/{habits.length} completed today</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          style={{
            width: "32px", height: "32px", borderRadius: "10px", border: "none",
            backgroundColor: "var(--wellness-teal)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Plus size={16} color="white" />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: "6px", borderRadius: "3px", backgroundColor: "var(--muted)", marginBottom: "16px" }}>
        <div style={{
          width: habits.length ? `${(done / habits.length) * 100}%` : "0%", height: "100%",
          borderRadius: "3px", backgroundColor: "var(--wellness-teal)",
          transition: "width 0.3s ease",
        }} />
      </div>

      {adding && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="New habit..."
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add()}
            autoFocus
            style={{
              flex: 1, padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid var(--wellness-teal)", backgroundColor: "var(--input-background)",
              color: "var(--foreground)", fontSize: "14px", outline: "none",
            }}
          />
          <button onClick={add} style={{ padding: "10px 14px", borderRadius: "10px", border: "none", backgroundColor: "var(--wellness-teal)", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Add</button>
          <button onClick={() => setAdding(false)} style={{ padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "var(--muted)", cursor: "pointer" }}>
            <X size={14} color="var(--muted-foreground)" />
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {habits.map(h => (
          <button
            key={h.id}
            onClick={() => toggle(h.id)}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px", borderRadius: "12px", border: "none",
              backgroundColor: h.done ? "var(--wellness-teal)11" : "var(--muted)",
              cursor: "pointer", textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
              backgroundColor: h.done ? "var(--wellness-teal)" : "var(--card)",
              border: h.done ? "none" : "2px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {h.done && <Check size={14} color="white" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: "16px" }}>{h.emoji}</span>
            <span style={{
              flex: 1, fontSize: "14px", fontWeight: "500",
              color: h.done ? "var(--wellness-teal)" : "var(--foreground)",
              textDecoration: h.done ? "line-through" : "none",
            }}>{h.name}</span>
            {h.streak > 0 && (
              <span style={{
                fontSize: "11px", color: "#E88A7C", fontWeight: "600",
                backgroundColor: "#E88A7C22", padding: "2px 6px", borderRadius: "6px",
              }}>🔥 {h.streak}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WellnessJournal() {
  const [activeTab, setActiveTab] = useState<"journal" | "gratitude">("journal");
  const [journalEntry, setJournalEntry] = useState("");
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadTodayEntries() {
      const uid = Auth.getUserId();
      if (!uid) return;
      try {
        const rows = await sql`
          SELECT entry_type, content, items
          FROM journal_entries
          WHERE user_id = ${Number(uid)} AND entry_date = CURRENT_DATE
          ORDER BY created_at DESC
        `;
        if (rows && rows.length > 0) {
          const jEntry = rows.find((r: any) => r.entry_type === 'journal');
          const gEntry = rows.find((r: any) => r.entry_type === 'gratitude');
          if (jEntry) setJournalEntry(jEntry.content || "");
          if (gEntry) {
            const items = gEntry.items || [];
            setGratitudeItems([items[0] || "", items[1] || "", items[2] || ""]);
          }
        }
      } catch (err) {
        console.error('[journal] Error loading today entries:', err);
      }
    }
    loadTodayEntries();
  }, [activeTab]);

  const save = async () => {
    const uid = Auth.getUserId();
    if (!uid) return;

    // Optimistic Update: Set saved state immediately to give instant UI response
    setSaved(true);
    const savedTimeout = setTimeout(() => setSaved(false), 2000);

    try {
      if (activeTab === "journal") {
        if (!journalEntry.trim()) {
          clearTimeout(savedTimeout);
          setSaved(false);
          return;
        }
        await sql`
          INSERT INTO journal_entries (user_id, entry_type, content, entry_date)
          VALUES (${Number(uid)}, 'journal', ${journalEntry}, CURRENT_DATE)
        `;
      } else {
        const filtered = gratitudeItems.filter(item => item.trim() !== "");
        if (filtered.length === 0) {
          clearTimeout(savedTimeout);
          setSaved(false);
          return;
        }
        await sql`
          INSERT INTO journal_entries (user_id, entry_type, items, entry_date)
          VALUES (${Number(uid)}, 'gratitude', ${filtered}, CURRENT_DATE)
        `;
      }
    } catch (err) {
      console.error('[journal] Error saving journal entry:', err);
      // Rollback saved state on error
      clearTimeout(savedTimeout);
      setSaved(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "24px", padding: "20px",
      border: "1.5px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <BookOpen size={18} color="var(--wellness-lavender)" />
        <h3 style={{ color: "var(--foreground)", margin: 0 }}>Wellness Journal</h3>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {(["journal", "gratitude"] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "8px 16px", borderRadius: "10px", border: "none", cursor: "pointer",
              backgroundColor: activeTab === t ? "var(--wellness-lavender)" : "var(--muted)",
              color: activeTab === t ? "white" : "var(--muted-foreground)",
              fontSize: "13px", fontWeight: activeTab === t ? "600" : "400",
              transition: "all 0.2s",
            }}
          >{t === "journal" ? "📝 Journal" : "🙏 Gratitude"}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "journal" ? (
          <motion.div key="journal" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "10px" }}>
              How did today's practice feel? What are you noticing?
            </p>
            <textarea
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={5}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                border: "1.5px solid var(--border)", backgroundColor: "var(--input-background)",
                color: "var(--foreground)", fontSize: "14px", resize: "none",
                outline: "none", boxSizing: "border-box", lineHeight: "1.6",
                fontFamily: "inherit",
              }}
            />
          </motion.div>
        ) : (
          <motion.div key="gratitude" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "12px" }}>
              Name 3 things you're grateful for today:
            </p>
            {gratitudeItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>
                  {["💛", "💙", "💚"][i]}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={e => setGratitudeItems(g => g.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={`I'm grateful for...`}
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: "10px",
                    border: "1.5px solid var(--border)", backgroundColor: "var(--input-background)",
                    color: "var(--foreground)", fontSize: "14px", outline: "none",
                  }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={save}
        style={{
          width: "100%", marginTop: "14px", padding: "12px", borderRadius: "12px", border: "none",
          backgroundColor: saved ? "#6BB8A0" : "var(--wellness-lavender)",
          color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "all 0.3s",
        }}
      >
        {saved ? <><Check size={16} /> Saved!</> : "Save Entry"}
      </button>
    </div>
  );
}
