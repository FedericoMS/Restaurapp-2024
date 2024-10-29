import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.page.html',
  styleUrls: ['./encuesta-empleados.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EncuestaEmpleadosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
