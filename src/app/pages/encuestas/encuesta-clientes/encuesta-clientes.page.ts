import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonRange,
  IonItem,
} from '@ionic/angular/standalone';
import { UtilService } from 'src/app/services/util.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Encuesta } from 'src/app/clases/encuesta';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-encuesta-clientes',
  templateUrl: './encuesta-clientes.page.html',
  styleUrls: ['./encuesta-clientes.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonRange,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class EncuestaClientesPage implements OnInit {
  private util = inject(UtilService);
  private fire = inject(FirestoreService);
  imgs: string[] = [];
  sub?: Subscription;
  res_encuestas: Encuesta[] = [];
  range?: Encuesta;
  radio?: Encuesta;
  chek?: Encuesta;
  select?: Encuesta;
  radioSelect = 'Tranquilo';
  Select_ok = 'Primera_vez';
  check_1 = false;
  check_2 = true;
  check_3 = false;
  range_select: number = 0;

  constructor() {}

  ngOnInit() {
    this.get_resultados_encuesta();
  }

  get_resultados_encuesta() {
    this.sub = this.fire
      .getCollection('encuesta_clientes')
      .valueChanges()
      .subscribe((next) => {
        this.res_encuestas = next as Encuesta[];
        this.res_encuestas.forEach((value) => {
          this.derivarTipos(value);
        });
      });
  }

  async sacar_foto() {
    try {
      const img = (await this.util.takePicturePrompt()).dataUrl;
      if (img) {
        this.imgs.push(img);
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  derivarTipos(encuesta: Encuesta) {
    switch (encuesta['tipo']) {
      case 'select':
        this.select = encuesta;
        break;
      case 'check':
        this.chek = encuesta;
        break;
      case 'radio':
        this.radio = encuesta;
        break;
      case 'range':
        this.range = encuesta;
        break;
    }
  }

  cambiarSelect(value: string) {
    this.Select_ok = value;
  }

  cambiarRadio(value: string) {
    this.radioSelect = value;
  }

  cambiarRange(event: any) {
    const aux = event.detail.value;
    console.log(aux);
  }

  cambiarCheck(num: number) {
    switch (num) {
      case 1:
        this.check_1 = !this.check_1;
        break;
      case 2:
        this.check_2 = !this.check_2;
        break;
      case 3:
        this.check_3 = !this.check_3;
        break;
    }
  }

  guardar() {
    if (this.chek && this.range && this.radio && this.select) {
      this.chek['Atención'] = this.check_1
        ? this.chek['Atención'] + 1
        : this.chek['Atención'];

      this.chek['Baños'] = this.check_1
        ? this.chek['Baños'] + 1
        : this.chek['Baños'];

      this.chek['Mesas'] = this.check_1
        ? this.chek['Mesas'] + 1
        : this.chek['Mesas'];

      this.range[this.range_select]++;

      this.select[this.Select_ok]++;

      this.radio[this.radioSelect]++;
    }
    console.log(this.res_encuestas);
  }
}
