import { Component } from '@angular/core';
import { LoaderService } from '@shared/services';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  constructor(public loaderService: LoaderService) {}
}
