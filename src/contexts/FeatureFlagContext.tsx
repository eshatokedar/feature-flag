import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { featureFlagAPI, type FeatureFlag as APIFeatureFlag } from '../services/featureFlagAPI';

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

interface FeatureFlagContextType {
  flags: FeatureFlag[];
  loading: boolean;
  error: string | null;
  toggleFlag: (id: string) => Promise<void>;
  setFlags: (flags: FeatureFlag[]) => void;
  getFeatureValue: (name: string) => boolean;
  resetToDefaults: () => Promise<void>;
  refetchFlags: () => Promise<void>;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Convert API format to internal format
const convertAPIFlagToInternal = (apiFlag: APIFeatureFlag): FeatureFlag => ({
  id: apiFlag.name, // Use name as ID for consistency
  name: apiFlag.name,
  enabled: apiFlag.enabled,
  description: apiFlag.description
});

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch flags from API
  const fetchFlags = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiFlags = await featureFlagAPI.getAllFlags();
      const internalFlags = apiFlags.map(convertAPIFlagToInternal);
      setFlags(internalFlags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flags');
      console.error('Failed to fetch flags:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFlags();
  }, []);

  const toggleFlag = async (name: string) => {
    try {
      const flag = flags.find(f => f.name === name);
      if (!flag) return;

      // Find the API flag to get the correct ID
      const apiFlags = await featureFlagAPI.getAllFlags();
      const apiFlag = apiFlags.find(f => f.name === name);
      if (!apiFlag) return;

      await featureFlagAPI.toggleFlag(apiFlag.id, !flag.enabled);
      
      // Update local state immediately for better UX
      setFlags(prevFlags => 
        prevFlags.map(f => 
          f.name === name ? { ...f, enabled: !f.enabled } : f
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle flag');
      console.error('Failed to toggle flag:', err);
    }
  };

  const getFeatureValue = (name: string): boolean => {
    const flag = flags.find(f => f.name === name);
    return flag ? flag.enabled : false;
  };

  const resetToDefaults = async () => {
    try {
      setLoading(true);
      await featureFlagAPI.initializeDefaultFlags();
      await fetchFlags(); // Refetch to get updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset to defaults');
      console.error('Failed to reset to defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetchFlags = async () => {
    await fetchFlags();
  };

  return (
    <FeatureFlagContext.Provider value={{ 
      flags, 
      loading,
      error,
      toggleFlag, 
      setFlags, 
      getFeatureValue, 
      resetToDefaults,
      refetchFlags
    }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
}
