import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab,
  IonLabel,
  IonItem,
  IonButton,
} from '@ionic/angular/standalone';
import { Empleado } from 'src/app/clases/empleado';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonFab,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AltaEmpleadoPage implements OnInit {
  // Alta de empleados
  // ● Se cargarán: nombre, apellido, DNI, CUIL, foto y tipo de empleado.
  // ● La foto se tomará del celular. La foto puede ser tomada luego de realizar el alta.
  // ● Brindar la posibilidad de contar con un lector de código QR para el DNI, que cargará
  // la información disponible (sólo aplicable a aquellos documentos que lo posean).
  // ● Esta acción la podrá realizar el supervisor o el dueño.
  private router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  fg: FormGroup;
  list_roles = Empleado.get_roles();

  constructor() {
    this.fg = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: [
        '',
        [
          Validators.required,
          Validators.min(1000000),
          Validators.max(99999999),
        ],
      ],
      cuil: [
        '',
        [
          Validators.required,
          Validators.min(1000000000),
          Validators.max(99999999999),
        ],
      ],
    });
  }

  ngOnInit() {}

  cargar() {
    if (this.fg.valid) {
      console.log('es valido');
    } else {
      //Muestro todos los errores
      Object.keys(this.fg.controls).forEach((controlName) => {
        this.fg.controls[controlName].markAsTouched();
      });
    }
  }
}
