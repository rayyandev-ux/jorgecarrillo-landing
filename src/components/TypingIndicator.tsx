import { motion } from 'framer-motion';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex w-full mb-4 justify-start"
    >
      <div className="flex max-w-[80%] flex-row">
        <div className="flex-shrink-0 mr-3 mt-auto">
           <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 bg-gray-800">
             <img 
                src="/profile.jpg" 
                onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=faces"}
                alt="Coach" 
                className="w-full h-full object-cover"
              />
           </div>
        </div>
        <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl rounded-bl-none flex items-center space-x-1.5">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
