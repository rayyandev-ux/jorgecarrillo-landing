import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronRight } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { SCRIPT } from './data/script';
import type { Message, UserData, Option } from './types';

// CONFIGURATION
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'https://your-n8n-webhook-url.com/webhook/path';
const TYPING_DELAY_MS = 1300;
const MESSAGE_DELAY_MS = 900;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentStep = SCRIPT[currentStepIndex];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showInput]);

  // Effect to handle bot messages for the current step
  useEffect(() => {
    if (completed) return;

    let isMounted = true;
    const step = SCRIPT[currentStepIndex];
    
    const processMessages = async () => {
      setShowInput(false);
      
      for (let i = 0; i < step.messages.length; i++) {
        if (!isMounted) return;
        
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, TYPING_DELAY_MS)); // Simulate reading/typing
        
        if (!isMounted) return;
        setIsTyping(false);
        
        const newMessage: Message = {
          id: `${step.id}-${i}-${Date.now()}`,
          type: 'bot',
          content: step.messages[i],
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, newMessage]);
        await new Promise(resolve => setTimeout(resolve, MESSAGE_DELAY_MS)); // Pause between bubbles
      }

      if (!isMounted) return;
      setShowInput(true);
      setIsProcessing(false);
      isProcessingRef.current = false;
    };

    processMessages();

    return () => { isMounted = false; };
  }, [currentStepIndex, completed]);

  const handleOptionSelect = (option: Option) => {
    if (!showInput || isProcessing || isProcessingRef.current) return;
    setIsProcessing(true);
    isProcessingRef.current = true;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: option.label,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // Save data
    if (currentStep.field) {
      const newData = { ...userData, [currentStep.field]: option.value };
      setUserData(newData);
      
      // If it's the last step or specific logic, we might submit here
      // But usually we submit at the end.
    }

    nextStep();
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !showInput || isProcessing || isProcessingRef.current) return;

    // Phone validation
    if (currentStep.type === 'tel') {
       const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
       // Simple regex: allows +1234567890, (123) 456-7890, 123-456-7890, etc.
       // Adjust length as needed, typically > 7 digits
       const cleanNumber = inputText.replace(/\D/g, '');
       
       if (cleanNumber.length < 7 || !phoneRegex.test(inputText.replace(/\s/g, ''))) {
          // Invalid phone
          const errorMsg: Message = {
             id: `error-${Date.now()}`,
             type: 'bot',
             content: "Eso no parece un número de teléfono válido. Por favor, intenta de nuevo (ej: 999123456).",
             timestamp: Date.now()
          };
          setMessages(prev => [...prev, errorMsg]);
          return;
       }
    }

    setIsProcessing(true);
    isProcessingRef.current = true;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // Save data
    if (currentStep.field) {
      const newData = { ...userData, [currentStep.field]: inputText };
      setUserData(newData);
      
      // Check if this was the last input before end
      if (currentStepIndex === SCRIPT.length - 2) { // Assuming last step is 'end' type
         submitData(newData);
      }
    }

    setInputText('');
    nextStep();
  };

  const nextStep = () => {
    setShowInput(false);
    if (currentStepIndex < SCRIPT.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const submitData = async (data: UserData) => {
    // Transform data to format: { response: [{ ask: "Question text", answer: "User Answer" }, ...] }
    const responseArray: { ask: string; answer: string }[] = [];
    
    SCRIPT.forEach((step) => {
      if (step.field && data[step.field]) {
        let answer = data[step.field];
        
        // For options, find the full label
        if (step.options) {
          const selectedOption = step.options.find(opt => opt.value === answer);
          if (selectedOption) {
            answer = selectedOption.label;
          }
        }

        // Get the question text (taking the last message of the step usually contains the question)
        const question = step.messages[step.messages.length - 1];

        responseArray.push({ 
          ask: question, 
          answer: answer 
        });
      }
    });

    const payload = { response: responseArray };

    console.log("Submitting data to n8n:", payload);
    
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('your-n8n-webhook')) {
      console.warn("Webhook URL not configured. Data:", payload);
      return;
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 flex flex-col items-center justify-center font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900/100"></div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 w-full max-w-2xl h-full flex flex-col bg-transparent md:bg-slate-950/30 md:backdrop-blur-md md:border-x md:border-white/10 shadow-2xl">
        
        {/* Header Removed */}

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 pt-20 md:pt-24 scroll-smooth no-scrollbar"
        >
          <div className="flex flex-col space-y-2 min-h-full pb-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            
            <AnimatePresence>
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>

            {/* Inline Options */}
            <AnimatePresence mode="wait">
              {showInput && currentStep.type === 'options' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="grid grid-cols-1 gap-2 mt-2"
                >
                  {currentStep.options?.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(opt)}
                      className="w-full p-4 text-sm md:text-base bg-gradient-to-r from-slate-800 to-slate-700 hover:from-amber-600 hover:to-amber-500 active:from-amber-600 active:to-amber-500 border border-slate-600 hover:border-amber-400 active:border-amber-400 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-amber-500/20 active:shadow-amber-500/20 text-left flex items-center justify-between group transform hover:-translate-y-0.5 active:-translate-y-0.5"
                    >
                      <span className="font-medium">{opt.label}</span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-slate-900/90 backdrop-blur-lg transition-all duration-300 ease-in-out pb-[env(safe-area-inset-bottom)]">
          <AnimatePresence mode="wait">
            {/* Options moved inline, removed from here */}

            {showInput && (currentStep.type === 'text' || currentStep.type === 'email' || currentStep.type === 'tel') && (
              <motion.form
                className="p-4 border-t border-white/10 flex items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onSubmit={handleTextSubmit}
              >
                <input
                  type={currentStep.type}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={currentStep.inputPlaceholder || "Escribe aquí..."}
                  autoFocus
                  className="flex-1 bg-slate-800 border border-slate-700 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </motion.form>
            )}
            
            {currentStep.type === 'end' && (
               <div className="text-center text-gray-400 text-sm py-2">
                  Chat finalizado.
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
