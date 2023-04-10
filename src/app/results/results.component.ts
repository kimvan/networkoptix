import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { ResultsService } from '../shared/results.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  
  results$: Observable<string> = this.resultsService.results$;
  form!: FormGroup;
  result!: string;

  constructor(
    private resultsService: ResultsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fileName: [{ value: null, disabled: false }, [Validators.required]],
    })

    // this.results$.subscribe(res => {
    //   this.result = res;
    // })

    this.results$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(res => {
      this.result = res;
    })
  }


  download(type = "text/plain"): void {
    const filename = this.form.get('fileName')?.value;

    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    a.href = window.URL.createObjectURL(
      new Blob([this.result], { type })
    );

    a.setAttribute("download", filename);

    a.click();

    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }

  viewAll(): void {
    this.router.navigate(['../', 'view-results']);
  }

  ngOnDestroy() {
    this.resultsService.updateResults('');
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
