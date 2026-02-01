import { v4 as uuidv4 } from 'uuid';
import type { ValentineData, CreateValentineInput } from '@/types/valentine';

const STORAGE_KEY = 'vallink_proposals';

export function getAllProposals(): ValentineData[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getProposalById(id: string): ValentineData | null {
  const proposals = getAllProposals();
  return proposals.find(p => p.id === id) || null;
}

export function createProposal(input: CreateValentineInput): ValentineData {
  const proposals = getAllProposals();
  
  const newProposal: ValentineData = {
    id: uuidv4().slice(0, 8),
    ...input,
    createdAt: new Date().toISOString(),
  };
  
  proposals.push(newProposal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  
  return newProposal;
}

export function generateWhatsAppLink(phoneNumber: string, senderName: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Hey! 💕 I just said YES to your Valentine proposal on ValLink! I'm so happy! Let's celebrate together! 🎉❤️ - Your Valentine`
  );
  return `https://wa.me/${cleanNumber}?text=${message}`;
}

export function validateWhatsAppNumber(number: string): boolean {
  const cleaned = number.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}
