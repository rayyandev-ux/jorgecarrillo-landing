import { motion } from 'framer-motion';
import type { Message } from '../types';
import clsx from 'clsx';

interface ChatBubbleProps {
  message: Message;
  isLast?: boolean;
}

export const ChatBubble = ({ message, isLast }: ChatBubbleProps) => {
  const isBot = message.type === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "flex w-full mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div className={clsx(
        "flex max-w-[85%] md:max-w-[70%]",
        isBot ? "flex-row" : "flex-row-reverse"
      )}>
        {isBot && (
          <div className="flex-shrink-0 mr-3 mt-auto">
             {/* Avatar only for bot */}
             <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 shadow-sm bg-gray-800">
                <img 
                  src="/profile.jpg" 
                  onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&crop=faces"}
                  alt="Coach" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        )}

        <div className={clsx(
          "p-3.5 rounded-2xl text-sm md:text-base leading-relaxed shadow-md whitespace-pre-wrap break-words",
          isBot 
            ? "bg-slate-800/90 text-gray-100 rounded-bl-none border border-slate-700" 
            : "bg-blue-600 text-white rounded-br-none"
        )}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};
