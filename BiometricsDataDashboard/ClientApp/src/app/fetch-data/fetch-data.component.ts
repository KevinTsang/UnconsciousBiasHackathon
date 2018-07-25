import { Component, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { gazeData} from './data/gazeLog';
import { mergedData} from './data/merged';

@Component({
    selector: 'app-fetch-data',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './fetch-data.component.html',
    styleUrls: ['./fetch-data.component.scss']
})

export class FetchDataComponent{
  public title : string = 'Blood Pressure & Heart Rate Line Chart';

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;

  private yRight: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  private line2: d3Shape.Line<[number, number]>;
  private legendSpace = 200;
  private legendHeight = 20;
  private legendWidth = 35;

  public data1: any[] = [];

  public data2: any[] = [];

  constructor() {
      this.width = 900 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
      console.log(gazeData);
      var allLogs = JSON.parse(mergedData);
      var i;
      for (i = 0; i < allLogs.length; i++)
      {
          var log = allLogs[i];
          if (log['Pressure (mmHg)'])
          {
              this.data1.push({'ts': log['ts'], 'Pressure (mmHg)': log['Pressure (mmHg)']}); 
          }
          if (log['HeartRate (bpm)'])
          {
              this.data2.push({'ts': log['ts'], 'HeartRate (bpm)': log['HeartRate (bpm)']});
          }
      }
      this.initSvg();
      this.initAxis();
      this.drawAxis();
      this.drawLine();
  }

  private initSvg() {
      this.svg = d3.select('svg')
          .append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
      this.x = d3Scale.scaleLinear().range([0, this.width]);
      this.y = d3Scale.scaleLinear().range([this.height, 0]);
      this.yRight = d3Scale.scaleLinear().range([this.height, 0]);
      var range = d3Array.extent(this.data1, (d) => d['ts']  / 1000)
      this.x.domain([range[0]-10, range[1]+10]);
      range = d3Array.extent(this.data1, (d) => d['Pressure (mmHg)']);
      this.y.domain([range[0]-10, range[1]+10]);
      range = d3Array.extent(this.data2, (d) => d['HeartRate (bpm)'])
      this.yRight.domain([range[0]-10, range[1]+10]);
  }

  private drawAxis() {
      this.svg.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3Axis.axisBottom(this.x))
          .append('text')
          .attr('y', 15)
          .attr('x', 25)
          .attr('class', 'axis-title')
          .style('text-anchor', 'end')
          .text('Time (s)');

      this.svg.append('g')
          .attr('class', 'axis axis--y')
          .call(d3Axis.axisLeft(this.y))
          .attr('transform', 'translate(' + this.width.toString() +',0)')
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', 10)
          .attr('x', 5)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Blood Pressure (mmHg)');

      this.svg.append('g')
          .attr('class', 'axis axis--y')
          .call(d3Axis.axisRight(this.yRight))
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', -15)
          .attr('x', 5)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Heart Rate (bpm)');
  }

  
  private drawLine() {
      console.log(this.data1);
      this.line = d3Shape.line()
          .x( (d: any) => this.x(d['ts'] / 1000) )
          .y( (d: any) => this.y(d['Pressure (mmHg)']) );

      this.svg.append('path')
          .datum(this.data1)
          .attr('class', 'line')
          .attr('d', this.line);

      var legend1 = this.svg.append("g")
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (this.width - this.legendSpace) + ',' + 0 + ')');

      legend1.append('rect')
          .attr('width', this.legendWidth)
          .attr('height', this.legendHeight)
          .style('fill', 'orange');

      legend1.append('text')
          .attr('x', this.legendWidth)
          .attr('y', this.legendHeight-5)
          .text('Blood Pressure');

      var legend1 = this.svg.append("g")
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (this.width - this.legendSpace) + ',' + 0 + ')');


      console.log(this.data1);
      console.log(this.data2);
      this.line2 = d3Shape.line()
      .x( (d: any) => this.x(d['ts'] / 1000) )
      .y( (d: any) => this.yRight(d['HeartRate (bpm)']) );

      this.svg.append("path")
          .datum(this.data2)
          .attr('class', 'line')
          .style("stroke", "orange")
          .attr("d", this.line2);

      var legend2 = this.svg.append("g")
              .attr('class', 'legend')
              .attr('transform', 'translate(' + (this.width - this.legendSpace) + ',' + 30 + ')');

      legend2.append('rect')
          .attr('width', this.legendWidth)
          .attr('height', this.legendHeight)
          .style('fill', 'blue');

      legend2.append('text')
          .attr('x', this.legendWidth)
          .attr('y', this.legendHeight-5)
          .text('Heart Rate');
      
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
