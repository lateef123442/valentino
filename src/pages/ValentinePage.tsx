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

// Demo data for when no proposal is found
const DEMO_DATA: ValentineData = {
  id: 'demo',
  senderName: 'Your Secret Admirer',
  recipientName: 'Beautiful Soul',
  whatsappNumber: '+1234567890',
  message: 'Every moment with you feels like a beautiful dream I never want to wake up from. You make my heart skip a beat every single day. 💕',
  theme: 'romantic',
  createdAt: new Date().toISOString(),
};

// Helper functions to encode/decode proposal data for URL sharing
const encodeProposal = (data: ValentineData): string => {
  return btoa(JSON.stringify(data));
};

const decodeProposal = (encoded: string): ValentineData | null => {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
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
    // Check if data is encoded in the URL hash (for shareable links)
    const hash = window.location.hash.substring(1); // Remove the '#'
    if (hash) {
      const decoded = decodeProposal(hash);
      if (decoded) {
        setProposal(decoded);
        return;
      }
    }

    // Fallback to existing logic
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
      const timer = setTimeout(() => setStage('message'), 3000);
      return () => clearTimeout(timer);
    }
    if (stage === 'message') {
      const timer = setTimeout(() => setStage('question'), 4000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const triggerConfetti = () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#e11d48', '#f472b6', '#fbbf24', '#ffffff'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#e11d48', '#f472b6', '#fbbf24', '#ffffff'],
      });
    }, 250);
  };

  const handleYesClick = () => {
    setStage('celebration');
    triggerConfetti();
    setTimeout(() => setStage('whatsapp'), 4000);
  };

  const handleNoHover = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 100 - 50;
    setNoButtonPosition({ x, y });
  };

  const handleNoClick = () => {
    setNoClickCount((prev) => prev + 1);
    handleNoHover();
    
    const messages = [
      "Are you sure? 🥺",
      "Please reconsider! 💔",
      "One more chance? 🙏",
      "My heart can't take this! 😢",
      "Okay okay, but... really? 💕",
    ];
    toast(messages[noClickCount % messages.length]);
  };

  const handleShare = async () => {
    // Generate a shareable URL with encoded data in the hash
    const baseUrl = window.location.origin + window.location.pathname;
    const encoded = encodeProposal(proposal!);
    const shareableUrl = `${baseUrl}#${encoded}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ValLink - Valentine Proposal',
          text: 'Someone special created this for you! 💕',
          url: shareableUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareableUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCopyLink = () => {
    // Generate a shareable URL with encoded data in the hash
    const baseUrl = window.location.origin + window.location.pathname;
    const encoded = encodeProposal(proposal!);
    const shareableUrl = `${baseUrl}#${encoded}`;
    
    navigator.clipboard.writeText(shareableUrl);
    toast.success('Link copied!');
  };

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Heart className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background particles-bg relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <FloatingHearts />

      {/* Back button (only for demo) */}
      {id === 'demo' && (
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-50 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}

      {/* Share button */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button variant="ghost" size="icon" onClick={handleCopyLink}>
          <Copy className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-24 h-24 text-primary mx-auto mb-8 fill-primary/30" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-serif font-bold gradient-text mb-4"
            >
              {proposal.recipientName || 'Hey You'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-muted-foreground"
            >
              Someone special has a message for you...
            </motion.p>
          </motion.div>
        )}

        {/* Message Stage */}
        {stage === 'message' && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="text-center px-4 max-w-2xl"
          >
            <motion.div
              className="glass-card p-8 md:p-12"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed italic mb-6">
                "{proposal.message}"
              </p>
              <p className="text-muted-foreground">
                — {proposal.senderName}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Question Stage */}
        {stage === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-20 h-20 text-primary mx-auto mb-8 fill-primary/50" />
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-glow">
              Will You Be My
            </h2>
            <h1 className="text-5xl md:text-7xl font-serif font-bold gradient-text mb-12">
              Valentine?
            </h1>

            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleYesClick}
                  className="btn-romantic text-xl px-12 py-8 rounded-full"
                >
                  <Heart className="w-6 h-6 mr-2 fill-current" />
                  Yes! 💕
                </Button>
              </motion.div>

              <motion.div
                animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onMouseEnter={handleNoHover}
              >
                <Button
                  variant="outline"
                  onClick={handleNoClick}
                  className="text-xl px-12 py-8 rounded-full border-muted-foreground/30 hover:border-muted-foreground/50"
                >
                  No 😢
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Celebration Stage */}
        {stage === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="text-center px-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Heart className="w-32 h-32 text-primary mx-auto mb-8 fill-primary" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif font-bold gradient-text mb-4"
            >
              YES!!!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-muted-foreground"
            >
              🎉 You just made someone incredibly happy! 🎉
            </motion.p>
          </motion.div>
        )}

        {/* WhatsApp Stage */}
        {stage === 'whatsapp' && (
          <motion.div
            key="whatsapp"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4 max-w-md"
          >
            <motion.div
              className="glass-card p-8 md:p-12 glow"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-16 h-16 text-primary mx-auto mb-6 fill-primary/50" />
              </motion.div>
              
              <h2 className="text-3xl font-serif font-bold mb-4">
                You Said <span className="gradient-text">YES!</span>
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Now let {proposal.senderName} know the amazing news! 💕
              </p>

              <motion.a
                href={generateWhatsAppLink(proposal.whatsappNumber, proposal.senderName)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 btn-romantic text-lg px-8 py-6 rounded-full w-full"
              >
                <MessageCircle className="w-6 h-6" />
                Message on WhatsApp
              </motion.a>

              <p className="mt-6 text-sm text-muted-foreground">
                Made with 💕 by ValLink
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
