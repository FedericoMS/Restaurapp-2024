import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform : Platform, private router : Router) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {    
      SplashScreen.hide();  // Hide the splash screen
      this.router.navigateByUrl('splash');  // Navigate to the splash route
      
  });
  }
}
