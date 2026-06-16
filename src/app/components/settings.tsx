import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, BellOff, LogOut, Moon, Clock, Sun, ChevronRight, Smartphone } from "lucide-react";
import { sql } from "../../lib/db";
import { Auth } from "../../lib/auth";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  emoji: string;
  enabled: boolean;
  time: string;
}

interface SettingsProps {
  onSignOut: () => void;
  darkMode: boolean;
  toggleDark: () => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: "44px", height: "26px", borderRadius: "13px",
        backgroundColor: on ? "var(--wellness-teal)" : "var(--border)",
        cursor: "pointer", position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: "spring", damping: 18, stiffness: 300 }}
        style={{
          position: "absolute", top: "3px",
          width: "20px", height: "20px", borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "4px 8px", borderRadius: "8px",
        border: "1.5px solid var(--border)", backgroundColor: "var(--card)",
        color: "var(--foreground)", fontSize: "13px", fontFamily: "inherit",
        cursor: "pointer",
      }}
    />
  );
}

const DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
  { id: "yoga", label: "Yoga Session", description: "Remind me to practice yoga", emoji: "🧘", enabled: true, time: "07:00" },
  { id: "meditation", label: "Meditation", description: "Daily mindfulness reminder", emoji: "🧠", enabled: true, time: "08:00" },
  { id: "breathwork", label: "Breathwork", description: "Breathing exercise reminder", emoji: "🌬️", enabled: false, time: "09:00" },
  { id: "water", label: "Hydration", description: "Drink water reminders throughout day", emoji: "💧", enabled: true, time: "10:00" },
  { id: "sleep", label: "Wind-Down", description: "Evening relaxation reminder", emoji: "🌙", enabled: false, time: "21:30" },
  { id: "progress", label: "Log Session", description: "Remind to log today's practice", emoji: "📊", enabled: false, time: "20:00" },
];

export function Settings({ onSignOut, darkMode, toggleDark }: SettingsProps) {
  const [notifications, setNotifications] = useState<NotificationSetting[]>(DEFAULT_NOTIFICATIONS);
  const [masterNotif, setMasterNotif] = useState(true);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  useEffect(() => {
    async function loadSettings() {
      const uid = Auth.getUserId();
      if (!uid) return;
      try {
        const rows = await sql`
          SELECT master_notif as "masterNotif", settings
          FROM notification_settings
          WHERE user_id = ${Number(uid)}
        `;
        if (rows && rows.length > 0) {
          setMasterNotif(rows[0].masterNotif);
          setNotifications(rows[0].settings || DEFAULT_NOTIFICATIONS);
        }

        const stats = await sql`
          SELECT COALESCE(SUM(duration_minutes), 0) as total
          FROM sessions
          WHERE user_id = ${Number(uid)}
        `;
        if (stats && stats.length > 0) {
          setTotalMinutes(Number(stats[0].total));
        }
      } catch (err) {
        console.error('[settings] Error loading user configuration:', err);
      }
    }
    loadSettings();
  }, []);

  const saveSettingsToDb = async (mNotif: boolean, notifs: NotificationSetting[]) => {
    const uid = Auth.getUserId();
    if (!uid) return;
    try {
      await sql`
        INSERT INTO notification_settings (user_id, master_notif, settings, updated_at)
        VALUES (${Number(uid)}, ${mNotif}, ${JSON.stringify(notifs)}, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          master_notif = EXCLUDED.master_notif,
          settings = EXCLUDED.settings,
          updated_at = NOW()
      `;
    } catch (err) {
      console.error('[settings] Error saving settings:', err);
    }
  };

  const handleMasterToggle = () => {
    const next = !masterNotif;
    setMasterNotif(next);
    saveSettingsToDb(next, notifications);
  };

  const updateNotif = (id: string, changes: Partial<NotificationSetting>) => {
    const updated = notifications.map(n => n.id === id ? { ...n, ...changes } : n);
    setNotifications(updated);
    saveSettingsToDb(masterNotif, updated);
  };

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      setMasterNotif(true);
      saveSettingsToDb(true, notifications);
    }
  };

  const scheduleTestNotification = (label: string) => {
    if (notifPermission === "granted") {
      new Notification(`Serenity – ${label}`, {
        body: "This is how your reminder will look 🧘",
        icon: "/favicon.ico",
      });
    }
  };

  return (
    <div style={{ paddingBottom: "100px", minHeight: "100dvh", backgroundColor: "var(--background)" }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 20px", background: "linear-gradient(135deg, var(--wellness-teal)15, transparent)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--foreground)", marginBottom: "4px" }}>Settings</h1>
        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Notifications, appearance & account</p>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Appearance */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Appearance</div>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                backgroundColor: "var(--wellness-indigo)20",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {darkMode ? <Moon size={18} color="var(--wellness-indigo)" /> : <Sun size={18} color="var(--wellness-gold)" />}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>Dark Mode</div>
                <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{darkMode ? "Dark theme active" : "Light theme active"}</div>
              </div>
            </div>
            <Toggle on={darkMode} onToggle={toggleDark} />
          </div>
        </div>

        {/* Notifications master */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Notifications</div>
          </div>

          {/* Permission banner */}
          {notifPermission !== "granted" && (
            <div style={{
              margin: "12px 16px", padding: "12px 14px", borderRadius: "12px",
              backgroundColor: "var(--wellness-gold)15", border: "1px solid var(--wellness-gold)40",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <Smartphone size={16} color="var(--wellness-gold)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>Enable browser notifications</div>
                <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                  {notifPermission === "denied" ? "Notifications blocked — enable in browser settings" : "Allow notifications to receive reminders"}
                </div>
              </div>
              {notifPermission !== "denied" && (
                <button onClick={requestPermission} style={{
                  padding: "6px 12px", borderRadius: "8px", border: "none",
                  backgroundColor: "var(--wellness-gold)", color: "#fff",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer", flexShrink: 0,
                }}>Allow</button>
              )}
            </div>
          )}

          {/* Master toggle */}
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                backgroundColor: masterNotif ? "var(--wellness-teal)20" : "var(--muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {masterNotif ? <Bell size={18} color="var(--wellness-teal)" /> : <BellOff size={18} color="var(--muted-foreground)" />}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>All Notifications</div>
                <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{masterNotif ? "Reminders are active" : "All reminders paused"}</div>
              </div>
            </div>
            <Toggle on={masterNotif} onToggle={handleMasterToggle} />
          </div>

          {/* Individual notifications */}
          {notifications.map((notif, idx) => (
            <div
              key={notif.id}
              style={{
                padding: "12px 16px",
                borderBottom: idx < notifications.length - 1 ? "1px solid var(--border)" : "none",
                opacity: masterNotif ? 1 : 0.45,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifySide: "space-between", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <span style={{ fontSize: "22px" }}>{notif.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>{notif.label}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{notif.description}</div>
                  </div>
                </div>
                <Toggle
                  on={notif.enabled && masterNotif}
                  onToggle={() => masterNotif && updateNotif(notif.id, { enabled: !notif.enabled })}
                />
              </div>
              {notif.enabled && masterNotif && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: "10px", paddingLeft: "32px", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Clock size={13} color="var(--muted-foreground)" />
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Daily at</span>
                  <TimeInput value={notif.time} onChange={t => updateNotif(notif.id, { time: t })} />
                  {notifPermission === "granted" && (
                    <button
                      onClick={() => scheduleTestNotification(notif.label)}
                      style={{
                        padding: "4px 10px", borderRadius: "7px",
                        border: "1px solid var(--border)", backgroundColor: "var(--background)",
                        color: "var(--muted-foreground)", fontSize: "11px", cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Test
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* About */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px" }}>About</div>
          </div>
          {[
            { label: "App Version", value: "1.0.0" },
            { label: "Practice Hours", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: "14px", color: "var(--foreground)" }}>{item.label}</span>
              <span style={{ fontSize: "14px", color: "var(--muted-foreground)", fontWeight: "600" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <div style={{ backgroundColor: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
          {!showSignOutConfirm ? (
            <button
              onClick={() => setShowSignOutConfirm(true)}
              style={{
                width: "100%", padding: "16px", border: "none", backgroundColor: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
              }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                backgroundColor: "#FF6B6B20",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <LogOut size={18} color="#FF6B6B" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#FF6B6B", flex: 1, textAlign: "left" }}>Sign Out</span>
              <ChevronRight size={16} color="var(--muted-foreground)" />
            </button>
          ) : (
            <div style={{ padding: "16px" }}>
              <p style={{ fontSize: "14px", color: "var(--foreground)", marginBottom: "6px", fontWeight: "600" }}>Sign out of Serenity?</p>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginBottom: "14px" }}>Your progress and logs will be cleared from this device.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "11px",
                    border: "1.5px solid var(--border)", backgroundColor: "transparent",
                    color: "var(--foreground)", fontWeight: "600", fontSize: "14px", cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >Cancel</button>
                <button
                  onClick={onSignOut}
                  style={{
                    flex: 1, padding: "11px", borderRadius: "11px",
                    border: "none", backgroundColor: "#FF6B6B",
                    color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >Sign Out</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
