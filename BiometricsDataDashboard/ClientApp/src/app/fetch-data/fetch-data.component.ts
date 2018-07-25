import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { gazeData} from './data/gazeLog';
import { mergedData} from './data/merged';
import { MedicalDataComponent } from './medical-data/medical-data.component';

@Component({
    selector: 'app-fetch-data',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './fetch-data.component.html',
    styleUrls: ['./fetch-data.component.scss'],
})

export class FetchDataComponent implements OnInit{
  public data1: any[] = [];
  public data2: any[] = [];
  
  public ngOnInit() {
    var allLogs = JSON.parse(mergedData);
    var i;
    for (i = 0; i < allLogs.length; i++)
    {
        var log = allLogs[i];
        if (log['Pressure (mmHg)'])
        {
            this.data1.push({'x': log['ts'] / 1000, 'y': log['Pressure (mmHg)']}); 
        }
        if (log['HeartRate (bpm)'])
        {
            this.data2.push({'x': log['ts'] / 1000, 'y': log['HeartRate (bpm)']});
        }
    }
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
