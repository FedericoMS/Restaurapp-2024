import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.page.html',
  styleUrls: ['./dona.page.scss'],
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
export class DonaPage implements OnInit {
  @Input() values: number[] = [];
  @Input() keys: string[] = [];
  @Input() question: string = '';
  chart?: Chart;

  constructor() {}

  ngOnInit() {
    this.crearChart();
  }

  crearChart() {
    const labels = this.keys.slice(0, 7);

    // datos
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Cantidad',
          data: this.values.slice(0, 7),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(201, 203, 207, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(255, 159, 64)',
          ],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };

    // Opciones para estilizar el gráfico
    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#fff', // Color de las etiquetas de la leyenda
          },
        },
      },
      layout: {
        padding: 20, // Añadir algo de padding alrededor
      },
      backgroundColor: 'transparent', // Fondo transparente
    };

    // Creamos la gráfica
    this.chart = new Chart('chart', {
      type: 'doughnut' as ChartType, // Tipo de gráfica
      data, // Datos
      options, // Opciones para estilizar
    });
  }
}
