import { Component, Input } from '@angular/core';
import { CompanyStockDetails } from 'src/app/modules/stock-tracker/models';

@Component({
  selector: 'st-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyStockDetailsComponent {
  @Input() CompanyStockDetails: CompanyStockDetails = {
    description: '',
    displaySymbol: '',
    symbol: '',
    type: '',
  };
}
