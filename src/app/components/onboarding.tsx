import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, ArrowRight, ArrowLeft, Check, Scale, Dumbbell,
  Moon, Sun, Heart, Zap, Wind, Activity, Star, Clock, Calendar,
  Target, BarChart2, ChevronRight
} from "lucide-react";

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  experience: string;
  goals: string[];
  practices: string[];
  skillLevel: string;
  restrictions: string[];
  dailyTime: string;
  practiceTime: string;
  equipment: string[];
  weeklyCommitment: string;
  motivations: string[];
  bmi: number;
  bmiCategory: string;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  darkMode: boolean;
  toggleDark: () => void;
}

const TOTAL_STEPS = 13;

const goals = [
  { id: "weight-loss", label: "Weight Loss", icon: Scale },
  { id: "flexibility", label: "Flexibility", icon: Activity },
  { id: "strength", label: "Strength", icon: Dumbbell },
  { id: "better-sleep", label: "Better Sleep", icon: Moon },
  { id: "stress-relief", label: "Stress Relief", icon: Wind },
  { id: "focus", label: "Improved Focus", icon: Target },
  { id: "posture", label: "Better Posture", icon: User },
  { id: "energy", label: "Increase Energy", icon: Zap },
  { id: "confidence", label: "Feel Confident", icon: Star },
  { id: "tone", label: "Tone Muscles", icon: Activity },
  { id: "mobility", label: "Improve Mobility", icon: Heart },
  { id: "habits", label: "Healthy Habits", icon: Check },
  { id: "wellness", label: "General Wellness", icon: Heart },
];

const practices = [
  { id: "vinyasa", label: "Vinyasa", desc: "Dynamic flow yoga" },
  { id: "restorative", label: "Restorative", desc: "Deep relaxation" },
  { id: "yin", label: "Yin", desc: "Long-held stretches" },
  { id: "guided-meditation", label: "Guided Meditation", desc: "Mindful awareness" },
  { id: "sleep-meditation", label: "Sleep Meditation", desc: "Better rest" },
  { id: "wake-up-yoga", label: "Wake-Up Yoga", desc: "Morning energy" },
  { id: "pilates", label: "Pilates", desc: "Core strength" },
];

const restrictions = [
  "Back Pain", "Knee Pain", "Neck Pain", "Joint Issues",
  "High Blood Pressure", "Pregnancy", "Recent Injury", "None"
];

const equipment = [
  "Yoga Mat", "Yoga Blocks", "Resistance Bands",
  "Dumbbells", "Chair", "No Equipment"
];

const motivations = [
  { id: "streaks", label: "Streaks", icon: Zap },
  { id: "achievements", label: "Achievements", icon: Star },
  { id: "progress", label: "Progress Tracking", icon: BarChart2 },
  { id: "coaching", label: "Guided Coaching", icon: User },
  { id: "community", label: "Community", icon: Heart },
  { id: "appearance", label: "Better Appearance", icon: Star },
  { id: "fitness", label: "Fitness Goals", icon: Target },
  { id: "healthy-habits", label: "Healthy Habits", icon: Check },
];

function calcBMI(weight: string, height: string) {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;
  if (!w || !h) return { bmi: 0, category: "Unknown" };
  const bmi = w / (h * h);
  let category = "Healthy";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Healthy";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";
  return { bmi: Math.round(bmi * 10) / 10, category };
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step - 1 ? "18px" : "5px",
          height: "5px", borderRadius: "3px",
          backgroundColor: i < step ? "var(--wellness-teal)" : "var(--border)",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function MultiSelect({ options, selected, onChange, columns = 2 }: {
  options: { id: string; label: string; icon?: React.ComponentType<{ size?: number }> }[];
  selected: string[];
  onChange: (val: string[]) => void;
  columns?: number;
}) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "10px" }}>
      {options.map(o => {
        const Icon = o.icon;
        const active = selected.includes(o.id);
        return (
          <button key={o.id} onClick={() => toggle(o.id)} style={{
            padding: "12px 10px", borderRadius: "12px",
            border: `2px solid ${active ? "var(--wellness-teal)" : "var(--border)"}`,
            backgroundColor: active ? "rgba(61,139,122,0.12)" : "var(--card)",
            color: active ? "var(--wellness-teal)" : "var(--foreground)",
            display: "flex", alignItems: "center", gap: "7px",
            cursor: "pointer", transition: "all 0.2s",
            fontSize: "13px", fontWeight: active ? "600" : "400",
            fontFamily: "inherit",
          }}>
            {Icon && <Icon size={14} />}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SingleSelect({ options, selected, onChange }: {
  options: { id: string; label: string; desc?: string }[];
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {options.map(o => {
        const active = selected === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            padding: "14px 16px", borderRadius: "14px",
            border: `2px solid ${active ? "var(--wellness-teal)" : "var(--border)"}`,
            backgroundColor: active ? "rgba(61,139,122,0.12)" : "var(--card)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", transition: "all 0.2s", textAlign: "left",
            fontFamily: "inherit",
          }}>
            <div>
              <div style={{ fontWeight: active ? "600" : "500", fontSize: "14px", color: active ? "var(--wellness-teal)" : "var(--foreground)" }}>{o.label}</div>
              {o.desc && <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>{o.desc}</div>}
            </div>
            {active && <Check size={16} color="var(--wellness-teal)" />}
          </button>
        );
      })}
    </div>
  );
}

export function Onboarding({ onComplete, darkMode, toggleDark }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: [], practices: [], restrictions: [], equipment: [], motivations: [],
  });

  const update = (key: keyof UserProfile, val: unknown) => setProfile(p => ({ ...p, [key]: val }));
  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));
  const finish = () => {
    const { bmi, category: bmiCategory } = calcBMI(profile.weight || "", profile.height || "");
    onComplete({ ...profile, bmi, bmiCategory } as UserProfile);
  };

  const bmiData = step >= 2 ? calcBMI(profile.weight || "", profile.height || "") : null;

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div style={{
      minHeight: "100dvh", backgroundColor: "var(--background)",
      display: "flex", flexDirection: "column",
      maxWidth: "480px", margin: "0 auto", position: "relative",
    }}>
      {/* Top bar */}
      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {step > 1 && step < TOTAL_STEPS ? (
          <button onClick={back} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)", padding: "4px" }}>
            <ArrowLeft size={20} />
          </button>
        ) : <div style={{ width: 28 }} />}
        <ProgressDots step={step} total={TOTAL_STEPS} />
        <button onClick={toggleDark} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)", padding: "4px" }}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 100px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeInOut" }}>

            {/* Step 1: Profile Setup */}
            {step === 1 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Tell us about yourself</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>This helps us personalize your experience</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { key: "name", label: "Preferred Name", placeholder: "Alex", type: "text" },
                    { key: "age", label: "Age", placeholder: "28", type: "number" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "6px", display: "block" }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(profile as Record<string, string>)[f.key] || ""}
                        onChange={e => update(f.key as keyof UserProfile, e.target.value)}
                        style={{
                          width: "100%", padding: "14px 16px", borderRadius: "12px",
                          border: "1.5px solid var(--border)", backgroundColor: "var(--input-background)",
                          color: "var(--foreground)", fontSize: "15px", boxSizing: "border-box", outline: "none",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "6px", display: "block" }}>Gender</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                      {["Male", "Female", "Non-binary", "Prefer not to say"].map(g => (
                        <button key={g} onClick={() => update("gender", g)} style={{
                          padding: "11px 10px", borderRadius: "10px", fontSize: "13px",
                          border: `2px solid ${profile.gender === g ? "var(--wellness-teal)" : "var(--border)"}`,
                          backgroundColor: profile.gender === g ? "rgba(61,139,122,0.12)" : "var(--card)",
                          color: profile.gender === g ? "var(--wellness-teal)" : "var(--foreground)",
                          cursor: "pointer", fontWeight: profile.gender === g ? "600" : "400",
                          fontFamily: "inherit",
                        }}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {[
                      { key: "height", label: "Height (cm)", placeholder: "170" },
                      { key: "weight", label: "Weight (kg)", placeholder: "65" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "6px", display: "block" }}>{f.label}</label>
                        <input type="number" placeholder={f.placeholder} value={(profile as Record<string, string>)[f.key] || ""}
                          onChange={e => update(f.key as keyof UserProfile, e.target.value)}
                          style={{
                            width: "100%", padding: "14px 12px", borderRadius: "12px",
                            border: "1.5px solid var(--border)", backgroundColor: "var(--input-background)",
                            color: "var(--foreground)", fontSize: "15px", boxSizing: "border-box", outline: "none",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: BMI */}
            {step === 2 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Your BMI Analysis</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>Based on your height and weight</p>
                {bmiData && bmiData.bmi > 0 ? (
                  <div>
                    <div style={{
                      background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
                      borderRadius: "20px", padding: "32px", textAlign: "center", marginBottom: "20px",
                    }}>
                      <div style={{ fontSize: "56px", fontWeight: "700", color: "#fff", lineHeight: 1, fontFamily: "var(--font-display)" }}>{bmiData.bmi}</div>
                      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", marginTop: "8px" }}>BMI Score</div>
                      <div style={{
                        display: "inline-block", marginTop: "12px", padding: "6px 18px",
                        borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.2)",
                        color: "#fff", fontSize: "14px", fontWeight: "600",
                      }}>{bmiData.category}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {[
                        { label: "Under", range: "< 18.5", color: "#7B9EC5" },
                        { label: "Healthy", range: "18.5–24.9", color: "var(--wellness-teal)" },
                        { label: "Over", range: "25–29.9", color: "var(--wellness-warm)" },
                        { label: "Obese", range: "> 30", color: "var(--wellness-coral)" },
                      ].map(c => (
                        <div key={c.label} style={{
                          padding: "10px 6px", borderRadius: "10px", textAlign: "center",
                          backgroundColor: c.label === bmiData.category ? c.color + "22" : "var(--muted)",
                          border: `1.5px solid ${c.label === bmiData.category ? c.color : "transparent"}`,
                        }}>
                          <div style={{ fontSize: "11px", fontWeight: "600", color: c.color }}>{c.label}</div>
                          <div style={{ fontSize: "10px", color: "var(--muted-foreground)", marginTop: "2px" }}>{c.range}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    backgroundColor: "var(--card)", borderRadius: "20px", border: "1.5px solid var(--border)",
                  }}>
                    <Scale size={32} color="var(--muted-foreground)" style={{ margin: "0 auto 12px", display: "block" }} />
                    <p style={{ color: "var(--muted-foreground)", lineHeight: "1.5" }}>
                      Please go back and enter your height and weight to see your BMI analysis.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Yoga Experience */}
            {step === 3 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Yoga Experience</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>How familiar are you with yoga?</p>
                <SingleSelect options={[
                  { id: "never", label: "Never Practiced", desc: "This is brand new to me" },
                  { id: "few-times", label: "Tried a Few Times", desc: "I've done a class or two" },
                  { id: "occasionally", label: "Practice Occasionally", desc: "A few times a month" },
                  { id: "regularly", label: "Practice Regularly", desc: "At least once a week" },
                  { id: "advanced", label: "Advanced Practitioner", desc: "Daily practice or teaching" },
                ]} selected={profile.experience || ""} onChange={v => update("experience", v)} />
              </div>
            )}

            {/* Step 4: Goals */}
            {step === 4 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Your Goals</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>Select all that apply</p>
                <MultiSelect options={goals.map(g => ({ id: g.id, label: g.label, icon: g.icon }))}
                  selected={profile.goals || []} onChange={v => update("goals", v)} columns={2} />
              </div>
            )}

            {/* Step 5: Practice Preferences */}
            {step === 5 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Practice Style</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>What interests you most?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {practices.map(p => {
                    const active = (profile.practices || []).includes(p.id);
                    return (
                      <button key={p.id} onClick={() => {
                        const cur = profile.practices || [];
                        update("practices", active ? cur.filter(x => x !== p.id) : [...cur, p.id]);
                      }} style={{
                        padding: "14px 16px", borderRadius: "14px",
                        border: `2px solid ${active ? "var(--wellness-teal)" : "var(--border)"}`,
                        backgroundColor: active ? "rgba(61,139,122,0.12)" : "var(--card)",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                      }}>
                        <div>
                          <div style={{ fontWeight: "500", fontSize: "14px", color: active ? "var(--wellness-teal)" : "var(--foreground)" }}>{p.label}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{p.desc}</div>
                        </div>
                        {active && <Check size={16} color="var(--wellness-teal)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 6: Skill Level */}
            {step === 6 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Skill Level</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>How would you rate yourself?</p>
                <SingleSelect options={[
                  { id: "beginner", label: "Beginner", desc: "New to movement practice" },
                  { id: "beginner-2", label: "Beginner 2", desc: "Some foundations in place" },
                  { id: "intermediate", label: "Intermediate", desc: "Comfortable with basics" },
                  { id: "intermediate-2", label: "Intermediate 2", desc: "Exploring advanced poses" },
                  { id: "advanced", label: "Advanced", desc: "Strong consistent practice" },
                ]} selected={profile.skillLevel || ""} onChange={v => update("skillLevel", v)} />
              </div>
            )}

            {/* Step 7: Health Restrictions */}
            {step === 7 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Health Considerations</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>We'll adapt recommendations to keep you safe</p>
                <MultiSelect options={restrictions.map(r => ({ id: r.toLowerCase().replace(/ /g, "-"), label: r }))}
                  selected={profile.restrictions || []} onChange={v => update("restrictions", v)} columns={2} />
              </div>
            )}

            {/* Step 8: Daily Availability */}
            {step === 8 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Daily Availability</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>How much time can you dedicate?</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {["5 min", "10 min", "15 min", "20 min", "30 min", "45+ min"].map(t => {
                    const active = profile.dailyTime === t;
                    return (
                      <button key={t} onClick={() => update("dailyTime", t)} style={{
                        padding: "20px 10px", borderRadius: "14px",
                        border: `2px solid ${active ? "var(--wellness-teal)" : "var(--border)"}`,
                        backgroundColor: active ? "rgba(61,139,122,0.12)" : "var(--card)",
                        color: active ? "var(--wellness-teal)" : "var(--foreground)",
                        cursor: "pointer", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "6px", fontFamily: "inherit",
                      }}>
                        <Clock size={18} />
                        <span style={{ fontSize: "13px", fontWeight: active ? "600" : "400" }}>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 9: Preferred Practice Time */}
            {step === 9 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Best Time to Practice</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>When do you feel most motivated?</p>
                <SingleSelect options={[
                  { id: "early-morning", label: "Early Morning", desc: "5am – 7am" },
                  { id: "morning", label: "Morning", desc: "7am – 10am" },
                  { id: "afternoon", label: "Afternoon", desc: "12pm – 5pm" },
                  { id: "evening", label: "Evening", desc: "5pm – 9pm" },
                  { id: "before-bed", label: "Before Bed", desc: "9pm onwards" },
                ]} selected={profile.practiceTime || ""} onChange={v => update("practiceTime", v)} />
              </div>
            )}

            {/* Step 10: Equipment */}
            {step === 10 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Available Equipment</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>We'll tailor sessions to what you have</p>
                <MultiSelect options={equipment.map(e => ({ id: e.toLowerCase().replace(/ /g, "-"), label: e }))}
                  selected={profile.equipment || []} onChange={v => update("equipment", v)} columns={2} />
              </div>
            )}

            {/* Step 11: Weekly Commitment */}
            {step === 11 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>Weekly Commitment</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>How often will you practice?</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                  {[
                    { id: "1-2", label: "1–2 Days", desc: "Light start" },
                    { id: "3-4", label: "3–4 Days", desc: "Balanced" },
                    { id: "5-6", label: "5–6 Days", desc: "Dedicated" },
                    { id: "daily", label: "Daily", desc: "All-in" },
                  ].map(o => {
                    const active = profile.weeklyCommitment === o.id;
                    return (
                      <button key={o.id} onClick={() => update("weeklyCommitment", o.id)} style={{
                        padding: "24px 16px", borderRadius: "16px",
                        border: `2px solid ${active ? "var(--wellness-teal)" : "var(--border)"}`,
                        backgroundColor: active ? "rgba(61,139,122,0.12)" : "var(--card)",
                        cursor: "pointer", textAlign: "center", fontFamily: "inherit",
                      }}>
                        <Calendar size={24} color={active ? "var(--wellness-teal)" : "var(--muted-foreground)"} style={{ margin: "0 auto 8px" }} />
                        <div style={{ fontSize: "15px", fontWeight: "700", color: active ? "var(--wellness-teal)" : "var(--foreground)" }}>{o.label}</div>
                        <div style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "4px" }}>{o.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 12: Motivation */}
            {step === 12 && (
              <div style={{ paddingTop: "24px" }}>
                <h2 style={{ color: "var(--foreground)", marginBottom: "6px" }}>What Motivates You?</h2>
                <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "28px" }}>Select all that resonate</p>
                <MultiSelect options={motivations}
                  selected={profile.motivations || []} onChange={v => update("motivations", v)} columns={2} />
              </div>
            )}

            {/* Step 13: Done */}
            {step === TOTAL_STEPS && (
              <div style={{ paddingTop: "60px", textAlign: "center" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                  style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-sage))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 28px",
                  }}>
                  <Check size={44} color="white" strokeWidth={2.5} />
                </motion.div>
                <h1 style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", marginBottom: "12px" }}>
                  Your journey begins{profile.name ? `, ${profile.name}` : ""}!
                </h1>
                <p style={{ color: "var(--muted-foreground)", fontSize: "15px", lineHeight: "1.6", marginBottom: "32px" }}>
                  We've crafted a personalized wellness plan just for you. Let's begin.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "32px" }}>
                  {[
                    { icon: Target, label: "Daily Plan", value: "Ready" },
                    { icon: Calendar, label: "Weekly Plan", value: "Personalized" },
                    { icon: Star, label: "Programs", value: "5 Available" },
                    { icon: BarChart2, label: "BMI Score", value: bmiData && bmiData.bmi > 0 ? String(bmiData.bmi) : "Set up" },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} style={{
                        padding: "16px", borderRadius: "14px", backgroundColor: "var(--card)",
                        border: "1.5px solid var(--border)", textAlign: "left",
                      }}>
                        <Icon size={18} color="var(--wellness-teal)" style={{ marginBottom: "8px" }} />
                        <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{s.label}</div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>{s.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "480px", padding: "16px 24px 32px",
        background: "linear-gradient(to top, var(--background) 80%, transparent)",
      }}>
        {step < TOTAL_STEPS ? (
          <button onClick={next} style={{
            width: "100%", padding: "16px", borderRadius: "16px", border: "none",
            background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
            color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            fontFamily: "inherit",
          }}>
            Continue <ArrowRight size={18} />
          </button>
        ) : (
          <button onClick={finish} style={{
            width: "100%", padding: "16px", borderRadius: "16px", border: "none",
            background: "linear-gradient(135deg, var(--wellness-teal), var(--wellness-teal-light))",
            color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            fontFamily: "inherit",
          }}>
            Start My Journey <ChevronRight size={18} />
          </button>
        )}
      </div>

    </div>
  );
}
