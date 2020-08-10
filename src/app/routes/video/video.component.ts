import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.less'],
})
export class VideoComponent implements OnInit {
  url = 'api/video/list';
  page: STPage = {
    toTop: false,
  };
  data: any[];
  reqConfig: STReq = {
    reName: { pi: 'page', ps: 'limit' },
  };
  resConfig: STRes = { reName: { total: 'meta.pagination.total', list: 'data' } };
  columns: STColumn[] = [
    {
      title: '名称',
      index: 'videoName',
    },
    {
      title: '操作',
      width: '60px',
      fixed: 'right',
      buttons: [
        {
          text: '查看',
          type: 'link',
          // click: (item: any) => `payment/funder/view/${item.id}/${item.payNo}`,
        },
        // { text: '修改', click: (item: any) => `/platform/edit/${item.id}` },
      ],
    },
  ];

  /** internal */
  @ViewChild('st', { static: true }) st: STComponent;
  constructor() {}

  ngOnInit(): void {}
}
