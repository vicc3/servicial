// 2. HOOKS PERSONALIZADOS PARA REUTILIZACIÓN
// src/hooks/useFirestore.ts
import { useState, useEffect } from 'react';
import { firebaseService, FirebaseResponse } from '../config/firebase';

export function useDocument<T>(collection: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      setLoading(true);
      const result = await firebaseService.getDocument<T>(collection, docId);
      
      if (result.success) {
        setData(result.data || null);
        setError(null);
      } else {
        setError(result.error || 'Error desconocido');
        setData(null);
      }
      setLoading(false);
    };

    fetchDocument();
  }, [collection, docId]);

  const refetch = () => {
    if (docId) {
      firebaseService.getDocument<T>(collection, docId, false).then(result => {
        if (result.success) {
          setData(result.data || null);
          setError(null);
        }
      });
    }
  };

  return { data, loading, error, refetch };
}