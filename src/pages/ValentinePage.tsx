import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, Copy, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ParticleBackground } from '@/components/ParticleBackground';
import { getProposalById, generateWhatsAppLink } from '@/lib/storage';
import type { ValentineData } from '@/types/valentine';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type Stage = 'intro' | 'message' | 'question' | 'celebration' | 'whatsapp';

const DEMO_DATA: ValentineData = {
  id: 'demo',
  senderName: 'Your Secret Admirer',
  recipientName: 'Beautiful Soul',
  whatsappNumber: '+1234567890',
  message: 'Every moment with you feels like a beautiful dream... 💕',
  theme: 'romantic',
  createdAt: new Date().toISOString(),
};

/** * SHORT LINK LOGIC 
 * We convert the object to an array to strip out the keys and save space
 */
const encodeProposal = (data: ValentineData): string => {
  const compactData = [
    data.senderName,      // 0
    data.recipientName,   // 1
    data.whatsappNumber,  // 2
    data.message,         // 3
    data.theme            // 4
  ];
  return btoa(encodeURIComponent(JSON.stringify(compactData)));
};

const decodeProposal = (encoded: string): ValentineData | null => {
  try {
    const decodedB64 = atob(encoded);
    const arr = JSON.parse(decodeURIComponent(decodedB64));
    return {
      id: 'shared',
      senderName: arr[0],
      recipientName: arr[1],
      whatsappNumber: arr[2],
      message: arr[3],
      theme: arr[4],
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    // Fallback for old long links if any exist
    try {
      return JSON.parse(decodeURIComponent(atob(encoded)));
    } catch {
      return null;
    }
  }
};

export default function ValentinePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<ValentineData | null>(null);
  const [stage, setStage] = useState<Stage>('intro');
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noClickCount, setNoClickCount] = useState(0);

  useEffect(() => {
    // 1. Try Short Link from Hash
    const hash = window.location.hash.substring(1);
    if (hash) {
      const decoded = decodeProposal(hash);
      if (decoded) {
        setProposal(decoded);
        return;
      }
    }

    // 2. Try ID or Demo
    if (id === 'demo') {
      setProposal(DEMO_DATA);
    } else if (id) {
      const data = getProposalById(id);
      if (data) {
        setProposal(data);
      } else {
        toast.error('Valentine not found');
        navigate('/');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    if (stage === 'intro') {
      const timer = setTimeout(() => setStage('message'), 2500);
      return () => clearTimeout(timer);
    }
    if (stage === 'message') {
      const timer = setTimeout(() => setStage('question'), 3500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const triggerConfetti = () => {
    const end = Date.now() + 5000;
    const colors = ['#e11d48', '#f472b6', '#fbbf24', '#ffffff'];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleYesClick = () => {
    setStage('celebration');
    triggerConfetti();
    setTimeout(() => setStage('whatsapp'), 3000);
  };

  const handleNoHover = () => {
    const x = Math.random() * 260 - 130;
    const y = Math.random() * 140 - 70;
    setNoButtonPosition({ x, y });
  };

  const handleNoClick = () => {
    setNoClickCount(prev => prev + 1);
    handleNoHover();
    const msgs = ["Are you sure? 🥺", "Please reconsider! 💔", "One more chance? 🙏", "My heart can't take this! 😢"];
    toast(msgs[noClickCount % msgs.length]);
  };

  const handleCopyLink = () => {
    if (!proposal) return;
    const url = `${window.location.origin}${window.location.pathname}#${encodeProposal(proposal)}`;
    navigator.clipboard.writeText(url);
    toast.success('Short link copied! 💕');
  };

  const handleShare = async () => {
    if (!proposal) return;
    const url = `${window.location.origin}${window.location.pathname}#${encodeProposal(proposal)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'A Special Message', text: 'Open this for a surprise! 💕', url });
      } catch (err) {}
    } else {
      handleCopyLink();
    }
  };

  if (!proposal) return <div className="min-h-screen flex items-center justify-center"><Heart className="animate-pulse text-primary w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <ParticleBackground />
      <FloatingHearts />

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button variant="ghost" size="icon" onClick={handleCopyLink}><Copy className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="w-4 h-4" /></Button>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <Heart className="w-20 h-20 text-primary mx-auto mb-6 fill-primary/20 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold gradient-text mb-2">{proposal.recipientName}</h1>
            <p className="text-muted-foreground">Someone has a secret message for you...</p>
          </motion.div>
        )}

        {stage === 'message' && (
          <motion.div key="message" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-md w-full">
            <div className="glass-card p-8 text-center border-primary/20 border">
              <Sparkles className="w-6 h-6 text-accent mx-auto mb-4" />
              <p className="text-xl italic leading-relaxed mb-6">"{proposal.message}"</p>
              <p className="text-sm font-medium opacity-70">— {proposal.senderName}</p>
            </div>
          </motion.div>
        )}

        {stage === 'question' && (
          <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Will You Be My <span className="gradient-text">Valentine?</span></h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button onClick={handleYesClick} className="btn-romantic px-10 py-6 text-lg rounded-full">Yes, I will! ❤️</Button>
              <motion.div animate={noButtonPosition} transition={{ type: 'spring', stiffness: 300 }}>
                <Button variant="outline" onMouseEnter={handleNoHover} onClick={handleNoClick} className="rounded-full px-10 py-6">No 😢</Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {stage === 'celebration' && (
          <motion.div key="celebration" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
            <h1 className="text-7xl mb-4">🥰</h1>
            <h2 className="text-5xl font-serif font-bold gradient-text">YES!!!</h2>
            <p className="mt-4 text-muted-foreground">Sending the good news...</p>
          </motion.div>
        )}

        {stage === 'whatsapp' && (
          <motion.div key="whatsapp" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xs w-full glass-card p-8 text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4 fill-primary" />
            <h3 className="text-xl font-bold mb-2">It's Official!</h3>
            <p className="text-sm text-muted-foreground mb-6">Tell {proposal.senderName} the news on WhatsApp!</p>
            <Button asChild className="w-full btn-romantic rounded-full">
              <a href={generateWhatsAppLink(proposal.whatsappNumber, proposal.senderName)} target="_blank">
                <MessageCircle className="mr-2 w-4 h-4" /> Message Now
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
