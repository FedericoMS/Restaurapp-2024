import { Component, OnInit } from '@angular/core';
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
  IonButton,
  IonIcon,
  IonSegmentButton,
  IonLabel,
  IonSegment,
  IonButtons,
} from '@ionic/angular/standalone';
import { EstadoAprobacion, Usuario } from 'src/app/clases/usuario';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { addIcons } from 'ionicons';
import {
  arrowBackCircleOutline,
  cameraOutline,
  checkmark,
  closeOutline,
  qrCodeOutline,
} from 'ionicons/icons';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonSegment,
    IonLabel,
    IonSegmentButton,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
})
export class AltaClientePage implements OnInit {
  fg!: FormGroup;
  list_roles = Usuario.get_roles();
  foto_url: string = '';
  img?: string = '';
  isLoading: boolean;

  constructor(
    private firestore: FirestoreService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    addIcons({
      qrCodeOutline,
      cameraOutline,
      closeOutline,
      checkmark,
      arrowBackCircleOutline,
    });
    this.isLoading = true;
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
      rol: [this.list_roles[6]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required]],
      contraseniaRepetida: ['',[Validators.required]],
      img: ['',[Validators.required]],
      
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  async cargarConQr() {
    const datos = await this.utilService.scan_dni();
    if (datos) {
      this.fg.controls['nombre'].setValue(datos.nombre);
      this.fg.controls['apellido'].setValue(datos.apellido);
      this.fg.controls['dni'].setValue(datos.dni);
    } else {
      this.userService.showToast(
        'Ocurrió un error. ' + 'Vuelva a intentar más tarde',
        'red',
        'center',
        'error',
        'white',
        true
      );
    }
  }

  async cargar() {
    if (
      this.fg.valid ||
      (this.fg.controls['rol'].value == 'anonimo' &&
        this.fg.controls['nombre'].value !== '')
    ) {

      if (this.fg.controls['contrasenia'].value !== this.fg.controls['contraseniaRepetida'].value) {
        this.userService.showToast(
          'Las contraseñas no coinicden, reingresar!',
          'red',
          'center',
          'error',
          'white',
          true
        );
      }
      else{
        this.isLoading = true;
        await this.upload_storage();
        let user;
        if (this.fg.controls['rol'].value == 'cliente') {
          user = new Usuario(
            this.fg.controls['nombre'].value,
            this.fg.controls['apellido'].value,
            this.fg.controls['dni'].value,
            '',
            this.foto_url,
            this.fg.controls['rol'].value,
            EstadoAprobacion.Pendiente,
            this.fg.controls['correo'].value,
            this.fg.controls['contrasenia'].value
          );
        } else {
          user = new Usuario(
            this.fg.controls['nombre'].value,
            '',
            0,
            '',
            this.foto_url,
            this.fg.controls['rol'].value,
            EstadoAprobacion.Pendiente
          );
        }
        this.userService
          .createUser(user)
          .then(() => {
            this.fg.patchValue({
              rol: this.fg.controls['rol'].value,
            });
            this.emptyInputs();
            this.isLoading = false;
            this.router.navigate(['/login']);
          })
          .catch(() => {
            this.userService.showToast(
              'Hubo un problema al cargar el ' + this.fg.controls['rol'].value,
              'red',
              'center',
              'error',
              'white',
              true
            );
            this.isLoading = false;
          });
      }
      
    } else {
      this.userService.showToast(
        'Ocurrió un error. ' +
          'Verifique que todos los campos estén completos sin errores',
        'red',
        'center',
        'error',
        'white',
        true
      );
      Object.keys(this.fg.controls).forEach((controlName) => {
        this.fg.controls[controlName].markAsTouched();
      });
    }
  }

  async sacar_foto() {
    try {
      this.img = await this.utilService.sacar_foto();
      this.fg.get('img')?.setValue(this.img ?? '');
      this.userService.showToast(
        'Se cargó la foto',
        'lightgreen',
        'center',
        'success',
        'black'
      );
    } catch (error) {
      console.log(error);
    }
  }

  async upload_storage() {
    if (this.img) {
      this.foto_url = await this.firestore.uploadImage(
        `imagenes_clientes/${Date.now()}`,
        this.img
      );
    }
  }
  emptyInputs() {
    this.fg.reset({
      rol: this.fg.get('rol')?.value,
      nombre: '',
      apellido: '',
      correo: '',
      contrasenia: '',
      dni: '',
    });

    Object.keys(this.fg.controls).forEach((key) => {
      const control = this.fg.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.updateValueAndValidity();
    });

    this.img = '';
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
