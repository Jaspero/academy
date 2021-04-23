import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StateService } from '../../services/state/state.service';

interface TestData {
  name: string;
  // level: number;
  children?: TestData[];
}

const GetChildren = (node: TestData) => of(node.children);
const TC = new NestedTreeControl(GetChildren);

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    public state: StateService
  ) {
  }

  tc = TC;
  data = [
    {
      name: 'a',
      children: [
        {name: 'g'},
        {
          name: 'b',
          children: [
            {name: 'e'},
            {name: 'f'}
          ]
        },
        {
          name: 'c',
          children: [
            {name: 'd'}
          ]
        }
      ]
    }];
  sidebar$: Observable<any>;

  ngOnInit(): void {
    this.sidebar$ = combineLatest([this.state.fields$]).pipe(
      map(([fields]) => {
        return [
          {
            name: 'Fields',
            children: fields.map((field: any) => {
              return {
                ...field,
                parent: 'fields'
              };
            })
          },
          {
            name: 'Layout',
            children: [
              {
                name: 'Table'
              }
            ]
          }
        ];
      })
    );
  }

  selectItem(item: any) {
    console.log({item});
    switch (item.parent) {
      case 'fields': {
        const {parent, ...field} = item;
        this.state.fieldControl.setValue(field);
        break;
      }
    }
  }

  hasChild(_: number, node: TestData) {
    console.log(node);
    return node.children != null && node.children.length > 0;
  }

}
