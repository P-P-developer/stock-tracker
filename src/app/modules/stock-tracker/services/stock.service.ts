import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocalStorageKeys } from '@shared/models';
import { NotificationService } from '@shared/services';
import { AssetService } from './asset.service';
import { QuoteService } from './quote.service';

@Injectable()
export class StockService {
  private _unsubscribe: Subject<void> = new Subject<void>();
  private _stockSymbolList: string[] = [];
  constructor(
    private _quoteService: QuoteService,
    private _assetService: AssetService,
    private _notificationService: NotificationService
  ) {}

  loadStockDataByStockSymbolsInLocalStorage(): void {
    const stockSymbolList: string[] = JSON.parse(
      localStorage.getItem(LocalStorageKeys.stockSymbolList) ?? '[]'
    );

    this._stockSymbolList = stockSymbolList;

    stockSymbolList.forEach((stockSymbol) => {
      this.loadRequiredStockDataByStockSymbol(stockSymbol);
    });
  }

  searchStockByStockSymbol(stockSymbol: string): void {
    stockSymbol = stockSymbol.toUpperCase();

    // Add local storage item for currentStockSymbolToSearch
    this.addCurrentStockSymbolToSearchToLocalStorage(stockSymbol);

    // If the current stock symbol was already added then skip this part
    if (this.stockSymbolAlreadyExistInList(stockSymbol)) {
      this._notificationService.showNotification(
        'The stock you are looking for has already been added!'
      );
      return;
    }

    // Load required data for a stock by the stock symbol
    this.loadRequiredStockDataByStockSymbol(stockSymbol);
  }

  loadRequiredStockDataByStockSymbol(stockSymbol: string): void {
    // load asset for current stock symbol
    this._assetService.loadAssetForStockSymbol(stockSymbol);
    // load quote for current stock symbol
    this._quoteService.loadQuoteForStockSymbol(stockSymbol);

    this._assetService.assetsFound$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        this._assetService.orderAssetsByStockSymbolList(this._stockSymbolList);

        // If the current stock symbol was already added/loaded then skip this part
        if (
          this.stockSymbolAlreadyExistInList(stockSymbol) ||
          !this._assetService.assetExistInListByStockSymbol(stockSymbol)
        ) {
          return;
        }

        // Push new stock symbol to the list
        this.addNewStockSymbolToList(stockSymbol);

        // Add stock symbol to the local storage list
        this.addStockSymbolToLocalStorageList(stockSymbol);
      });
  }

  removeAllStockData(): void {
    this._assetService.removeAllAssets();
    this._quoteService.removeAllQuotes();
  }

  removeStockByStockSymbol(stockSymbol: string): void {
    this._assetService.removeAssetByStockSymbol(stockSymbol);
    this._quoteService.removeQuoteByStockSymbol(stockSymbol);
    this._stockSymbolList = this._stockSymbolList.filter(
      (stockSymbolItem) => stockSymbolItem !== stockSymbol
    );
    localStorage.setItem(
      LocalStorageKeys.stockSymbolList,
      JSON.stringify(this._stockSymbolList)
    );
  }

  destroySubscriptions(): void {
    this._unsubscribe.next();
  }

  private addStockSymbolToLocalStorageList(stockSymbol: string): void {
    const stockSymbolList: string[] = JSON.parse(
      localStorage.getItem(LocalStorageKeys.stockSymbolList) ?? '[]'
    );

    if (stockSymbolList.indexOf(stockSymbol) === -1) {
      stockSymbolList.push(stockSymbol);
    }

    this._stockSymbolList = stockSymbolList;

    localStorage.setItem(
      LocalStorageKeys.stockSymbolList,
      JSON.stringify(this._stockSymbolList)
    );
  }

  private addCurrentStockSymbolToSearchToLocalStorage(
    stockSymbol: string
  ): void {
    localStorage.setItem(
      LocalStorageKeys.currentStockSymbolToSearch,
      stockSymbol
    );
  }

  private stockSymbolAlreadyExistInList(stockSymbol: string): boolean {
    return (
      this._stockSymbolList.find(
        (stockSymbolItem) => stockSymbolItem === stockSymbol
      ) !== undefined
    );
  }

  private addNewStockSymbolToList(stockSymbol: string): void {
    this._stockSymbolList.push(stockSymbol);
  }
}
