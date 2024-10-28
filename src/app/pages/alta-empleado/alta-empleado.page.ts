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
import { Alert } from 'src/app/clases/alert';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';

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
  // private router = inject(Router);
  private fire = inject(FirestoreService);
  private util = inject(UtilService);
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

      rol: [this.list_roles[0]],
    });
  }

  ngOnInit() {}
  async cargarConQr() {
    const datos = await this.util.scan_dni();
    if (datos) {
      this.fg.controls['nombre'].setValue(datos.nombre);
      this.fg.controls['apellido'].setValue(datos.apellido);
      this.fg.controls['dni'].setValue(datos.dni);
    } else {
      Alert.error('Ocurrió un error', 'Vuelva a intentar más tarde');
    }
  }

  cargar() {
    if (this.fg.valid) {
      //Se deberia agregar un spinner para la espera
      //Agrego el empleado a firestores
      this.fire
        .addEmpleado(
          new Empleado(
            this.fg.controls['nombre'].value,
            this.fg.controls['apellido'].value,
            this.fg.controls['dni'].value,
            this.fg.controls['cuil'].value,
            '', //esta la foto_url que se agrega despues
            this.fg.controls['rol'].value
          )
        )
        .then(() => {
          Alert.success('Se cargo exitosamente el empleado', '');
          //Reseteo el form para que empiece de cero
          this.fg.reset();
        })
        .catch(() => {
          Alert.error(
            'Hubo un problema al cargar el empleado',
            'Vuelva a intentar más tarde'
          );
        });
    } else {
      Alert.error(
        'Ocurrió un error',
        'Verifique que todos los campos estén completos sin errores!'
      );
      //Muestro todos los errores
      Object.keys(this.fg.controls).forEach((controlName) => {
        this.fg.controls[controlName].markAsTouched();
      });
    }
  }
}
