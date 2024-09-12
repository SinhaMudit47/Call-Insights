import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://127.0.0.1:5000';


  uploadAudioFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('audio', file, file.name);

    return this.http.post(`${this.baseUrl}/transcribe`, formData);
  }


  getAnalysisData(text:String): Observable < any > {
    const requestBody = { text: text };
    return this.http.post<any>(`${this.baseUrl}/analyze_text`,requestBody);
  }

  getSummarizeData(text:String): Observable < any > {
    const requestBody = { text: text };
    return this.http.post<any>(`${this.baseUrl}/summarize_text`,requestBody);
  }

  getTranslateData(text:String,target_language:String): Observable < any > {
    const requestBody = { text, target_language};
    return this.http.post<any>(`${this.baseUrl}/translate_text`,requestBody);
  }

}
