import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = false;

  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  get isLoading(): boolean {
    return this.loading;
  }
}
