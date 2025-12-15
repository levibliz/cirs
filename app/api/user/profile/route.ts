
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return new NextResponse('User not found', { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const values = await req.json();
  const { first_name, last_name, role } = values;

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({ first_name, last_name, role })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return new NextResponse('Update failed', { status: 500 });
  }

  return NextResponse.json(updatedUser);
}
