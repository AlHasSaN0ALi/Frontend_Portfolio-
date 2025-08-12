import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private imageUrl = environment.imageUrl;

  constructor(private http: HttpClient) { }

  uploadImage(endpoint: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(endpoint, formData);
  }

  // For competition gallery upload with multiple images
  uploadImages(endpoint: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file); // 'images' is the field name for multiple files
    });
    return this.http.post(endpoint, formData);
  }
}
