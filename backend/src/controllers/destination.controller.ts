import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    const { search, category, priceRange, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }
    if (category && category !== 'All') {
      where.category = String(category);
    }
    if (priceRange && priceRange !== 'All') {
      where.priceRange = String(priceRange);
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: Number(limit),
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
      }),
      prisma.destination.count({ where })
    ]);

    res.json({
      destinations,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Error getting destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
};

export const getDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await prisma.destination.findUnique({
      where: { id },
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
    });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error('Error getting destination:', error);
    res.status(500).json({ message: 'Error fetching destination' });
  }
};

export const createDestination = async (req: Request, res: Response) => {
  try {
    const { name, description, location, category, priceRange, image } = req.body;

    const destination = await prisma.destination.create({
      data: {
        name,
        description,
        location,
        category,
        priceRange,
        image
      }
    });

    res.status(201).json(destination);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Error creating destination' });
  }
};

export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, location, category, priceRange, image } = req.body;

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name,
        description,
        location,
        category,
        priceRange,
        image
      }
    });

    res.json(destination);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ message: 'Error updating destination' });
  }
};

export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({
      where: { id }
    });

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ message: 'Error deleting destination' });
  }
};
