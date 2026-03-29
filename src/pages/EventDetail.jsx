import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { Calendar, MapPin, Users, DollarSign, Clock, ShieldCheck, Ticket, ArrowLeft, Info, Heart, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { user, userData } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [numSeats, setNumSeats] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await getEventById(id);
      if (data) {
        setEvent(data);
      } else {
        toast.error('Event not found');
        navigate('/events');
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id, getEventById, navigate]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (numSeats > event.availableSeats) {
      toast.error('Not enough seats available');
      return;
    }

    setBookingLoading(true);
    try {
      // Use Firestore Transaction to ensure consistency
      const eventRef = doc(db, 'events', event.id);
      
      await runTransaction(db, async (transaction) => {
        const eDoc = await transaction.get(eventRef);
        if (!eDoc.exists()) throw "Event does not exist!";
        
        const available = eDoc.data().availableSeats;
        if (available < numSeats) throw "Sorry, seats just filled up!";

        // 1. Create Booking Record
        const bookingRef = doc(collection(db, 'bookings'));
        const totalAmount = numSeats * event.price;
        const bookingData = {
          id: bookingRef.id,
          userId: user.uid,
          eventId: event.id,
          userName: userData?.displayName || user.email,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          seatsBooked: numSeats,
          totalAmount: totalAmount,
          paymentStatus: 'Paid (Simulated)',
          status: 'Confirmed',
          qrCodeData: `EVENT-${event.id}-USER-${user.uid}-BOOK-${bookingRef.id}`,
          createdAt: serverTimestamp()
        };

        transaction.set(bookingRef, bookingData);

        // 2. Update Event Seats
        transaction.update(eventRef, {
          availableSeats: increment(-numSeats)
        });
      });

      toast.success('Tickets booked successfully! Check your email.', { duration: 5000 });
      navigate('/bookings');
    } catch (error) {
       console.error("Booking error:", error);
       toast.error(typeof error === 'string' ? error : 'Booking failed. Try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
       <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
       <p className="text-slate-400 font-medium">Loading event details...</p>
    </div>
  );

  const isSoldOut = event.availableSeats <= 0;
  const totalPrice = numSeats * event.price;

  return (
    <div className="max-w-6xl mx-auto pb-12">
       {/* Breadcrumb / Back */}
       <div className="mb-6">
          <Link to="/events" className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors font-medium">
            <ArrowLeft size={18} />
            <span>Back to all events</span>
          </Link>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
             {/* Hero Image */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl group"
             >
                <img 
                  src={event.posterURL || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=1200&auto=format&fit=crop&q=80'} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest mb-3 inline-block">
                    {event.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{event.title}</h1>
                </div>
             </motion.div>

             {/* Info & Description */}
             <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-b border-white/5">
                    <div className="space-y-1">
                       <p className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center"><Calendar size={14} className="mr-1.5" /> Date</p>
                       <p className="text-white font-bold">
                         {event.date?.toDate ? format(event.date.toDate(), 'MMM d, yyyy') : 
                          event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'Date TBA'}
                       </p>
                    </div>
                   <div className="space-y-1">
                      <p className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center"><Clock size={14} className="mr-1.5" /> Time</p>
                      <p className="text-white font-bold">{event.time}</p>
                   </div>
                   <div className="space-y-1 col-span-2">
                       <p className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center"><MapPin size={14} className="mr-1.5" /> Location</p>
                       <p className="text-white font-bold">{event.location}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-xl font-bold text-white flex items-center"><Info size={20} className="mr-2 text-blue-400" /> About the Event</h3>
                   <div className="text-slate-400 leading-relaxed space-y-4">
                      {event.description.split('\n').map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                   </div>
                </div>

                <div className="pt-4 flex items-center space-x-4 border-t border-white/5 text-slate-500">
                    <button className="flex items-center space-x-2 hover:text-rose-400 transition-colors">
                       <Heart size={18} />
                       <span className="text-sm font-medium">Save to favorites</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                       <Share2 size={18} />
                       <span className="text-sm font-medium">Share event</span>
                    </button>
                </div>
             </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass sticky top-24 p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col space-y-6 overflow-hidden"
             >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10 rounded-full translate-x-10 -translate-y-10"></div>

                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Price per person</p>
                      <h4 className="text-4xl font-black text-white">₹{event.price}</h4>
                   </div>
                   {!isSoldOut && (
                     <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                       In Stock
                     </div>
                   )}
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                      <div className="flex items-center space-x-3">
                         <Users size={20} className="text-blue-400" />
                         <div>
                            <p className="text-sm font-bold text-white">Seats Available</p>
                            <p className="text-xs text-slate-500">{event.availableSeats} spots remaining</p>
                         </div>
                      </div>
                   </div>

                   {!isSoldOut && (
                     <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                           <div className="flex items-center space-x-4 bg-slate-800 rounded-xl p-1 border border-white/5 shadow-inner">
                              <button 
                                onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
                                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-700 text-white font-bold transition-all disabled:opacity-50"
                                disabled={numSeats <= 1}
                              >-</button>
                              <span className="w-8 text-center font-black text-white">{numSeats}</span>
                              <button 
                                onClick={() => setNumSeats(Math.min(event.availableSeats, numSeats + 1))}
                                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-700 text-white font-bold transition-all disabled:opacity-50"
                                disabled={numSeats >= event.availableSeats || numSeats >= 5}
                              >+</button>
                           </div>
                        </div>
                        {numSeats >= 5 && <p className="text-[10px] text-amber-500 text-right">Limit 5 tickets per person</p>}

                        <div className="pt-4 border-t border-white/5 space-y-3">
                           <div className="flex justify-between text-slate-400">
                              <span>Subtotal</span>
                              <span>₹{totalPrice}</span>
                           </div>
                           <div className="flex justify-between text-slate-400 text-xs">
                              <span>Booking Fee</span>
                              <span className="text-emerald-400">FREE</span>
                           </div>
                           <div className="flex justify-between text-xl font-black text-white pt-2">
                              <span>Total</span>
                              <span className="text-blue-400">₹{totalPrice}</span>
                           </div>
                        </div>

                        <button
                          onClick={() => setShowConfirm(true)}
                          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <Ticket size={22} className="rotate-12" />
                          <span>Reserve Now</span>
                        </button>
                     </div>
                   )}

                   {isSoldOut && (
                      <div className="py-8 text-center bg-rose-600/10 border border-rose-600/20 rounded-2xl">
                         <Users size={32} className="mx-auto text-rose-500 mb-2" />
                         <p className="font-bold text-rose-500 uppercase tracking-widest text-sm">Event Full</p>
                         <p className="text-sm text-slate-400 mt-1">Join the waitlist for updates</p>
                      </div>
                   )}
                </div>

                <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-600/10 flex items-start space-x-3">
                   <ShieldCheck className="text-blue-400 mt-1 shrink-0" size={18} />
                   <div className="text-[11px] text-slate-400 leading-relaxed">
                      Secure checkout. Tickets are non-refundable but transferable. 
                      Standard event terms and conditions apply.
                   </div>
                </div>
             </motion.div>
          </div>
       </div>

       {/* Confirmation Modal */}
       <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowConfirm(false)}
                 className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
               ></motion.div>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative w-full max-w-md glass p-8 rounded-3xl border border-white/10 shadow-3xl text-center"
               >
                  <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 shadow-inner">
                     <DollarSign size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Complete Payment</h3>
                  <p className="text-slate-400 mb-8">
                     You are booking <span className="font-bold text-white">{numSeats}</span> tickets for <br />
                     <span className="font-bold text-blue-400">{event.title}</span>.
                  </p>
                  
                  <div className="bg-slate-800/50 p-6 rounded-2xl mb-8 space-y-2 border border-white/5">
                     <div className="flex justify-between text-slate-400 text-sm">
                        <span>Transaction Amount:</span>
                        <span className="text-white font-bold">₹{totalPrice}</span>
                     </div>
                     <div className="flex justify-between text-slate-400 text-sm">
                        <span>Status:</span>
                        <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Test Mode Active</span>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-4 text-slate-400 font-bold hover:bg-white/5 rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                      {bookingLoading ? 'Processing...' : 'Pay & Confirm'}
                    </button>
                  </div>
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default EventDetail;
