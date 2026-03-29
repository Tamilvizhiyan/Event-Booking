import React, { useState, useMemo } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Music', 'Tech', 'Networking', 'Arts', 'Education', 'Business', 'Sports'];

const Events = () => {
  const { events, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
       const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             event.location.toLowerCase().includes(searchTerm.toLowerCase());
       const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
       return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-medium animate-pulse">Fetching latest events...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Hero Headings */}
      <section className="text-center space-y-4 py-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Sparkles size={14} />
          <span>Discover Your Next Experience</span>
        </motion.div>
        
        <motion.h1 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-4xl md:text-6xl font-black text-white px-4 leading-[1.1]"
        >
          Unforgettable <span className="text-gradient">Events</span> <br className="hidden md:block" />
          Awaiting Your Presence
        </motion.h1>
         <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="text-slate-400 max-w-2xl mx-auto text-lg px-4"
         >
           Browse and book the most exclusive events, conferences, and workshops 
           across the globe. Seamlessly managed, instantly accessible.
         </motion.p>
      </section>

      {/* Filters & Search */}
      <section className="glass p-6 rounded-3xl border border-white/5 sticky top-20 z-40 backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, location, or organization..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 items-center w-full lg:w-auto">
             <div className="hidden lg:flex items-center space-x-2 mr-2 text-slate-400">
               <SlidersHorizontal size={18} />
               <span className="text-sm font-medium">Filter:</span>
             </div>
             {CATEGORIES.map(category => (
               <button
                 key={category}
                 onClick={() => setSelectedCategory(category)}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap active:scale-95 ${
                   selectedCategory === category 
                   ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                   : 'bg-slate-800/30 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                 }`}
               >
                 {category}
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-12 px-2">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl border border-dashed border-white/10 max-w-lg mx-auto">
            <div className="bg-slate-800/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <Search size={40} className="text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No matching events</h3>
            <p className="text-slate-400 px-8">We couldn't find any events matching your criteria. Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="mt-6 text-blue-400 font-bold hover:underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
