import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Lagos, Nigeria',
    text: 'My boyfriend sent me a ValLink and I literally cried! It was so beautiful. I said YES immediately and we\'re celebrating our 1 year anniversary now! 💕',
    rating: 5,
  },
  {
    name: 'David K.',
    location: 'London, UK',
    text: 'I was so nervous to ask her, but ValLink made it feel special and magical. The animations were incredible and she loved every second of it!',
    rating: 5,
  },
  {
    name: 'Chioma A.',
    location: 'Abuja, Nigeria',
    text: 'The WhatsApp integration is genius! As soon as I clicked YES, I could message him right away. This is how proposals should be done in 2024! 🎉',
    rating: 5,
  },
];

export function Testimonials() {
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
            Love <span className="gradient-text">Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Real couples, real proposals, real magic
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-soft flex items-center justify-center text-white font-medium">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
