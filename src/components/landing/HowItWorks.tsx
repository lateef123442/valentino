import { motion } from 'framer-motion';
import { PenLine, Wand2, Send, Heart } from 'lucide-react';

const steps = [
  {
    icon: PenLine,
    title: 'Fill in the Details',
    description: 'Enter your name, your crush\'s name, and their WhatsApp number',
  },
  {
    icon: Wand2,
    title: 'Customize',
    description: 'Pick a theme, write a message, and make it uniquely yours',
  },
  {
    icon: Send,
    title: 'Share the Link',
    description: 'Send your personalized ValLink to your special someone',
  },
  {
    icon: Heart,
    title: 'Celebrate Together',
    description: 'When they say YES, connect instantly via WhatsApp!',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            How It <span className="gradient-text-gold">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Four simple steps to sweep them off their feet
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`flex items-center gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pink-soft flex items-center justify-center glow">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  <div className="flex items-center gap-3 mb-2 ${index % 2 === 1 ? 'md:justify-end' : ''}">
                    <span className="text-sm font-medium text-accent">Step {index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
