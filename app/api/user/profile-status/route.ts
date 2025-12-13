
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      // This case might happen if the user record is not yet created in your DB.
      // Depending on your logic, you might create it here or handle it differently.
      return NextResponse.json({ isProfileComplete: false });
    }

    // Define what "complete" means. For example, all these fields must be non-null.
    const isProfileComplete = Boolean(
      user.firstName &&
      user.lastName &&
      user.address &&
      user.phoneNumber
    );

    return NextResponse.json({ isProfileComplete });
  } catch (error) {
    console.error('[PROFILE_STATUS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
