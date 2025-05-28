import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BucketService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseConfig.url,
      environment.supabaseConfig.key
    );
  }

  async storeImage(blobData: Blob, filePath: string): Promise<string> {
    const { error } = await this.client.storage
      .from('jitcall/images')
      .upload(filePath, blobData);
    if (error) throw error;

    const { publicUrl } = this.client.storage
      .from('jitcall/images')
      .getPublicUrl(filePath).data;

    return publicUrl;
  }

  async storeFile(blobData: Blob, filePath: string): Promise<string> {
    const { error } = await this.client.storage
      .from('jitcall/files')
      .upload(filePath, blobData);
    if (error) throw error;

    const { publicUrl } = this.client.storage
      .from('jitcall/files')
      .getPublicUrl(filePath).data;

    return publicUrl;
  }

  async storeAudio(blobData: Blob, filePath: string): Promise<string> {
    const { error } = await this.client.storage
      .from('jitcall/audio')
      .upload(filePath, blobData, {
        contentType: blobData.type || 'audio/aac',
        upsert: true,
      });

    if (error) {
      console.warn('Fallo en la subida de audio:', error);
      throw error;
    }

    const { data } = this.client.storage
      .from('jitcall/audio')
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('No se pudo generar la URL del audio');
    }

    return data.publicUrl;
  }

  async storeVideo(blobData: Blob, filePath: string): Promise<string> {
    const { error } = await this.client.storage
      .from('jitcall/video')
      .upload(filePath, blobData);
    if (error) throw error;

    const { publicUrl } = this.client.storage
      .from('jitcall/video')
      .getPublicUrl(filePath).data;

    return publicUrl;
  }
}
