import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  images: string[] = [
    'assets/images/home.jpg',
    'assets/images/home1.jpg',
    'assets/images/home2.jpg'
  ];
  currentImageIndex = 0;
  fadeOut = false;

  constructor(private ngZone: NgZone) {
    // arrancamos el loop fuera de Angular
    this.ngZone.runOutsideAngular(() => this.startCarousel());
  }

  startCarousel() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      });
      this.startCarousel();
    }, 5000);
  }
}