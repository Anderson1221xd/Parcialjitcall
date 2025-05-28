import { Injectable } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { v4 as generateUuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private storage: Storage) {}

  async uploadFile(file: File, folderPath: string): Promise<string> {
    const uniqueFileName = `${folderPath}/${generateUuid()}_${file.name}`;
    const fileReference = ref(this.storage, uniqueFileName);

    await uploadBytes(fileReference, file);
    const downloadUrl = await getDownloadURL(fileReference);

    return downloadUrl;
  }
}
