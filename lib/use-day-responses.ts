import { useState, useCallback } from 'react';

interface UserResponses {
  mainQuestion?: string;
  exploration?: string[];
  audit?: string;
  closure?: string[];
}

/**
 * Hook para gestionar respuestas de los 7 días
 * Almacena en localStorage para persistencia entre sesiones
 */
export function useDayResponses() {
  const [responses, setResponses] = useState<Record<number, UserResponses>>(() => {
    // Cargar respuestas del localStorage al inicializar
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('arc_day_responses');
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  /**
   * Guarda respuestas de un día específico
   */
  const saveDayResponses = useCallback((day: number, dayResponses: UserResponses) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [day]: dayResponses,
      };
      // Persistir en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('arc_day_responses', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  /**
   * Obtiene respuestas de un día específico
   */
  const getDayResponses = useCallback((day: number): UserResponses | undefined => {
    return responses[day];
  }, [responses]);

  /**
   * Obtiene todas las respuestas
   */
  const getAllResponses = useCallback((): Record<number, UserResponses> => {
    return responses;
  }, [responses]);

  /**
   * Limpia todas las respuestas
   */
  const clearResponses = useCallback(() => {
    setResponses({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arc_day_responses');
    }
  }, []);

  return {
    responses,
    saveDayResponses,
    getDayResponses,
    getAllResponses,
    clearResponses,
  };
}
