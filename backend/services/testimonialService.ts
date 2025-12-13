
import type { Testimonial } from '../../backend/types/testimonial';

// In a real application, this data would come from a database.
const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "CIRS has transformed how we manage community issues. The platform is intuitive and the real-time reporting is a game-changer for us.",
    name: "Jane Doe",
    role: "Community Manager",
    avatar: "/avatars/avatar-1.jpg",
    rating: 5,
    category: "Efficiency",
  },
  {
    id: 2,
    quote: "A must-have tool for any modern community. It bridges the gap between residents and management seamlessly.",
    name: "John Smith",
    role: "Resident",
    avatar: "/avatars/avatar-2.jpg",
    rating: 5,
    category: "Communication",
  },
  {
    id: 3,
    quote: "The mobile app is incredibly convenient. I can report a problem with a photo in under a minute. The response time has improved drastically.",
    name: "Emily White",
    role: "Homeowner",
    avatar: "/avatars/avatar-3.jpg",
    rating: 5,
    category: "Usability",
  },
];

/**
 * Retrieves all testimonials.
 */
export const getTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate a network delay, as if fetching from a database
  await new Promise(resolve => setTimeout(resolve, 100));
  return testimonials;
};
