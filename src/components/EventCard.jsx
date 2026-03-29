import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const isFull = event.availableSeats <= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all flex flex-col h-full shadow-lg hover:shadow-blue-500/10"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={event.posterURL || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60'} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-4 right-4 glass-light px-3 py-1 rounded-full text-xs font-bold text-slate-800 tracking-wider">
           ₹{event.price}
        </div>
        {isFull && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
            <span className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg uppercase tracking-widest text-sm shadow-xl animate-pulse">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{event.category}</span>
          <h3 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors line-clamp-1">{event.title}</h3>
        </div>

        <div className="space-y-3 text-sm text-slate-400 mb-6 flex-1">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-blue-500" />
            <span>
              {event.date?.toDate ? format(event.date.toDate(), 'EEE, MMM d, yyyy') : 
               event.date ? format(new Date(event.date), 'EEE, MMM d, yyyy') : 'Date TBA'}
              • {event.time}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-rose-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
             <Users size={16} className="text-emerald-500" />
             <span className={`${event.availableSeats < 10 ? 'text-rose-400 font-bold' : ''}`}>
               {event.availableSeats} seats remaining
             </span>
          </div>
        </div>

        <Link 
          to={`/events/${event.id}`}
          className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all border ${
            isFull 
            ? 'border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed' 
            : 'border-blue-500/20 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white shadow-blue-500/10 shadow-lg active:scale-95'
          }`}
        >
          <span>{isFull ? 'View Info' : 'Book Tickets'}</span>
          {!isFull && <ArrowRight size={16} />}
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
