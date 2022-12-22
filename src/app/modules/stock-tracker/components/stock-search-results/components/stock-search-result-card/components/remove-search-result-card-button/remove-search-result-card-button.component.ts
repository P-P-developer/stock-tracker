import { LoaderService } from '@shared/services';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'st-remove-search-result-card-button',
  templateUrl: './remove-search-result-card-button.component.html',
  styleUrls: ['./remove-search-result-card-button.component.scss'],
})
export class RemoveSearchResultCardButtonComponent {
  @Input() onStockSymbol = '';
  @Output() removeStockCardButtonClick = new EventEmitter();

  constructor(public loaderService: LoaderService) {}

  removeStockCard(): void {
    this.removeStockCardButtonClick.emit();
  }
}
