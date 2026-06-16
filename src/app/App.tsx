import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home as HomeIcon, BookOpen, Layers, TrendingUp, Settings as SettingsIcon, Wind, Bookmark, Plus } from "lucide-react";
import { Home } from "./components/home";
import { Library } from "./components/library";
import { Programs } from "./components/programs";
import { Progress } from "./components/progress";
import { Settings } from "./components/settings";
import { BreathingTimer, HabitTracker, WellnessJournal } from "./components/extras";
import { Onboarding, type UserProfile } from "./components/onboarding";
import { Auth } from "../lib/auth";
import { initializeUser, saveUserProfile } from "../lib/userInit";
import { sql } from "../lib/db";

type Tab = "home" | "library" | "programs" | "progress" | "settings";
type ExtraPanel = "breathing" | "habits" | "journal" | null;

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("serenity_dark") === "true";
    document.documentElement.classList.toggle("dark", stored);
    return stored;
  });
  const [extraPanel, setExtraPanel] = useState<ExtraPanel>(null);
  const [showExtrasMenu, setShowExtrasMenu] = useState(false);

  useEffect(() => {
    async function runHandshake() {
      try {
        setIsPreparing(true);
        const validatedUid = await Auth.performHandshake();
        setUserId(validatedUid);

        // Fetch user profile from database
        const dbProfile = await initializeUser(validatedUid);
        if (dbProfile) {
          setProfile(dbProfile);

          // Pre-warm the SQL query cache concurrently during the loading state for instant tab loading
          await Promise.all([
            sql`
              SELECT id, to_char(date, 'YYYY-MM-DD') as date, title, category, duration_minutes as "durationMinutes"
              FROM sessions
              WHERE user_id = ${Number(validatedUid)}
              ORDER BY date DESC, created_at DESC
            `,
            sql`
              SELECT id, name, emoji, streak, done
              FROM habits
              WHERE user_id = ${Number(validatedUid)}
              ORDER BY created_at ASC
            `,
            sql`
              SELECT entry_type, content, items
              FROM journal_entries
              WHERE user_id = ${Number(validatedUid)} AND entry_date = CURRENT_DATE
              ORDER BY created_at DESC
            `,
            sql`
              SELECT master_notif as "masterNotif", settings
              FROM notification_settings
              WHERE user_id = ${Number(validatedUid)}
            `,
            sql`
              SELECT COALESCE(SUM(duration_minutes), 0) as total
              FROM sessions
              WHERE user_id = ${Number(validatedUid)}
            `
          ]).catch(err => console.error('[App] Query cache pre-warming failed:', err));
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('[App] Verification or initialization failed:', err);
      } finally {
        setIsPreparing(false);
      }
    }
    runHandshake();
  }, []);

  const handleDarkToggle = () => {
    setDarkMode(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("serenity_dark", String(next));
      return next;
    });
  };

  const handleOnboardingComplete = async (p: UserProfile) => {
    if (userId) {
      await saveUserProfile(userId, p);
    }
    setProfile(p);
    setActiveTab("home");
  };

  const handleSignOut = () => {
    Auth.clear();
    setProfile(null);
    setUserId(null);
    window.location.href = '/token';
  };

  if (isPreparing) {
    return (
      <div style={{
        minHeight: "100dvh",
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display, sans-serif)",
        color: "var(--foreground)",
        padding: "24px",
        textAlign: "center",
      }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px var(--wellness-teal)40",
            marginBottom: "24px",
          }}
        >
          <Wind size={36} color="white" />
        </motion.div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" }}>Preparing Serenity...</h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "14px" }}>Setting up your wellness space</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        darkMode={darkMode}
        toggleDark={handleDarkToggle}
      />
    );
  }

  const tabs: { id: Tab; icon: React.ComponentType<{ size?: number }>; label: string }[] = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "library", icon: BookOpen, label: "Library" },
    { id: "programs", icon: Layers, label: "Programs" },
    { id: "progress", icon: TrendingUp, label: "Progress" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  const extras = [
    { id: "breathing" as ExtraPanel, icon: Wind, label: "Breathe", color: "#6BB8A0" },
    { id: "habits" as ExtraPanel, icon: Bookmark, label: "Habits", color: "#D4A853" },
    { id: "journal" as ExtraPanel, icon: BookOpen, label: "Journal", color: "#B8A8D5" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--background)",
        maxWidth: "480px",
        margin: "0 auto",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <div style={{ overflowY: "auto", height: "100dvh" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home" && (
              <Home profile={profile} darkMode={darkMode} onGoToLibrary={() => setActiveTab("library")} />
            )}
            {activeTab === "library" && <Library />}
            {activeTab === "programs" && <Programs />}
            {activeTab === "progress" && <Progress profile={profile} />}
            {activeTab === "settings" && (
              <Settings onSignOut={handleSignOut} darkMode={darkMode} toggleDark={handleDarkToggle} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {activeTab !== "settings" && (
        <div style={{ position: "fixed", bottom: "90px", right: "16px", zIndex: 40 }}>
          {showExtrasMenu && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              {extras.map((e, i) => {
                const Icon = e.icon;
                return (
                  <motion.button
                    key={e.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => { setExtraPanel(e.id); setShowExtrasMenu(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "10px 14px", borderRadius: "20px", border: "none",
                      backgroundColor: e.color, color: "#fff", cursor: "pointer",
                      marginBottom: "8px", fontSize: "13px", fontWeight: "600",
                      boxShadow: "0 4px 12px " + e.color + "66", whiteSpace: "nowrap",
                    }}
                  >
                    <Icon size={15} />
                    {e.label}
                  </motion.button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => setShowExtrasMenu(s => !s)}
            style={{
              width: "48px", height: "48px", borderRadius: "16px", border: "none",
              background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px var(--wellness-teal)66",
              transition: "transform 0.2s",
              transform: showExtrasMenu ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <Plus size={22} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {extraPanel && (
          <motion.div
            key="extra-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "flex-end",
            }}
            onClick={() => setExtraPanel(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "480px", margin: "0 auto",
                backgroundColor: "var(--background)",
                borderRadius: "24px 24px 0 0",
                padding: "8px 16px 40px",
                maxHeight: "85dvh", overflowY: "auto",
              }}
            >
              <div style={{
                width: "40px", height: "4px", borderRadius: "2px",
                backgroundColor: "var(--border)", margin: "0 auto 20px",
              }} />
              {extraPanel === "breathing" && <BreathingTimer />}
              {extraPanel === "habits" && <HabitTracker />}
              {extraPanel === "journal" && <WellnessJournal />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "480px",
        backgroundColor: "var(--card)", borderTop: "1px solid var(--border)",
        display: "flex", paddingBottom: "env(safe-area-inset-bottom, 8px)", zIndex: 30,
      }}>
        {tabs.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: "10px 4px 8px", border: "none",
                backgroundColor: "transparent", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                width: "32px", height: "3px", borderRadius: "0 0 3px 3px",
                backgroundColor: "var(--wellness-teal)",
                opacity: active ? 1 : 0, transition: "opacity 0.2s",
              }} />
              <div style={{
                width: "32px", height: "32px", borderRadius: "10px",
                backgroundColor: active ? "var(--wellness-teal)22" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                <Icon size={18} color={active ? "var(--wellness-teal)" : "var(--muted-foreground)"} />
              </div>
              <span style={{
                fontSize: "10px",
                color: active ? "var(--wellness-teal)" : "var(--muted-foreground)",
                fontWeight: active ? "600" : "400",
              }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
