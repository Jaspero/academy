import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
// @ts-ignore
import md from 'markdown-it';

interface Wiki {
  id: string;
  name: string;
  content: string;
}

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  wiki$: Observable<Wiki>;

  ngOnInit(): void {
    this.wiki$ = this.route.params.pipe(
      pluck('id'),
      switchMap(id => {
        return this.afs.doc<Wiki>(`wiki/${id}`).get().pipe(
          map((snap) => {
            return {
              id,
              ...snap.data()
            };
          })
        )
      }),
      map(wiki => {
        console.log({wiki});
        return {
          ...wiki,
          content: md().render(wiki.content)
        };
      })
    );
  }

}
