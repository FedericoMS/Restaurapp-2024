import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonFab,
  IonFabList,
  IonFabButton,
} from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { UtilService } from './services/util.service';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonFabButton,
    IonFabList,
    IonFab,
    IonApp,
    IonRouterOutlet,
    SpinnerComponent,
  ],
})
export class AppComponent {
  util = inject(UtilService);

  constructor(private platform: Platform, private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide(); // Hide the splash screen
      this.router.navigateByUrl('home-cliente-anonimo'); // Navigate to the splash route
    });
  }
}
