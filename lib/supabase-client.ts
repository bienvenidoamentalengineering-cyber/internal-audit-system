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

export interface ArcDiagnosis {
  id: string;
  user_id?: string;
  day: number;
  pattern: string;
  contradiction: string;
  decision: string;
  cost: string;
  alignment_score: number;
  friction_index: number;
  created_at: string;
}

export interface ArcChat {
  id: string;
  user_id?: string;
  session_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

/**
 * Guardar respuestas de un día
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
 * Guardar diagnóstico
 */
export async function saveDiagnosis(
  diagnosis: Omit<ArcDiagnosis, 'id' | 'created_at'>,
  userId?: string
): Promise<ArcDiagnosis | null> {
  try {
    const { data, error } = await supabase
      .from('arc_diagnostics')
      .insert({
        ...diagnosis,
        user_id: userId,
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
): Promise<ArcDiagnosis | null> {
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

/**
 * Guardar mensajes de chat
 */
export async function saveChatMessages(
  sessionId: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userId?: string
): Promise<ArcChat | null> {
  try {
    const messagesWithTimestamp = messages.map((msg) => ({
      ...msg,
      timestamp: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('arc_chat')
      .upsert(
        {
          session_id: sessionId,
          user_id: userId,
          messages: messagesWithTimestamp,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat messages:', error);
    return null;
  }
}

/**
 * Obtener mensajes de chat
 */
export async function getChatMessages(
  sessionId: string,
  userId?: string
): Promise<ArcChat | null> {
  try {
    const query = supabase
      .from('arc_chat')
      .select('*')
      .eq('session_id', sessionId);

    if (userId) {
      query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error getting chat messages:', error);
    return null;
  }
}
