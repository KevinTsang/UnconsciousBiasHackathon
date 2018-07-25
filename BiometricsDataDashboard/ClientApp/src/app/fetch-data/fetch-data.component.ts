import { Component, ViewEncapsulation, Input, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { gazeData } from './data/gazeLog';
import { mergedData } from './data/merged';
import { MedicalDataComponent } from './medical-data/medical-data.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-fetch-data',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.scss'],
})

export class FetchDataComponent implements OnInit, AfterViewInit{
  public data1: any[] = [];
  public data2: any[] = [];

  public chart = [];

  public ngOnInit() {
    var allLogs = JSON.parse(mergedData);
    var i;
    for (i = 0; i < allLogs.length; i++) {
      var log = allLogs[i];
      if (log['Pressure (mmHg)']) {
        this.data1.push({ 'x': log['ts'] / 1000, 'y': log['Pressure (mmHg)'] });
      }
      if (log['HeartRate (bpm)']) {
        this.data2.push({ 'x': log['ts'] / 1000, 'y': log['HeartRate (bpm)'] });
      }
    }
  }

  public ngAfterViewInit(): void {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: [new Date(2018, 7, 24, 10, 1, 1), new Date(2018, 7, 24, 10, 1, 5), new Date(2018, 7, 24, 10, 1, 10),
        new Date(2018, 7, 24, 10, 1, 15), new Date(2018, 7, 24, 10, 1, 20), new Date(2018, 7, 24, 10, 1, 25),
        new Date(2018, 7, 24, 10, 1, 30), new Date(2018, 7, 24, 10, 1, 35), new Date(2018, 7, 24, 10, 1, 40),
        new Date(2018, 7, 24, 10, 1, 45), new Date(2018, 7, 24, 10, 1, 50), new Date(2018, 7, 24, 10, 1, 55)],
        datasets: [
          {
            label: 'Hit',
            data: [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
            fill: false
          },
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Timestamp (Unix)",
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Hit (Boolean)",
            }
          }]
        }
      }
    });
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface HeartData {
  time: number;
  pulse: number;
}

interface OxygenData {
  time: number;
  oxygenLevel: number;
}

export class AreaChartConfig {
  settings: { fill: string, interpolation: string };
  dataset: Array<{ x: string, y: number }>
}
