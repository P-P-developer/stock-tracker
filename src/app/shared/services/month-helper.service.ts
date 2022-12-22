import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MonthHelperService {
  private readonly datePipe: DatePipe = new DatePipe('en-US');

  convertNumberToMonthName(monthNumber: number): string {
    switch (monthNumber) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        return '';
    }
  }

  getFirstDateOfMonthFromCurrentYear(monthNumber: number): string {
    const now = new Date();
    const firstDateOfMonth = new Date(now.getFullYear(), monthNumber, 1);
    return this.datePipe.transform(firstDateOfMonth, 'YYYY-MM-dd') ?? '';
  }
}
