import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-romantic-purple/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-16 text-center max-w-4xl mx-auto glow"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Heart className="w-16 h-16 text-primary fill-primary/20" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Ready to Make
            <br />
            <span className="gradient-text">Magic Happen?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Create your personalized Valentine proposal in under 2 minutes. 
            It's free, beautiful, and unforgettable.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/create')}
            className="btn-romantic group text-xl px-10 py-7 rounded-full"
          >
            <Heart className="w-6 h-6 mr-2 group-hover:animate-heartbeat" />
            Create Your Proposal Now
            <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            ✨ 100% Free • No sign-up required • Share instantly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
