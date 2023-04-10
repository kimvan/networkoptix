import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultsService } from '../shared/results.service';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.scss']
})
export class ViewResultsComponent {
  allResults$: Observable<string[]> = this.resultsService.allResults$;

  constructor(
    private resultsService: ResultsService,
  ) { }

}
