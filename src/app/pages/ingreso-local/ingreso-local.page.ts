import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabButton,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subscription } from 'rxjs';
import { PushService } from 'src/app/services/push.service';
@Component({
  selector: 'app-ingreso-local',
  templateUrl: './ingreso-local.page.html',
  styleUrls: ['./ingreso-local.page.scss'],
  standalone: true,
  imports: [
    IonFabList,
    IonFabButton,
    IonFab,
    IonIcon,
    IonButton,
    IonTabButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class IngresoLocalPage implements OnInit {
  private router = inject(Router);
  private fire = inject(FirestoreService);
  userService = inject(UserService);
  sub?: Subscription;

  constructor(private util: UtilService) {
    addIcons({ qrCodeOutline });
    this.sub = this.fire
      .getUserProfile(this.userService.uidUser)
      .subscribe((next) => {
        console.log(next.data());
        const aux: any = next.data();
        if (aux.lista_espera) {
          this.router.navigateByUrl('/home-cliente-anonimo');
        }
      });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async scan() {
    const data = await this.util.scan();
    if (data === 'restaurapp') {
      this.router.navigateByUrl('/home-cliente-anonimo', { replaceUrl: true });
    } else {
      this.util.msjError(
        'No podes vincularte con una mesa sin estar en la sala de espera'
      );
    }
    console.log(data);
  }


}
