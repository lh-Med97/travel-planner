
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { createTripSchema, tripQuerySchema } from '@/lib/validations/schema';
import { successResponse, errorResponse } from '@/lib/api-response';
import { ValidationError, NotFoundError } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    const validatedQuery = tripQuerySchema.parse(query);

    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        destinations: true
      },
      orderBy: validatedQuery.sortBy ? {
        [validatedQuery.sortBy]: validatedQuery.order || 'desc'
      } : undefined,
      take: validatedQuery.limit || 10,
      skip: validatedQuery.page ? (validatedQuery.page - 1) * (validatedQuery.limit || 10) : 0
    });

    return successResponse(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    if (error instanceof ValidationError) {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Internal Server Error', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const data = await request.json();
    const validatedData = createTripSchema.parse(data);

    const trip = await prisma.trip.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        destinations: {
          create: validatedData.destinations
        }
      },
      include: {
        destinations: true
      }
    });

    return successResponse(trip, 201);
  } catch (error) {
    console.error('Error creating trip:', error);
    if (error instanceof ValidationError) {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Internal Server Error', 500);
  }
}