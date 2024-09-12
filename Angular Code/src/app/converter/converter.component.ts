import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent{



  showAnalysis: boolean = false;
  analysisData: any;
  summarizeText: any;


  constructor(private apiService:ApiService){}


   fileName:any;
   audioFile: File | null = null;
   audioUrl :String ='';

   translateData:string='';
   loading: boolean = false;
   anLoding:boolean = false;

  onInput(event: any) {

   const files = event.target.files;

   if (files.length > 0) {
    this.audioFile = files[0];
     this.audioUrl = URL.createObjectURL(files[0]);
     this.fileName = files[0].name;
   }

 
    (<HTMLAudioElement>document.getElementById("audio"))?.load();
  
  }


  uploadAudio() {

    if (this.audioFile) {
      this.loading = true;
      this.apiService.uploadAudioFile(this.audioFile).subscribe(
        (response:any) => {
          this.translateData = response.transcription;
          console.log('Upload successful', response);
        },
      error => {
        console.error('Error uploading file', error);
      }
    ).add(() => {
      this.loading = false;
    });
  }
  

}


getAnalysis() {

  if(this.translateData){
    const text = this.translateData
    this.anLoding = true
    this.apiService.getAnalysisData(text).subscribe(data => {
      this.analysisData = data;
      console.log("type",typeof this.analysisData)
      console.log("type",this.analysisData.frequency_distribution)
      console.log('API Response:', data);

      this.apiService.getSummarizeData(text).subscribe(summarizedData =>{
        this.summarizeText = summarizedData
        this.showAnalysis = true;
        this.anLoding = false;
        console.log('Summarized Data:', summarizedData);
      },
      (error: any) => {
        console.error('Summarize API Error:', error);
        this.anLoding = false;
      });
  
    },
    error => {
      console.error('API Error:', error);
      this.anLoding = false;
      
    });

  }else{
    alert("Select audio and convert it to text");

  }

  }


  downloadText() {
    const blob = new Blob([this.translateData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);


    const a = document.createElement('a');
    a.href = url;
    a.download = 'translateData.txt'; 
    a.click();

    window.URL.revokeObjectURL(url);
    a.remove();
  }


  


}
