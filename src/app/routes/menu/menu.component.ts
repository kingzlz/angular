import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';
import { ModalHelper } from '@delon/theme';
import { AddComponent } from './add-dialog/add-dialog.component';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  url = 'api/menu/list';
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
      title: '导航',
      index: 'text',
    },
    {
      title: '图标',
      index: 'icon',
    },
    {
      title: '路由',
      index: 'link',
    },
    {
      title: '排序',
      index: 'sort',
    },

    {
      title: '操作',
      width: '60px',
      fixed: 'right',
      buttons: [
        {
          text: '删除',
          pop: true,
          click: (item: any) => this.del(item._id),
        },
        // { text: '修改', click: (item: any) => `/platform/edit/${item.id}` },
      ],
    },
  ];

  /** internal */
  @ViewChild('st', { static: true }) st: STComponent;
  constructor(private modelService: ModalHelper, private service: MenuService) {}

  ngOnInit(): void {}
  add(): void {
    this.modelService.create(AddComponent, null, { size: 'md' }).subscribe(() => this.st.reload());
  }

  del(id: string): void {
    this.service.delMunu(id).subscribe((res) => {
      this.st.reload();
    });
  }
}
