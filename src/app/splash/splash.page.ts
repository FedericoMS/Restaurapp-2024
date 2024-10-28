import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  constructor(public router : Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login', { replaceUrl: true }); //El replaceUrl es para que NO se pueda volver a la pantalla de splash cuando volvés en el celu
    }, 3000);
   }

  ngOnInit() {
  }

}
