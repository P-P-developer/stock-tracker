import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { StockTrackerComponent } from './stock-tracker.component';
import {
  StockEnterCardComponent,
  StockFormFieldComponent,
  StockTrackButtonComponent,
  StockSearchResultsComponent,
  StockSearchResultCardComponent,
  CompanyQuoteDetailsComponent,
  SocialSentimentDetailsButtonComponent,
  RemoveSearchResultCardButtonComponent,
  SentimentDetailsCardComponent,
  SentimentDetailsDataComponent,
  BackButtonComponent,
} from './components';
import {
  CompanyStockDetailsComponent,
  ArrowComponent,
} from './shared-components';
import {
  AssetService,
  FinnhubService,
  InsiderSentimentService,
  QuoteService,
  StockService,
} from './services';
import { StockTrackerRoutingModule } from './stock-tracker-routing.module';

@NgModule({
  declarations: [
    StockEnterCardComponent,
    StockFormFieldComponent,
    StockTrackButtonComponent,
    StockSearchResultsComponent,
    StockSearchResultCardComponent,
    CompanyQuoteDetailsComponent,
    CompanyStockDetailsComponent,
    SocialSentimentDetailsButtonComponent,
    RemoveSearchResultCardButtonComponent,
    SentimentDetailsCardComponent,
    StockTrackerComponent,
    ArrowComponent,
    BackButtonComponent,
    SentimentDetailsDataComponent,
  ],
  imports: [
    StockTrackerRoutingModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
  ],
  providers: [
    StockService,
    QuoteService,
    InsiderSentimentService,
    FinnhubService,
    AssetService,
  ],
})
export class StockTrackerModule {}
