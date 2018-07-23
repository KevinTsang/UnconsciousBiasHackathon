import { Component, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as D3 from 'd3/index';
import * as Moment from 'moment';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];
  @Input() config: Array<AreaChartConfig>;

  private host; // D3 object referencing host dom object
  private svg; // SVG in which we will print our chart
  private margin; // Space between the svg borders and the actual chart graphic
  private width; // Component width
  private height; // Component height
  private xScale; // D3 scale in X
  private yScale; // D3 scale in Y
  private xAxis; // D3 X Axis
  private yAxis; // D3 Y Axis
  private htmlElement; // Host HTMLElement

  /* Constructor, needed to get @Injectables */
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<WeatherForecast[]>(baseUrl + 'api/SampleData/WeatherForecasts').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));
  }

  /* Will Update on every @Input change */
  ngOnChanges(): void {
    if (!this.config || this.config.length === 0) return;
    this.setup();
    this.buildSVG();
    this.populate();
    this.drawXAxis();
    this.drawYAxis();
  }

  /* Will setup the chart container */
  private setup(): void {
    this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
    this.width = this.htmlElement.clientWidth - this.margin.left - this.margin.right;
    this.height = this.width * 0.5 - this.margin.top - this.margin.bottom;
    this.xScale = D3.time.scale().range([0, this.width]);
    this.yScale = D3.scale.linear().range([this.height, 0]);
  }

  /* Will build the SVG Element */
  private buildSVG(): void {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ') ');
  }

  /* Will draw the X Axis */
  private drawXAxis(): void {
    this.xAxis = D3.svg.axis().scale(this.xScale)
      .tickFormat(t => Moment(t).format('MMM').toUpperCase())
      .tickPadding(15);
    this.svg.append('g')
      .attr('class ', 'x axis')
      .attr('transform', 'translate(0, ' + this.height + ') ')
      .call(this.xAxis);
  }

  /* Will draw the Y Axis */
  private drawYAxis(): void {
    this.yAxis = D3.svg.axis().scale(this.yScale)
      .orient('left')
      .tickPadding(10);
    this.svg.append('g')
      .attr('class ', 'y axis')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90) ');
  }

  /**
  * Will return the maximum value in any dataset inserted, so we use
  * it later for the maximum number in the Y Axis
  **/
  private getMaxY(): number {
    let maxValuesOfAreas = [];
    this.config.forEach(data => maxValuesOfAreas.push(Math.max.apply(Math, data.dataset.map(d => d.y))));
    return Math.max(...maxValuesOfAreas);
  }
  
  /* Will populate datasets into areas*/
  private populate(): void {
    this.config.forEach((area: any) => {
      this.xScale.domain(D3.extent(area.dataset, (d: any) => d.x));
      this.yScale.domain([0, this.getMaxY()]);
      this.svg.append('path')
        .datum(area.dataset)
        .attr('class ', 'area')
        .style('fill', area.settings.fill)
        .attr('d', D3.svg.area()
          .x((d: any) => this.xScale(d.x))
          .y0(this.height)
          .y1((d: any) => this.yScale(d.y))
          .interpolate(area.settings.interpolation));
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
