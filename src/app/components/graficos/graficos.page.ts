import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonIcon,
  IonFabButton,
  IonButton,
} from '@ionic/angular/standalone';
import { BarraPage } from './barra/barra.page';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { Encuesta } from 'src/app/clases/encuesta';
import { TortaPage } from './torta/torta.page';
import { DonaPage } from './dona/dona.page';
import { PolarPage } from './polar/polar.page';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonFabButton,
    IonIcon,
    IonFab,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BarraPage,
    TortaPage,
    DonaPage,
    PolarPage,
  ],
})
export class GraficosPage implements OnInit {
  fire: FirestoreService = inject(FirestoreService);
  util: UtilService = inject(UtilService);
  keys: string[][] = [];
  question: string[] = [];
  values: number[][] = [];
  contador: number = 0;
  mostrarGraficos = false;
  router = inject(Router);
  encuesta: string = 'clientes';

  constructor() {
    addIcons({ chevronForwardOutline, chevronBackOutline });
    this.router.routerState.root.queryParams.forEach((item) => {
      this.encuesta = item['encuesta'];
    });
  }

  ngOnInit() {
    this.util.showSpinner();
    this.getDatos();
  }

  async getDatos() {
    await this.fire
      .getCollection('encuesta_' + this.encuesta)
      .valueChanges()
      .forEach((a) => {
        const aux = a as Encuesta[];
        this.obtenerKeys(aux);
        this.obtenerValues(aux);
        setTimeout(() => {
          this.mostrarGraficos = true;
          this.util.hideSpinner();
        }, 1000);
      });
  }

  obtenerKeys(encuesta: Encuesta[]) {
    encuesta.forEach((item) => {
      const aux = Object.keys(item);
      this.keys.push([
        ...aux.filter((item) => item !== 'question' && item !== 'tipo'),
      ]);
    });
  }

  obtenerValues(encuesta: Encuesta[]) {
    encuesta.forEach((item) => {
      const aux = Object.values(item);
      this.values.push([...aux.filter((item) => Number.isInteger(item))]);
      this.question.push(item['question']);
    });
  }

  sumarContador() {
    this.contador++;
  }

  restarContador() {
    this.contador--;
  }

  finalizar() {
    // this.router.navigateByUrl('algun_lugar');
  }
}
