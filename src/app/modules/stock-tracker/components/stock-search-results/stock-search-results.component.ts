import { CompanyStockDetails } from 'src/app/modules/stock-tracker/models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  QuoteService,
  AssetService,
  StockService,
} from 'src/app/modules/stock-tracker/services';

@Component({
  selector: 'st-stock-search-results',
  templateUrl: './stock-search-results.component.html',
  styleUrls: ['./stock-search-results.component.scss'],
})
export class StockSearchResultsComponent implements OnInit, OnDestroy {
  constructor(
    public quoteService: QuoteService,
    public assetService: AssetService,
    private _stockService: StockService
  ) {}

  ngOnInit(): void {
    this._stockService.loadStockDataByStockSymbolsInLocalStorage();
  }

  ngOnDestroy(): void {
    this._stockService.destroySubscriptions();
  }

  removeStockFromList(stockSymbol: string): void {
    this._stockService.removeStockByStockSymbol(stockSymbol);
  }

  trackByFn(index: number, item: CompanyStockDetails): string {
    return item.symbol; // unique value corresponding to the item
  }
}
