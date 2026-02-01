import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FloatingHearts } from '@/components/FloatingHearts';
import { ParticleBackground } from '@/components/ParticleBackground';
import { createProposal, validateWhatsAppNumber } from '@/lib/storage';
import { MESSAGE_TEMPLATES, THEME_OPTIONS, type CreateValentineInput } from '@/types/valentine';
import { toast } from 'sonner';

const steps = [
  { id: 1, title: 'Your Details', description: 'Tell us about yourself' },
  { id: 2, title: 'Your Message', description: 'What do you want to say?' },
  { id: 3, title: 'Choose Theme', description: 'Pick a beautiful look' },
  { id: 4, title: 'Preview & Share', description: 'See your creation' },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateValentineInput>({
    senderName: '',
    recipientName: '',
    whatsappNumber: '',
    message: MESSAGE_TEMPLATES[0],
    theme: 'romantic',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.senderName.trim()) {
        newErrors.senderName = 'Please enter your name';
      }
      if (!formData.whatsappNumber.trim()) {
        newErrors.whatsappNumber = 'Please enter your WhatsApp number';
      } else if (!validateWhatsAppNumber(formData.whatsappNumber)) {
        newErrors.whatsappNumber = 'Please enter a valid phone number (10-15 digits)';
      }
    }

    if (step === 2) {
      if (!formData.message.trim()) {
        newErrors.message = 'Please write or select a message';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreate = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    
    try {
      const proposal = createProposal(formData);
      toast.success('Your ValLink has been created! 💕');
      navigate(`/v/${proposal.id}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background particles-bg relative overflow-hidden">
      <ParticleBackground />
      <FloatingHearts />

      {/* Header */}
      <header className="relative z-20 py-6 px-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary/30" />
            <span className="text-xl font-serif font-bold">ValLink</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-20 container px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                    currentStep > step.id
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'bg-primary text-primary-foreground glow'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-12 md:w-24 h-0.5 mx-2 transition-colors ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="relative z-20 container px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Your Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8"
              >
                <h2 className="text-3xl font-serif font-bold mb-2">Your Details</h2>
                <p className="text-muted-foreground mb-8">Tell us who's sending this love note</p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="senderName">Your Name *</Label>
                    <Input
                      id="senderName"
                      placeholder="Enter your name"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      className="mt-2 bg-muted/50"
                    />
                    {errors.senderName && (
                      <p className="text-sm text-destructive mt-1">{errors.senderName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="recipientName">Their Name (optional)</Label>
                    <Input
                      id="recipientName"
                      placeholder="Enter your crush's name"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="mt-2 bg-muted/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsappNumber">Your WhatsApp Number *</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="+234 xxx xxx xxxx"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="mt-2 bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include country code (e.g., +234 for Nigeria)
                    </p>
                    {errors.whatsappNumber && (
                      <p className="text-sm text-destructive mt-1">{errors.whatsappNumber}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Your Message */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8"
              >
                <h2 className="text-3xl font-serif font-bold mb-2">Your Message</h2>
                <p className="text-muted-foreground mb-8">Write from your heart or pick a template</p>

                <div className="space-y-6">
                  <div>
                    <Label>Choose a Template</Label>
                    <div className="grid gap-3 mt-2">
                      {MESSAGE_TEMPLATES.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => setFormData({ ...formData, message: template })}
                          className={`p-4 rounded-xl text-left text-sm transition-all ${
                            formData.message === template
                              ? 'bg-primary/20 border-2 border-primary'
                              : 'bg-muted/50 border-2 border-transparent hover:border-primary/30'
                          }`}
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customMessage">Or Write Your Own</Label>
                    <Textarea
                      id="customMessage"
                      placeholder="Write your heartfelt message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-2 bg-muted/50 min-h-[120px]"
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Choose Theme */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8"
              >
                <h2 className="text-3xl font-serif font-bold mb-2">Choose Theme</h2>
                <p className="text-muted-foreground mb-8">Pick the perfect look for your proposal</p>

                <div className="grid grid-cols-2 gap-4">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setFormData({ ...formData, theme: theme.id })}
                      className={`relative p-6 rounded-2xl transition-all overflow-hidden group ${
                        formData.theme === theme.id
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-80`} />
                      <div className="relative z-10 text-white">
                        <Heart className="w-8 h-8 mb-2 mx-auto" />
                        <span className="font-medium">{theme.name}</span>
                      </div>
                      {formData.theme === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8"
              >
                <h2 className="text-3xl font-serif font-bold mb-2">Preview</h2>
                <p className="text-muted-foreground mb-8">Here's how your ValLink will look</p>

                <div className="bg-muted/30 rounded-2xl p-6 mb-8">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Heart className="w-12 h-12 text-primary mx-auto mb-4 fill-primary/30" />
                    </motion.div>
                    <h3 className="text-2xl font-serif font-bold mb-2">
                      {formData.recipientName || 'Someone Special'}
                    </h3>
                    <p className="text-muted-foreground mb-4">From {formData.senderName}</p>
                    <p className="text-foreground/80 italic">"{formData.message}"</p>
                    <div className="mt-6 flex justify-center gap-4">
                      <div className="px-6 py-2 bg-primary/20 rounded-full text-primary font-medium">
                        Yes! 💕
                      </div>
                      <div className="px-6 py-2 bg-muted rounded-full text-muted-foreground">
                        No 😢
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full btn-romantic text-lg py-6"
                >
                  {isCreating ? (
                    <>Creating magic...</>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create My ValLink
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {currentStep < 4 && (
              <Button onClick={nextStep} className="btn-romantic px-6">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
