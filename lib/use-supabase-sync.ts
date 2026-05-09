import { useCallback, useEffect, useState } from 'react';
import {
  saveDayResponses,
  getDayResponses,
  getAllDayResponses,
  saveDiagnosis,
  getLatestDiagnosis,
  saveChatMessages,
  getChatMessages,
} from './supabase-client';

/**
 * Hook para sincronizar respuestas con Supabase
 * Guarda en localStorage por defecto, sincroniza con Supabase si está disponible
 */
export function useSupabaseSync(userId?: string) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  /**
   * Sincronizar respuestas de un día
   */
  const syncDayResponses = useCallback(
    async (day: number, responses: Record<string, any>) => {
      try {
        setSyncing(true);
        setSyncError(null);

        // Guardar en Supabase
        const result = await saveDayResponses(day, responses, userId);

        if (!result) {
          console.warn('Could not sync to Supabase, using localStorage');
        }

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Sync error';
        setSyncError(message);
        console.error('Error syncing day responses:', error);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [userId]
  );

  /**
   * Cargar respuestas de un día desde Supabase
   */
  const loadDayResponses = useCallback(
    async (day: number) => {
      try {
        setSyncing(true);
        setSyncError(null);

        const result = await getDayResponses(day, userId);
        return result?.responses || null;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Load error';
        setSyncError(message);
        console.error('Error loading day responses:', error);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [userId]
  );

  /**
   * Cargar todas las respuestas desde Supabase
   */
  const loadAllResponses = useCallback(async () => {
    try {
      setSyncing(true);
      setSyncError(null);

      const result = await getAllDayResponses(userId);
      const responses: Record<number, Record<string, any>> = {};

      Object.entries(result).forEach(([day, session]) => {
        responses[parseInt(day)] = session.responses;
      });

      return responses;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Load error';
      setSyncError(message);
      console.error('Error loading all responses:', error);
      return {};
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  /**
   * Sincronizar diagnóstico
   */
  const syncDiagnosis = useCallback(
    async (diagnosis: {
      pattern: string;
      contradiction: string;
      decision: string;
      cost: string;
      alignment_score: number;
      friction_index: number;
    }) => {
      try {
        setSyncing(true);
        setSyncError(null);

        const result = await saveDiagnosis(
          {
            ...diagnosis,
            day: 7,
          },
          userId
        );

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Sync error';
        setSyncError(message);
        console.error('Error syncing diagnosis:', error);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [userId]
  );

  /**
   * Cargar diagnóstico más reciente
   */
  const loadLatestDiagnosis = useCallback(async () => {
    try {
      setSyncing(true);
      setSyncError(null);

      const result = await getLatestDiagnosis(userId);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Load error';
      setSyncError(message);
      console.error('Error loading latest diagnosis:', error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  /**
   * Sincronizar mensajes de chat
   */
  const syncChatMessages = useCallback(
    async (
      sessionId: string,
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
    ) => {
      try {
        setSyncing(true);
        setSyncError(null);

        const result = await saveChatMessages(sessionId, messages, userId);
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Sync error';
        setSyncError(message);
        console.error('Error syncing chat messages:', error);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [userId]
  );

  /**
   * Cargar mensajes de chat
   */
  const loadChatMessages = useCallback(
    async (sessionId: string) => {
      try {
        setSyncing(true);
        setSyncError(null);

        const result = await getChatMessages(sessionId, userId);
        return result?.messages || [];
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Load error';
        setSyncError(message);
        console.error('Error loading chat messages:', error);
        return [];
      } finally {
        setSyncing(false);
      }
    },
    [userId]
  );

  return {
    syncing,
    syncError,
    syncDayResponses,
    loadDayResponses,
    loadAllResponses,
    syncDiagnosis,
    loadLatestDiagnosis,
    syncChatMessages,
    loadChatMessages,
  };
}
