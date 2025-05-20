import { Train } from '../types/train';

export const mockTrains: Train[] = [
  {
    id: '1',
    number: '7601',
    type: 'fast',
    departureTime: '2024-03-20T06:30:00',
    arrivalTime: '2024-03-20T08:45:00',
    duration: 135,
    price: 25.50,
    transfers: 0,
    delay: 0,
    features: ['restaurant', 'ac', 'wifi'],
    stops: [
      { station: 'София', time: '06:30' },
      { station: 'Пловдив', time: '08:45' }
    ]
  },
  {
    id: '2',
    number: '7603',
    type: 'fast',
    departureTime: '2024-03-20T07:15:00',
    arrivalTime: '2024-03-20T09:30:00',
    duration: 135,
    price: 25.50,
    transfers: 0,
    delay: 15,
    features: ['restaurant', 'ac', 'wifi', 'accessible'],
    stops: [
      { station: 'София', time: '07:15' },
      { station: 'Пловдив', time: '09:30' }
    ]
  },
  {
    id: '3',
    number: '7605',
    type: 'express',
    departureTime: '2024-03-20T08:00:00',
    arrivalTime: '2024-03-20T10:00:00',
    duration: 120,
    price: 30.00,
    transfers: 0,
    delay: 0,
    features: ['restaurant', 'ac', 'wifi', 'accessible'],
    stops: [
      { station: 'София', time: '08:00' },
      { station: 'Пловдив', time: '10:00' }
    ]
  },
  {
    id: '4',
    number: '7607',
    type: 'passenger',
    departureTime: '2024-03-20T09:30:00',
    arrivalTime: '2024-03-20T12:45:00',
    duration: 195,
    price: 18.00,
    transfers: 1,
    delay: 0,
    features: ['ac'],
    stops: [
      { station: 'София', time: '09:30' },
      { station: 'Ихтиман', time: '10:15' },
      { station: 'Пловдив', time: '12:45' }
    ]
  },
  {
    id: '5',
    number: '7609',
    type: 'passenger',
    departureTime: '2024-03-20T11:00:00',
    arrivalTime: '2024-03-20T14:15:00',
    duration: 195,
    price: 18.00,
    transfers: 0,
    delay: 0,
    features: ['ac', 'accessible'],
    stops: [
      { station: 'София', time: '11:00' },
      { station: 'Пловдив', time: '14:15' }
    ]
  },
  {
    id: '6',
    number: '7611',
    type: 'fast',
    departureTime: '2024-03-20T13:30:00',
    arrivalTime: '2024-03-20T15:45:00',
    duration: 135,
    price: 25.50,
    transfers: 0,
    delay: 0,
    features: ['restaurant', 'ac', 'wifi'],
    stops: [
      { station: 'София', time: '13:30' },
      { station: 'Пловдив', time: '15:45' }
    ]
  },
  {
    id: '7',
    number: '7613',
    type: 'express',
    departureTime: '2024-03-20T15:00:00',
    arrivalTime: '2024-03-20T17:00:00',
    duration: 120,
    price: 30.00,
    transfers: 0,
    delay: 0,
    features: ['restaurant', 'ac', 'wifi', 'accessible'],
    stops: [
      { station: 'София', time: '15:00' },
      { station: 'Пловдив', time: '17:00' }
    ]
  },
  {
    id: '8',
    number: '7615',
    type: 'passenger',
    departureTime: '2024-03-20T16:30:00',
    arrivalTime: '2024-03-20T19:45:00',
    duration: 195,
    price: 18.00,
    transfers: 1,
    delay: 0,
    features: ['ac'],
    stops: [
      { station: 'София', time: '16:30' },
      { station: 'Ихтиман', time: '17:15' },
      { station: 'Пловдив', time: '19:45' }
    ]
  },
  {
    id: '9',
    number: '7617',
    type: 'fast',
    departureTime: '2024-03-20T18:00:00',
    arrivalTime: '2024-03-20T20:15:00',
    duration: 135,
    price: 25.50,
    transfers: 0,
    delay: 0,
    features: ['restaurant', 'ac', 'wifi', 'accessible'],
    stops: [
      { station: 'София', time: '18:00' },
      { station: 'Пловдив', time: '20:15' }
    ]
  },
  {
    id: '10',
    number: '7619',
    type: 'express',
    departureTime: '2024-03-20T19:30:00',
    arrivalTime: '2024-03-20T21:30:00',
    duration: 120,
    price: 30.00,
    transfers: 0,
    delay: 0,
    features: ['restaurant', 'ac', 'wifi'],
    stops: [
      { station: 'София', time: '19:30' },
      { station: 'Пловдив', time: '21:30' }
    ]
  }
]; 