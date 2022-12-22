import {
  CompanyQuote,
  CompanyStockDetails,
} from 'src/app/modules/stock-tracker/models';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StockService } from 'src/app/modules/stock-tracker/services';

@Component({
  selector: 'st-stock-search-result-card',
  templateUrl: './stock-search-result-card.component.html',
  styleUrls: ['./stock-search-result-card.component.scss'],
})
export class StockSearchResultCardComponent {
  constructor(public stockService: StockService) {}
  @Input() onCompanyStockDetails: CompanyStockDetails = {
    description: '',
    displaySymbol: '',
    symbol: '',
    type: '',
  };

  @Input() onCompanyQuote: CompanyQuote | undefined = undefined;

  @Output() removeStockCardButtonClick = new EventEmitter();

  removeStockCard(): void {
    this.removeStockCardButtonClick.emit();
  }
}
