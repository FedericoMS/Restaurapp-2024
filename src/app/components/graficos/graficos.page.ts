import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BarraPage } from './barra/barra.page';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { Encuesta } from 'src/app/clases/encuesta';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BarraPage,
  ],
})
export class GraficosPage implements OnInit {
  fire: FirestoreService = inject(FirestoreService);
  util: UtilService = inject(UtilService);
  keys: string[][] = [];
  question: string[] = [];
  values: number[][] = [];
  mostrarGraficos = false;
  constructor() {}

  ngOnInit() {
    this.util.showSpinner();
    this.getDatos();
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
}
