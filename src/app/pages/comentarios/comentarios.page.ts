import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { UtilService } from 'src/app/services/util.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { addIcons } from 'ionicons';
import { personSharp, arrowBackCircleOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ComentariosPage implements OnInit {
  util = inject(UtilService);
  router = inject(Router);
  fire = inject(FirestoreService);
  sub?: Subscription;
  comentarios: string[] = [];
  constructor() {
    addIcons({ personSharp, arrowBackCircleOutline });
  }

  ngOnInit() {
    this.util.showSpinner();
    this.sub = this.fire
      .getCollection('comentarios_clientes')
      .valueChanges()
      .subscribe((next) => {
        const aux = next as any[];
        aux.forEach((item: any) => {
          this.comentarios.push(item.msj);
        });
        this.util.hideSpinner();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  goBack(): void {
    this.router.navigate(['/graficos'], {
      queryParams: { encuesta: 'clientes' },
      replaceUrl: true,
    });
  }
}
