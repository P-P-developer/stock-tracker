import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { StockService } from 'src/app/modules/stock-tracker/services';

@Component({
  selector: 'st-stock-enter-card',
  templateUrl: './stock-enter-card.component.html',
  styleUrls: ['./stock-enter-card.component.scss'],
})
export class StockEnterCardComponent implements AfterContentChecked {
  stockSymbolForm = new FormControl(undefined);

  constructor(
    public stockService: StockService,
    private _cdref: ChangeDetectorRef
  ) {}

  receiveFormControl(formControl: FormControl): void {
    this.stockSymbolForm = formControl;
  }

  ngAfterContentChecked(): void {
    this._cdref.detectChanges();
  }
}
