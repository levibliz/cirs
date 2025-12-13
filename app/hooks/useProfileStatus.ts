import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

export default function useProfileStatus() {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        if (!isSignedIn || !user) {
          setIsLoading(false);
          return;
        }

        // Check if user has filled in required profile fields
        const hasProfile = user.firstName && user.lastName && user.primaryEmailAddress;
        setIsProfileComplete(!!hasProfile);
      } catch (error) {
        console.error('Error checking profile status:', error);
        setIsProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [isSignedIn, user]);

  return { isProfileComplete, isLoading };
}