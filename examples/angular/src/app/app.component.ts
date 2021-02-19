import { Component, OnInit } from '@angular/core';
import Academy from '@jaspero/academy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {
  }

  title = 'angular';
  // @ts-ignore
  academy: Academy;

  ngOnInit() {
    this.academy = new Academy({
      mount: [
        {
          type: 'description',
          element: '#description'
        }
      ]
    });

    this.academy.addStep({
      name: 'test',
      description: `Click 'Validate'!`,
      validate: () => true
    });
    this.academy.addStep({
      name: 'test2',
      description: 'Bravo! Now random chance!',
      validate: () => Math.random() < 0.1
    });
    this.academy.addStep({
      name: 'test3',
      description: 'Woosh! That was 1 in a 10 chance...',
      validate: () => Math.random() < 0.7
    });

    this.academy.startStep('test');
  }

  validate() {
    if (!this.academy.currentStep) {
      return;
    }

    if (this.academy.currentStep.valid) {
      this.academy.nextStep();
    } else {
      console.log('bad');
    }
  }
}
