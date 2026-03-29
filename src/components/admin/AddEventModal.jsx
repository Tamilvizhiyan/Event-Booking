import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, MapPin, Tag, Users, DollarSign, Clock, Layout } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Music', 'Tech', 'Networking', 'Arts', 'Education', 'Business', 'Sports'];

const AddEventModal = ({ isOpen, onClose, initialData }) => {
  const { createEvent, updateEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    date: '',
    time: '',
    location: '',
    description: '',
    price: 0,
    totalSeats: 100,
    posterURL: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date instanceof Date 
               ? initialData.date.toISOString().split('T')[0] 
               : initialData.date
      });
      setPreview(initialData.posterURL || '');
    } else {
      setFormData({
        title: '',
        category: 'Tech',
        date: '',
        time: '',
        location: '',
        description: '',
        price: 0,
        totalSeats: 100,
        posterURL: ''
      });
      setPreview('');
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async () => {
    if (!file) return formData.posterURL;
    const storageRef = ref(storage, `events/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const posterURL = await uploadImage();
      const eventPayload = {
        ...formData,
        posterURL,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        date: new Date(formData.date)
      };

      if (initialData) {
        await updateEvent(initialData.id, eventPayload);
        toast.success('Event updated successfully');
      } else {
        await createEvent(eventPayload);
        toast.success('Event created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Operation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        ></motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl glass max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="sticky top-0 z-10 p-6 glass border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">{initialData ? 'Edit' : 'Create'} <span className="text-gradient">Event</span></h2>
              <p className="text-sm text-slate-400">Specify details for your amazing event below.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload Area */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest">Event Poster</label>
                <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-2xl aspect-video overflow-hidden flex flex-col items-center justify-center bg-slate-800/20 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                  {preview ? (
                    <img src={preview} alt="Poster" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center space-y-3 p-8">
                       <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all">
                         <Upload size={32} />
                       </div>
                       <div className="text-center">
                         <p className="text-sm font-bold text-white">Drop or Click to Upload</p>
                         <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                       </div>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {preview && (
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                       <p className="text-white font-bold flex items-center"><Upload className="mr-2" /> Change Image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><Layout size={14} className="mr-2" /> Title</label>
                  <input
                    required
                    name="title"
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Grand Tech Summit 2024"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><Tag size={14} className="mr-2" /> Category</label>
                    <select
                      name="category"
                      className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><DollarSign size={14} className="mr-2" /> Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><Calendar size={14} className="mr-2" /> Date</label>
                  <input
                    type="date"
                    required
                    name="date"
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white color-scheme-dark"
                    value={formData.date}
                    onChange={handleChange}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><Clock size={14} className="mr-2" /> Time</label>
                  <input
                    type="time"
                    required
                    name="time"
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white"
                    value={formData.time}
                    onChange={handleChange}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><Users size={14} className="mr-2" /> Total Seats</label>
                  <input
                    type="number"
                    required
                    name="totalSeats"
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white"
                    value={formData.totalSeats}
                    onChange={handleChange}
                  />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center"><MapPin size={14} className="mr-2" /> Location</label>
              <input
                required
                name="location"
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="Ex. Marina Convention Centre, Las Vegas"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Description</label>
              <textarea
                required
                name="description"
                rows="4"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/20 outline-none leading-relaxed"
                placeholder="Share more details about the event experience..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4 pt-4">
               <button
                 type="button"
                 onClick={onClose}
                 className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-400 font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center space-x-2"
               >
                 <span>{loading ? 'Processing...' : (initialData ? 'Update Event' : 'Launch Event')}</span>
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEventModal;
