import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-torta',
  templateUrl: './torta.page.html',
  styleUrls: ['./torta.page.scss'],
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
export class TortaPage implements OnInit {
  chart?: Chart;
  @Input() values: number[] = [];
  @Input() keys: string[] = [];
  @Input() question: string = '';
  constructor() {}

  ngOnInit() {
    this.crearChart();
  }

  crearChart() {
    // Datos
    const data = {
      labels: this.keys,
      datasets: [
        {
          label: 'Cantidad',
          data: [15, 15, 22, 26].slice(0, 7),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(201, 203, 207, 0.8)',
          ],
          borderColor: [
            'rgba(255, 255, 255, 1)', // Bordes blancos para mejor visibilidad
          ],
          borderWidth: 2, // Grosor de los bordes
          hoverOffset: 4, // Efecto de desplazamiento al hacer hover
        },
      ],
    };

    // Opciones para estilizar el gráfico
    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#fff', // Color blanco para las etiquetas de la leyenda
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro para los tooltips
          titleColor: '#fff', // Color de texto en los tooltips
          bodyColor: '#fff',
        },
      },
      layout: {
        padding: 20, // Padding alrededor del gráfico
      },
      backgroundColor: 'transparent', // Fondo transparente
    };

    // Creamos la gráfica
    this.chart = new Chart('chart', {
      type: 'pie' as ChartType, // Tipo de gráfica de torta
      data, // Datos
      options, // Opciones para el diseño
    });
  }
}
