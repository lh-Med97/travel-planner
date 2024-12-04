import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/trips/[id] - Get a specific trip
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        destinations: true
      }
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/trips/[id] - Update a trip
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, startDate, endDate, destinations } = data;

    // First, verify the trip belongs to the user
    const existingTrip = await prisma.trip.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Update trip and its destinations
    const updatedTrip = await prisma.trip.update({
      where: {
        id: params.id
      },
      data: {
        title,
        startDate,
        endDate,
        destinations: {
          deleteMany: {}, // Remove existing destinations
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

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id] - Delete a trip
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the trip belongs to the user
    const trip = await prisma.trip.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Delete the trip and all associated destinations
    await prisma.trip.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
