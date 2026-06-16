/**
 * src/lib/userInit.ts
 *
 * Manages database user initialization and user profile synchronizations.
 */

import { sql } from './db';
import type { UserProfile } from '../app/components/onboarding';

/**
 * Initializes the user record in Neon database.
 * If user exists, returns their UserProfile data.
 * If not, inserts a minimal record and default notification settings.
 */
export async function initializeUser(userId: string): Promise<UserProfile | null> {
  try {
    const rows = await sql`
      SELECT * FROM users WHERE id = ${Number(userId)}
    `;

    if (rows && rows.length > 0) {
      const row = rows[0];
      console.info('[userInit] Loaded existing database profile for user ID:', userId);

      return {
        name: row.name || 'User',
        age: row.age !== null ? String(row.age) : '25',
        gender: row.gender || '',
        height: row.height !== null ? String(row.height) : '',
        weight: row.weight !== null ? String(row.weight) : '',
        experience: row.experience || '',
        goals: row.goals || [],
        practices: row.practices || [],
        skillLevel: row.skill_level || '',
        restrictions: row.restrictions || [],
        dailyTime: row.daily_time || '',
        practiceTime: row.practice_time || '',
        equipment: row.equipment || [],
        weeklyCommitment: row.weekly_commitment || '',
        motivations: row.motivations || [],
        bmi: row.bmi !== null ? Number(row.bmi) : 0,
        bmiCategory: row.bmi_category || '',
      };
    } else {
      console.info('[userInit] Brand new user. Creating basic record for user ID:', userId);

      // Create minimal user profile row
      await sql`
        INSERT INTO users (id, name, age, updated_at)
        VALUES (${Number(userId)}, 'New User', 25, NOW())
        ON CONFLICT (id) DO NOTHING
      `;

      const defaultSettings = [
        { id: "yoga", label: "Yoga Session", description: "Remind me to practice yoga", emoji: "🧘", enabled: true, time: "07:00" },
        { id: "meditation", label: "Meditation", description: "Daily mindfulness reminder", emoji: "🧠", enabled: true, time: "08:00" },
        { id: "breathwork", label: "Breathwork", description: "Breathing exercise reminder", emoji: "🌬️", enabled: false, time: "09:00" },
        { id: "water", label: "Hydration", description: "Drink water reminders throughout day", emoji: "💧", enabled: true, time: "10:00" },
        { id: "sleep", label: "Wind-Down", description: "Evening relaxation reminder", emoji: "🌙", enabled: false, time: "21:30" },
        { id: "progress", label: "Log Session", description: "Remind to log today's practice", emoji: "📊", enabled: false, time: "20:00" }
      ];

      // Create default notification settings row
      await sql`
        INSERT INTO notification_settings (user_id, master_notif, settings)
        VALUES (${Number(userId)}, TRUE, ${JSON.stringify(defaultSettings)})
        ON CONFLICT (user_id) DO NOTHING
      `;

      return null;
    }
  } catch (err) {
    console.error('[userInit] Error loading/initializing user profile:', err);
    return null;
  }
}

/**
 * Saves or updates a user profile to the Neon database.
 */
export async function saveUserProfile(userId: string, p: UserProfile): Promise<void> {
  try {
    await sql`
      INSERT INTO users (
        id, name, age, gender, height, weight, experience, goals, practices,
        skill_level, restrictions, daily_time, practice_time, equipment,
        weekly_commitment, motivations, bmi, bmi_category, updated_at
      ) VALUES (
        ${Number(userId)},
        ${p.name},
        ${parseInt(p.age) || null},
        ${p.gender},
        ${parseFloat(p.height) || null},
        ${parseFloat(p.weight) || null},
        ${p.experience},
        ${p.goals},
        ${p.practices},
        ${p.skillLevel},
        ${p.restrictions},
        ${p.dailyTime},
        ${p.practiceTime},
        ${p.equipment},
        ${p.weeklyCommitment},
        ${p.motivations},
        ${p.bmi || null},
        ${p.bmiCategory},
        NOW()
      ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        age = EXCLUDED.age,
        gender = EXCLUDED.gender,
        height = EXCLUDED.height,
        weight = EXCLUDED.weight,
        experience = EXCLUDED.experience,
        goals = EXCLUDED.goals,
        practices = EXCLUDED.practices,
        skill_level = EXCLUDED.skill_level,
        restrictions = EXCLUDED.restrictions,
        daily_time = EXCLUDED.daily_time,
        practice_time = EXCLUDED.practice_time,
        equipment = EXCLUDED.equipment,
        weekly_commitment = EXCLUDED.weekly_commitment,
        motivations = EXCLUDED.motivations,
        bmi = EXCLUDED.bmi,
        bmi_category = EXCLUDED.bmi_category,
        updated_at = NOW()
    `;
    console.info('[userInit] Saved user profile to database for ID:', userId);
  } catch (err) {
    console.error('[userInit] Error saving user profile to database:', err);
  }
}
export default saveUserProfile;
