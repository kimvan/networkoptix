import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'networkoptix';


  constructor(private router: Router) {}

  navigateTo(value: string) {
    this.router.navigate(['../', value]);
  }

}
