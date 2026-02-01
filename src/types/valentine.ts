export interface ValentineData {
  id: string;
  senderName: string;
  recipientName: string;
  whatsappNumber: string;
  message: string;
  theme: 'romantic' | 'elegant' | 'playful' | 'classic';
  createdAt: string;
}

export interface CreateValentineInput {
  senderName: string;
  recipientName: string;
  whatsappNumber: string;
  message: string;
  theme: 'romantic' | 'elegant' | 'playful' | 'classic';
}

export const MESSAGE_TEMPLATES = [
  "Every moment with you feels like a beautiful dream I never want to wake up from. 💕",
  "You're the reason my heart beats a little faster and my smile shines a little brighter. ✨",
  "In a world full of billions, my heart chose you. Will you be my forever? 💖",
  "They say love is a journey, and I want every step of mine to be with you. 🌹",
  "You're not just my Valentine, you're my every day. Be mine? 💘",
];

export const THEME_OPTIONS = [
  { id: 'romantic', name: 'Romantic Rose', gradient: 'from-rose-500 to-pink-600' },
  { id: 'elegant', name: 'Elegant Gold', gradient: 'from-amber-400 to-yellow-600' },
  { id: 'playful', name: 'Playful Pink', gradient: 'from-pink-400 to-purple-500' },
  { id: 'classic', name: 'Classic Red', gradient: 'from-red-500 to-rose-600' },
] as const;
