import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { Plus, Edit, Trash2, Eye, TrendingUp, Users, DollarSign, CalendarCheck, Database } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AddEventModal from '../components/admin/AddEventModal';
import { format } from 'date-fns';
import { seedDatabase } from '../utils/seed';

const AdminDashboard = () => {
  const { events, deleteEvent, loading } = useEvents();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    const result = await seedDatabase();
    setIsSeeding(false);
    if (result.success) {
      toast.success(`Successfully added ${result.count} sample events!`);
    } else {
      toast.error('Failed to seed database.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const stats = [
    { label: 'Total Events', value: events.length, icon: CalendarCheck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Bookings', value: '1,284', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Registered Users', value: '520', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Total Revenue', value: '₹45,200', icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tight">Admin <span className="text-gradient">Control Panel</span></h1>
           <p className="text-slate-400 mt-1">Manage events, track bookings, and analyze performance.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
           <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="glass p-6 rounded-2xl border border-white/5 flex items-center space-x-4"
           >
             <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon size={24} />
             </div>
             <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h4 className="text-2xl font-black text-white tracking-tight">{stat.value}</h4>
             </div>
           </motion.div>
        ))}
      </div>

      {/* Events Table */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
               <span>Manage Events</span>
               <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">{events.length}</span>
            </h2>
         </div>
         
         <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-white/5">
                   <th className="px-6 py-4">Event Details</th>
                   <th className="px-6 py-4">Categories</th>
                   <th className="px-6 py-4">Pricing</th>
                   <th className="px-6 py-4">Capacity</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {events.map((event) => (
                   <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                     <td className="px-6 py-4">
                       <div className="flex items-center space-x-4">
                          <img 
                            src={event.posterURL || 'https://via.placeholder.com/150'} 
                            alt="" 
                            className="w-12 h-12 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{event.title}</div>
                            <div className="text-xs text-slate-500">{format(new Date(event.date), 'MMM d, yyyy')} • {event.time}</div>
                          </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-bold">{event.category}</span>
                     </td>
                     <td className="px-6 py-4">
                       <div className="font-bold text-slate-200">₹{event.price}</div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col space-y-1">
                          <div className="text-xs text-slate-400 flex justify-between">
                             <span>{event.availableSeats} / {event.totalSeats} left</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-blue-500 transition-all duration-1000" 
                               style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                             ></div>
                          </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end space-x-2">
                         <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                           <Eye size={18} />
                         </button>
                         <button 
                           onClick={() => { setSelectedEvent(event); setIsAddModalOpen(true); }}
                           className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
                         >
                           <Edit size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(event.id)}
                           className="p-2 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition-colors"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           {events.length === 0 && (
             <div className="text-center py-20 bg-slate-900/50">
                <div className="text-slate-500 mb-2 font-medium">No events created yet.</div>
                <div className="flex flex-col items-center space-y-4">
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-blue-400 font-bold hover:underline"
                  >
                    Create your first event
                  </button>
                  <p className="text-xs text-slate-600">OR</p>
                  <button 
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="flex items-center space-x-2 px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    <Database size={14} />
                    <span>{isSeeding ? 'Seeding...' : 'Populate with Sample Data'}</span>
                  </button>
                </div>
             </div>
           )}
         </div>
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setSelectedEvent(null); }} 
        initialData={selectedEvent}
      />
    </div>
  );
};

export default AdminDashboard;
