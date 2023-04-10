import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { ResultsService } from '../shared/results.service';
import { jsonValidator } from '../shared/json.validator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {

  form!: FormGroup;
  value!: string;
  allResults$: Observable<string[]> = this.resultsService.allResults$;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private resultsService: ResultsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      text: [{ value: null, disabled: false }],
      json: [null, [Validators.required, jsonValidator()]]
    });
  }

  readInput(): void {
    const regex = /%[A-Za-z]+%/g;
    const jsonVal = this.form.get('json')?.value;
    const textVal = this.form.get('text')?.value;

    if (jsonVal && textVal) {
      this.value = textVal.replace(regex, (variable: string) => {
        if (this.getVariableValue(variable)) {
          return this.getVariableValue(variable);
        } else {
          return variable;
        }
      });
    } else {
      this.value = textVal;
    }
  }

  getVariableValue(variable: string): unknown {
    const jsonObject = this.isValidJSON(this.form.get('json')?.value);

    const found = !jsonObject? null : Object.keys(jsonObject)
      .filter(key => key === variable)
      .reduce((obj, key) => {
        const variableValue = jsonObject[key];
        return variableValue;
      }, null);

    return found;
  }

  isValidJSON(stringToValidate: string) {
    try {
      JSON.parse(stringToValidate);
    } catch (e) {
      return null;
    }
    return JSON.parse(stringToValidate);
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
