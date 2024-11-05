import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonRow, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonList, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CartaPage implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  filtroActual: string = 'todo';
  total: number = 0;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.firestoreService.getCollection('productos').valueChanges().subscribe((data: any) => {
      this.productos = data;
      this.filtrarProductos();
    });
  }

  filtrarProductos() {
    if (this.filtroActual === 'todo') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto => producto.tipo === this.filtroActual);
    }
  }

  agregarProducto(producto: any) {
    this.total += producto.precio;
  }

  quitarProducto(producto: any) {
    if (this.total >= producto.precio) {
      this.total -= producto.precio;
    }
  }
  
}


