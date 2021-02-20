import { Component, OnInit } from '@angular/core';
import Academy from '@jaspero/academy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() { }

  // @ts-ignore
  academy: Academy;

  ngOnInit() {
    this.academy = new Academy({
      mount: [
        {
          type: 'description'
        },
        {
          type: 'editor'
        }
      ]
    });

    this.academy.addStep({
      name: 'test',
      description: `Click 'Validate'!`,
      validate: () => true
    });
    this.academy.addStep({
      name: 'test1',
      description: `Write '123'`,
      validate: (content) => {
        if (content === '123') {
          return true;
        }

        if (content === `'123'`) {
          alert('Ha ha, good one');
          return true;
        }

        return false;
      }
    });
    this.academy.addStep({
      name: 'test1.5',
      description: `Click 'Validate' and DO NOT write anything in the textbox!`,
      validate: (content) => content === ''
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

    if (this.academy.valid) {
      this.academy.nextStep();
    } else {
      console.log('bad');
    }
  }
}
