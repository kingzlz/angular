import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';
export interface TreeNodeInterface {
  key?: string;
  name?: string;
  age?: number;
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
  menu: TreeNodeInterface[] = [
    {
      pid: '',
      group: true,
      hideInBreadcrumb: true,
      children: [],
      _id: '5f2a8630e2fbe74f26dcca3a',
      icon: 'anticon-dashboard',
      text: '首页',
      link: '/index',
    },
    {
      pid: '',
      group: true,
      hideInBreadcrumb: true,
      children: [],
      _id: '5f2a878c85a1404f73729efe',
      icon: 'anticon-rocket',
      text: '用户管理',
      link: '/user',
    },
    {
      pid: '',
      group: true,
      hideInBreadcrumb: true,
      children: [
        {
          pid: '5f2a87a685a1404f73729eff',
          group: true,
          hideInBreadcrumb: true,
          children: [],
          _id: '5f32035a3f614fd0a21c67a0',
          icon: 'anticon-search',
          text: '拍照片',
          link: '/video/list',
        },
        {
          pid: '5f2a87a685a1404f73729eff',
          group: true,
          hideInBreadcrumb: true,
          children: [],
          _id: '5f3203263f614fd0a21c678f',
          icon: 'anticon-team',
          text: '视频',
          link: '/video',
        },
      ],
      _id: '5f2a87a685a1404f73729eff',
      icon: 'anticon-info',
      text: '媒体管理',
      link: '/video',
    },
    {
      pid: '',
      group: true,
      hideInBreadcrumb: true,
      children: [],
      _id: '5f2b9aeedb2c6c55b16bb6f6',
      icon: 'anticon-bulb',
      text: '菜单管理',
      link: '/menu',
    },
    {
      pid: '',
      group: true,
      hideInBreadcrumb: true,
      children: [],
      _id: '5f3b9edabdb5f5af4d267a10',
      icon: 'anticon-file',
      text: '文件管理',
      link: '/file',
    },
  ];

  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: `1-1`,
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          key: `1-2`,
          name: 'John Brown jr.',
          age: 30,
          address: 'New York No. 3 Lake Park',
          children: [
            {
              key: `1-2-1`,
              name: 'Jimmy Brown',
              age: 16,
              address: 'New York No. 3 Lake Park',
            },
          ],
        },
        {
          key: `1-3`,
          name: 'Jim Green sr.',
          age: 72,
          address: 'London No. 1 Lake Park',
          children: [
            {
              key: `1-3-1`,
              name: 'Jim Green',
              age: 42,
              address: 'London No. 2 Lake Park',
              children: [
                {
                  key: `1-3-1-1`,
                  name: 'Jim Green jr.',
                  age: 25,
                  address: 'London No. 3 Lake Park',
                },
                {
                  key: `1-3-1-2`,
                  name: 'Jimmy Green sr.',
                  age: 18,
                  address: 'London No. 4 Lake Park',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: `2`,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  /** internal */
  @ViewChild('st', { static: true }) st: STComponent;
  constructor() {}

  ngOnInit(): void {
    // this.menu.forEach((item) => {
    //   this.mapOfExpandedData[item._id] = this.convertTreeToList(item);
    // });
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
