import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/trips - Get all trips for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        destinations: true
      }
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, startDate, endDate, destinations } = data;

    const trip = await prisma.trip.create({
      data: {
        title,
        startDate,
        endDate,
        userId: session.user.id,
        destinations: {
          create: destinations.map((dest: any) => ({
            name: dest.name,
            description: dest.description,
            date: dest.date
          }))
        }
      },
      include: {
        destinations: true
      }
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
