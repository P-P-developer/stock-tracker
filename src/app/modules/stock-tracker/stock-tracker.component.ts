import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'st-stock-tracker',
  templateUrl: './stock-tracker.component.html',
})
export class StockTrackerComponent {
  constructor(private _router: Router) {}

  /**
   * Check if the router url contains the specified route
   *
   * @param {string} route
   * @returns
   * @memberof MyComponent
   */
  hasRoute(route: string): boolean {
    return this._router.url.includes(route);
  }
}
