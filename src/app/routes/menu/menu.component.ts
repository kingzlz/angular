import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';
import { ModalHelper } from '@delon/theme';
import { AddComponent } from './add-dialog/add-dialog.component';
import { MenuModel, MenuService } from './menu.service';
export interface TreeNodeInterface {
  key?: string;
  name?: string;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  _id?: string;
  pid?: string;
  group?: boolean;
  hideInBreadcrumb?: boolean;
  link?: string;
  text?: string;
  icon?: string;
}
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
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  /** internal */
  @ViewChild('st', { static: true }) st: STComponent;
  constructor(private modelService: ModalHelper, private service: MenuService) {}

  ngOnInit(): void {
    this.service.getMenus().subscribe((res) => {
      this.data = res;
      this.data.forEach((item) => {
        this.mapOfExpandedData[item._id] = this.convertTreeToList(item);
      });
    });
  }
  add(): void {
    this.modelService.create(AddComponent, null, { size: 'md' }).subscribe(() => this.st.reload());
  }

  addChildren(pid: string): void {
    this.modelService.create(AddComponent, { pid }, { size: 'md' }).subscribe(() => this.st.reload());
  }

  del(id: string): void {
    this.service.delMunu(id).subscribe((res) => {
      this.st.reload();
    });
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          // tslint:disable-next-line: no-non-null-assertion
          const target = array.find((a) => a._id === d._id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      // tslint:disable-next-line: no-non-null-assertion
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          // tslint:disable-next-line: no-non-null-assertion
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [_id: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node._id]) {
      hashMap[node._id] = true;
      array.push(node);
    }
  }
}
