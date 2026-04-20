"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IconArrowDown, IconArrowDownBar, IconArrowUp, IconArrowUpBar, IconMicrophoneOff, IconPlayerRecordFilled, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { FaMicrophone } from "react-icons/fa6";
import { AnimatePresence, motion } from 'framer-motion';

const InfoModal = ({ icon, title, description, showModal, setShowModal, centered = false, duration = 1200 }) => {

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [showModal, duration]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className={` ${centered ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'top-10 left-10'} flex flex-col items-center gap-3 column fixed z-30 bg-slate-600 opacity-25 text-white text-center p-10 rounded-xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <p>{icon}</p>
          <h2 className='text-2xl font-bold'>{title}</h2>
          <p>{description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const InstructionModal = ({ setShowModal }) => {
  return <AnimatePresence>
    <motion.div
      className={`top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed z-30 bg-gradient-to-b from-blue-50 to-white text-slate-800 p-8 rounded-2xl shadow-2xl max-w-2xl`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
    >
      {/* close button */}
      <button onClick={() => setShowModal(false)} className='absolute top-5 right-5 text-xl hover:bg-red-100 p-2 rounded'>
        <IconX size={24} />
      </button>
      
      <h3 className='text-center text-4xl font-bold mb-6 text-blue-600'>🎤 वॉइस कमांड्स</h3>
      
      <div className='space-y-4'>
        <div className='bg-blue-100 p-4 rounded-lg'>
          <h4 className='font-bold text-lg mb-2'>📍 नेविगेशन (पेज खोलना)</h4>
          <p className='text-base mb-1'>• "होम खोलो" - होम पेज पर जाना</p>
          <p className='text-base mb-1'>• "लॉगिन खोलो" - लॉगिन पेज पर जाना</p>
          <p className='text-base mb-1'>• "साइन अप खोलो" - खाता बनाना</p>
          <p className='text-base mb-1'>• "कार्ट खोलो" या "मेरी कार्ट" - शॉपिंग कार्ट देखना</p>
          <p className='text-base'>• "प्रोडक्ट्स" - सभी प्रोडक्ट्स देखना</p>
        </div>

        <div className='bg-green-100 p-4 rounded-lg'>
          <h4 className='font-bold text-lg mb-2'>⬆️ स्क्रॉलिंग</h4>
          <p className='text-base mb-1'>• "ऊपर स्क्रॉल करो" - पेज को ऊपर ले जाना</p>
          <p className='text-base mb-1'>• "नीचे स्क्रॉल करो" - पेज को नीचे ले जाना</p>
          <p className='text-base mb-1'>• "सबसे नीचे जाओ" - पेज के आखिर में जाना</p>
          <p className='text-base'>• "सबसे ऊपर जाओ" - पेज के शुरुआत में जाना</p>
        </div>

        <div className='bg-yellow-100 p-4 rounded-lg'>
          <h4 className='font-bold text-lg mb-2'>💡 सामान्य कमांड्स</h4>
          <p className='text-base mb-1'>• "नमस्ते" - सहायक को नमस्कार</p>
          <p className='text-base mb-1'>• "मदद दो" - सहायता पाना</p>
          <p className='text-base'>• "अलविदा" - सहायक को बंद करना</p>
        </div>

        <p className='text-sm text-gray-600 italic mt-4'>💬 Tip: धीरे-धीरे और स्पष्ट आवाज़ में बोलें</p>
      </div>
    </motion.div>
  </AnimatePresence>
}

const pageDetails = [
  {
    pageName: 'home',
    pagePath: '/'
  },
  {
    pageName: 'signup',
    pagePath: '/signup'
  },
  {
    pageName: 'login',
    pagePath: '/login'
  },
  {
    pageName: 'contact',
    pagePath: '/contact'
  },
  {
    pageName: 'about',
    pagePath: '/about'
  },
  {
    pageName: 'resetPassword',
    pagePath: '/resetPassword'
  },
  {
    pageName: 'productView',
    pagePath: '/productView'
  },
  {
    pageName: 'sellerdashboard',
    pagePath: '/seller/sellerdashboard'
  },
  {
    pageName: 'addProduct',
    pagePath: '/seller/addProduct'
  },
  {
    pageName: 'manageProduct',
    pagePath: '/seller/manageProduct'
  },
  {
    pageName: 'sellersignup',
    pagePath: '/seller/sellersignup'
  },
  {
    pageName: 'admindashboard',
    pagePath: '/admin/admindashboard'
  },
  {
    pageName: 'manageuser',
    pagePath: '/admin/manageuser'
  },
  {
    pageName: 'adminprofile',
    pagePath: '/admin/adminprofile'
  },
  {
    pageName: 'profile',
    pagePath: '/user/profile'
  },
  {
    pageName: 'MyCart',
    pagePath: '/user/mycart'
  },
  {
    pageName: 'checkout',
    pagePath: '/user/checkout'
  },
]

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  // Track if user requested to stop listening
  const stopListeningRef = useRef(false);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  // All browser-dependent hooks and logic must be inside this block
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return <VoiceProviderClient stopListeningRef={stopListeningRef}>{children}</VoiceProviderClient>;
};

// This component is only rendered on the client
const VoiceProviderClient = ({ children, stopListeningRef }) => {
  const [showModal, setShowModal] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    icon: <FaMicrophone size={50} />,
    title: '',
    description: '',
    centered: true,
    duration: 1200
  });
  const hasRun = useRef(false);
  const router = useRouter();
  const [voices, setVoices] = useState([]);
  const [speech, setSpeech] = useState(null);
  const voicesCacheRef = useRef(null); // Cache voices for faster lookups
  const lastProcessedCommandRef = useRef(null); // Track last processed command to prevent duplicates
  const commandTimeoutRef = useRef(null); // Track timeout for duplicate prevention

  // Initialize speech synthesis on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const utterance = new SpeechSynthesisUtterance();
        setSpeech(utterance);
        loadVoices();
        console.log('✅ Speech synthesis initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing speech synthesis:', error);
      }
    }
  }, []);

  const triggerModal = (title, description, centered = true, icon = <FaMicrophone size={50} />, duration = 1200) => {
    setModalOptions({
      icon,
      title,
      description,
      centered,
      duration
    });
    setShowModal(true);
  }

  const commands = [
    {
      command: ['place order', 'pay now'],
      callback: () => {
        voiceResponse('Placing your order');
        window.dispatchEvent(new CustomEvent('voicePlaceOrder'));
      }
    },
    // Cancel order (order tracking page)
    {
      command: ['cancel my order', 'cancel order'],
      callback: () => {
        voiceResponse('Attempting to cancel your order');
        window.dispatchEvent(new CustomEvent('voiceCancelOrder'));
      }
    },
    // Navigation: open any page
    {
      command: 'open :pageName page',
      callback: (pageName) => {
        voicePageNavigator(pageName);
      }
    },
    {
      command: 'I want to create an account',
      callback: () => {
        console.log('🎯 Command matched: Create account');
        voicePageNavigator('signup')
      }
    },
    {
      command: 'I want to login',
      callback: () => {
        console.log('🎯 Command matched: Want to login');
        voicePageNavigator('login')
      }
    },
    {
      command: 'I want to buy something',
      callback: () => {
        console.log('🎯 Command matched: Buy something');
        voicePageNavigator('productView')
      }
    },
    {
      command: 'I want to contact you',
      callback: () => {
        console.log('🎯 Command matched: Contact');
        voicePageNavigator('contact')
      }
    },
    {
      command: 'open manage product page',
      callback: () => {
        console.log('🎯 Command matched: Manage product');
        voicePageNavigator('manageProduct')
      }
    },
    {
      command: 'open login page',
      callback: () => {
        console.log('🎯 Command matched: Open login page');
        voicePageNavigator('login')
      }
    },
    {
      command: 'open cheak out page',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('cheakout')
      }
    },

    {
      command: 'open contact page',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('contact')
      }
    },
    {
      command: 'open reset password page',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('resetPassword')
      }
    },
    {
      command: 'open signup page',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('signup')
      }
    },
    {
      command: 'open admin dashboard',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('admindashboard')
      }
    },
    {
      command: 'open manage user',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('manageuser')
      }
    },
    {
      command: 'open admin profile',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('adminprofile')
      }
    },
    {
      command: 'open add product',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('addProduct')
      }
    },
    {
      command: 'open manage product',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('manageProduct')
      }
    },
    {
      command: 'open seller dashboard',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('sellerdashboard')
      }
    },
    {
      command: 'open seller sign up',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('sellersignup')
      }
    },
    {
      command: 'open user profile',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('profile')
      }
    },
    {
      command: 'open cart page',
      callback: (pageName) => {
        console.log('Opening page: ', pageName);
        voicePageNavigator('MyCart')
      }
    },
    {
      command: 'open cart',
      callback: () => {
        console.log('🎯 Command matched: Open cart');
        voicePageNavigator('MyCart')
      }
    },
    {
      command: 'open card',
      callback: () => {
        console.log('🎯 Command matched: Open cart (card variant)');
        voicePageNavigator('MyCart')
      }
    },
    {
      command: 'show me products',
      callback: (pageName) => {
        router.push('/productView');
        voiceResponse('Showing all products');
      }
    },
    {
      command: 'move page :direction',
      callback: (direction) => {
        console.log('Moving in direction: ', direction);
        if (direction === 'up') {
          window.scrollBy(0, -window.innerHeight);
        } else if (direction === 'down') {
          window.scrollBy(0, window.innerHeight);
        }
      }
    },
    {
      command: 'scroll :direction',
      callback: (direction) => {
        console.log('Scrolling in direction: ', direction);
        if (direction === 'up') {
          window.scrollBy(0, -window.innerHeight);
        } else if (direction === 'down') {
          window.scrollBy(0, window.innerHeight);
        }
      }
    }
  ]

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useSpeechRecognition({
    commands,
    continuous: true,
    clearTranscriptOnListen: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!browserSupportsSpeechRecognition) {
        console.warn('⚠️ Your browser does not support speech recognition! Please use Chrome or Edge.');
        triggerModal('Browser Not Supported', 'Please use Chrome or Edge browser for voice features', true, <IconMicrophoneOff size={50} />);
      } else {
        console.log('✅ Speech recognition is supported in this browser!');
      }
    }
  }, [browserSupportsSpeechRecognition]);

  // Debug: Log transcript changes
  useEffect(() => {
    if (transcript) {
      console.log('🎤 Transcript:', transcript);
    }
    if (finalTranscript) {
      console.log('✅ Final Transcript:', finalTranscript);
    }
  }, [transcript, finalTranscript]);

  const voicePageNavigator = (pageName) => {
    // Handle common speech recognition variations
    let normalizedName = pageName.toLowerCase();
    
    // Map variations to correct page names
    const variations = {
      'card': 'cart',
      'my cart': 'cart',
      'shopping cart': 'cart',
      'quit': 'checkout',
      'check out': 'checkout',
      'check-out': 'checkout',
      'sign up': 'signup',
      'register': 'signup',
      'reset pass': 'resetPassword',
      'password reset': 'resetPassword',
      'products': 'productView',
      'product': 'productView',
      'seller dash': 'sellerdashboard',
      'seller panel': 'sellerdashboard',
      'manage': 'manageProduct',
      'add item': 'addProduct',
      'admin dash': 'admindashboard',
      'admin panel': 'admindashboard',
    };

    // Apply variation mapping
    for (const [variation, target] of Object.entries(variations)) {
      if (normalizedName.includes(variation)) {
        normalizedName = target;
        break;
      }
    }

    console.log('🔍 Looking for page:', normalizedName);
    const page = pageDetails.find(page => normalizedName.includes(page.pageName.toLowerCase()));
    console.log('📄 Found page:', page);

    if (page) {
      console.log('✅ Navigating to:', page.pagePath);
      const message = `Navigating to ${pageName} page`;
      voiceResponse(message);
      triggerModal('Navigating...', message);
      // Faster navigation - immediate without delay
      router.push(page.pagePath);
    } else {
      console.log('❌ Page not found!');
      voiceResponse('Sorry, I could not find that page');
      triggerModal('Error', `Could not find ${pageName} page`, true, <IconX size={50} />);
    }
  }

  // Debug: Log listening status changes
  useEffect(() => {
    console.log('🎧 Listening status:', listening);
  }, [listening]);

  const fillInputUsingVoice = (cb) => {
    if (finalTranscript.toLowerCase().startsWith('enter')) {
      cb();
    }
  }

  const performActionUsingVoice = (triggerCommand, command, cb) => {
    if (finalTranscript.toLowerCase().startsWith(triggerCommand) && finalTranscript.toLowerCase().includes(command)) {
      cb();
    }
  }

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      // Start listening when component mounts
      setTimeout(() => {
        console.log('🎤 Auto-starting voice recognition on mount');
        SpeechRecognition.startListening({ continuous: true });
        try {
          voiceResponse('आपका स्वागत है BolBazar में', 'hi');
          triggerModal('🎤 वॉइस असिस्टेंट', 'मैं सुन रहा हूँ। कोई कमांड बोलें या "?" दबाएं मदद के लिए', true, <FaMicrophone size={50} />, 3000);
        } catch (error) {
          console.error('Error starting voice response:', error);
        }
      }, 500);
    }
  }, [browserSupportsSpeechRecognition])

  // Keyboard shortcut for help
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Show help on "?" or "H" key
      if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        setShowInstruction(true);
        voiceResponse('यहाँ वॉइस कमांड्स हैं', 'hi');
      }
      // Start listening on Space
      if (e.code === 'Space' && e.ctrlKey) {
        SpeechRecognition.startListening();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Function to clean noise words from transcript
  const cleanTranscript = (text) => {
    if (!text) return '';
    
    // List of noise words/phrases to remove
    const noisePatterns = [
      /sorry\s+i\s+did\s+not\s+understand/gi,
      /i\s+did\s+not\s+understand/gi,
      /sorry\s+i\s+don\'t\s+understand/gi,
      /i\s+don\'t\s+understand/gi,
      /sorry/gi,
      /uh\s+huh/gi,
      /hmm/gi,
      /um/gi,
      /uh/gi,
      /like\s+/gi,
      /you\s+know/gi,
      /i\s+mean/gi,
      /basically/gi,
      /actually/gi,
      /literally/gi,
    ];

    let cleaned = text.trim();
    
    // Remove each noise pattern
    for (const pattern of noisePatterns) {
      cleaned = cleaned.replace(pattern, ' ');
    }

    // Clean up multiple spaces and trim
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  };

  useEffect(() => {
    if (!finalTranscript) return;
    
    // Clean the transcript first
    const cleanedTranscript = cleanTranscript(finalTranscript);
    if (!cleanedTranscript) {
      resetTranscript();
      return; // If nothing remains after cleaning, skip
    }
    
    const lowerTranscript = cleanedTranscript.toLowerCase();
    console.log('🎯 Processing command:', lowerTranscript);

    // Prevent duplicate command processing within 1.5 second
    if (lastProcessedCommandRef.current === lowerTranscript) {
      console.log('⏭️ Skipping duplicate command processing');
      return;
    }

    // Mark this command as processed IMMEDIATELY
    lastProcessedCommandRef.current = lowerTranscript;
    resetTranscript(); // Reset immediately to prevent reprocessing
    
    // Clear any pending timeout
    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
    }
    
    // Reset the "last processed" command after 1.5 seconds to allow reprocessing if needed
    commandTimeoutRef.current = setTimeout(() => {
      lastProcessedCommandRef.current = null;
    }, 1500);

    // --- Hindi Commands ---
    // नमस्ते / हेलो
    if (lowerTranscript.includes('नमस्ते') || lowerTranscript.includes('नमस्कार')) {
      voiceResponse('नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?', 'hi');
      triggerModal('नमस्ते!', 'आपकी मदद के लिए तैयार हूँ', true, <FaMicrophone size={50} />, 1000);
      return;
    }

    // अलविदा / गुडबाय
    if (lowerTranscript.includes('अलविदा') || lowerTranscript.includes('बाय')) {
      voiceResponse('शुक्रिया! आपका दिन शुभ हो!', 'hi');
      SpeechRecognition.stopListening();
      triggerModal('अलविदा!', 'आपका दिन शुभ हो!', false, <IconMicrophoneOff size={50} />);
      return;
    }

    // लॉगिन (हिंदी)
    if (lowerTranscript.includes('लॉगिन') || lowerTranscript.includes('लॉगिन करना') || lowerTranscript.includes('साइन इन')) {
      voiceResponse('लॉगिन पेज पर जा रहे हैं', 'hi');
      triggerModal('लॉगिन', 'लॉगिन पेज पर जा रहे हैं');
      setTimeout(() => {
        router.push('/login');
      }, 500);
      return;
    }

    // साइन अप (हिंदी)
    if (lowerTranscript.includes('साइन अप') || lowerTranscript.includes('खाता बनाना') || lowerTranscript.includes('रजिस्टर')) {
      voiceResponse('साइन अप पेज पर जा रहे हैं', 'hi');
      triggerModal('साइन अप', 'खाता बनाने के लिए जा रहे हैं');
      setTimeout(() => {
        router.push('/signup');
      }, 500);
      return;
    }

    // होम (हिंदी)
    if (lowerTranscript.includes('होम') || lowerTranscript.includes('घर') || lowerTranscript.includes('मुख्य पृष्ठ')) {
      voiceResponse('होम पेज पर जा रहे हैं', 'hi');
      triggerModal('होम', 'होम पेज पर जा रहे हैं');
      setTimeout(() => {
        router.push('/');
      }, 500);
      return;
    }

    // शॉपिंग (हिंदी)
    if (lowerTranscript.includes('खरीदना') || lowerTranscript.includes('शॉपिंग') || lowerTranscript.includes('उत्पाद देखना')) {
      voiceResponse('उत्पाद पेज पर जा रहे हैं', 'hi');
      triggerModal('शॉपिंग', 'उत्पाद देखने के लिए जा रहे हैं');
      setTimeout(() => {
        router.push('/productView');
      }, 500);
      resetTranscript();
      return;
    }

    // कार्ट (हिंदी)
    if (lowerTranscript.includes('कार्ट') || lowerTranscript.includes('मेरी कार्ट')) {
      voiceResponse('कार्ट पेज पर जा रहे हैं', 'hi');
      triggerModal('कार्ट', 'कार्ट देखने जा रहे हैं');
      setTimeout(() => {
        router.push('/user/mycart');
      }, 500);
      resetTranscript();
      return;
    }

    // संपर्क (हिंदी)
    if (lowerTranscript.includes('संपर्क') || lowerTranscript.includes('हमसे संपर्क करें')) {
      voiceResponse('संपर्क पेज पर जा रहे हैं', 'hi');
      triggerModal('संपर्क', 'संपर्क पेज पर जा रहे हैं');
      setTimeout(() => {
        router.push('/contact');
      }, 500);
      resetTranscript();
      return;
    }

    // स्क्रॉल (हिंदी)
    if (lowerTranscript.includes('ऊपर स्क्रॉल')) {
      window.scrollBy(0, -window.innerHeight / 2);
      voiceResponse('ऊपर स्क्रॉल कर रहे हैं', 'hi');
      triggerModal('ऊपर जा रहे हैं', '', true, <IconArrowUp size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('नीचे स्क्रॉल')) {
      window.scrollBy(0, window.innerHeight / 2);
      voiceResponse('नीचे स्क्रॉल कर रहे हैं', 'hi');
      triggerModal('नीचे जा रहे हैं', '', true, <IconArrowDown size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('सबसे नीचे') || lowerTranscript.includes('अंत में')) {
      window.scrollTo(0, document.body.scrollHeight);
      voiceResponse('सबसे नीचे जा रहे हैं', 'hi');
      triggerModal('सबसे नीचे', '', true, <IconArrowDownBar size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('सबसे ऊपर') || lowerTranscript.includes('शुरुआत में')) {
      window.scrollTo(0, 0);
      voiceResponse('सबसे ऊपर जा रहे हैं', 'hi');
      triggerModal('सबसे ऊपर', '', true, <IconArrowUpBar size={50} />);
      resetTranscript();
      return;
    }

    // --- English Commands (existing) ---
    // Cancel Order (Hindi + English)
    if (
      lowerTranscript.includes('cancel order') || lowerTranscript.includes('order cancel') ||
      lowerTranscript.includes('ऑर्डर कैंसल') || lowerTranscript.includes('ऑर्डर रद्द') || lowerTranscript.includes('ऑर्डर हटाओ')
    ) {
      // Dispatch a custom event for order tracking page to handle
      window.dispatchEvent(new CustomEvent('voice-cancel-order'));
      const isHindi = lowerTranscript.includes('ऑर्डर') || lowerTranscript.includes('रद्द') || lowerTranscript.includes('हटाओ');
      voiceResponse(
        isHindi ? 'क्या आप यह ऑर्डर कैंसल करना चाहते हैं? हाँ या नहीं।' : 'Do you want to cancel this order? Please say yes or no.',
        isHindi ? 'hi' : 'en'
      );
      triggerModal(isHindi ? 'ऑर्डर कैंसल करें' : 'Cancel Order', isHindi ? 'पुष्टि के लिए "हाँ" बोलें' : 'Say "yes" to confirm or "no" to abort.');
      resetTranscript();
      return;
    }

    // Help / मदद (Hindi + English)
    if (
      lowerTranscript.includes('help') || lowerTranscript.includes('मदद') || 
      lowerTranscript.includes('सहायता') || lowerTranscript.includes('help me') ||
      lowerTranscript.includes('मदद दो') || lowerTranscript.includes('कमांड्स बताओ') ||
      lowerTranscript.includes('क्या करूँ') || lowerTranscript.includes('क्या कहूँ')
    ) {
      const isHindi = lowerTranscript.includes('मदद') || lowerTranscript.includes('सहायता') || 
                      lowerTranscript.includes('मदद दो') || lowerTranscript.includes('क्या');
      voiceResponse(
        isHindi ? 'वॉइस कमांड्स की सूची दिखा रहे हैं' : 'Here are the available voice commands for you.',
        isHindi ? 'hi' : 'en'
      );
      setShowInstruction(true);
      return;
    }

    // Feedback (Hindi + English)
    if (
      lowerTranscript.includes('feedback') || lowerTranscript.includes('suggestion') ||
      lowerTranscript.includes('फीडबैक') || lowerTranscript.includes('सुझाव')
    ) {
      const isHindi = lowerTranscript.includes('फीडबैक') || lowerTranscript.includes('सुझाव');
      voiceResponse(
        isHindi ? 'कृपया अपनी प्रतिक्रिया साझा करें।' : 'Please share your feedback with us.',
        isHindi ? 'hi' : 'en'
      );
      triggerModal(isHindi ? 'प्रतिक्रिया' : 'Feedback', isHindi ? 'आपकी प्रतिक्रिया महत्वपूर्ण है' : 'Your feedback matters to us.');
      return;
    }

    // If user says 'start listening' or similar, re-enable listening
    if (lowerTranscript.includes('start listening') || lowerTranscript.includes('listen now') || lowerTranscript.includes('सुनो')) {
      stopListeningRef.current = false;
      voiceResponse('I am listening now');
      SpeechRecognition.startListening({ continuous: true });
      triggerModal('Voice Assistant', 'I am listening');
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('stop listening')) {
      stopListeningRef.current = true;
      voiceResponse('Okay, I will stop listening now');
      SpeechRecognition.stopListening();
      triggerModal('Voice Assistant', 'Good Bye! Have a nice day!', false, <IconMicrophoneOff size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('hello box') || lowerTranscript.includes('hello')) {
      voiceResponse('Hello! How can I help you today?');
      triggerModal('Hello!', 'How can I help you?');
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('goodbye box') || lowerTranscript.includes('goodbye')) {
      voiceResponse('Goodbye! Have a nice day!');
      SpeechRecognition.stopListening();
      triggerModal('Voice Assistant', 'Good bye! have a nice Day', false, <IconMicrophoneOff size={50} />);
      resetTranscript();
      return;
    }

    // Scroll Commands
    if (lowerTranscript.includes('scroll up')) {
      window.scrollBy(0, -window.innerHeight / 2);
      voiceResponse('Scrolling up');
      triggerModal('Scrolling Up', '', true, <IconArrowUp size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('scroll down')) {
      window.scrollBy(0, window.innerHeight / 2);
      voiceResponse('Scrolling down');
      triggerModal('Scrolling Down', '', true, <IconArrowDown size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('move to bottom') || lowerTranscript.includes('go to bottom')) {
      window.scrollTo(0, document.body.scrollHeight);
      voiceResponse('Moving to bottom');
      triggerModal('Moving to Bottom', '', true, <IconArrowDownBar size={50} />);
      resetTranscript();
      return;
    }

    if (lowerTranscript.includes('move to top') || lowerTranscript.includes('go to top')) {
      window.scrollTo(0, 0);
      voiceResponse('Moving to top');
      triggerModal('Moving to Top', '', true, <IconArrowUpBar size={50} />);
      resetTranscript();
      return;
    }

    // Handle "navigating to X" pattern
    if (lowerTranscript.includes('navigating to')) {
      const pageName = lowerTranscript.replace('navigating to', '').replace('page', '').trim();
      if (pageName && pageName.length > 0) {
        console.log('🎯 Processing navigating to command:', pageName);
        voicePageNavigator(pageName);
        return;
      }
    }

    // Fallback: Handle "open X page" pattern manually
    if (lowerTranscript.includes('open') && lowerTranscript.includes('page')) {
      console.log('🎯 Processing open page command');
      voicePageNavigator(lowerTranscript.replace('open', '').replace('page', '').trim());
      return;
    }

    // Fallback: Handle simple "open X" pattern (without page keyword)
    if (lowerTranscript.startsWith('open ')) {
      const pageName = lowerTranscript.replace('open', '').trim();
      if (pageName && pageName.length > 1) {
        console.log('🎯 Processing open command:', pageName);
        voicePageNavigator(pageName);
        return;
      }
    }

    // Fallback: Handle simple navigation like "login", "signup", etc.
    const simpleCommands = ['login', 'signup', 'home', 'contact', 'cart', 'card', 'profile', 'checkout'];
    for (const cmd of simpleCommands) {
      if (lowerTranscript === cmd || lowerTranscript.includes(`go to ${cmd}`)) {
        console.log('🎯 Processing simple command:', cmd);
        // Map "card" to "cart"
        const mappedCmd = cmd === 'card' ? 'cart' : cmd;
        voicePageNavigator(mappedCmd);
        return;
      }
    }

    // If no command matched, only show error if transcript is substantial
    // (to avoid showing errors for background noise)
    if (cleanedTranscript && cleanedTranscript.trim().length > 5) {
      console.log('⚠️ Command not recognized:', lowerTranscript);
      // Only show error message if it's not just single words or noise
      const wordCount = cleanedTranscript.trim().split(/\s+/).length;
      if (wordCount >= 2) {
        const isHindi = lowerTranscript.match(/[\u0900-\u097F]/); // Detect Hindi characters
        if (isHindi) {
          voiceResponse('यह कमांड समझ नहीं आया। कृपया "मदद" बोलें या "?" दबाएं', 'hi');
          triggerModal('कमांड समझ नहीं आया 🎤', '"मदद" बोलें सभी कमांड्स जानने के लिए', true);
        } else {
          voiceResponse('I did not understand that command. Please say "help" to see available commands.');
          triggerModal('Command Not Recognized 🎤', 'Say "help" to see available voice commands', true);
        }
      }
      return;
    } else if (cleanedTranscript && cleanedTranscript.trim().length > 0) {
      // Very short transcript - likely just noise after cleaning
      console.log('🔇 Ignoring very short transcript after noise removal:', lowerTranscript);
      return;
    }

  }, [finalTranscript]);

  const voiceResponse = (text, lang = 'en') => {
    if (typeof window === 'undefined') {
      console.log('⚠️ Window is not defined');
      return;
    }

    try {
      const synth = window.speechSynthesis;
      
      // Check if speech synthesis is available
      if (!synth) {
        console.warn('⚠️ Speech Synthesis API not available in this browser');
        return;
      }

      // Cancel any ongoing speech first
      synth.cancel();
      
      // Create new utterance for each speak
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower speech for better understanding
      utterance.pitch = 1;
      utterance.volume = 1;

      // Use cached voices for faster lookups
      let availableVoices = voicesCacheRef?.current || voices || synth.getVoices();

      // Set voice and language with minimal processing
      if (availableVoices && availableVoices.length > 0) {
        let selectedVoice = null;
        
        if (lang === 'hi') {
          selectedVoice = availableVoices.find(voice => voice.lang?.includes('hi')) || 
                          availableVoices.find(voice => voice.lang?.includes('en-IN')) ||
                          availableVoices[availableVoices.length - 1];
          utterance.lang = 'hi-IN';
        } else {
          selectedVoice = availableVoices.find(voice => voice.lang?.includes('en')) || availableVoices[0];
          utterance.lang = 'en-US';
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else {
        console.warn('⚠️ No voices available for speech synthesis');
      }

      // Add comprehensive error handlers
      utterance.onerror = (error) => {
        console.error('❌ Speech synthesis error:', error.error || error);
        // Gracefully handle errors without crashing
        if (error.error === 'network') {
          console.warn('⚠️ Network error during speech synthesis');
        } else if (error.error === 'not-allowed') {
          console.warn('⚠️ Speech synthesis not allowed by browser');
        }
      };

      utterance.onend = () => {
        console.log('✅ Speech synthesis completed');
      };

      utterance.onstart = () => {
        console.log('🔊 Speech synthesis started');
      };

      // Speak immediately without delays
      synth.speak(utterance);
    } catch (error) {
      console.error('❌ Voice response error:', error.message || error);
      // Fail gracefully - don't crash the app
    }
  }

  const interpretVoiceCommand = () => {
    // const last = event.results.length - 1;
    // const command = event.results[last][0].transcript;
    console.log('Voice Command: ', transcript);
    const lower = transcript.toLowerCase();
    if (
      lower.includes('home') ||
      lower.includes('go home') ||
      lower.includes('मुख्य पृष्ठ') ||
      lower.includes('main page')
    ) {
      voicePageNavigator('home');
    } else if (lower.includes('sign up')) {
      voicePageNavigator('signup');
    } else if (lower.includes('login')) {
      voicePageNavigator('login');
    } else if (lower.includes('contact')) {
      voicePageNavigator('contact');
    } else if (lower.includes('reset password')) {
      voicePageNavigator('reset password');
    } else if (lower.includes('hello')) {
      voiceResponse('Hello! How can I help you?');
    } else if (lower.includes('goodbye')) {
      voiceResponse('Goodbye! Have a nice day!');
    } else {
      voiceResponse('Sorry, I did not understand that command. Please try again.');
    }
  }


  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      // console.log(e.code);
      if (e.code === 'Space' && e.ctrlKey) {
        SpeechRecognition.startListening();
      }
    });
  }, [])

  const loadVoices = () => {
    if (typeof window !== 'undefined' && !voicesCacheRef.current) {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      if (availableVoices.length > 0) {
        voicesCacheRef.current = availableVoices;
        setVoices(availableVoices);
        console.log('✅ Voices cached:', availableVoices.length);
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const synth = window.speechSynthesis;

      // Load voices immediately
      loadVoices();

      // Also load when voices change
      if ("onvoiceschanged" in synth) {
        synth.onvoiceschanged = loadVoices;
      }

      return () => {
        if (synth.onvoiceschanged) {
          synth.onvoiceschanged = null;
        }
      };
    }
  }, [speech])

  const checkExistenceInTranscript = (commandArray) => {
    const command = commandArray.find(command => finalTranscript.includes(command));
    return command;
  }

  return (
    <VoiceContext.Provider value={{
      transcript,
      resetTranscript,
      interpretVoiceCommand,
      fillInputUsingVoice,
      performActionUsingVoice,
      finalTranscript,
      voiceResponse,
      voices,
      triggerModal,
      checkExistenceInTranscript
    }}>

      {/* Floating Help Button */}
      <button 
        onClick={() => setShowInstruction(true)}
        className='fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-20 flex items-center justify-center text-xl font-bold transition-all hover:scale-110'
        title="Press '?' or click for help (मदद के लिए '?' दबाएं या क्लिक करें)"
      >
        ?
      </button>

      <div className='bg-[#8C52FF] text-white text-center'>
        <button className='floating-mic ' onClick={() => {
          console.log('🎤 Mic button clicked');
          console.log('Current listening status:', listening);
          console.log('Browser supports speech recognition:', browserSupportsSpeechRecognition);
          
          if (listening) {
            console.log('⏹️ Stopping listening...');
            SpeechRecognition.stopListening();
            triggerModal('Microphone', 'Voice recognition stopped');
          } else {
            console.log('▶️ Starting listening...');
            try {
              SpeechRecognition.startListening({ continuous: true });
              triggerModal('Microphone', 'Listening... speak now!', true, <FaMicrophone size={50} />, 1000);
              // Very small delay before voice response
              voiceResponse('I am listening');
            } catch (error) {
              console.error('Error starting listening:', error);
              triggerModal('Error', 'Could not start voice recognition', true, <IconMicrophoneOff size={50} />, 1200);
            }
          }
        }}>{listening ?
          (
            <span >
              <IconPlayerRecordFilled style={{ display: 'inline', color: 'white' }} color='#f00' /> listening...
            </span>
          ) : (
            <span className='text-xl'><FaMicrophone /></span>
          )}</button>
      </div>

      {children}
      <InfoModal {...modalOptions} showModal={showModal} setShowModal={setShowModal} />
      {
        showInstruction &&
        <div className='fixed top-0 left-0 w-full h-full bg-slate-900 opacity-50 z-20' onClick={() => setShowInstruction(false)}>
          <div className='h-full backdrop-blur-sm'>
            <InstructionModal setShowModal={setShowInstruction} />
          </div>
        </div>
      }
    </VoiceContext.Provider>
  )
}

const useVoiceContext = () => useContext(VoiceContext);

export default useVoiceContext;