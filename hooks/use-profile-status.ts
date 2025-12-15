
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function useProfileStatus() {
  const { user, isLoaded } = useUser();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (!isLoaded) {
        setIsLoading(true);
        return;
      }

      if (!user) {
        setIsLoading(false);
        setIsProfileComplete(false);
        return;
      }

      try {
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          setIsProfileComplete(false);
          return;
        }

        const profile = await response.json();
        
        // Check if profile has required fields
        const hasRequiredFields = !!(
          profile.first_name &&
          profile.last_name &&
          profile.email
        );

        setIsProfileComplete(hasRequiredFields);
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkProfile();
  }, [user, isLoaded]);

  return { isProfileComplete, isLoading };
}
