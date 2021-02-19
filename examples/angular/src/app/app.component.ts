import { Component } from '@angular/core';
import Academy from '@jaspero/academy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  constructor() {
    console.log(Academy);
    const a = new Academy();
    a.addStep({name: 'test'});
    a.addStep({name: 'test2'});

    // console.log(a.steps);
    // a.step({name: 'test'})

    // console.log(a.steps);
  }
}
