import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAsyncState<T> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  // Use ref to store the function to avoid creating new references
  const asyncFunctionRef = useRef(asyncFunction);

  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(async () => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const response = await asyncFunctionRef.current();
      setState({ status: 'success', data: response, error: null });
      return response;
    } catch (error) {
      setState({ status: 'error', data: null, error: error as Error });
      throw error;
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]); // Only depend on immediate, not execute

  return { ...state, execute };
};
