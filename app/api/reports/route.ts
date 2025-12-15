
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const { title, description, location, image_url } = await req.json();

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      title,
      description,
      location,
      image_url,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return new NextResponse('Failed to create report', { status: 500 });
  }

  return NextResponse.json(report);
}

export async function GET() {
  const { userId } = await auth();
  
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return new NextResponse('Failed to fetch reports', { status: 500 });
  }

  return NextResponse.json(reports);
}
