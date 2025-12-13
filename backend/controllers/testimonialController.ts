
import { NextResponse } from 'next/server';
import { getTestimonials } from '../../backend/services/testimonialService';

/**
 * Handles the GET request for testimonials.
 */
export const fetchTestimonials = async (): Promise<NextResponse> => {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
