import { Request, Response } from 'express';
import prisma from '../config/database';

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { title, startDate, endDate, destinationIds } = req.body;
    const userId = req.user?.id;

    const trip = await prisma.trip.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        destinations: {
          connect: destinationIds.map((id: string) => ({ id }))
        }
      },
      include: {
        destinations: true
      }
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Error creating trip' });
  }
};

export const getUserTrips = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { status } = req.query;

    const where: any = { userId };
    if (status) {
      where.status = String(status);
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        destinations: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    res.json(trips);
  } catch (error) {
    console.error('Error getting trips:', error);
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

export const getTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const trip = await prisma.trip.findFirst({
      where: {
        id,
        userId
      },
      include: {
        destinations: {
          include: {
            reviews: {
              include: {
                user: {
                  select: {
                    name: true,
                    image: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Error getting trip:', error);
    res.status(500).json({ message: 'Error fetching trip' });
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, status, destinationIds } = req.body;
    const userId = req.user?.id;

    const trip = await prisma.trip.update({
      where: {
        id,
        userId
      },
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        destinations: {
          set: destinationIds.map((id: string) => ({ id }))
        }
      },
      include: {
        destinations: true
      }
    });

    res.json(trip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ message: 'Error updating trip' });
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await prisma.trip.delete({
      where: {
        id,
        userId
      }
    });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Error deleting trip' });
  }
};
