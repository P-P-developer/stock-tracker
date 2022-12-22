import { Component } from '@angular/core';

import { LoaderService } from '@shared/services';

@Component({
  selector: 'st-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {
  constructor(public loaderService: LoaderService) {}
}
