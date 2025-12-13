
import { getTestimonials } from '../../../backend/services/testimonialService';
import { NextResponse } from 'next/server';

/**
 * GET handler for the /api/testimonials endpoint.
 * Retrieves all testimonials.
 */
export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    // In a real app, you might want to log this error to a logging service
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
