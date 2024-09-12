import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {


  @Input() analysisData: any;
  @Input() summarizeText: any;

  base64Image: string =''; 
  imageUrl: string = ''; 


  frequencyArray: { word: string; frequency: number }[] = [];
  vader: any;
  subjectivity: any;

  subjectivityChart: any;
  polarityChart: any;


  totalDigit:number=0;
  totalNoun:number=0;
  totalPronoun:number=0;
  totalSentence:number=0;
  totalWord:number=0;
  totalVerb:number=0;

  selectedLanguage: String='en';
  translatedText: string = '';

  loading: boolean = false;


  constructor(private apiService:ApiService) {}



  ngOnInit() {

     //-------------------Translate language-----------------------------------------------

    this.translatedText = this.analysisData.sentences;


     //-------------------Frequency count of words-----------------------------------------------

    this.frequencyArray = Object.entries(this.analysisData.frequency_distribution)
                                  .map(([word, frequency]) => ({ word, frequency: frequency as number }));

      this.frequencyArray.sort((a, b) => b.frequency - a.frequency);


    //-------------------image-----------------------------------------------

    this.base64Image = this.analysisData.image;
    if (this.base64Image) {
      this.imageUrl = 'data:image/png;base64,' + this.base64Image;
    }
    
    

    // ------------------Polarity--------------------------------------------

    this.vader = this.analysisData.Vader_sentiment_analysis;

    let positivePercentage = this.analysisData.Vader_sentiment_analysis.pos*100;
    let negativePercentage = this.analysisData.Vader_sentiment_analysis.neg*100;
    let neutralPercentage = this.analysisData.Vader_sentiment_analysis.neu*100;


    this.polarityChart = {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          data: [positivePercentage, negativePercentage, neutralPercentage],
          backgroundColor: [
            "#36A2EB",
            "#FF6384",
            "#FFCE56"  
          ],
          hoverBackgroundColor: [
            "#36A3EB",
            "#FF6384",
            "#FFCE56"
          ]
        }
      ]
    };

    // ------------------subjectivityChart--------------------------------------------

    this.subjectivity = this.analysisData.subjectivity;


    let factPercentage = this.analysisData.subjectivity;
    let OpinionPercentage = 1 - factPercentage;

    this.subjectivityChart = {
      labels: ['Fact', 'Personal Opinion'],
      datasets: [
        {
          data: [factPercentage*100, OpinionPercentage*100],
          backgroundColor: [
            "#36A2EB", 
            "#FF6384",  
          ],
          hoverBackgroundColor: [
            "#36A2EB",
            "#FF6384",
          ]
        }
      ]
    };




    //---------------------Total count-----------------------------------

    this.totalNoun = this.analysisData.noun_length;
    this.totalPronoun = this.analysisData.pronoun_length;
    this.totalWord = this.analysisData.total_words;
    this.totalSentence = this.analysisData.total_sentences;
    this.totalDigit = this.analysisData.cardinal_digit_length;
    this.totalVerb = this.analysisData.verb_length;



  }

  //-------------------Translate language-----------------------------------------------


  changeLang(){
      this.loading=true;
      const text = this.analysisData.sentences.join(' ');
      const lang = this.selectedLanguage;
      this.apiService.getTranslateData(text,lang).subscribe(data => {
      this.translatedText = data.translated_text;
      this.loading=false;
      },
      error => {
        console.error('API Error:', error);
        this.translatedText = this.analysisData.sentences;
        
      });
  
  }

}


