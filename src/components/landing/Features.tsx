import { motion } from 'framer-motion';
import { Heart, Smartphone, Sparkles, Share2, Palette, Music } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Personalized Messages',
    description: 'Write your own heartfelt message or choose from beautiful templates',
  },
  {
    icon: Palette,
    title: 'Stunning Themes',
    description: 'Pick from romantic, elegant, playful, or classic visual themes',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Animations',
    description: 'Floating hearts, confetti celebrations, and magical transitions',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your unique link via WhatsApp, SMS, or any platform',
  },
  {
    icon: Smartphone,
    title: 'WhatsApp Integration',
    description: 'One-tap WhatsApp message when they say YES!',
  },
  {
    icon: Music,
    title: 'Mobile Perfect',
    description: 'Looks stunning on any device, optimized for mobile viewing',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Why <span className="gradient-text">ValLink</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create the perfect Valentine proposal
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
