import { Component, Input } from '@angular/core';
import { LoaderService } from '@shared/services';

@Component({
  selector: 'st-social-sentiment-details-button',
  templateUrl: './social-sentiment-details-button.component.html',
  styleUrls: ['./social-sentiment-details-button.component.scss'],
})
export class SocialSentimentDetailsButtonComponent {
  @Input() onStockSymbol = '';

  constructor(public loaderService: LoaderService) {}
}
