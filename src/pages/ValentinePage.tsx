import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Send, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { saveProposal } from '@/lib/storage';
import type { ValentineData } from '@/types/valentine';

const COUNTRY_CODES = [
  { code: '+234', country: 'Nigeria 🇳🇬' },
  { code: '+1', country: 'USA/Canada 🇺🇸' },
  { code: '+44', country: 'UK 🇬🇧' },
  { code: '+91', country: 'India 🇮🇳' },
  { code: '+254', country: 'Kenya 🇰🇪' },
  { code: '+27', country: 'South Africa 🇿🇦' },
  { code: '+63', country: 'Philippines 🇵🇭' },
  { code: '+92', country: 'Pakistan 🇵🇰' },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+234');
  const [phoneNum, setPhoneNum] = useState('');
  
  const [formData, setFormData] = useState({
    senderName: '',
    recipientName: '',
    message: '',
    theme: 'romantic' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Clean and Format Phone Number
    const cleanNumber = phoneNum.replace(/^0+/, '').replace(/\D/g, '');
    if (cleanNumber.length < 7) {
      toast.error("Please enter a valid phone number");
      setLoading(false);
      return;
    }
    const finalWhatsAppNumber = `${selectedCode}${cleanNumber}`;

    // 2. Prepare Data
    const id = Math.random().toString(36).substring(2, 10);
    const newProposal: ValentineData = {
      id,
      ...formData,
      whatsappNumber: finalWhatsAppNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      saveProposal(newProposal);
      toast.success("Proposal created successfully! 💕");
      
      // Navigate to the view page with the ID
      // The ValentinePage will automatically handle generating the short link hash
      navigate(`/v/${id}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="mb-6 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 fill-primary/20" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold gradient-text">Create Your Proposal</h1>
          <p className="text-muted-foreground mt-2">Fill in the details to create a magical moment</p>
        </motion.div>

        <Card className="glass-card p-6 md:p-8 border-primary/10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  required
                  placeholder="e.g. Ahmed"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Their Name</label>
                <Input
                  required
                  placeholder="e.g. Sarah"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* WhatsApp Number Section with Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Your WhatsApp Number 
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Required</span>
              </label>
              <div className="flex shadow-sm rounded-md overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="bg-muted border-y border-l border-input px-3 py-2 text-sm outline-none cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.country.split(' ')[0]})
                    </option>
                  ))}
                </select>
                <Input
                  type="tel"
                  required
                  placeholder="8012345678"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value.replace(/\D/g, ''))}
                  className="rounded-l-none border-l-0 bg-background/50 focus-visible:ring-0"
                />
              </div>
              <p className="text-[11px] text-muted-foreground italic px-1">
                Note: This is where you'll receive their response.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Romantic Message</label>
              <Textarea
                required
                placeholder="Write something from the heart..."
                className="min-h-[120px] bg-background/50 resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full btn-romantic h-12 text-lg font-medium rounded-full shadow-lg hover:shadow-primary/20 transition-all"
            >
              {loading ? (
                "Creating magic..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Proposal Link
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
