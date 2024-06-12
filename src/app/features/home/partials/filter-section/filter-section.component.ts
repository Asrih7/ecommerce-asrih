import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss']
})
export class FilterSectionComponent implements OnInit, OnDestroy {
  @ViewChild('map', { static: true }) mapContainer: ElementRef;
  public listCountries: any[] = [];
  public typeMap = 'country'
  public popup: any;
  public countryMapInfo: any[] = [];
  public regionMapInfo: any[] = [];
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private generateInformationMap: GenerateInformationsService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.generateInformationMap.getCountryMapInfos().pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.countryMapInfo = data;
    });

    this.generateInformationMap.getRegionMapInfos().pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.regionMapInfo = data;
    });

    this.createMap();
  }

  createMap() {
    const width = 900;
    const height = 450;

    if (this.mapContainer) {
      const svg = d3.select(this.mapContainer.nativeElement)
        .append('svg')
        .attr("viewBox", [0, 0, width, height])
        .attr('width', width)
        .attr('height', height)
        .attr("style", "max-width: 100%; height: auto;")

      const projection = d3.geoMercator()
        .scale(130)
        .translate([450, 300]);

      const path: any = d3.geoPath().projection(projection);
      d3.json('./../../../../../assets/geo.json').then((json: any) => {
        svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', (d: any) => d.properties.subregion.replaceAll(' ', '___'))
          .style('fill', '#e8e8e8')
          .on('mouseover', (event: any, d: any) => {
            const xy = { x: event.pageX, y: event.pageY };
            if (this.typeMap == 'country') {
              let activeCountry = this.countryMapInfo?.find((info: any) => info.country == d.properties.iso_a2_eh);
              d3.select(event.target)
                .style('fill', '#f8c43d')
                .style('cursor', 'pointer');
              this.showPopup(xy, 'C', d, activeCountry);
            } else {
              let activeRegion = this.regionMapInfo?.find((info: any) => info.subregion?.translations['en'].subregion == d.properties.subregion);
              const cls = d.properties.subregion.replaceAll(' ', '___');
              d3.selectAll(`.${cls}`)
                .style('fill', '#f8c43d')
                .style('cursor', 'pointer');
              this.showPopup(xy, 'R', d, activeRegion);
            }
          })
          .on('mouseout', (event: any, d: any) => {
            if (this.typeMap == 'country') {
              d3.select(event.target)
                .style('fill', '#e8e8e8'); // Restore original color on mouseout
            } else {
              const cls = d.properties.subregion.replaceAll(' ', '___');
              d3.selectAll(`.${cls}`)
                .style('fill', '#e8e8e8');
            }

            this.hidePopup();
          })
          .on('click', (event: any, d: any) => {
            this.hidePopup();
            d3.select(event.target)
              .style('cursor', 'pointer');
            this.showProducts(d)
          })
      });
    }
  }

  showPopup(xy: any, type: 'R' | 'C', d: any, properties: any) {
    if (properties) {
      const info =
        `
        <div class="pb-2">
        ${type == 'C' ? '<span class="fi fi-' + properties.country.toLowerCase() + '"></span>' : '<span class="map-dot">■</span>'}
        ${type == 'C' ? d.properties['name_' + this.translate.currentLang] : properties.subregion?.translations[this.translate.currentLang]?.subregion}
        </div>
        <b>${this.translate.instant('home.map.nbr_shops')} : </b>${properties.nb_shops}<br>
        <b>${this.translate.instant('home.map.nbr_products')} : </b>${properties.nb_products}
        `;

      this.popup = d3.select("body")
        .append('div')
        .attr('class', 'map-popup')
        .style('left', `${xy.x - 50}px`)
        .style('top', `${xy.y + 30}px`)
        .html(info);
    }
  }

  hidePopup() {
    if (this.popup) {
      this.popup.remove();
    }
  }

  showProducts(d: any) {
    let query = '';

    if (this.typeMap == 'country') {
      query = `inspiration_country=${d.properties.iso_a2_eh}`;
    } else {
      let activeRegion = this.regionMapInfo?.find((info: any) => info.subregion?.translations['en'].subregion == d.properties.subregion);
      (activeRegion.country_list ?? []).forEach((country: string) => {
        query += `${!query ? '' : '&'}inspiration_country=${country}`;
      });
    }

    this.router.navigate([`products/`, { query }]);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

