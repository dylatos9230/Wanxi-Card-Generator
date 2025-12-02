export interface ServiceItem {
  id: string;
  text: string;
}

export interface PartnerItem {
  id: string;
  name: string;
}

export interface BusinessCardData {
  themeColor: string;
  companyNameCN: string;
  companyNameEN: string;
  tagline: string;
  services: ServiceItem[];
  partners: PartnerItem[];
  contact: {
    phone: string;
    email: string;
    qrData: string;
    qrImage?: string;
  };
  cardWidth?: number;
}

export interface AIState {
  isLoading: boolean;
  error: string | null;
}