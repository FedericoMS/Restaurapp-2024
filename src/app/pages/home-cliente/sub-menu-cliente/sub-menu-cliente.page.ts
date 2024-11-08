import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFabList,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-sub-menu-cliente',
  templateUrl: './sub-menu-cliente.page.html',
  styleUrls: ['./sub-menu-cliente.page.scss'],
  standalone: true,
  imports: [
    IonFabButton,
    IonFab,
    IonFabList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class SubMenuClientePage implements OnInit {
  router = inject(Router);
  util = inject(UtilService);

  constructor() {}

  ngOnInit() {}

  realizarEncuesta() {
    this.router.navigateByUrl('/encuesta-clientes');
  }

  estadoPedido() {
    this.util.estadoPedido();
  }
}
