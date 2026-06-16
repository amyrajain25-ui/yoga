import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Clock, Star, Play, X, Maximize2, Minimize2 } from "lucide-react";

interface Video {
  id: string;
  title: string;
  creator: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
  reviews: number;
  videoId: string;
  tags: string[];
  reason: string;
}

const videos: Video[] = [
  // ── YOGA (10 videos) ──────────────────────────────────────────
  { id: "y1", title: "Yoga for Complete Beginners", creator: "Yoga With Adriene", duration: "20 min", level: "Beginner", category: "yoga", rating: 4.9, reviews: 18400, videoId: "4C-gxOE0j7s", tags: ["beginner", "morning", "gentle"], reason: "Most-watched beginner yoga video. Clear instructions for every pose." },
  { id: "y2", title: "Morning Yoga – 10 Min Stretch", creator: "Yoga With Adriene", duration: "10 min", level: "Beginner", category: "yoga", rating: 4.8, reviews: 12600, videoId: "oBu-pQG6sTY", tags: ["morning", "short", "wake-up"], reason: "Perfect 10-minute routine to start your day with energy." },
  { id: "y3", title: "Yoga for Stress & Anxiety Relief", creator: "Yoga With Adriene", duration: "28 min", level: "Beginner", category: "yoga", rating: 4.9, reviews: 21300, videoId: "hJbRpHZr_d0", tags: ["stress", "anxiety", "calm"], reason: "Specifically designed to calm the nervous system and reduce anxiety." },
  { id: "y4", title: "30 Min Vinyasa Yoga Flow", creator: "Boho Beautiful", duration: "30 min", level: "Intermediate", category: "yoga", rating: 4.8, reviews: 9700, videoId: "9kOCY0KNByw", tags: ["vinyasa", "flow", "full-body"], reason: "Dynamic flow combining strength and flexibility for intermediate practitioners." },
  { id: "y5", title: "Yin Yoga for Deep Flexibility", creator: "Yoga With Bird", duration: "45 min", level: "Intermediate", category: "yoga", rating: 4.9, reviews: 7800, videoId: "2MJGg-dUKh0", tags: ["yin", "flexibility", "hips"], reason: "Long-held poses to release deep connective tissue and improve flexibility." },
  { id: "y6", title: "Restorative Yin Yoga for Recovery", creator: "Yoga With Kassandra", duration: "60 min", level: "Intermediate", category: "yoga", rating: 4.8, reviews: 6200, videoId: "Z6jRKThDCBU", tags: ["restorative", "recovery", "yin"], reason: "Fully supported yin poses to rest and restore your body and mind." },
  { id: "y7", title: "Power Yoga Flow – Full Body", creator: "Yoga With Kassandra", duration: "40 min", level: "Advanced", category: "yoga", rating: 4.7, reviews: 5100, videoId: "rQAw4ex5FLw", tags: ["power", "strength", "challenge"], reason: "Challenging power yoga flow linking breath with dynamic movement." },
  { id: "y8", title: "Ashtanga Primary Series Breakdown", creator: "Kino MacGregor", duration: "90 min", level: "Advanced", category: "yoga", rating: 4.8, reviews: 4300, videoId: "hW9mu7rEfQ4", tags: ["ashtanga", "advanced", "traditional"], reason: "Traditional Ashtanga primary series for dedicated advanced practitioners." },
  { id: "y9", title: "Yoga for Back Pain Relief", creator: "Yoga With Adriene", duration: "21 min", level: "Beginner", category: "yoga", rating: 4.9, reviews: 31000, videoId: "v7AYKMP6rOE", tags: ["back-pain", "therapeutic", "gentle"], reason: "Safe, evidence-based sequence for relieving chronic back pain." },
  { id: "y10", title: "Yoga for Weight Loss – Fat Burning", creator: "Boho Beautiful", duration: "35 min", level: "Intermediate", category: "yoga", rating: 4.7, reviews: 14500, videoId: "lMWOrDH694c", tags: ["weight-loss", "cardio", "dynamic"], reason: "High-energy yoga flow that elevates heart rate and burns calories." },

  // ── MEDITATION (10 videos) ────────────────────────────────────
  { id: "m1", title: "Guided Meditation for Beginners", creator: "Goodful", duration: "8 min", level: "Beginner", category: "meditation", rating: 4.8, reviews: 28000, videoId: "inpok4MKVLM", tags: ["beginner", "guided", "quick"], reason: "Perfect introduction to meditation — simple and effective." },
  { id: "m2", title: "5-Minute Stress Relief Meditation", creator: "Great Meditation", duration: "5 min", level: "Beginner", category: "meditation", rating: 4.7, reviews: 19200, videoId: "ZToicYcHIOU", tags: ["stress", "quick", "relief"], reason: "Fast and effective stress relief for any moment in your day." },
  { id: "m3", title: "Morning Meditation for Positive Energy", creator: "Jason Stephenson", duration: "15 min", level: "Beginner", category: "meditation", rating: 4.8, reviews: 12400, videoId: "86m4RC_ADEY", tags: ["morning", "positive", "energy"], reason: "Start your day with clarity and positive intentions." },
  { id: "m4", title: "Body Scan Mindfulness Meditation", creator: "Headspace", duration: "20 min", level: "Intermediate", category: "meditation", rating: 4.9, reviews: 8700, videoId: "6iDKF-TrAfE", tags: ["body-scan", "mindfulness", "relaxation"], reason: "Systematic body awareness technique for deep relaxation." },
  { id: "m5", title: "Loving-Kindness Meditation", creator: "Tara Brach", duration: "25 min", level: "Intermediate", category: "meditation", rating: 4.9, reviews: 7100, videoId: "sz7cpV7ERsM", tags: ["loving-kindness", "compassion", "heart"], reason: "Cultivate self-compassion and kindness toward yourself and others." },
  { id: "m6", title: "Mindfulness Meditation for Anxiety", creator: "Michael Sealey", duration: "30 min", level: "Intermediate", category: "meditation", rating: 4.8, reviews: 9400, videoId: "1vx8iUvfyCY", tags: ["anxiety", "mindfulness", "calm"], reason: "Specifically designed to interrupt anxiety cycles and restore calm." },
  { id: "m7", title: "Vipassana Insight Meditation", creator: "Tara Brach", duration: "45 min", level: "Advanced", category: "meditation", rating: 4.9, reviews: 4200, videoId: "sz7cpV7ERsM", tags: ["vipassana", "insight", "deep"], reason: "Traditional Vipassana technique for experienced meditators." },
  { id: "m8", title: "Transcendental Style Meditation", creator: "Mindful Movement", duration: "20 min", level: "Advanced", category: "meditation", rating: 4.7, reviews: 3800, videoId: "9lvNhOKtifU", tags: ["mantra", "transcendental", "deep"], reason: "Mantra-based meditation for reaching deeper states of awareness." },
  { id: "m9", title: "NSDR / Yoga Nidra for Beginners", creator: "Andrew Huberman", duration: "10 min", level: "Beginner", category: "meditation", rating: 4.9, reviews: 22600, videoId: "ApQ9NovgnA4", tags: ["nsdr", "yoga-nidra", "rest"], reason: "Non-Sleep Deep Rest protocol proven to restore focus and energy." },

  // ── BREATHWORK (8 videos) ─────────────────────────────────────
  { id: "b1", title: "Box Breathing Tutorial", creator: "Mark Divine", duration: "10 min", level: "Beginner", category: "breathwork", rating: 4.8, reviews: 14200, videoId: "tybOi4hjZFQ", tags: ["box-breathing", "calm", "focus"], reason: "Used by Navy SEALs — simple 4-4-4-4 technique to regulate the nervous system." },
  { id: "b2", title: "4-7-8 Breathing for Sleep", creator: "Dr. Andrew Weil", duration: "6 min", level: "Beginner", category: "breathwork", rating: 4.9, reviews: 18700, videoId: "YRPh_GaiL8s", tags: ["sleep", "4-7-8", "relaxation"], reason: "Dr. Weil's famous breathing technique that can induce sleep in minutes." },
  { id: "b3", title: "Wim Hof Breathing Method", creator: "Wim Hof", duration: "11 min", level: "Intermediate", category: "breathwork", rating: 4.8, reviews: 31000, videoId: "nzCaZQqAs9I", tags: ["wim-hof", "energy", "immune"], reason: "The original Wim Hof guided breathing — boost energy and immune function." },
  { id: "b4", title: "Pranayama for Beginners", creator: "Yoga With Adriene", duration: "12 min", level: "Beginner", category: "breathwork", rating: 4.7, reviews: 8900, videoId: "acUZdGd_3Dg", tags: ["pranayama", "yoga", "basics"], reason: "Foundation pranayama including Nadi Shodhana and Kapalabhati." },
  { id: "b5", title: "Tummo Breathing Meditation", creator: "Michael Bijker", duration: "20 min", level: "Intermediate", category: "breathwork", rating: 4.8, reviews: 6300, videoId: "wUJzTSPgAZE", tags: ["tummo", "inner-fire", "powerful"], reason: "Tibetan inner-fire breathing to generate heat and boost energy." },
  { id: "b7", title: "Cyclic Sighing for Stress", creator: "Andrew Huberman", duration: "5 min", level: "Beginner", category: "breathwork", rating: 4.9, reviews: 24100, videoId: "kSZKIupBUuc", tags: ["cyclic-sighing", "stress", "quick"], reason: "Scientifically proven to be the most effective breath for stress relief." },

  // ── PILATES (10 videos) ───────────────────────────────────────
  { id: "p1", title: "Pilates for Absolute Beginners", creator: "Move With Nicole", duration: "20 min", level: "Beginner", category: "pilates", rating: 4.8, reviews: 11300, videoId: "tov0o3mi5h8", tags: ["beginner", "intro", "core"], reason: "Learn the fundamental Pilates principles and basic exercises safely." },
  { id: "p2", title: "10-Min Beginner Pilates Core", creator: "Lottie Murphy", duration: "10 min", level: "Beginner", category: "pilates", rating: 4.7, reviews: 8400, videoId: "bxCVvYy_cuw", tags: ["beginner", "core", "short"], reason: "Quick and effective core strengthening using classic Pilates movements." },
  { id: "p3", title: "Pilates for Lower Back Pain", creator: "SELF", duration: "15 min", level: "Beginner", category: "pilates", rating: 4.8, reviews: 9700, videoId: "i-VOH-3fTMk", tags: ["back-pain", "therapeutic", "gentle"], reason: "Therapeutic Pilates to strengthen the core and relieve lower back pain." },
  { id: "p4", title: "Intermediate Pilates Mat Class", creator: "Blogilates", duration: "35 min", level: "Intermediate", category: "pilates", rating: 4.8, reviews: 7200, videoId: "AMLSBnAxLbU", tags: ["intermediate", "mat", "full-class"], reason: "Full intermediate mat class progressing through classic Pilates repertoire." },
  { id: "p5", title: "Pilates for Flat Abs", creator: "Cassey Ho", duration: "25 min", level: "Intermediate", category: "pilates", rating: 4.7, reviews: 13600, videoId: "OJxXA4EwTf0", tags: ["abs", "core", "tone"], reason: "Targeted Pilates sequence for strengthening and toning the abdominal muscles." },
  { id: "p6", title: "Pilates Reformer Flow (No Equipment)", creator: "Move With Nicole", duration: "30 min", level: "Intermediate", category: "pilates", rating: 4.8, reviews: 5400, videoId: "b3B9tmwR58E", tags: ["reformer-inspired", "no-equipment", "flow"], reason: "Reformer-inspired movements you can do on a mat at home." },
  { id: "p7", title: "Advanced Pilates for Athletes", creator: "Blogilates", duration: "50 min", level: "Advanced", category: "pilates", rating: 4.7, reviews: 3900, videoId: "1wYTc_3x2Ms", tags: ["advanced", "athletic", "strength"], reason: "High-intensity Pilates for athletes looking to build explosive core strength." },
  { id: "p8", title: "Pilates for Spine Health", creator: "Move With Nicole", duration: "20 min", level: "Beginner", category: "pilates", rating: 4.9, reviews: 6700, videoId: "6FbZTPZG5io", tags: ["spine", "posture", "beginner"], reason: "Focused on spinal articulation to improve posture and spinal health." },
  { id: "p9", title: "Full Body Pilates Burn", creator: "Blogilates", duration: "40 min", level: "Advanced", category: "pilates", rating: 4.7, reviews: 4200, videoId: "60T1eRQzlGw", tags: ["advanced", "full-body", "burn"], reason: "Full body challenge combining strength, endurance, and coordination." },
  { id: "p10", title: "Pilates for Hip Flexibility", creator: "Lottie Murphy", duration: "22 min", level: "Intermediate", category: "pilates", rating: 4.8, reviews: 5100, videoId: "xvUcA8HCOJk", tags: ["hips", "flexibility", "mobility"], reason: "Pilates hip series to open tight hips and improve mobility." },

  // ── STRETCHING (16 videos) ────────────────────────────────────
  { id: "s1", title: "Full Body Stretch for Beginners", creator: "Tom Merrick", duration: "20 min", level: "Beginner", category: "stretching", rating: 4.9, reviews: 14200, videoId: "L_xrDAtykMI", tags: ["full-body", "beginner", "gentle"], reason: "Comprehensive beginner stretch touching every major muscle group." },
  { id: "s2", title: "Morning Stretch Routine – 10 Min", creator: "FitnessFAQs", duration: "10 min", level: "Beginner", category: "stretching", rating: 4.8, reviews: 11700, videoId: "sTANio_2E0Q", tags: ["morning", "short", "wake-up"], reason: "Start each day with this feel-good 10-minute stretch." },
  { id: "s3", title: "Hip Flexor Stretch for Desk Workers", creator: "Doctor Jo", duration: "12 min", level: "Beginner", category: "stretching", rating: 4.9, reviews: 22400, videoId: "WUKHM6-ekJM", tags: ["hips", "desk-worker", "tight-hips"], reason: "Essential for anyone who sits for long hours — relieves hip flexor tightness." },
  { id: "s4", title: "Hamstring Stretching Routine", creator: "Tom Merrick", duration: "15 min", level: "Beginner", category: "stretching", rating: 4.8, reviews: 9300, videoId: "E9mM2StxkCo", tags: ["hamstrings", "legs", "flexibility"], reason: "Progressive hamstring stretching to safely improve flexibility." },
  { id: "s5", title: "30-Day Split Flexibility Program", creator: "Antranik", duration: "25 min", level: "Intermediate", category: "stretching", rating: 4.7, reviews: 7800, videoId: "8_I-hFhvGQM", tags: ["splits", "advanced-goal", "flexibility"], reason: "Structured approach to safely work toward a full split." },
  { id: "s6", title: "Deep Hip Opener Sequence", creator: "Yoga With Adriene", duration: "30 min", level: "Intermediate", category: "stretching", rating: 4.9, reviews: 12600, videoId: "L9rMeyoynY4", tags: ["hips", "deep-stretch", "release"], reason: "Release years of hip tension with this targeted deep hip sequence." },
  { id: "s7", title: "Thoracic Spine Mobility Flow", creator: "Tom Merrick", duration: "18 min", level: "Intermediate", category: "stretching", rating: 4.8, reviews: 6400, videoId: "qULTwquOuT4", tags: ["thoracic", "spine", "posture"], reason: "Improve upper back mobility and correct rounded-shoulder posture." },
  { id: "s8", title: "Shoulder & Neck Release", creator: "Doctor Jo", duration: "12 min", level: "Beginner", category: "stretching", rating: 4.9, reviews: 18900, videoId: "SedzswEwpPw", tags: ["neck", "shoulders", "tension"], reason: "Relief for chronic neck and shoulder tension from stress or screen time." },
  { id: "s9", title: "Advanced Flexibility Training", creator: "Antranik", duration: "45 min", level: "Advanced", category: "stretching", rating: 4.7, reviews: 5200, videoId: "950Hw7L7If8", tags: ["advanced", "flexibility", "training"], reason: "Serious flexibility work for those pursuing advanced ranges of motion." },
  { id: "s10", title: "Piriformis & IT Band Release", creator: "FitnessFAQs", duration: "16 min", level: "Intermediate", category: "stretching", rating: 4.8, reviews: 7700, videoId: "WbDS4XE5SKs", tags: ["piriformis", "IT-band", "runners"], reason: "Essential for runners and cyclists — relieves common overuse tightness." },
  { id: "s11", title: "Calf & Ankle Mobility", creator: "Doctor Jo", duration: "10 min", level: "Beginner", category: "stretching", rating: 4.7, reviews: 8100, videoId: "tMohaoyTy4g", tags: ["calves", "ankles", "mobility"], reason: "Improve ankle dorsiflexion for better squats, walking, and balance." },
  { id: "s12", title: "Post-Workout Full Body Stretch", creator: "Yoga With Adriene", duration: "20 min", level: "Beginner", category: "stretching", rating: 4.9, reviews: 11300, videoId: "7_Gmj7awnWY", tags: ["post-workout", "recovery", "cooldown"], reason: "Cool down properly after any workout to speed recovery." },
  { id: "s13", title: "PNF Stretching for Flexibility Gains", creator: "Tom Merrick", duration: "35 min", level: "Advanced", category: "stretching", rating: 4.8, reviews: 4600, videoId: "CKwLZKj-UFw", tags: ["PNF", "advanced", "science-based"], reason: "Proprioceptive Neuromuscular Facilitation — the fastest way to gain flexibility." },
  { id: "s14", title: "Glute Stretch & Hip Release", creator: "Yoga With Adriene", duration: "18 min", level: "Intermediate", category: "stretching", rating: 4.8, reviews: 9800, videoId: "-ciMG4K4Fdk", tags: ["glutes", "hips", "tightness"], reason: "Release tight glutes and hip rotators that cause lower back pain." },
  { id: "s15", title: "Wrist & Forearm Flexibility", creator: "Doctor Jo", duration: "8 min", level: "Beginner", category: "stretching", rating: 4.7, reviews: 6200, videoId: "XKWJ3Flfm8A", tags: ["wrists", "forearms", "yoga-prep"], reason: "Essential for yoga, typing, and any wrist-intensive activity." },
  { id: "s16", title: "Full Body Flexibility – Advanced", creator: "Antranik", duration: "60 min", level: "Advanced", category: "stretching", rating: 4.8, reviews: 3800, videoId: "s-1vMbAgYWU", tags: ["advanced", "comprehensive", "full-body"], reason: "Comprehensive advanced stretching program for serious flexibility goals." },

  // ── SLEEP (8 videos) ──────────────────────────────────────────
  { id: "sl1", title: "Sleep Meditation – Let Go of Anxiety", creator: "Michael Sealey", duration: "30 min", level: "Beginner", category: "sleep", rating: 4.9, reviews: 28400, videoId: "acLUWBuAvms", tags: ["sleep", "anxiety", "guided"], reason: "One of YouTube's most-watched sleep meditations — deeply effective." },
  { id: "sl2", title: "10-Min Yoga Nidra for Sleep", creator: "Yoga Nidra Network", duration: "10 min", level: "Beginner", category: "sleep", rating: 4.8, reviews: 14700, videoId: "ApQ9NovgnA4", tags: ["yoga-nidra", "NSDR", "short"], reason: "Quick yoga nidra session equivalent to 4 hours of sleep." },
  { id: "sl3", title: "Bedtime Yoga for Deep Sleep", creator: "Yoga With Adriene", duration: "22 min", level: "Beginner", category: "sleep", rating: 4.9, reviews: 19200, videoId: "v7SN-d4qXx0", tags: ["bedtime", "yoga", "relax"], reason: "Gentle yoga sequence to transition from the day to deep restful sleep." },
  { id: "sl4", title: "Body Scan for Deep Sleep", creator: "Jason Stephenson", duration: "45 min", level: "Intermediate", category: "sleep", rating: 4.8, reviews: 11600, videoId: "FwWua_fAa2I", tags: ["body-scan", "deep-sleep", "long"], reason: "Progressive relaxation that systematically releases tension across the body." },
  { id: "sl5", title: "Sleep Hypnosis for Insomnia", creator: "Michael Sealey", duration: "60 min", level: "Intermediate", category: "sleep", rating: 4.8, reviews: 9400, videoId: "uaBK0cCcMzw", tags: ["hypnosis", "insomnia", "deep"], reason: "Clinical sleep hypnosis for chronic insomnia sufferers." },
  { id: "sl6", title: "432Hz Sleep Music Meditation", creator: "Meditative Mind", duration: "60 min", level: "Intermediate", category: "sleep", rating: 4.7, reviews: 7800, videoId: "o-9T184mpY4", tags: ["music", "432hz", "binaural"], reason: "Tuned to 432Hz frequency associated with deep relaxation and sleep." },
  { id: "sl7", title: "Yoga Nidra – 30 Min Deep Rest", creator: "Ally Boothroyd", duration: "30 min", level: "Advanced", category: "sleep", rating: 4.9, reviews: 8200, videoId: "8mM5Oks8yZc", tags: ["yoga-nidra", "deep", "advanced"], reason: "In-depth yoga nidra for those seeking the deepest possible rest state." },
  { id: "sl8", title: "Yin Yoga for Sleep – Night Practice", creator: "Yoga With Bird", duration: "35 min", level: "Advanced", category: "sleep", rating: 4.8, reviews: 5900, videoId: "q-76wcHi9GM", tags: ["yin", "night", "advanced-relax"], reason: "Advanced yin practice for experienced practitioners wanting deeper night rest." },
];

const categories = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "yoga", label: "Yoga", emoji: "🧘" },
  { id: "meditation", label: "Meditation", emoji: "🧠" },
  { id: "breathwork", label: "Breathwork", emoji: "💨" },
  { id: "pilates", label: "Pilates", emoji: "💪" },
  { id: "stretching", label: "Stretching", emoji: "🤸" },
  { id: "sleep", label: "Sleep", emoji: "🌙" },
];

const levelColors: Record<string, string> = {
  "Beginner": "#6BB8A0",
  "Intermediate": "#D4A853",
  "Advanced": "#E88A7C",
};

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          backgroundColor: "#000",
          display: "flex", flexDirection: "column",
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&fs=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ flex: 1, width: "100%", border: "none", display: "block" }}
        />
        {/* Controls overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 14px",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}>
          <button onClick={onClose} style={{
            width: "36px", height: "36px", borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} color="white" />
          </button>
          <button onClick={() => setIsFullscreen(false)} style={{
            width: "36px", height: "36px", borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Minimize2 size={16} color="white" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.80)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px", margin: "0 auto",
          backgroundColor: "var(--background)", borderRadius: "24px 24px 0 0",
          maxHeight: "92dvh", overflowY: "auto",
        }}
      >
        {/* Embedded YouTube player */}
        <div style={{ position: "relative" }}>
          <div style={{ aspectRatio: "16/9", backgroundColor: "#000", borderRadius: "24px 24px 0 0", overflow: "hidden" }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&fs=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
          {/* Close button */}
          <button onClick={onClose} style={{
            position: "absolute", top: "12px", left: "12px",
            width: "32px", height: "32px", borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}>
            <X size={15} color="white" />
          </button>
          {/* Fullscreen button */}
          <button onClick={() => setIsFullscreen(true)} style={{
            position: "absolute", top: "12px", right: "12px",
            width: "32px", height: "32px", borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}>
            <Maximize2 size={15} color="white" />
          </button>
        </div>

        <div style={{ padding: "18px 20px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <h3 style={{ color: "var(--foreground)", margin: 0, flex: 1, lineHeight: "1.3", fontSize: "17px" }}>{video.title}</h3>
            <span style={{
              padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
              backgroundColor: levelColors[video.level] + "22", color: levelColors[video.level],
              marginLeft: "10px", whiteSpace: "nowrap", flexShrink: 0,
            }}>{video.level}</span>
          </div>
          <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "12px" }}>by {video.creator}</p>
          <div style={{ display: "flex", gap: "16px", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={13} color="var(--muted-foreground)" />
              <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{video.duration}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Star size={13} color="#D4A853" fill="#D4A853" />
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: "600" }}>{video.rating}</span>
              <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>({video.reviews.toLocaleString()} reviews)</span>
            </div>
          </div>
          <div style={{
            padding: "12px 14px", borderRadius: "12px",
            backgroundColor: "var(--wellness-teal)11",
            borderLeft: "3px solid var(--wellness-teal)",
            marginBottom: "14px",
          }}>
            <div style={{ fontSize: "11px", color: "var(--wellness-teal)", fontWeight: "600", marginBottom: "4px" }}>WHY THIS VIDEO</div>
            <div style={{ fontSize: "13px", color: "var(--foreground)", lineHeight: "1.5" }}>{video.reason}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {video.tags.map(t => (
              <span key={t} style={{
                padding: "4px 10px", borderRadius: "20px", fontSize: "11px",
                backgroundColor: "var(--muted)", color: "var(--muted-foreground)",
              }}>#{t}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoCard({ video, onPlay }: { video: Video; onPlay: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div onClick={onPlay} style={{
      backgroundColor: "var(--card)", borderRadius: "16px",
      border: "1.5px solid var(--border)", overflow: "hidden", cursor: "pointer",
    }}>
      <div style={{
        aspectRatio: "16/9", position: "relative",
        background: imgError
          ? "linear-gradient(135deg, var(--wellness-teal)25, var(--wellness-indigo)25)"
          : `url(https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg) center/cover`,
        backgroundColor: "var(--muted)",
      }}>
        {!imgError && (
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
            onError={() => setImgError(true)}
            style={{ display: "none" }}
            alt=""
          />
        )}
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Play size={16} fill="#FF0000" color="#FF0000" style={{ marginLeft: "2px" }} />
          </div>
        </div>
        <div style={{
          position: "absolute", bottom: "6px", left: "6px", padding: "2px 7px",
          borderRadius: "5px", backgroundColor: "rgba(0,0,0,0.65)",
          color: "#fff", fontSize: "10px", fontWeight: "600",
        }}>{video.duration}</div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)", lineHeight: "1.3", marginBottom: "3px" }}>
          {video.title}
        </div>
        <div style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "7px" }}>{video.creator}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            padding: "2px 7px", borderRadius: "5px", fontSize: "9px", fontWeight: "700",
            backgroundColor: levelColors[video.level] + "22", color: levelColors[video.level],
            textTransform: "uppercase", letterSpacing: "0.3px",
          }}>{video.level}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <Star size={10} color="#D4A853" fill="#D4A853" />
            <span style={{ fontSize: "10px", color: "var(--muted-foreground)", fontWeight: "600" }}>{video.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Library() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filtered = videos.filter(v => {
    const matchCat = activeCategory === "all" || v.category === activeCategory;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.creator.toLowerCase().includes(search.toLowerCase()) ||
      v.tags.some(t => t.includes(search.toLowerCase()));
    const matchLevel = selectedLevel === "All" || v.level === selectedLevel;
    return matchCat && matchSearch && matchLevel;
  });

  const categoryCounts: Record<string, number> = {};
  categories.forEach(c => {
    categoryCounts[c.id] = c.id === "all" ? videos.length : videos.filter(v => v.category === c.id).length;
  });

  return (
    <div style={{ paddingBottom: "100px" }}>
      <div style={{ padding: "52px 24px 12px" }}>
        <h2 style={{ color: "var(--foreground)", marginBottom: "4px", fontFamily: "var(--font-display)" }}>Practice Library</h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "14px" }}>
          {videos.length} curated sessions · tap any to watch
        </p>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          backgroundColor: "var(--input-background)", borderRadius: "14px",
          padding: "11px 14px", marginBottom: "12px",
        }}>
          <Search size={15} color="var(--muted-foreground)" />
          <input
            type="text"
            placeholder="Search by title, creator, or style..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "var(--foreground)", fontSize: "14px", fontFamily: "inherit",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={13} color="var(--muted-foreground)" />
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "7px", marginBottom: "4px", overflowX: "auto", paddingBottom: "4px" }}>
          {["All", "Beginner", "Intermediate", "Advanced"].map(l => (
            <button key={l} onClick={() => setSelectedLevel(l)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
              border: `1.5px solid ${selectedLevel === l ? "var(--wellness-teal)" : "var(--border)"}`,
              backgroundColor: selectedLevel === l ? "rgba(61,139,122,0.12)" : "var(--card)",
              color: selectedLevel === l ? "var(--wellness-teal)" : "var(--muted-foreground)",
              cursor: "pointer", fontWeight: selectedLevel === l ? "600" : "400",
              fontFamily: "inherit",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", paddingLeft: "24px", overflowX: "auto", marginBottom: "16px", paddingBottom: "4px" }}>
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{
            flexShrink: 0, padding: "8px 14px", borderRadius: "20px",
            border: `1.5px solid ${activeCategory === c.id ? "var(--wellness-teal)" : "var(--border)"}`,
            backgroundColor: activeCategory === c.id ? "var(--wellness-teal)" : "var(--card)",
            color: activeCategory === c.id ? "#fff" : "var(--foreground)",
            cursor: "pointer", fontSize: "13px", fontWeight: "500",
            display: "flex", alignItems: "center", gap: "5px",
            fontFamily: "inherit",
          }}>
            <span>{c.emoji}</span> {c.label}
            <span style={{
              fontSize: "10px", fontWeight: "700",
              backgroundColor: activeCategory === c.id ? "rgba(255,255,255,0.25)" : "var(--muted)",
              color: activeCategory === c.id ? "#fff" : "var(--muted-foreground)",
              padding: "1px 6px", borderRadius: "10px",
            }}>{categoryCounts[c.id]}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: "0 24px" }}>
        <div style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "12px" }}>
          {filtered.length} session{filtered.length !== 1 ? "s" : ""}
          {search ? ` matching "${search}"` : ""}
          {selectedLevel !== "All" ? ` · ${selectedLevel}` : ""}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted-foreground)" }}>
            <Search size={28} style={{ margin: "0 auto 10px", display: "block", opacity: 0.4 }} />
            No sessions found. Try adjusting filters.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {filtered.map(v => (
              <VideoCard key={v.id} video={v} onPlay={() => setSelectedVideo(v)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
    </div>
  );
}
