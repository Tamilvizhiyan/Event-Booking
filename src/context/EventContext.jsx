import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all active events in real-time
  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      where('status', '==', 'active'),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
      }));
      setEvents(eventList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createEvent = async (eventData) => {
    return await addDoc(collection(db, 'events'), {
      ...eventData,
      status: 'active',
      availableSeats: eventData.totalSeats,
      createdAt: serverTimestamp()
    });
  };

  const updateEvent = async (eventId, updatedData) => {
    const eventDoc = doc(db, 'events', eventId);
    return await updateDoc(eventDoc, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteEvent = async (eventId) => {
    const eventDoc = doc(db, 'events', eventId);
    return await updateDoc(eventDoc, { status: 'deleted' });
  };

  const getEventById = async (eventId) => {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() };
    }
    return null;
  };

  const value = {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
