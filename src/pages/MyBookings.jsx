import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { Ticket, Calendar, MapPin, QrCode, Download, CreditCard, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
        eventDate: doc.data().eventDate?.toDate ? doc.data().eventDate.toDate() : new Date()
      }));
      setBookings(bookingList);
      setLoading(false);
    }, (error) => {
      console.error("Booking fetch error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-bounce">Retrieving your passes...</p>
     </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
         <div>
            <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
               <Sparkles size={14} />
               <span>Confirmed Bookings</span>
            </motion.div>
            <h1 className="text-4xl font-black text-white">Your <span className="text-gradient">Experiences</span></h1>
            <p className="text-slate-400 mt-2">View your tickets, download passes, and manage your upcoming events.</p>
         </div>
         <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Tickets</p>
                <p className="text-xl font-black text-white">{bookings.length}</p>
             </div>
             <div className="h-10 w-px bg-white/10 mx-2 hidden sm:block"></div>
             <button className="p-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5">
                <Filter size={20} />
             </button>
         </div>
      </section>

      <section className="space-y-6">
        {bookings.length > 0 ? (
          bookings.map((booking, idx) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass relative group rounded-3xl border border-white/5 overflow-hidden hover:border-blue-500/20 transition-all flex flex-col md:flex-row shadow-xl hover:shadow-blue-600/5"
            >
              {/* Event Accent - Gradient Border Left */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

              {/* Data Content */}
              <div className="flex-1 p-8 space-y-6">
                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                       <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                          Order #{booking.id.slice(0, 8)}
                       </span>
                       <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors pt-1">
                          {booking.eventTitle}
                       </h3>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pass Quantity</p>
                       <p className="text-2xl font-black text-white leading-none">0{booking.seatsBooked}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-white/5">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 shadow-inner">
                          <Calendar size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Event Date</p>
                          <p className="text-sm font-bold text-slate-200">{format(booking.eventDate, 'EEEE, MMMM d, yyyy')}</p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 shadow-inner">
                          <MapPin size={20} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Venue</p>
                          <p className="text-sm font-bold text-slate-200 line-clamp-1">{booking.eventLocation}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-emerald-400">
                       <CreditCard size={14} />
                       <span className="text-xs font-black uppercase tracking-widest">{booking.paymentStatus}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="inline-flex items-center space-x-2 text-sm font-black text-blue-400 hover:text-white hover:bg-blue-600/10 px-4 py-2 rounded-xl transition-all group/btn"
                    >
                       <span>View Digital Pass</span>
                       <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>

              {/* QR Sidebar (Desktop only visual preview) */}
              <div className="hidden md:flex w-52 bg-slate-900/40 border-l border-white/5 items-center justify-center p-8 backdrop-blur-xl relative">
                  <div className="absolute top-4 right-4 text-slate-700">
                     <QrCode size={20} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    <QRCodeSVG 
                      value={booking.qrCodeData} 
                      size={100} 
                      level="H" 
                      imageSettings={{ excavate: true }}
                    />
                  </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 glass rounded-[40px] border border-dashed border-white/10">
             <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner text-slate-500">
                <Ticket size={48} />
             </div>
             <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No adventures found yet!</h3>
             <p className="text-slate-400 px-8 max-w-sm mx-auto mb-8 font-medium">
                You haven't booked any events yet. Discover amazing experiences curated just for you.
             </p>
             <Link 
               to="/events" 
               className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95 uppercase tracking-widest text-xs"
             >
                <span>Browse All Events</span>
             </Link>
          </div>
        )}
      </section>

      {/* QR Ticket Modal */}
      <AnimatePresence>
         {selectedBooking && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   onClick={() => setSelectedBooking(null)}
                   className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
                />
                
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                   className="relative w-full max-w-sm"
                >
                   {/* Ticket Outer Wrapper */}
                   <div className="bg-white rounded-[40px] overflow-hidden shadow-3xl text-slate-900">
                      {/* Ticket Header */}
                      <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white relative">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -z-10 rounded-full translate-x-10 -translate-y-10"></div>
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/10 rounded-full">Entry Pass</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-black">EV</div>
                         </div>
                         <h4 className="text-2xl font-black leading-tight mb-4">{selectedBooking.eventTitle}</h4>
                         <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center"><Calendar size={12} className="mr-1.5" /> {format(selectedBooking.eventDate, 'MMM d, yyyy')}</span>
                            <span className="flex items-center"><MapPin size={12} className="mr-1.5" /> SEC B</span>
                         </div>
                      </div>

                      {/* Ticket Dotted Separator */}
                      <div className="relative h-6 bg-white overflow-hidden">
                         <div className="absolute top-1/2 left-0 right-0 border-t-4 border-dotted border-slate-200 -translate-y-1/2"></div>
                         <div className="absolute left-0 top-0 w-6 h-6 bg-slate-950 -translate-x-1/2 rounded-full"></div>
                         <div className="absolute right-0 top-0 w-6 h-6 bg-slate-950 translate-x-1/2 rounded-full"></div>
                      </div>

                      {/* Ticket Body (QR Code) */}
                      <div className="p-10 space-y-8 flex flex-col items-center">
                         <div className="p-5 border-2 border-slate-100 rounded-[32px] shadow-sm transform hover:scale-105 transition-transform duration-500">
                            <QRCodeSVG 
                               value={selectedBooking.qrCodeData} 
                               size={200} 
                               level="H" 
                               fgColor="#0f172a"
                            />
                         </div>
                         <div className="text-center space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pass Holder</p>
                            <p className="text-xl font-black">{selectedBooking.userName}</p>
                            <p className="text-sm font-bold text-indigo-600 italic">Confirmed • {selectedBooking.seatsBooked} Seat(s)</p>
                         </div>
                      </div>

                      {/* Ticket Footer */}
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                         <button className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 font-black uppercase tracking-widest text-[10px] transition-colors">
                            <Download size={14} />
                            <span>Download PDF Receipt</span>
                         </button>
                      </div>
                   </div>

                   {/* Close Button UI */}
                   <button 
                      onClick={() => setSelectedBooking(null)}
                      className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/20"
                   >
                      <Ticket size={24} className="rotate-45" />
                   </button>
                </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
