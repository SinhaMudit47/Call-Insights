import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  constructor(private route:Router){}

  converter(){
    this.route.navigate(['/audiototext'])
    this.preloadImage();
  }


  imageSrc: string = 'assets/music.jpg'; 

  preloadImage() {
    const img = new Image();
    img.src = this.imageSrc;
  }
}
