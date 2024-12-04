export interface Destination {
  id?: string;
  name: string;
  description?: string;
  date: Date;
  tripId?: string;
}

export interface Trip {
  id?: string;
  title: string;
  startDate: Date;
  endDate: Date;
  userId?: string;
  destinations: Destination[];
}

export interface TripFormData {
  title: string;
  startDate: string;
  endDate: string;
  destinations: {
    name: string;
    description?: string;
    date: string;
  }[];
}
