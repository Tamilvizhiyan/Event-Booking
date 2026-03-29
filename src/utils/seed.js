import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SAMPLE_EVENTS = [
  {
    title: "Global Tech Summit 2024",
    category: "Tech",
    date: new Date("2024-05-15T10:00:00"),
    time: "10:00 AM",
    location: "Sillicon Valley Convention Center, CA",
    description: "Join industry leaders for the biggest technology conference of the year. Topics include AI, Web3, and Quantum Computing.",
    price: 4999,
    totalSeats: 1000,
    availableSeats: 1000,
    posterURL: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=1200&auto=format&fit=crop",
    status: "active"
  },
  {
    title: "Vibes & Vinyl Night",
    category: "Music",
    date: new Date("2024-04-20T19:00:00"),
    time: "7:00 PM",
    location: "Blue Note Jazz Club, New York",
    description: "An intimate evening with local jazz legends and rare vinyl collections. Perfect for music enthusiasts and collectors.",
    price: 1500,
    totalSeats: 50,
    availableSeats: 12,
    posterURL: "https://images.unsplash.com/photo-1514525253361-bee8718a300c?q=80&w=1200&auto=format&fit=crop",
    status: "active"
  },
  {
    title: "Digital Art Workshop",
    category: "Arts",
    date: new Date("2024-06-05T14:00:00"),
    time: "2:00 PM",
    location: "Loom Fine Arts Studio, London",
    description: "Learn professional digital painting techniques from world-class artists. Hands-on experience with the latest creative software.",
    price: 2500,
    totalSeats: 30,
    availableSeats: 30,
    posterURL: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1200&auto=format&fit=crop",
    status: "active"
  },
  {
    title: "Founders Networking Mixer",
    category: "Networking",
    date: new Date("2024-04-12T18:30:00"),
    time: "6:30 PM",
    location: "Skyline Lounge, Dubai",
    description: "Connect with the founders of top startups and established entrepreneurs. Expand your network over cocktails and premium appetizers.",
    price: 3500,
    totalSeats: 100,
    availableSeats: 85,
    posterURL: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    status: "active"
  }
];

export const seedDatabase = async () => {
  try {
    const eventsRef = collection(db, 'events');
    const promises = SAMPLE_EVENTS.map(event => 
      addDoc(eventsRef, { ...event, createdAt: serverTimestamp() })
    );
    await Promise.all(promises);
    return { success: true, count: SAMPLE_EVENTS.length };
  } catch (error) {
    console.error("Seeding error:", error);
    return { success: false, error };
  }
};
