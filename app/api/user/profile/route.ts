
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Try to get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // If user doesn't exist, create them
    if (error?.code === 'PGRST116') {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return new NextResponse('User not found', { status: 404 });
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          role: 'user'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return new NextResponse('Failed to create user', { status: 500 });
      }

      return NextResponse.json(newUser);
    }

    if (error) {
      console.error('Error fetching user:', error);
      return new NextResponse('Database error', { status: 500 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { first_name, last_name, role } = body;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ 
        first_name, 
        last_name, 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return new NextResponse(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
