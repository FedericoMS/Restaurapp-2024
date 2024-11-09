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
  IonButtons,
} from '@ionic/angular/standalone';
import { BarraPage } from './barra/barra.page';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { Encuesta } from 'src/app/clases/encuesta';
import { TortaPage } from './torta/torta.page';
import { DonaPage } from './dona/dona.page';
import { PolarPage } from './polar/polar.page';
import {
  chevronForwardOutline,
  chevronBackOutline,
  arrowBackCircleOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonButton,
    IonFabButton,
    IonIcon,
    IonFab,
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
  titulo: string = 'Gráfico de barra';

  constructor() {
    addIcons({
      chevronForwardOutline,
      chevronBackOutline,
      arrowBackCircleOutline,
    });
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
    this.cambiarTitulo();
  }

  restarContador() {
    this.contador--;
    this.cambiarTitulo();
  }

  finalizar() {
    this.router.navigateByUrl('/comentarios');
  }

  cambiarTitulo() {
    switch (this.contador) {
      case 0:
        this.titulo = 'Gráfico de barra';
        break;
      case 1:
        this.titulo = 'Gráfico de torta';
        break;
      case 2:
        this.titulo = 'Gráfico circular';
        break;
      case 3:
        this.titulo = 'Gráfico de área polar';
        break;
    }
  }
  goBack(): void {
    this.router.navigateByUrl('/home-cliente-anonimo', { replaceUrl: true });
  }
}
