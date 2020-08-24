import { Inject, Injector } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';
import { confirmFn } from '@utils';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
export class UsersComponent implements OnInit {
  url = 'api/user/list';
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
      title: '用户名',
      index: 'name',
    },
    {
      title: '头像',
      index: 'avatar',
      type: 'img',
      width: '200px',
    },
    {
      title: '密码',
      index: 'password',
      format: () => '******',
    },
    {
      title: 'Email',
      index: 'email',
    },
    {
      title: '电话',
      index: 'phone',
    },

    {
      title: '操作',
      width: '60px',
      fixed: 'right',
      buttons: [
        {
          text: '查看',
          click: (item) => this.view(item),
          // type: 'link',
          // click: (item: any) => `payment/funder/view/${item.id}/${item.payNo}`,
        },
        // { text: '修改', click: (item: any) => `/platform/edit/${item.id}` },
      ],
    },
  ];

  /** internal */
  @ViewChild('st', { static: true }) st: STComponent;
  constructor(@Inject(Injector) public injector: Injector, public model: NzModalService) {}

  ngOnInit(): void {}

  @confirmFn('哈哈')
  view(item: any): void {
    console.log(item);
  }
}
