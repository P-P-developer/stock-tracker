import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { InsiderSentimentResult } from 'src/app/modules/stock-tracker/models';
import { FinnhubService } from './finnhub.service';
import { NotificationService } from '@shared/services/notification.service';

@Injectable()
export class InsiderSentimentService {
  constructor(
    private _finnhubService: FinnhubService,
    private _notificationService: NotificationService
  ) {
    this._insiderSentiments$ = new BehaviorSubject<
      InsiderSentimentResult | undefined
    >(undefined);
  }

  private _insiderSentiments$: BehaviorSubject<
    InsiderSentimentResult | undefined
  >;
  public get insiderSentiments$(): Observable<
    InsiderSentimentResult | undefined
  > {
    return this._insiderSentiments$.asObservable();
  }

  loadInsiderSentimentsOfLastThreeMonthsByStockSymbol(
    stockSymbol: string
  ): void {
    this._finnhubService
      .getInsiderSentimentFromLastThreeMonths(stockSymbol)
      .pipe(take(1))
      .subscribe(
        (insiderSentimentsResult) => {
          this.addMissingMonthsWithEmptyData(
            stockSymbol,
            insiderSentimentsResult
          );
          this._insiderSentiments$.next(insiderSentimentsResult);
        },
        (error: HttpErrorResponse) => {
          this._notificationService.showNotification(
            `Could not get insider sentiment details for the stock symbol ${stockSymbol}! Reason "${error.message}"`
          );
        }
      );
  }

  resetData(): void {
    this._insiderSentiments$.next(undefined);
  }

  private addMissingMonthsWithEmptyData(
    stockSymbol: string,
    insiderSentimentsResult: InsiderSentimentResult
  ): InsiderSentimentResult {
    // Check if the API doesnt return data from the last three months
    if (insiderSentimentsResult && insiderSentimentsResult.data.length < 3) {
      const lastElement =
        insiderSentimentsResult.data[insiderSentimentsResult.data.length - 1];

      let currentMonth = lastElement.month ?? 0;

      // Add empty data for missing months
      for (
        let index = insiderSentimentsResult.data.length;
        index < 3;
        index++
      ) {
        insiderSentimentsResult.data.push({
          change: undefined,
          month: currentMonth + 1,
          mspr: undefined,
          symbol: stockSymbol,
          year: undefined,
        });
        currentMonth++;
      }
    }
    return insiderSentimentsResult;
  }
}
