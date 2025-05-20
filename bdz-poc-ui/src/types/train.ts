export type TrainType = 'fast' | 'passenger' | 'express';

export type TrainFeature = 'restaurant' | 'ac' | 'wifi' | 'accessible';

export interface TrainStop {
  station: string;
  time: string;
  platform?: string;
}

export interface Train {
  id: string;
  number: string;
  type: TrainType;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  price: number;
  transfers: number;
  delay: number; // in minutes
  features: TrainFeature[];
  stops: TrainStop[];
}

export interface TrainSearchParams {
  from: string;
  to: string;
  date: string;
  timeRange: 'morning' | 'afternoon' | 'evening' | 'night' | 'all';
}

export interface TrainFilter {
  trainType: TrainType | 'all';
  directOnly: boolean;
  sortBy: 'departure' | 'duration' | 'price';
}

export interface TrainSearchState {
  searchParams: TrainSearchParams | null;
  trains: Train[];
  selectedTrain: Train | null;
  loading: boolean;
  error: string | null;
} 