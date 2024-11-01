import { Component, inject, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [
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
  constructor() {
    addIcons({ chevronForwardOutline, chevronBackOutline });
  }

  ngOnInit() {
    this.util.showSpinner();
    this.getDatos();
    console.log(this.values);
  }

  async getDatos() {
    await this.fire
      .getCollection('encuesta_clientes')
      .valueChanges()
      .forEach((a) => {
        const aux = a as Encuesta[];
        this.obtenerKeys(aux);
        this.obtenerValues(aux);
        this.mostrarGraficos = true;
        this.util.hideSpinner();
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
}
