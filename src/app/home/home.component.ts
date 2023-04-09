import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ResultsService } from '../shared/results.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  form!: FormGroup;
  value!: string;
  allResults$: Observable<string[]> = this.resultsService.allResults;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private resultsService: ResultsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      text: [{ value: null, disabled: false }],
      json: [null, [Validators.required]]
    })
  }

  readOutput(): void {
    const regex = /%[A-Za-z]+%/g;
    this.value = this.form.get('text')?.value.replace(regex, (variable: string) => {
      return this.getVariableValue(variable);
    });
  }

  getVariableValue(variable: string): unknown {
    const jsonString = this.form.get('json')?.value;
    const jsonObject = JSON.parse(jsonString);

    const found = Object.keys(jsonObject)
      .filter(key => key === variable)
      .reduce((obj, key) => {
        const variableValue = jsonObject[key];
        return variableValue;
      }, {});

    return found;
  }

  save(): void {
    this.resultsService.updateResults(this.value);
    this.updateAllResults();
  }

  updateAllResults(): void {
    this.allResults$.pipe(take(1)).subscribe(val => {
      const newArr = [...val, this.value];
      this.resultsService.updateAllResults(newArr);
      this.router.navigate(['../', 'results']);
    })
  }

}
