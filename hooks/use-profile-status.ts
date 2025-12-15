
import useSWR from 'swr';

// A simple fetcher function that can be used with SWR
// It fetches data from a URL and parses it as JSON.
const fetcher = (url: string) => fetch(url).then((res) => {
  // If the user is not found in our DB, the API returns a 404.
  // We can treat this as a valid state meaning "profile does not exist".
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
});

export function useProfileStatus() {
  // Use SWR to fetch the profile data from our API route.
  // SWR handles caching, revalidation, and more automatically.
  const { data, error, isLoading } = useSWR('/api/user/profile', fetcher);

  // Determine if the profile is complete.
  // It's incomplete if:
  // 1. The API returned null (user not in our DB).
  // 2. Any of the required fields (phone, address) are missing.
  const isProfileComplete = !!(data && data.phone && data.address);

  return {
    profile: data,
    isLoading,
    isError: error,
    isProfileComplete,
  };
}
