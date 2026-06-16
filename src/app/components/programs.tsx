import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Check, ChevronRight, X, Clock, Star, Calendar } from "lucide-react";

interface DaySession {
  day: number;
  title: string;
  focus: string;
  duration: string;
  videoId: string;
  instructions: string[];
}

interface Program {
  id: string;
  title: string;
  totalDays: number;
  level: string;
  category: string;
  description: string;
  benefits: string[];
  color: string;
  emoji: string;
  rating: number;
  enrolled: number;
  sessions: DaySession[];
}

const programs: Program[] = [
  {
    id: "stress-7",
    title: "7-Day Stress Relief",
    totalDays: 7,
    level: "Beginner",
    category: "Wellness",
    description: "Transform your relationship with stress through gentle yoga, breathwork, and mindfulness. This 7-day journey will give you lasting tools to find calm on demand.",
    benefits: ["Reduce cortisol levels", "Learn breathwork tools", "Build a calming routine", "Improve sleep quality"],
    color: "#6BB8A0",
    emoji: "🌿",
    rating: 4.9,
    enrolled: 24300,
    sessions: [
      { day: 1, title: "Intro to Stress-Relief Yoga", focus: "Foundation", duration: "15 min", videoId: "hJbRpHZr_d0", instructions: ["Start in a comfortable seated position and take 3 deep breaths", "Move through gentle cat-cow stretches to warm up the spine", "Hold each pose for 5 breaths, focusing on releasing tension", "End in legs-up-the-wall pose for 3 minutes"] },
      { day: 2, title: "Box Breathing Practice", focus: "Breathwork", duration: "10 min", videoId: "tybOi4hjZFQ", instructions: ["Sit comfortably with your back straight", "Inhale slowly for 4 counts through the nose", "Hold your breath gently for 4 counts", "Exhale slowly for 4 counts through the mouth", "Hold empty for 4 counts. Repeat 8 times"] },
      { day: 3, title: "Yin Yoga for Tension Release", focus: "Flexibility & Calm", duration: "20 min", videoId: "2MJGg-dUKh0", instructions: ["Hold each pose for 3–5 minutes — this is the key to yin yoga", "Focus on the hips, spine, and shoulders where stress is stored", "Use bolsters or blankets to support yourself in each pose", "Breathe naturally and let gravity do the work"] },
      { day: 4, title: "Guided Body Scan Meditation", focus: "Mindfulness", duration: "15 min", videoId: "ZToicYcHIOU", instructions: ["Lie flat on your back in savasana", "Close your eyes and bring awareness to each body part", "Start at the top of the head and work down to the toes", "If you find tension, breathe into it and consciously release"] },
      { day: 5, title: "Restorative Yoga Flow", focus: "Deep Rest", duration: "25 min", videoId: "v7AYKMP6rOE", instructions: ["Gather 2 blankets and a pillow to support each pose", "Stay in supported fish pose for 5 minutes", "Move to supta baddha konasana for 5 minutes", "Finish with a 10-minute supported savasana"] },
      { day: 6, title: "Mindful Movement & Flow", focus: "Integration", duration: "20 min", videoId: "9kOCY0KNByw", instructions: ["Connect each movement to your breath intentionally", "Move slowly — this is not a workout, it's a moving meditation", "Notice how your body feels today without judgment", "Return to your breath whenever the mind wanders"] },
      { day: 7, title: "Full Stress Relief Sequence", focus: "Completion", duration: "30 min", videoId: "hJbRpHZr_d0", instructions: ["This is your graduation practice — you've built the tools", "Combine breathwork, gentle yoga, and meditation", "Spend the final 10 minutes writing in a journal about your week", "Set an intention for continuing your practice going forward"] },
    ],
  },
  {
    id: "sleep-14",
    title: "14-Day Better Sleep",
    totalDays: 14,
    level: "All Levels",
    category: "Sleep",
    description: "Establish a powerful bedtime ritual that retrains your nervous system for deep, restorative sleep. Science-backed techniques from yoga nidra to breathwork.",
    benefits: ["Fall asleep faster", "Wake up fewer times", "Deeper sleep cycles", "Reduced sleep anxiety"],
    color: "#7B9EC5",
    emoji: "🌙",
    rating: 4.8,
    enrolled: 31800,
    sessions: [
      { day: 1, title: "Sleep Foundation: Introduction", focus: "Understanding Sleep", duration: "20 min", videoId: "1vx8iUvfyCY", instructions: ["Learn about sleep hygiene and set your bedroom temperature to 18°C / 65°F", "Turn off all screens 30 minutes before this practice", "Do this practice in bed or on a mat near your bed", "Follow the yoga nidra guide — allow yourself to drift if you do"] },
      { day: 2, title: "Evening Stretch Routine", focus: "Body Release", duration: "15 min", videoId: "L_xrDAtykMI", instructions: ["Begin 1 hour before your intended sleep time", "Focus on releasing hip flexors, hamstrings, and shoulders", "Move slowly and with less range than you would in daytime practice", "Finish with 3 minutes of legs-up-the-wall"] },
      { day: 3, title: "4-7-8 Sleep Breathing", focus: "Breathwork", duration: "10 min", videoId: "tybOi4hjZFQ", instructions: ["Lie in bed when you do this practice", "Inhale through the nose for 4 counts", "Hold the breath for 7 counts", "Exhale completely through the mouth for 8 counts", "Repeat a minimum of 4 cycles — many fall asleep before finishing"] },
      { day: 4, title: "Progressive Muscle Relaxation", focus: "Tension Release", duration: "20 min", videoId: "ZToicYcHIOU", instructions: ["Tense each muscle group for 5 seconds then release for 30 seconds", "Start with feet: curl toes, tense, release. Notice the relaxation", "Work up: calves, thighs, stomach, hands, arms, shoulders, face", "After completing the scan, your body should feel very heavy"] },
      { day: 5, title: "Restorative Yoga for Sleep", focus: "Deep Relaxation", duration: "25 min", videoId: "v7AYKMP6rOE", instructions: ["Set your bedroom lights very low or use a candle", "Supported child's pose: 5 minutes with a pillow under your chest", "Supine twist: 3 minutes each side", "End in savasana with a blanket over you — sleep from here"] },
      { day: 6, title: "Guided Sleep Meditation", focus: "Mind Quieting", duration: "30 min", videoId: "1vx8iUvfyCY", instructions: ["Use headphones for the best effect", "Allow your body to become completely still as the guide begins", "When thoughts arise, imagine placing them in a cloud and watching them float away", "Do not try to stay awake — sleep is the goal"] },
      { day: 7, title: "Yin Yoga for Deeper Sleep", focus: "Connective Release", duration: "30 min", videoId: "2MJGg-dUKh0", instructions: ["Reclined butterfly: hold for 5 minutes with a pillow under your knees", "Sleeping swan / pigeon: 4 minutes per side", "Supported fish pose: 5 minutes on a folded blanket", "Savasana: 5 minutes, drifting into sleep"] },
      { day: 8, title: "Advanced Yoga Nidra", focus: "Consciousness Threshold", duration: "35 min", videoId: "pL02HUFk_q8", instructions: ["This practice takes you to the edge of sleep — the hypnagogic state", "Avoid moving once the practice begins", "Follow the rotation of consciousness through each body part", "Welcome any imagery or sensations that arise without judgment"] },
      { day: 9, title: "Evening Wind-Down Flow", focus: "Transition Ritual", duration: "20 min", videoId: "9kOCY0KNByw", instructions: ["This is your signal to your nervous system that night is here", "Dim lights, put on soft music, and move very slowly", "Include gentle neck rolls, seated forward folds, and spinal twists", "Journal for 5 minutes after: write tomorrow's to-do list to clear the mind"] },
      { day: 10, title: "Sleep Anxiety Relief Practice", focus: "Calming Anxiety", duration: "15 min", videoId: "ZToicYcHIOU", instructions: ["If you lie awake anxious, try this technique instead of staying in bed", "Sit up, take 10 deep diaphragmatic breaths", "Write down every worry — getting it on paper removes it from your head", "Return to bed and practice the 4-7-8 breathing technique"] },
      { day: 11, title: "Sound Bath for Sleep", focus: "Sound Therapy", duration: "30 min", videoId: "d4S4bBUVHDc", instructions: ["Use headphones and set volume to a comfortable, relaxing level", "Allow the sounds to wash over you — no need to focus or analyze", "Let your breathing naturally slow to match the rhythm of the sounds", "Allow yourself to fall asleep — this is the intended outcome"] },
      { day: 12, title: "Full Body Relaxation Sequence", focus: "Complete Release", duration: "25 min", videoId: "1vx8iUvfyCY", instructions: ["Combine all techniques you've learned this week", "Start with 5 min gentle stretching, then 10 min body scan, then 10 min breathing", "Add a gratitude moment: think of 3 things that went well today", "Drift into sleep from the breathing practice"] },
      { day: 13, title: "Cyclic Sighing for Sleep", focus: "Breath Reset", duration: "8 min", videoId: "tybOi4hjZFQ", instructions: ["Take a normal inhale through the nose", "At the top, take one more small inhale to fully expand the lungs", "Release with a long, slow exhale through the mouth", "Repeat for 5 minutes — scientifically proven to reduce anxiety in real time"] },
      { day: 14, title: "Your Complete Sleep Ritual", focus: "Graduation", duration: "35 min", videoId: "1vx8iUvfyCY", instructions: ["Congratulations — you have built a sleep ritual that works for you", "Combine your favourite elements from the past 14 days", "Reflect on how your sleep has changed", "Commit to continuing 3–4 elements of this ritual every night going forward"] },
    ],
  },
  {
    id: "flex-21",
    title: "21-Day Flexibility Challenge",
    totalDays: 21,
    level: "Intermediate",
    category: "Flexibility",
    description: "A progressive, science-based flexibility program that safely increases your range of motion over 21 days through yin yoga, dynamic stretching, and mobility work.",
    benefits: ["Significantly increase flexibility", "Reduce injury risk", "Improve posture", "Reduce muscle soreness"],
    color: "#E8A87C",
    emoji: "🤸",
    rating: 4.8,
    enrolled: 19600,
    sessions: [
      { day: 1, title: "Hip Flexibility – Foundation", focus: "Hips", duration: "20 min", videoId: "2MJGg-dUKh0", instructions: ["Start with a 5-minute warm-up of gentle hip circles", "Low lunge: hold 2 minutes per side", "Pigeon pose: hold 2 minutes per side", "Bound angle pose: 3 minutes. Record your starting range of motion today"] },
      { day: 2, title: "Hamstring Opening – Week 1", focus: "Hamstrings", duration: "18 min", videoId: "L_xrDAtykMI", instructions: ["Warm up with 5 sun salutations at a slow pace", "Seated forward fold: hold for 3 minutes — do not force it", "Reclined leg stretch with a strap: 2 minutes per side", "Pyramid pose: 90 seconds per side"] },
      { day: 3, title: "Shoulder & Chest Opener", focus: "Upper Body", duration: "20 min", videoId: "v7AYKMP6rOE", instructions: ["Thread the needle: 2 minutes per side", "Eagle arms: 1 minute per side", "Doorway chest stretch: 3 sets of 30 seconds", "Supported fish pose over a block: 5 minutes"] },
      { day: 4, title: "Spine Mobility Day", focus: "Spine", duration: "22 min", videoId: "hJbRpHZr_d0", instructions: ["Cat-cow: 2 minutes, moving with breath", "Seated spinal twist: 2 minutes per side", "Supported backbend over a bolster: 5 minutes", "Child's pose counter-stretch: 3 minutes"] },
      { day: 5, title: "Full Yin Yoga Sequence", focus: "Deep Tissue", duration: "45 min", videoId: "2MJGg-dUKh0", instructions: ["This is your first full yin practice — hold each pose 3–5 minutes", "Dragon pose (low lunge yin): 3 min per side", "Sleeping swan / pigeon: 4 min per side", "Seal / sphinx backbend: 4 minutes", "Shoelace / double pigeon: 3 min per side"] },
      { day: 6, title: "Ankle & Calf Mobility", focus: "Lower Legs", duration: "15 min", videoId: "L_xrDAtykMI", instructions: ["Ankle circles: 30 each direction, each ankle", "Seated dorsiflexion stretch: 2 minutes per foot", "Standing calf stretch at wall: 2 minutes per side", "Squat hold (malasana): 3 minutes. Use a support if needed"] },
      { day: 7, title: "Active Flexibility Flow", focus: "Week 1 Integration", duration: "30 min", videoId: "9kOCY0KNByw", instructions: ["Today combines passive and active stretching", "Move dynamically through warrior sequences (active)", "Then hold each warrior for 90 seconds (passive integration)", "Re-measure your hip and hamstring range from Day 1"] },
      { day: 8, title: "Hip Flexors – Week 2", focus: "Hips (Deeper)", duration: "25 min", videoId: "2MJGg-dUKh0", instructions: ["Dragon pose with back knee down: 4 minutes per side", "Half splits: 3 minutes per side", "Full splits attempt (prop supported): 3 minutes", "Compare to Day 1 — notice improvement"] },
      { day: 9, title: "Hamstrings – Progressive Depth", focus: "Hamstrings (Week 2)", duration: "22 min", videoId: "L_xrDAtykMI", instructions: ["Warm up with 2 minutes of leg swings each side", "Seated wide-leg forward fold: 4 minutes", "Single-leg seated fold: 3 minutes per side", "Try to extend 10% further than Day 2 — gentle persistence"] },
      { day: 10, title: "Thoracic Spine Extension", focus: "Upper Back", duration: "20 min", videoId: "v7AYKMP6rOE", instructions: ["Use a foam roller under the thoracic spine: 5 minutes", "Camel pose with blocks: 3 sets of 5 breaths", "Cow face pose arms: 2 minutes per side", "Puppy pose: 3 minutes"] },
      { day: 11, title: "PNF Stretching – Hamstrings", focus: "Neuromuscular Technique", duration: "20 min", videoId: "L_xrDAtykMI", instructions: ["PNF (contract-relax) is the fastest way to gain flexibility", "Lift leg with a strap until you feel resistance", "Contract hamstring against strap for 10 seconds, then relax and go deeper", "Repeat 4 times per leg — you should gain range each time"] },
      { day: 12, title: "Full Body Yin – Week 2", focus: "Deep Release", duration: "50 min", videoId: "2MJGg-dUKh0", instructions: ["Hold everything 5 minutes this week (was 3–4 minutes in Week 1)", "Butterfly: 5 min, Dragonfly (wide seated): 5 min", "Sleeping swan: 5 min per side, Lizard: 5 min per side", "Saddle pose: 5 min. This is the most intense — use a block if needed"] },
      { day: 13, title: "Wrist & Forearm Flexibility", focus: "Wrists", duration: "12 min", videoId: "hJbRpHZr_d0", instructions: ["Wrist circles: 30 each direction", "Reverse prayer position: 90 seconds", "Table stretch (fingers pointing back): 90 seconds", "Forearm stretch with elbow straight: 90 seconds per side"] },
      { day: 14, title: "Week 2 Progress Check", focus: "Assessment", duration: "30 min", videoId: "9kOCY0KNByw", instructions: ["Repeat Day 1 poses and measure your improvement", "Take photos or video of your current range for comparison", "Note which areas improved most and which need more work", "Celebrate your progress — 2 weeks of consistency is a big deal"] },
      { day: 15, title: "Splits Progression", focus: "Hips (Week 3)", duration: "30 min", videoId: "2MJGg-dUKh0", instructions: ["Warm up thoroughly: 10 minutes of dynamic stretching", "Dragon pose: 5 minutes per side", "Half splits: 3 minutes per side", "Full splits with blocks under hips: spend 5 minutes here. Go only as far as comfortable"] },
      { day: 16, title: "Backbend Progression", focus: "Spine Extension", duration: "25 min", videoId: "v7AYKMP6rOE", instructions: ["Cobra: 5 breaths × 3 sets, increasing height each set", "Updog: 5 breaths × 3 sets", "Bridge: 5 breaths × 3 sets, eventually trying one-legged", "Wheel (if comfortable): 3 attempts of 5 breaths each"] },
      { day: 17, title: "Shoulder Flexibility – Advanced", focus: "Shoulders (Week 3)", duration: "22 min", videoId: "hJbRpHZr_d0", instructions: ["Goalpost stretch: 3 minutes at wall", "Sleeper stretch: 3 minutes per side", "Behind-back bind attempt: 2 minutes per side", "Garudasana (eagle) full expression: 90 seconds per side"] },
      { day: 18, title: "Deep Yin – Full Body", focus: "Week 3 Deep Dive", duration: "60 min", videoId: "2MJGg-dUKh0", instructions: ["This is the most challenging yin practice of the program", "Every pose: 5–6 minutes. No exceptions — this is where the gains happen", "Set a timer so you don't need to watch the clock", "Focus entirely on breath and sensation — this is moving meditation"] },
      { day: 19, title: "Dynamic Flexibility Flow", focus: "Active Mobility", duration: "35 min", videoId: "WgCT5xNkMOg", instructions: ["Leg swings: 30 each direction, each leg", "Hip circles: 30 each direction", "Spinal waves: 2 minutes", "Move through a flowing yoga sequence at medium pace — let flexibility translate into movement"] },
      { day: 20, title: "Final Assessment Preparation", focus: "Consolidation", duration: "30 min", videoId: "9kOCY0KNByw", instructions: ["Revisit all the key poses from the program", "Approach each one mindfully — notice how much has changed", "Practice the poses that still challenge you the most", "Prepare mentally for tomorrow's final assessment"] },
      { day: 21, title: "Graduation: Full Flexibility Assessment", focus: "Completion", duration: "45 min", videoId: "2MJGg-dUKh0", instructions: ["Repeat your Day 1 assessment — measure every benchmark pose", "Take comparison photos or video", "You should notice significant improvement across the board", "Set your next flexibility goal and plan to maintain with 3–4 sessions per week"] },
    ],
  },
  {
    id: "weight-30",
    title: "30-Day Weight Loss Journey",
    totalDays: 30,
    level: "Beginner",
    category: "Weight Loss",
    description: "A holistic 30-day program combining dynamic yoga flows, breathwork, and mindful movement to support sustainable weight loss through a consistent daily practice.",
    benefits: ["Burn calories with yoga", "Boost metabolism", "Build lean muscle", "Improve body awareness"],
    color: "#E88A7C",
    emoji: "🔥",
    rating: 4.7,
    enrolled: 43200,
    sessions: [
      { day: 1, title: "Week 1 Kickoff: Foundation Flow", focus: "Getting Started", duration: "20 min", videoId: "4C-gxOE0j7s", instructions: ["Start with 5 minutes of walking or marching in place to warm up", "Learn sun salutation A — this is the backbone of the program", "Do 5 rounds of sun salutation A slowly, focusing on form", "Finish with 5 minutes of seated breathing to cool down"] },
      { day: 2, title: "Core Activation Yoga", focus: "Core Strength", duration: "22 min", videoId: "WgCT5xNkMOg", instructions: ["Plank pose: hold for 30 seconds × 5 sets", "Boat pose: 5 breaths × 3 sets", "Side plank: 20 seconds each side × 3 sets", "Low plank (chaturanga) holds: 3 sets of 10 seconds"] },
      { day: 3, title: "Dynamic Vinyasa for Metabolism", focus: "Cardio & Flow", duration: "25 min", videoId: "9kOCY0KNByw", instructions: ["Move continuously — this is your cardio yoga session", "Sun Salutation B: 6 rounds without stopping", "Keep the pace brisk: 1 breath = 1 movement", "Aim to feel slightly out of breath — that's normal and beneficial"] },
      { day: 4, title: "Rest & Yin Recovery", focus: "Active Recovery", duration: "20 min", videoId: "2MJGg-dUKh0", instructions: ["Rest days are essential for weight loss — muscles recover and grow", "Today is gentle yin yoga, not intense movement", "Hold each pose 3–4 minutes, focusing on the areas most sore", "Hydrate well today — drink at least 2.5 litres of water"] },
      { day: 5, title: "Standing Poses Power Sequence", focus: "Leg Strength", duration: "28 min", videoId: "kGOKN6MLMTQ", instructions: ["Warrior I: 5 breaths per side × 3 rounds", "Warrior II: 5 breaths per side × 3 rounds", "Chair pose: 10 breaths × 4 sets", "Fierce warrior: 5 breaths × 3 rounds — this builds serious heat"] },
      { day: 6, title: "Morning Metabolism Boost", focus: "Energy & Warmth", duration: "18 min", videoId: "4C-gxOE0j7s", instructions: ["Do this session first thing in the morning before eating", "10 rounds of kapalabhati breath to wake the metabolism", "Then flow through 5 rounds of sun salutation at a brisk pace", "Finish with 2 minutes of jumping jacks or high knees (optional)"] },
      { day: 7, title: "Week 1 Full Flow", focus: "Week 1 Completion", duration: "35 min", videoId: "9kOCY0KNByw", instructions: ["Combine everything from the week: core, standing poses, and cardio flow", "7 rounds of sun salutation B — one for each day of the week", "Challenge: hold each standing pose for 10 breaths instead of 5", "Journal: what is your why? What are you working toward?"] },
      { day: 8, title: "Week 2: Building Intensity", focus: "Progressive Overload", duration: "30 min", videoId: "WgCT5xNkMOg", instructions: ["Increase hold times by 50% compared to last week", "Add a jump back and jump forward to your sun salutations", "Try transitions like: warrior → reverse warrior → triangle", "This week you should feel your heart rate elevating more"] },
      { day: 9, title: "Twisting for Detox", focus: "Digestion & Detox", duration: "25 min", videoId: "hJbRpHZr_d0", instructions: ["Twisting poses stimulate the digestive organs and support detox", "Revolved lunge: 5 breaths × 3 rounds per side", "Revolved triangle: 5 breaths × 3 rounds per side", "Reclined spinal twist: 3 minutes per side to finish"] },
      { day: 10, title: "Hip & Glute Strengthening", focus: "Lower Body Tone", duration: "28 min", videoId: "kGOKN6MLMTQ", instructions: ["Goddess pose squat: 20 pulses × 3 sets", "Three-legged dog: 10 breaths per side × 3 rounds", "Locust pose: 10 breaths × 3 sets for the glutes", "Bridge pose: 10 breaths × 3 sets, trying single-leg progressions"] },
      { day: 11, title: "Power Flow – No Breaks", focus: "Endurance", duration: "35 min", videoId: "9kOCY0KNByw", instructions: ["Today's challenge: flow for 35 minutes without stopping", "Move between poses on every exhale", "Alternate between challenging standing poses and sun salutations", "This is a milestone — celebrate completing it"] },
      { day: 12, title: "Mindful Eating & Yoga", focus: "Mind-Body Connection", duration: "20 min", videoId: "ZToicYcHIOU", instructions: ["Today's focus is on the mind-body connection to eating", "Start with 10 minutes of seated breathing and intention setting", "Contemplate: how does food make you feel? What do you truly hunger for?", "Practice yoga for the remaining time. Notice sensations without judgment"] },
      { day: 13, title: "Core Burn & Balance", focus: "Core + Balance", duration: "30 min", videoId: "WgCT5xNkMOg", instructions: ["Boat pose variations: 4 sets of 5 breaths each", "Tree pose: 10 breaths per side × 3 rounds", "Warrior III: 10 breaths per side × 3 rounds", "Side crow / crow pose attempt: 3 attempts each"] },
      { day: 14, title: "Week 2 Assessment & Rest", focus: "Check-In", duration: "20 min", videoId: "2MJGg-dUKh0", instructions: ["Measure your progress — how do you feel compared to 2 weeks ago?", "Note any changes in energy, sleep quality, or how clothes fit", "Do a gentle yin session to reward the body for two weeks of work", "Prepare mentally for the second half of the program"] },
      { day: 15, title: "Week 3: Peak Intensity Begins", focus: "Peak Challenge", duration: "40 min", videoId: "kGOKN6MLMTQ", instructions: ["This week is the most challenging — that's where the most change happens", "10 rounds of sun salutation B — this is your 'graduation test'", "Add warrior III and half-moon to your practice today", "If it's hard, you're doing it right. Rest when needed, then continue"] },
      { day: 16, title: "Arm Balance Focus", focus: "Upper Body Strength", duration: "30 min", videoId: "WgCT5xNkMOg", instructions: ["Crow pose: 5 attempts, building hold time each attempt", "Chaturanga push-ups: 3 sets of 10", "Dolphin pose: 5 breaths × 3 sets", "Forearm plank: 45 seconds × 4 sets"] },
      { day: 17, title: "HIIT Yoga Fusion", focus: "Cardio Burn", duration: "35 min", videoId: "9kOCY0KNByw", instructions: ["Alternate between yoga poses and high-intensity movements", "Warrior II → 20 jumping jacks → warrior II other side → repeat", "Sun salutation + 10 jump squats at the end of each round", "5 complete rounds. Rest 30 seconds between rounds"] },
      { day: 18, title: "Twists & Compression Flow", focus: "Metabolism Boost", duration: "25 min", videoId: "hJbRpHZr_d0", instructions: ["Twisting compresses and massages the abdominal organs", "Revolved chair pose: 5 breaths × 4 sets", "Prayer twist in crescent lunge: 5 breaths × 4 sets per side", "Seated twisted root: 3 minutes per side"] },
      { day: 19, title: "Active Rest: Long Walk + Stretch", focus: "Recovery", duration: "15 min", videoId: "L_xrDAtykMI", instructions: ["Today: take a 30-minute walk in nature (not counted in the 15 min)", "After the walk, do a 15-minute full-body stretch", "Focus on hip flexors and hamstrings which take a beating in yoga", "Reflect on how your body feels 19 days into the program"] },
      { day: 20, title: "Strong Standing Sequence", focus: "Leg Power", duration: "38 min", videoId: "kGOKN6MLMTQ", instructions: ["Extended side angle → reverse warrior → peaceful warrior: 3 rounds", "Hold every pose for 10 breaths this week", "Chair pose series: regular → twisted → prayer → 3 sets", "Notice how much stronger your legs have become"] },
      { day: 21, title: "3-Week Milestone Celebration", focus: "Celebration", duration: "40 min", videoId: "9kOCY0KNByw", instructions: ["Take a before/after photo — three weeks of consistency is a big deal", "Flow freely without following a script — trust your body's wisdom", "Attempt poses you couldn't do on Day 1", "Share your progress if you feel inspired — community supports growth"] },
      { day: 22, title: "Week 4: Final Stretch", focus: "Mastery", duration: "40 min", videoId: "WgCT5xNkMOg", instructions: ["Week 4 is about mastery and integration of everything you've learned", "Choose your 3 favourite sequences from the program and combine them", "Practice with intention: this is no longer a beginner's practice", "Feel the difference in your body, breath, and mental focus"] },
      { day: 23, title: "Inversions & Arm Strength", focus: "Advanced Strength", duration: "35 min", videoId: "9kOCY0KNByw", instructions: ["Headstand preparation at the wall: 3 attempts of 30 seconds", "Forearm stand at wall: 3 attempts", "Down dog to three-legged dog: 10 per side × 3 sets", "Chaturanga to updog flow: 15 reps × 3 sets"] },
      { day: 24, title: "Full Vinyasa Power Class", focus: "Peak Practice", duration: "50 min", videoId: "kGOKN6MLMTQ", instructions: ["This is the hardest session of the program. You're ready.", "Begin with 10 minutes of kapalabhati breathing", "12 rounds of sun salutation B", "Full standing series → balancing → backbends → cool down"] },
      { day: 25, title: "Mindfulness & Intention Reset", focus: "Inner Work", duration: "25 min", videoId: "ZToicYcHIOU", instructions: ["Slow down. The final week is as much about the mind as the body.", "Meditate for 10 minutes on your relationship with your body", "Ask: what do I want to feel in my body? What is truly healthy for me?", "Flow gently for 15 minutes from that intention"] },
      { day: 26, title: "Restorative & Yin Reward", focus: "Deep Recovery", duration: "35 min", videoId: "2MJGg-dUKh0", instructions: ["You've earned deep rest. Hold every pose for 5 minutes.", "Focus on hips: dragon, pigeon, frog", "Treat this as a spa treatment for your muscles", "Visualize the changes in your body and congratulate yourself"] },
      { day: 27, title: "Full Body Strength Flow", focus: "Strength Summary", duration: "45 min", videoId: "WgCT5xNkMOg", instructions: ["Revisit your strongest poses from the program", "Push further: longer holds, deeper expressions, more challenging variations", "Document your peak poses with photos if you'd like", "This is your final hard session before the graduation practice"] },
      { day: 28, title: "Wind Down: Gratitude Flow", focus: "Gratitude", duration: "30 min", videoId: "hJbRpHZr_d0", instructions: ["Flow with an attitude of gratitude for your body and its capabilities", "Thank each part of your body as you stretch and strengthen it", "Journal for 10 minutes: what has changed in 28 days?", "Set goals for the next 30 days of your ongoing practice"] },
      { day: 29, title: "Preparation for Final Practice", focus: "Warm-Up for Day 30", duration: "20 min", videoId: "4C-gxOE0j7s", instructions: ["A moderate, feel-good practice to prepare for tomorrow", "Flow through poses that make you feel your best", "Rest well tonight: early bed, good nutrition, plenty of water", "Visualize completing Day 30 with strength and confidence"] },
      { day: 30, title: "30-Day Graduation Practice", focus: "Completion", duration: "60 min", videoId: "9kOCY0KNByw", instructions: ["You did it! 30 days of consistent practice — this is a transformation.", "Revisit your Day 1 practice and notice how much easier everything feels", "Flow for the full 60 minutes with joy and pride", "Set your next 30-day intention. The practice never ends — it just deepens"] },
    ],
  },
  {
    id: "beginner",
    title: "Beginner Yoga Program",
    totalDays: 28,
    level: "Beginner",
    category: "Yoga",
    description: "The perfect 4-week introduction to yoga. Build your foundation with fundamental poses, breathing techniques, and mindfulness skills at a supportive pace.",
    benefits: ["Learn the fundamentals", "Build confidence", "Establish a routine", "Reduce stress and anxiety"],
    color: "#B8A8D5",
    emoji: "🧘",
    rating: 4.9,
    enrolled: 58700,
    sessions: [
      { day: 1, title: "What Is Yoga? First Practice", focus: "Introduction", duration: "15 min", videoId: "4C-gxOE0j7s", instructions: ["Yoga means 'union' — of body, breath, and mind", "Today you'll learn mountain pose, child's pose, and cat-cow", "Move slowly. There is no competition. You cannot do yoga wrong.", "End with 2 minutes of simply breathing and noticing how you feel"] },
      { day: 2, title: "Sun Salutation A – Step by Step", focus: "Sun Salutation", duration: "18 min", videoId: "4C-gxOE0j7s", instructions: ["Sun Salutation A has 12 movements — we'll learn them one by one", "Mountain pose → arms up → forward fold → half lift → plank → cobra/updog → downdog", "Do 3 slow rounds, pausing to understand each shape", "This sequence will appear every day of the program"] },
      { day: 3, title: "Standing Poses Basics", focus: "Foundation Poses", duration: "20 min", videoId: "9kOCY0KNByw", instructions: ["Learn warrior I: front knee at 90°, arms up, hips square", "Learn warrior II: arms wide, front knee over ankle, gaze over front hand", "Triangle pose: reach long before going down — length is more important than depth", "Hold each pose for 5 full breaths"] },
      { day: 4, title: "Breathing: Foundation of Yoga", focus: "Pranayama", duration: "15 min", videoId: "tybOi4hjZFQ", instructions: ["Ujjayi breath: inhale through nose, exhale through nose with mouth closed. Make an 'ocean sound' at the back of throat", "3-part breath: fill belly, then ribcage, then chest on inhale. Reverse on exhale", "Alternate nostril breathing: close right nostril, inhale left. Close left, exhale right. Repeat.", "Spend 15 minutes exploring these three techniques"] },
      { day: 5, title: "Core & Balance Foundations", focus: "Stability", duration: "20 min", videoId: "WgCT5xNkMOg", instructions: ["Tree pose: start with foot at ankle, then work up to knee or inner thigh", "Gaze at a fixed point (drishti) to help with balance — this is essential", "Plank pose: build core stability. Hold for 20 seconds to start", "Boat pose: sit tall, lean back slightly, lift feet. Hold for 5 breaths"] },
      { day: 6, title: "Hips & Hamstrings Basics", focus: "Flexibility Start", duration: "22 min", videoId: "2MJGg-dUKh0", instructions: ["Low lunge (crescent): front knee at 90°, back knee down, arms up", "Seated forward fold: never force it — fold from the hips, not the waist", "Reclined pigeon: lie on back, cross ankle over opposite knee, flex foot", "Bound angle (butterfly): bring soles together, hold feet, sit tall"] },
      { day: 7, title: "Week 1 Review & Rest", focus: "Integration", duration: "15 min", videoId: "ZToicYcHIOU", instructions: ["This is a gentle day — your body needs to process and restore", "Seated meditation: 5 minutes watching your breath without controlling it", "Journal: what did you notice about your body this week? What was hard?", "Light stretching only: 10 minutes of gentle cat-cow and child's pose"] },
      { day: 8, title: "Week 2: Sun Salutation B", focus: "Building Complexity", duration: "20 min", videoId: "4C-gxOE0j7s", instructions: ["Sun Salutation B adds chair pose and warriors to Sun Salutation A", "Chair → forward fold → halfway lift → plank → chaturanga → updog → downdog → warrior I right → chaturanga → warrior I left → forward fold → chair → mountain", "Do 3 slow rounds today. This sequence will build strength quickly", "Notice that you're already stronger than Day 1"] },
      { day: 9, title: "Hip Openers – Week 2", focus: "Hip Depth", duration: "25 min", videoId: "2MJGg-dUKh0", instructions: ["Lizard pose: front foot outside front hand, lower hips", "Half pigeon: more challenging version of Day 6's reclined pigeon. Hold 2 min per side", "Fire log pose: shins parallel, stack ankles on knees", "Keep the foot flexed in all hip poses to protect the knee joint"] },
      { day: 10, title: "Backbend Introduction", focus: "Spine Extension", duration: "18 min", videoId: "v7AYKMP6rOE", instructions: ["Cobra pose: hands under shoulders, elbows close to body, lift chest using back muscles (NOT arms)", "Upward facing dog: straighten arms, only hands and tops of feet on floor", "Bow pose: hold ankles, kick feet up while lifting chest", "Counter with child's pose between each backbend"] },
      { day: 11, title: "Forward Folds & Inversions Intro", focus: "Calming", duration: "20 min", videoId: "hJbRpHZr_d0", instructions: ["Forward folds are calming — they activate the parasympathetic nervous system", "Standing forward fold: let the head be heavy. Bend knees if needed.", "Seated forward fold: use a strap around your feet if you can't reach", "Legs up the wall: lie with legs vertical against wall for 5 minutes — very calming"] },
      { day: 12, title: "Twisting for Digestion", focus: "Twists", duration: "20 min", videoId: "9kOCY0KNByw", instructions: ["Twists wring out the spine and stimulate digestion", "Seated twist: sit tall first, then twist — never twist from a collapsed spine", "Reclined twist: lie on back, drop both knees to one side", "Always inhale to lengthen, exhale to twist deeper"] },
      { day: 13, title: "Full Sequence Practice", focus: "Integration", duration: "30 min", videoId: "9kOCY0KNByw", instructions: ["Combine everything from Weeks 1 and 2 into one complete flow", "3 rounds sun salutation A → 3 rounds sun salutation B → standing poses → seated poses → savasana", "Move at your own pace — challenge yourself gently", "You're now 13 days in. Notice how different yoga feels compared to Day 1"] },
      { day: 14, title: "Week 2 Meditation & Rest", focus: "Rest", duration: "20 min", videoId: "ZToicYcHIOU", instructions: ["Longer meditation today: 10 minutes", "Sit comfortably, close eyes, focus on the sensation of breathing", "When thoughts arise (they will!), gently return focus to breath", "After meditation, 10 minutes of restorative poses: supported fish, savasana"] },
      { day: 15, title: "Week 3: Yoga Philosophy Introduction", focus: "Philosophy", duration: "22 min", videoId: "4C-gxOE0j7s", instructions: ["The 8 limbs of yoga: the poses (asana) are only 1 of 8 limbs", "Ahimsa (non-violence) toward yourself: no forcing, no judging, no comparing", "Move through today's practice with this question: 'Am I being kind to myself?'", "Sun salutations × 5 rounds with this quality of awareness"] },
      { day: 16, title: "Arm Balances – First Steps", focus: "Arm Strength", duration: "25 min", videoId: "WgCT5xNkMOg", instructions: ["Crow pose: the most accessible arm balance. Start with feet on blocks.", "Lean forward until weight shifts to arms — most people can balance for 1 breath here", "Chaturanga push-ups: the foundation of all arm strength in yoga. 3 sets of 5.", "Don't worry about 'getting' crow today — exploration is the practice"] },
      { day: 17, title: "Yin Yoga Fundamentals", focus: "Yin Practice", duration: "35 min", videoId: "2MJGg-dUKh0", instructions: ["In yin yoga, muscles should be relaxed (not engaged) in each pose", "We're targeting the fascia and connective tissue — not the muscles", "Minimum 3 minutes per pose: the first 2 minutes muscles resist, the 3rd minute is where change happens", "Today: butterfly, dragon, sleeping swan, supported fish"] },
      { day: 18, title: "Standing Balance Deepening", focus: "Balance", duration: "22 min", videoId: "9kOCY0KNByw", instructions: ["Tree pose: work up to having arms above head if stable", "Warrior III: extend arms forward, torso and back leg parallel to floor", "Half moon at the wall: use wall as a support to learn the shape", "Standing split: reach one leg up while folded forward — flexibility + balance"] },
      { day: 19, title: "Breath + Movement Integration", focus: "Vinyasa Principle", duration: "28 min", videoId: "4C-gxOE0j7s", instructions: ["Vinyasa means 'breath-synchronized movement'", "Every movement should link to an inhale or exhale", "Move through your sun salutation sequence with this intention", "If breath becomes laboured, slow down or rest in child's pose"] },
      { day: 20, title: "Week 3 Yin & Reflection", focus: "Deep Rest", duration: "35 min", videoId: "2MJGg-dUKh0", instructions: ["Longer yin practice: 5 minutes per pose", "Journal after: what has shifted in 20 days? Strength? Flexibility? Mindset?", "Think about what you would like to explore after this program", "Notice: you are now an established yoga practitioner"] },
      { day: 21, title: "Week 3 Checkpoint", focus: "Assessment", duration: "25 min", videoId: "9kOCY0KNByw", instructions: ["Attempt Day 1 poses and feel the difference", "Compare your forward fold, your warrior I, your sun salutation", "Honour how far you have come — 3 weeks of daily practice is significant", "One more week to go. What do you want to focus on?"] },
      { day: 22, title: "Week 4: Full Vinyasa Practice", focus: "Mastery", duration: "35 min", videoId: "9kOCY0KNByw", instructions: ["You are no longer a complete beginner. You have a real practice now.", "Lead yourself through a full flow: warm-up → sun sals → standing → seated → savasana", "Challenge yourself to hold poses longer and explore deeper variations", "Trust your body — it knows more than you think after 22 days"] },
      { day: 23, title: "Forward Fold Mastery", focus: "Hamstrings & Hips", duration: "25 min", videoId: "L_xrDAtykMI", instructions: ["Standing forward fold: can you touch the floor now? Compare to Week 1.", "Prasarita (wide-legged) forward fold: hands, then head to floor", "Seated forward fold: use a strap or towel — the goal is length, not depth", "Patience: hamstring flexibility takes weeks to months. You're on track."] },
      { day: 24, title: "Backbend Deepening", focus: "Heart Opening", duration: "28 min", videoId: "v7AYKMP6rOE", instructions: ["Wheel pose (full backbend): the goal of Week 4", "Bridge pose: 5 breaths × 3 sets. Then try lifting one leg.", "If comfortable: place hands under shoulders and push into wheel. 3 attempts.", "Counter-pose with seated forward fold or supine twist"] },
      { day: 25, title: "Meditation: 15 Minutes", focus: "Advanced Meditation", duration: "25 min", videoId: "ZToicYcHIOU", instructions: ["Today you'll meditate for 15 minutes — the longest so far", "Use any technique that resonates: breath awareness, body scan, mantra", "When distracted, note 'thinking' and return to the object of meditation", "After: 10 minutes of restorative yoga as reward"] },
      { day: 26, title: "Your Favourite Poses", focus: "Self-Guided", duration: "30 min", videoId: "9kOCY0KNByw", instructions: ["Choose your 5 favourite poses from the entire program", "Create your own mini sequence around them", "Spend extra time in what feels good and challenges you", "This is the beginning of developing your personal practice"] },
      { day: 27, title: "Preparing for Graduation", focus: "Pre-Celebration", duration: "20 min", videoId: "4C-gxOE0j7s", instructions: ["Gentle practice today to prepare for tomorrow's graduation class", "Rest well tonight — good sleep, good nutrition", "Reflect on 27 days of showing up for yourself", "Think about what comes after Day 28 — commit to continuing"] },
      { day: 28, title: "Graduation: Beginner to Practitioner", focus: "Completion", duration: "45 min", videoId: "9kOCY0KNByw", instructions: ["You have completed a 28-day yoga program. You are a yoga practitioner.", "Flow freely through everything you've learned", "Take a moment in savasana to thank yourself for showing up every day", "Write a commitment statement: 'I will continue my yoga practice by ___'"] },
    ],
  },
];

function ProgramModal({ program, onClose }: { program: Program; onClose: () => void }) {
  const [selectedDay, setSelectedDay] = useState<DaySession | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [playing, setPlaying] = useState(false);

  const weeks = Math.ceil(program.sessions.length / 7);
  const weekSessions = program.sessions.slice(activeWeek * 7, activeWeek * 7 + 7);

  if (selectedDay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end" }}
        onClick={() => { setSelectedDay(null); setPlaying(false); }}
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
          {playing ? (
            <div style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedDay.videoId}?autoplay=1`}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              style={{
                aspectRatio: "16/9", cursor: "pointer", position: "relative",
                background: `url(https://img.youtube.com/vi/${selectedDay.videoId}/mqdefault.jpg) center/cover`,
                backgroundColor: "var(--muted)",
              }}
              onClick={() => setPlaying(true)}
            >
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Play size={22} fill={program.color} color={program.color} style={{ marginLeft: "3px" }} />
                </div>
              </div>
            </div>
          )}
          <div style={{ padding: "20px 20px 36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
              <div style={{
                display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px",
                fontWeight: "700", backgroundColor: program.color + "22", color: program.color, marginBottom: "8px",
              }}>DAY {selectedDay.day} · {selectedDay.focus.toUpperCase()}</div>
              <button onClick={() => { setSelectedDay(null); setPlaying(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
                <X size={20} />
              </button>
            </div>
            <h3 style={{ color: "var(--foreground)", margin: "0 0 4px", fontSize: "18px" }}>{selectedDay.title}</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "13px", marginBottom: "16px" }}>{selectedDay.duration}</p>

            <button onClick={() => setPlaying(true)} style={{
              width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              backgroundColor: program.color, color: "#fff",
              fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "20px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              fontFamily: "inherit",
            }}>
              <Play size={16} fill="white" /> Start Day {selectedDay.day}
            </button>

            <h4 style={{ color: "var(--foreground)", marginBottom: "12px", fontSize: "14px" }}>What to do</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedDay.instructions.map((inst, i) => (
                <div key={i} style={{
                  display: "flex", gap: "12px", alignItems: "flex-start",
                  padding: "12px", borderRadius: "12px", backgroundColor: "var(--card)",
                  border: "1.5px solid var(--border)",
                }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    backgroundColor: program.color + "22", border: `2px solid ${program.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", color: program.color,
                  }}>{i + 1}</div>
                  <p style={{ color: "var(--foreground)", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>{inst}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end" }}
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
        {/* Header */}
        <div style={{
          padding: "24px",
          background: `linear-gradient(135deg, ${program.color}, ${program.color}99)`,
          position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "16px", right: "16px",
            width: "32px", height: "32px", borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.3)", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} color="white" />
          </button>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>{program.emoji}</div>
          <h3 style={{ color: "#fff", margin: "0 0 6px", fontSize: "20px" }}>{program.title}</h3>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", margin: "0 0 14px", lineHeight: "1.5" }}>{program.description}</p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { icon: Calendar, val: `${program.totalDays} days` },
              { icon: Clock, val: `${program.sessions.length} sessions` },
              { icon: Star, val: `${program.rating} ★` },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.val} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Icon size={13} color="rgba(255,255,255,0.8)" />
                  <span style={{ color: "rgba(255,255,255,0.95)", fontSize: "13px" }}>{s.val}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "20px" }}>
          {/* Benefits */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "var(--foreground)", margin: "0 0 10px", fontSize: "14px" }}>What you'll gain</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {program.benefits.map(b => (
                <div key={b} style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "10px 12px", borderRadius: "10px",
                  backgroundColor: program.color + "11",
                  border: `1px solid ${program.color}33`,
                }}>
                  <Check size={13} color={program.color} strokeWidth={3} />
                  <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Week tabs */}
          {weeks > 1 && (
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px", overflowX: "auto" }}>
              {Array.from({ length: weeks }).map((_, i) => (
                <button key={i} onClick={() => setActiveWeek(i)} style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: "20px",
                  border: `1.5px solid ${activeWeek === i ? program.color : "var(--border)"}`,
                  backgroundColor: activeWeek === i ? program.color + "22" : "var(--card)",
                  color: activeWeek === i ? program.color : "var(--muted-foreground)",
                  cursor: "pointer", fontSize: "12px", fontFamily: "inherit",
                }}>Week {i + 1}</button>
              ))}
            </div>
          )}

          {/* Day sessions */}
          <h4 style={{ color: "var(--foreground)", margin: "0 0 12px", fontSize: "14px" }}>
            {weeks > 1 ? `Week ${activeWeek + 1} Sessions` : "Daily Sessions"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {weekSessions.map(session => (
              <button
                key={session.day}
                onClick={() => { setSelectedDay(session); setPlaying(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px", borderRadius: "14px",
                  backgroundColor: "var(--card)", border: "1.5px solid var(--border)",
                  cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                  backgroundColor: program.color + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column",
                }}>
                  <span style={{ fontSize: "10px", color: program.color, fontWeight: "700" }}>D{session.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--foreground)", marginBottom: "2px" }}>{session.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{session.focus} · {session.duration}</div>
                </div>
                <ChevronRight size={14} color="var(--muted-foreground)" />
              </button>
            ))}
          </div>

          {/* Start CTA */}
          <button
            onClick={() => setSelectedDay(program.sessions[activeWeek * 7])}
            style={{
              width: "100%", padding: "16px", borderRadius: "16px", border: "none",
              backgroundColor: program.color, color: "#fff",
              fontSize: "15px", fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              fontFamily: "inherit",
            }}
          >
            <Play size={16} fill="white" /> Start Day {activeWeek * 7 + 1}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  return (
    <div style={{ paddingBottom: "100px" }}>
      <div style={{ padding: "52px 24px 20px" }}>
        <h2 style={{ color: "var(--foreground)", marginBottom: "4px", fontFamily: "var(--font-display)" }}>Programs</h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "14px", marginBottom: "24px" }}>
          Structured journeys with day-by-day guidance
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {programs.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProgram(p)}
              style={{
                borderRadius: "20px", padding: "20px", cursor: "pointer",
                backgroundColor: "var(--card)", border: "1.5px solid var(--border)",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px", flexShrink: 0,
                  background: `linear-gradient(135deg, ${p.color}, ${p.color}77)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px",
                }}>{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <div style={{ fontWeight: "700", color: "var(--foreground)", fontSize: "15px" }}>{p.title}</div>
                    <ChevronRight size={16} color="var(--muted-foreground)" style={{ flexShrink: 0 }} />
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "0 0 12px", lineHeight: "1.5" }}>
                    {p.description.slice(0, 90)}...
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "11px", padding: "3px 9px", borderRadius: "20px",
                      backgroundColor: p.color + "22", color: p.color, fontWeight: "600",
                    }}>{p.totalDays} days</span>
                    <span style={{
                      fontSize: "11px", padding: "3px 9px", borderRadius: "20px",
                      backgroundColor: "var(--muted)", color: "var(--muted-foreground)",
                    }}>{p.level}</span>
                    <span style={{
                      fontSize: "11px", padding: "3px 9px", borderRadius: "20px",
                      backgroundColor: "var(--muted)", color: "var(--muted-foreground)",
                    }}>★ {p.rating} · {(p.enrolled / 1000).toFixed(0)}k enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProgram && (
          <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
