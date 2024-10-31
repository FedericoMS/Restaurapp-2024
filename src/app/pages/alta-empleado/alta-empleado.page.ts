import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
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
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
// import { Alert } from 'src/app/clases/alert';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  checkmark,
  closeOutline,
  qrCodeOutline,
} from 'ionicons/icons';
import { cuilValidator } from 'src/app/validators/cuilValidator';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true,
  imports: [
    SpinnerComponent,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
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
  list_roles = Usuario.get_roles().splice(0, 4);
  foto_url: string = '';
  img?: string = '';
  isLoading: boolean = false;

  constructor() {
    addIcons({ qrCodeOutline, cameraOutline, closeOutline, checkmark });

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
      cuil: ['', [Validators.required, cuilValidator()]],

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
      this.util.showToast(
        'Ocurrió un error, Vuelva a intentar más tarde',
        'red',
        'top'
      );
      // Alert.error('Ocurrió un error', 'Vuelva a intentar más tarde');
    }
  }
  generarUser() {
    const user = new Usuario();
    user.nombre = this.fg.controls['nombre'].value;
    user.apellido = this.fg.controls['apellido'].value;
    user.dni = this.fg.controls['dni'].value;
    user.cuil = this.fg.controls['cuil'].value;
    user.foto_url = this.foto_url;
    user.rol = this.fg.controls['rol'].value;
    return user;
  }
  async cargar() {
    if (this.fg.valid) {
      //Se deberia agregar un spinner para la espera
      this.isLoading = true;
      //Subo la imagen al storage
      await this.upload_storage();
      //Agrego el empleado a firestores
      this.fire
        .addUsuario(this.generarUser())
        .then(() => {
          this.util.showToast(
            'Se cargo exitosamente el empleado',
            'lightgreen',
            'top'
          );
          //Reseteo el form para que empiece de cero
          this.fg.reset();
          this.fg.controls['rol'].setValue(this.list_roles[0]);
        })
        .catch(() => {
          this.util.showToast(
            'Hubo un problema al cargar el empleado',
            'red',
            'top',
            'error'
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.util.showToast(
        'Verifique que todos los campos estén completos sin errores!',
        'red',
        'top',
        'error'
      );
      //Muestro todos los errores
      Object.keys(this.fg.controls).forEach((controlName) => {
        this.fg.controls[controlName].markAsTouched();
      });
    }
  }

  async sacar_foto() {
    try {
      this.img = await this.util.sacar_foto();
    } catch (error) {
      console.log(error);
    }
  }

  async upload_storage() {
    if (this.img) {
      this.foto_url = await this.fire.uploadImage(
        `imagenes_empelados/${Date.now()}`,
        this.img
      );
    }
  }

  formatCuil() {
    let rawValue = this.fg.get('cuil')?.value.replace(/-/g, '');

    if (!/^\d*$/.test(rawValue)) {
      rawValue = rawValue.replace(/\D/g, '');
    }

    if (rawValue.length > 2) {
      rawValue = rawValue.slice(0, 2) + '-' + rawValue.slice(2);
    }
    if (rawValue.length > 11) {
      rawValue = rawValue.slice(0, 11) + '-' + rawValue.slice(11);
    }

    this.fg.get('cuil')?.setValue(rawValue, { emitEvent: false });
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
