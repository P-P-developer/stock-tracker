import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { FinnhubService } from './finnhub.service';
import { CompanyStockDetails } from 'src/app/modules/stock-tracker/models';
import { NotificationService } from '@shared/services/notification.service';

@Injectable()
export class AssetService {
  constructor(
    private _finnHubService: FinnhubService,
    private _notificationService: NotificationService
  ) {
    this._assets$ = new BehaviorSubject<CompanyStockDetails[]>([]);
    this._assetsFound$ = new Subject<void>();
  }

  private _assets$: BehaviorSubject<CompanyStockDetails[]>;
  public get assets$(): Observable<CompanyStockDetails[]> {
    return this._assets$.asObservable();
  }

  private _assetsFound$: Subject<void>;
  public get assetsFound$(): Observable<void> {
    return this._assetsFound$.asObservable();
  }

  loadAssetForStockSymbol(stockSymbol: string): void {
    this._finnHubService
      .getCompanyStockDetailsByStockSymbol(stockSymbol)
      .pipe(take(1))
      .subscribe(
        (assets) => {
          const assetToShow = assets.result.find(
            (asset) => asset.symbol === stockSymbol
          );

          if (!assetToShow) {
            this._notificationService.showNotification(
              `Could not find any stock with the symbol ${stockSymbol}!`
            );
            return;
          }

          this._assets$.next([assetToShow, ...this._assets$.value]);
          this._assetsFound$.next();
        },
        (error: HttpErrorResponse) => {
          this._notificationService.showNotification(
            `Could not get assets for the stock symbol ${stockSymbol}! Reason "${error.message}"`
          );
        }
      );
  }

  removeAssetByStockSymbol(stockSymbol: string): void {
    this._assets$.next(
      this._assets$.getValue().filter((asset) => asset.symbol !== stockSymbol)
    );
  }

  removeAllAssets(): void {
    this._assets$.next([]);
  }

  orderAssetsByStockSymbolList(stockSymbolList: string[]): void {
    const sortedResults = this._assets$.value.sort(
      (asset1, asset2) =>
        stockSymbolList.indexOf(asset1.symbol) -
        stockSymbolList.indexOf(asset2.symbol)
    );
    this._assets$.next(sortedResults);
  }

  assetExistInListByStockSymbol(stockSymbol: string): boolean {
    return (
      this._assets$.value.find((asset) => asset.symbol === stockSymbol) !==
      undefined
    );
  }
}
