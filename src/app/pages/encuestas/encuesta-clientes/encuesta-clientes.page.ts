import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/angular/standalone';
import { UtilService } from 'src/app/services/util.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Encuesta } from 'src/app/clases/encuesta';

@Component({
  selector: 'app-encuesta-clientes',
  templateUrl: './encuesta-clientes.page.html',
  styleUrls: ['./encuesta-clientes.page.scss'],
  standalone: true,
  imports: [
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
  // Clientes
  // ● Se le permitirá cargar una encuesta de satisfacción por medio de un formulario, con
  // la opción de cargar hasta tres (3) fotos máximo, relacionada a la encuesta.
  // ● Con mínimo un tipo de cada uno de estos controles (range, input, radio, check,
  // select).
  // ● Mostrar los gráficos de las estadísticas obtenidas de cada uno de los ítems.
  constructor() {}

  ngOnInit() {}

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
}
