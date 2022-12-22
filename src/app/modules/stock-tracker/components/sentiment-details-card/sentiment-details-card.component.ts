import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { take } from 'rxjs/operators';

import { LoaderService } from '@shared/services';
import {
  AssetService,
  StockService,
  InsiderSentimentService,
} from 'src/app/modules/stock-tracker/services';

@Component({
  selector: 'st-sentiment-details-card',
  templateUrl: './sentiment-details-card.component.html',
  styleUrls: ['./sentiment-details-card.component.scss'],
})
export class SentimentDetailsCardComponent implements OnInit, OnDestroy {
  constructor(
    public assetService: AssetService,
    public loaderService: LoaderService,
    private _stockService: StockService,
    private _insiderSentimentService: InsiderSentimentService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._route.params.pipe(take(1)).subscribe(async (params: Params) => {
      const { symbol } = params;

      if (symbol) {
        this._stockService.removeAllStockData();
        this._stockService.loadRequiredStockDataByStockSymbol(symbol);
        this._insiderSentimentService.loadInsiderSentimentsOfLastThreeMonthsByStockSymbol(
          symbol
        );
      }
    });
  }

  ngOnDestroy(): void {
    // Remove everything when leaving the component
    this._stockService.removeAllStockData();
    this._insiderSentimentService.resetData();
  }
}
