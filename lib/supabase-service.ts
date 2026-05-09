import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Tipos de datos para Supabase
 */
export interface ArcSession {
  id: string;
  user_id?: string;
  day: number;
  responses: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ArcScoring {
  id: string;
  user_id?: string;
  day: number;
  canal_dominante?: string;
  nivel_conciencia?: number;
  nivel_dolor?: string;
  nivel_apertura?: string;
  cta_readiness?: string;
  friccion_area?: string;
  patrones?: Record<string, any>;
  created_at: string;
}

export interface ArcDiagnostics {
  id: string;
  user_id?: string;
  day: number;
  diagnostico: string;
  contradiccion: string;
  decision_detectada: string;
  pattern?: string;
  contradiction?: string;
  decision?: string;
  cost?: string;
  alignment_score?: number;
  friction_index?: number;
  created_at: string;
}

/**
 * Guardar respuestas de un día en arc_sessions
 */
export async function saveDayResponses(
  day: number,
  responses: Record<string, any>,
  userId?: string
): Promise<ArcSession | null> {
  try {
    const { data, error } = await supabase
      .from('arc_sessions')
      .upsert(
        {
          day,
          user_id: userId,
          responses,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'day,user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving day responses:', error);
    return null;
  }
}

/**
 * Obtener respuestas de un día
 */
export async function getDayResponses(
  day: number,
  userId?: string
): Promise<ArcSession | null> {
  try {
    const query = supabase
      .from('arc_sessions')
      .select('*')
      .eq('day', day);

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error getting day responses:', error);
    return null;
  }
}

/**
 * Obtener todas las respuestas de los 7 días
 */
export async function getAllDayResponses(
  userId?: string
): Promise<Record<number, ArcSession>> {
  try {
    const query = supabase
      .from('arc_sessions')
      .select('*')
      .order('day', { ascending: true });

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const result: Record<number, ArcSession> = {};
    data?.forEach((session) => {
      result[session.day] = session;
    });

    return result;
  } catch (error) {
    console.error('Error getting all day responses:', error);
    return {};
  }
}

/**
 * Guardar scoring de un día en arc_scoring
 */
export async function saveDayScoring(
  day: number,
  scoring: Omit<ArcScoring, 'id' | 'created_at'>,
  userId?: string
): Promise<ArcScoring | null> {
  try {
    const { data, error } = await supabase
      .from('arc_scoring')
      .upsert(
        {
          ...scoring,
          day,
          user_id: userId,
        },
        { onConflict: 'day,user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving day scoring:', error);
    return null;
  }
}

/**
 * Guardar diagnóstico en arc_diagnostics
 */
export async function saveDiagnosis(
  diagnosis: {
    pattern: string;
    contradiction: string;
    decision: string;
    cost: string;
    alignment_score: number;
    friction_index: number;
  },
  userId?: string
): Promise<ArcDiagnostics | null> {
  try {
    const { data, error } = await supabase
      .from('arc_diagnostics')
      .insert({
        day: 7,
        user_id: userId,
        diagnostico: diagnosis.pattern,
        contradiccion: diagnosis.contradiction,
        decision_detectada: diagnosis.decision,
        pattern: diagnosis.pattern,
        contradiction: diagnosis.contradiction,
        decision: diagnosis.decision,
        cost: diagnosis.cost,
        alignment_score: diagnosis.alignment_score,
        friction_index: diagnosis.friction_index,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving diagnosis:', error);
    return null;
  }
}

/**
 * Obtener diagnóstico más reciente
 */
export async function getLatestDiagnosis(
  userId?: string
): Promise<ArcDiagnostics | null> {
  try {
    const query = supabase
      .from('arc_diagnostics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error getting latest diagnosis:', error);
    return null;
  }
}
