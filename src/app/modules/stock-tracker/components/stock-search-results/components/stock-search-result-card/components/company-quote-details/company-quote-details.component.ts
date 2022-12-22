import { NumberHelperService } from '@shared/services/';
import { Component, Input } from '@angular/core';
import { CompanyQuote } from 'src/app/modules/stock-tracker/models';

@Component({
  selector: 'st-company-quote-details',
  templateUrl: './company-quote-details.component.html',
  styleUrls: ['./company-quote-details.component.scss'],
})
export class CompanyQuoteDetailsComponent {
  @Input() companyQuote!: CompanyQuote;

  constructor(public numberHelperService: NumberHelperService) {}
}
