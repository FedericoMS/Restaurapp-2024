import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Encuesta } from 'src/app/clases/encuesta';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.page.html',
  styleUrls: ['./encuesta-empleados.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class EncuestaEmpleadosPage implements OnInit {
  fire = inject(FirestoreService);
  constructor() {}

  ngOnInit() {
    const encuesta: Encuesta = new Encuesta({
      question: '¿Cómo describiría el ambiente del restaurante?',
      Tranquilo: 0,
      Animado: 0,
      Ruidoso: 0,
    });

    // this.fire.addEncuesta(encuesta);
  }
}
