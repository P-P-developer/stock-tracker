import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CompanyQuote } from 'src/app/modules/stock-tracker/models';
import { FinnhubService } from './finnhub.service';
import { NotificationService } from '@shared/services/notification.service';

@Injectable()
export class QuoteService {
  constructor(
    private _finnHubService: FinnhubService,
    private _notificationService: NotificationService
  ) {
    this._quotes$ = new BehaviorSubject<CompanyQuote[]>([]);
  }

  private _quotes$: BehaviorSubject<CompanyQuote[]>;
  public get quotes$(): Observable<CompanyQuote[]> {
    return this._quotes$.asObservable();
  }

  loadQuoteForStockSymbol(stockSymbol: string): void {
    this._finnHubService
      .getQuote(stockSymbol)
      .pipe(take(1))
      .subscribe(
        (quote) => {
          quote.stockSymbol = stockSymbol;
          this._quotes$.next([quote, ...this._quotes$.value]);
        },
        (error: HttpErrorResponse) => {
          this._notificationService.showNotification(
            `Could not get quotes for the stock symbol ${stockSymbol}! Reason "${error.message}"`
          );
        }
      );
  }

  quoteAlreadyLoaded(stockSymbol: string): boolean {
    console.log(this._quotes$.value);
    return (
      this._quotes$.value.find((quote) => quote.stockSymbol === stockSymbol) !==
      undefined
    );
  }

  removeQuoteByStockSymbol(stockSymbol: string): void {
    this._quotes$.next(
      this._quotes$
        .getValue()
        .filter((quote) => quote.stockSymbol !== stockSymbol)
    );
  }

  removeAllQuotes(): void {
    this._quotes$.next([]);
  }

  getQuoteByStockSymbol(stockSymbol: string): CompanyQuote | undefined {
    return this._quotes$.value.find(
      (quote) => quote.stockSymbol === stockSymbol
    );
  }
}
