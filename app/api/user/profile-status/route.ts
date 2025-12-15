
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Query Supabase for user data
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      // User doesn't exist in Supabase yet
      return NextResponse.json({ isProfileComplete: false });
    }

    // Check if profile is complete based on your users table
    const isProfileComplete = Boolean(
      user.first_name &&
      user.last_name &&
      user.email
    );

    return NextResponse.json({ isProfileComplete });
  } catch (error) {
    console.error('[PROFILE_STATUS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
