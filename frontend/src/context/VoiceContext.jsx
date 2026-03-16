"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IconArrowDown, IconArrowDownBar, IconArrowUp, IconArrowUpBar, IconMicrophoneOff, IconPlayerRecordFilled, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { FaMicrophone } from "react-icons/fa6";
import { AnimatePresence, motion } from 'framer-motion';

const InfoModal = ({ icon, title, description, showModal, setShowModal, centered = false, duration = 2000 }) => {

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
          transition={{ duration: 0.6 }}
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
      className={`top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed z-30 bg-white text-slate-800 p-10 rounded-xl`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* close button */}
      <button onClick={() => setShowModal(false)} className='absolute top-10 right-10 text-xl'>
        <IconX size={20} />
      </button>
      <h3 className='text-center text-3xl font-bold mb-4'>Basic Instructions</h3>
      <p className='text-lg mb-2'>{`1. Say "Open <page name> page" to open navigate to any page`}</p>
      <p className='text-lg mb-2'>{`2. Say "I want to create an account" to navigate to the signup page`}</p>
      <p className='text-lg mb-2'>{`3. Say "I want to login" to navigate to the login page`}</p>
      <p className='text-lg mb-2'>{`4. Say "Move down" to scroll down and vice-versa`}</p>
      <p className='text-lg mb-2'>{`5. Say "Move to bottom" to scroll to bottom of page and vice-versa`}</p>
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
    centered: true
  });
  const hasRun = useRef(false);
  const router = useRouter();
  const [voices, setVoices] = useState([]);
  const [speech, setSpeech] = useState(null);

  // Initialize speech synthesis on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance();
      setSpeech(utterance);
      loadVoices();
    }
  }, []);

  const triggerModal = (title, description, centered = true, icon = <FaMicrophone size={50} />) => {
    setModalOptions({
      icon,
      title,
      description,
      centered
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
        console.log('✅ Speech recognition is supported!');
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
    console.log('🔍 Looking for page:', pageName);
    const page = pageDetails.find(page => pageName.toLowerCase().includes(page.pageName.toLowerCase()));
    console.log('📄 Found page:', page);

    if (page) {
      console.log('✅ Navigating to:', page.pagePath);
      const message = `Navigating to ${pageName} page`;
      voiceResponse(message);
      triggerModal('Navigating...', message);
      setTimeout(() => {
        router.push(page.pagePath);
      }, 500);
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
      // SpeechRecognition.startListening({ continuous: true });
      // voiceResponse('Welcome to BolBazar. What are you shopping today?');
      // triggerModal('Voice Assistant', 'I am listening');
    }
  }, [])

  // open instruction modal after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setShowInstruction(true);
    }, 3000);
  }, [])



  useEffect(() => {
    if (!finalTranscript) return;
    const lowerTranscript = finalTranscript.toLowerCase();
    console.log('🎯 Processing command:', lowerTranscript);

    // --- Hindi Commands ---
    // नमस्ते / हेलो
    if (lowerTranscript.includes('नमस्ते') || lowerTranscript.includes('नमस्कार')) {
      voiceResponse('नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?', 'hi');
      triggerModal('नमस्ते!', 'आपकी मदद के लिए तैयार हूँ');
      resetTranscript();
      return;
    }

    // अलविदा / गुडबाय
    if (lowerTranscript.includes('अलविदा') || lowerTranscript.includes('बाय')) {
      voiceResponse('शुक्रिया! आपका दिन शुभ हो!', 'hi');
      SpeechRecognition.stopListening();
      triggerModal('अलविदा!', 'आपका दिन शुभ हो!', false, <IconMicrophoneOff size={50} />);
      resetTranscript();
      return;
    }

    // लॉगिन (हिंदी)
    if (lowerTranscript.includes('लॉगिन') || lowerTranscript.includes('लॉगिन करना') || lowerTranscript.includes('साइन इन')) {
      voiceResponse('लॉगिन पेज पर जा रहे हैं', 'hi');
      triggerModal('लॉगिन', 'लॉगिन पेज पर जा रहे हैं');
      setTimeout(() => {
        router.push('/login');
      }, 500);
      resetTranscript();
      return;
    }

    // साइन अप (हिंदी)
    if (lowerTranscript.includes('साइन अप') || lowerTranscript.includes('खाता बनाना') || lowerTranscript.includes('रजिस्टर')) {
      voiceResponse('साइन अप पेज पर जा रहे हैं', 'hi');
      triggerModal('साइन अप', 'खाता बनाने के लिए जा रहे हैं');
      setTimeout(() => {
        router.push('/signup');
      }, 500);
      resetTranscript();
      return;
    }

    // होम (हिंदी)
    if (lowerTranscript.includes('होम') || lowerTranscript.includes('घर') || lowerTranscript.includes('मुख्य पृष्ठ')) {
      voiceResponse('होम पेज पर जा रहे हैं', 'hi');
      triggerModal('होम', 'होम पेज पर जा रहे हैं');
      setTimeout(() => {
        router.push('/');
      }, 500);
      resetTranscript();
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

    // Feedback / Help (Hindi + English)
    if (
      lowerTranscript.includes('feedback') || lowerTranscript.includes('suggestion') ||
      lowerTranscript.includes('फीडबैक') || lowerTranscript.includes('सुझाव') ||
      lowerTranscript.includes('help') || lowerTranscript.includes('मदद') || lowerTranscript.includes('सहायता')
    ) {
      const isHindi = lowerTranscript.includes('फीडबैक') || lowerTranscript.includes('सुझाव') || lowerTranscript.includes('मदद') || lowerTranscript.includes('सहायता');
      voiceResponse(
        isHindi ? 'कृपया अपनी प्रतिक्रिया साझा करें।' : 'Opening feedback and help. Please share your feedback or ask your question.',
        isHindi ? 'hi' : 'en'
      );
      triggerModal(isHindi ? 'प्रतिक्रिया / मदद' : 'Feedback / Help', isHindi ? 'अपनी प्रतिक्रिया साझा करें' : 'Please share your feedback or ask your question.');
      resetTranscript();
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

    // Fallback: Handle "open X page" pattern manually
    if (lowerTranscript.includes('open') && lowerTranscript.includes('page')) {
      console.log('🎯 Processing open page command');
      voicePageNavigator(lowerTranscript.replace('open', '').replace('page', '').trim());
      resetTranscript();
      return;
    }

    // Fallback: Handle simple navigation like "login", "signup", etc.
    const simpleCommands = ['login', 'signup', 'home', 'contact', 'cart', 'profile', 'checkout'];
    for (const cmd of simpleCommands) {
      if (lowerTranscript === cmd || lowerTranscript.includes(`go to ${cmd}`)) {
        console.log('🎯 Processing simple command:', cmd);
        voicePageNavigator(cmd);
        resetTranscript();
        return;
      }
    }

    // If no command matched, give feedback
    if (finalTranscript && finalTranscript.trim().length > 0) {
      console.log('⚠️ Command not recognized:', lowerTranscript);
      voiceResponse('Sorry, I did not understand that command.');
    }

  }, [finalTranscript]);

  const voiceResponse = (text, lang = 'en') => {
    if (typeof window === 'undefined') {
      console.log('⚠️ Window is not defined');
      return;
    }

    try {
      const synth = window.speechSynthesis;
      
      // Create new utterance for each speak
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Get voices - try from state first, then from browser
      let availableVoices = voices;
      if (!availableVoices || availableVoices.length === 0) {
        availableVoices = synth.getVoices();
      }

      // Set voice and language
      if (availableVoices && availableVoices.length > 0) {
        let selectedVoice;
        
        if (lang === 'hi') {
          // Search for Hindi voice
          selectedVoice = availableVoices.find(voice => voice.lang.includes('hi'));
          if (!selectedVoice) {
            selectedVoice = availableVoices.find(voice => voice.lang.includes('en-IN'));
          }
          if (!selectedVoice) {
            selectedVoice = availableVoices[0];
          }
          utterance.lang = 'hi-IN';
        } else {
          // English voice
          selectedVoice = availableVoices.find(voice => voice.lang.includes('en'));
          if (!selectedVoice) {
            selectedVoice = availableVoices[0];
          }
          utterance.lang = 'en-US';
        }
        
        utterance.voice = selectedVoice;
        console.log('🎤 Using voice:', selectedVoice?.name, 'Language:', lang);
      } else {
        console.log('⚠️ No voices available, using default');
      }

      // Stop listening while speaking to prevent feedback loop
      const wasListening = listening && !stopListeningRef.current;
      if (wasListening) {
        console.log('🔇 Pausing listening during voice response');
        SpeechRecognition.stopListening();
      }

      utterance.onstart = () => {
        console.log('▶️ Speech started');
      };

      utterance.onend = () => {
        console.log('✅ Speech finished');
        if (wasListening && !stopListeningRef.current) {
          console.log('🔊 Resuming listening after voice response');
          setTimeout(() => {
            SpeechRecognition.startListening({ continuous: true });
          }, 300);
        }
      };

      utterance.onerror = (error) => {
        console.error('❌ Speech synthesis error:', error);
      };

      // Actually speak the text
      console.log('🔊 Speaking:', text);
      synth.cancel(); // Cancel any ongoing speech
      synth.speak(utterance);
    } catch (error) {
      console.error('❌ Voice response error:', error);
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
    if (typeof window !== 'undefined') {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      console.log('Available voices:', availableVoices.length);

      if (speech && availableVoices.length > 0) {
        // Try to find an English voice
        const englishVoice = availableVoices.find(voice => voice.lang.includes('en'));
        if (englishVoice) {
          speech.voice = englishVoice;
          console.log('Selected voice:', englishVoice.name);
        } else if (availableVoices.length > 0) {
          speech.voice = availableVoices[0];
          console.log('Selected default voice:', availableVoices[0].name);
        }
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

      <div className='bg-[#8C52FF] text-white text-center'>
        <button className='floating-mic ' onClick={() => {
          console.log('🎤 Mic button clicked, Current listening status:', listening);
          if (listening) {
            console.log('⏹️ Stopping listening...');
            SpeechRecognition.stopListening();
          } else {
            console.log('▶️ Starting listening...');
            SpeechRecognition.startListening({ continuous: true });
            voiceResponse('I am listening');
          }
        }}>{listening ?
          (
            <span >
              <IconPlayerRecordFilled style={{ display: 'inline', color: 'white' }} color='#f00' /> listening... {transcript}
            </span>
          ) : (
            <span className='text-xl'><FaMicrophone /></span>
          )}</button>
        {/* <p>Microphone: </p> */}
        {/* <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button> */}
      </div>

      {children}
      <InfoModal {...modalOptions} showModal={showModal} setShowModal={setShowModal} />
      {/* {
        showInstruction &&
        <div className='fixed top-0 left-0 w-full h-full bg-slate-900 opacity-90 z-20'>
          <div className='h-full backdrop-blur-md'>
            <InstructionModal setShowModal={setShowInstruction} />
          </div>
        </div>
      } */}
    </VoiceContext.Provider>
  )
}

const useVoiceContext = () => useContext(VoiceContext);

export default useVoiceContext;