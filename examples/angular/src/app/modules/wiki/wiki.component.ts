import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
// @ts-ignore
import md from 'markdown-it';
// const hljs = require('highlight.js');

// import * as hljs from 'highlight.js';

// @ts-ignore
import * as markdownittasklists from 'markdown-it-task-lists';
// @ts-ignore
import * as markdownitabbr from 'markdown-it-abbr';
// @ts-ignore
import * as markdownitsup from 'markdown-it-sup';
// @ts-ignore
import * as markdownitsub from 'markdown-it-sub';
// @ts-ignore
import * as markdownitmark from 'markdown-it-mark';
// @ts-ignore
import * as markdownitins from 'markdown-it-ins';

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
      map((wiki: Wiki) => {
        console.log({wiki});
        return {
          ...wiki,
          content: md({
            html: true,
            breaks: true,
            typographer: true,
            // highlight: function (str: any, lang: string) {
            //   if (lang && hljs.getLanguage(lang)) {
            //     try {
            //       // @ts-ignore
            //       return hljs.highlight(str, { language: lang }).value;
            //     } catch (__) {}
            //   }
            //
            //   return ''; // use external default escaping
            // }
          })
            .use(markdownittasklists, {
              label: true
            })
            .use(markdownitabbr)
            .use(markdownitsup)
            .use(markdownitsub)
            .use(markdownitmark)
            .use(markdownitins)
            .render(wiki.content)
        };
      })
    );
  }

}
