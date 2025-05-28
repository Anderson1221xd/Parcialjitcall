export interface Message {
  senderId: string;
  type: 'text' | 'image' | 'audio' | 'location' | 'file';
  content: string;
  timestamp: any;
  filename?: string;
  metadata?: {
    name?: string;
    size?: number;
    lat?: number;
    lng?: number;
    mimeType?: string;
  };
}
