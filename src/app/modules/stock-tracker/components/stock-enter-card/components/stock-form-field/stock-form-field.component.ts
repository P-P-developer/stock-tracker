import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'st-stock-form-field',
  templateUrl: './stock-form-field.component.html',
  styleUrls: ['./stock-form-field.component.scss'],
})
export class StockFormFieldComponent {
  @Output() stockSymbolFormControlChange = new EventEmitter<FormControl>();

  stockSymbolFormControl = new FormControl(undefined, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(5),
  ]);

  getErrorMessage(): string {
    // If there are any errors, then return a errorMessage and emit the formcontrol to the parent
    if (this.stockSymbolFormControl.errors != null) {
      this.stockSymbolFormControlChange.emit(this.stockSymbolFormControl);
      return 'Please enter a stock symbol that is between 1 to 5 letters';
    }
    return '';
  }
}
