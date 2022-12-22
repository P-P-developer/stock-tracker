import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MonthHelperService } from '@shared/services';
import {
  CompanyStockDetailsResult,
  CompanyQuote,
  InsiderSentimentResult,
} from 'src/app/modules/stock-tracker/models';
import { environment } from './../../../../environments/environment';

@Injectable()
export class FinnhubService {
  constructor(
    private _monthHelper: MonthHelperService,
    private _http: HttpClient
  ) {}

  configUrl = 'https://finnhub.io/api/v1/';
  token = `&token=${environment.token}`;

  getCompanyStockDetailsByStockSymbol(
    search: string
  ): Observable<CompanyStockDetailsResult> {
    return this._http.get<CompanyStockDetailsResult>(
      `${this.configUrl}search?q=${search}${this.token}`
    );
  }

  getQuote(symbol: string): Observable<CompanyQuote> {
    return this._http.get<CompanyQuote>(
      `${this.configUrl}quote?symbol=${symbol}${this.token}`
    );
  }

  getInsiderSentimentFromLastThreeMonths(
    symbol: string
  ): Observable<InsiderSentimentResult> {
    const now = new Date();
    // Get the first date of the month from 3 months ago
    const firstMonth = this._monthHelper.getFirstDateOfMonthFromCurrentYear(
      now.getMonth() - 3
    );
    // Get the first date of the current month
    const lastMonth = this._monthHelper.getFirstDateOfMonthFromCurrentYear(
      now.getMonth()
    );
    return this._http.get<InsiderSentimentResult>(
      `${this.configUrl}stock/insider-sentiment?symbol=${symbol}&from=${firstMonth}&to=${lastMonth}${this.token}`
    );
  }
}
