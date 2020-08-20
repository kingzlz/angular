import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-index',
  templateUrl: './page-index.html',
  styles: [
    `
      .page-index {
        font-size: 24px;
        font-weight: bold;
        margin-top: 15%;
        text-align: center;
      }
      .index-img {
        margin-top: 30px;
      }
    `,
  ],
})
export class PageIndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
