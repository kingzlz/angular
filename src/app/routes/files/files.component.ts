import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STPage, STReq, STRes } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.less'],
})
export class FilesComponent implements OnInit {
  url = 'api/file/list';
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
      title: '文件名称',
      index: 'fileName',
    },
    {
      title: '图片',
      render: 'custom',
      index: 'fileUrl',
      width: 150,
    },
    {
      title: '创建时间',
      index: 'createdAt',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm:ss',
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
  imageFullscreenView = false;
  images = [];
  imageIndexOne = 0;
  /** internal */
  @ViewChild('st', { static: true }) st: STComponent;
  constructor(private modelService: ModalHelper, private http: _HttpClient) {}

  ngOnInit(): void {}
  upload(): void {
    this.modelService.create(FileUploadComponent, null, { size: 'md' }).subscribe(() => this.st.reload());
  }

  del(id: string): void {
    this.http.delete(`${this.url}/${id}`).subscribe((res) => {
      console.log(res);
      this.st.reload();
    });
  }

  show(item: any): void {
    this.images = [item.fileUrl];
    this.imageFullscreenView = true;
  }
}
