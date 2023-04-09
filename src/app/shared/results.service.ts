import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private _results: BehaviorSubject<string> = new BehaviorSubject(<string>'');
  public readonly results: Observable<string> = this._results.asObservable();

  private _allResults: BehaviorSubject<string[]> = new BehaviorSubject(<string[]>[]);
  public readonly allResults: Observable<string[]> = this._allResults.asObservable();

  constructor() { }

  updateResults(result: string): void {
    this._results.next(result);
  }

  updateAllResults(result: string[]): void {
    this._allResults.next(result);
  }
}
