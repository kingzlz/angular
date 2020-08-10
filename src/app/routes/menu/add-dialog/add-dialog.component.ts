import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form/';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-black-add-dialog',
  templateUrl: './add-dialog.component.html',
})
export class AddComponent implements OnInit, OnDestroy {
  title = '新增';
  record: any = {};
  @Input() formatData: any = {};
  @Input() operation: string;
  @ViewChild('sf', { static: true }) sf: SFComponent;
  @ViewChild('input', { static: true }) searchInput: any;
  i: any;
  isView: string;
  schema: SFSchema = {};
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: {
        span: 24,
      },
    },
  };

  searchText = '';

  searchTextStream$: Subject<string> = new Subject<string>();

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient, private service: MenuService) {}

  ngOnInit(): void {
    switch (this.operation) {
      case 'modify':
        this.isView = 'modify';
        this.title = '修改黑名单';
        break;
      default:
        break;
    }
    this.schema = {
      properties: {
        text: {
          title: '导航名称',
          type: 'string',
          ui: {
            placeholder: '请输入',
          },
        },
        icon: {
          title: '图标',
          type: 'string',
          ui: {
            placeholder: '请输入',
          },
        },
        link: {
          type: 'string',
          title: '路由',
          ui: {
            placeholder: '请输入',
          },
        },

        sort: {
          type: 'number',
          title: '排序',
          ui: {
            placeholder: '请输入',
          },
        },
      },
      required: ['text', 'icon', 'link', 'sort'],
    };
  }

  ngOnDestroy(): void {
    this.searchTextStream$.unsubscribe();
  }

  searchChanged(searchText: string): void {
    this.searchTextStream$.next(searchText);
  }

  save(value: any): void {
    const params = { ...value };
    this.service.addMenu(params).subscribe((res) => {
      this.msgSrv.success('新增成功');
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
