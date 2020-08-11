import { Component, Input, OnInit } from '@angular/core';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UploadFile } from 'ng-zorro-antd/upload';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent implements OnInit {
  comments = '';
  FILE_SIZE: number = 20 * 1024 * 1024;
  // tslint:disable-next-line: typedef
  get fileList() {
    return this._fileList;
  }

  set fileList(val: any) {
    this._fileList = val;
    // this.fileAva =
    //   val && val.some(item => !item.error && item.status !== 'error');
  }

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient, public settings: SettingsService) {}

  // 文件可上传格式，如[.xls,.jpg]
  @Input() acceptFormat = ['.png', '.jpg', '.jpeg', '.gif'];
  @Input() businessId;
  @Input() moduleId;

  uploadParams: any = {};
  uploadUrl = 'api/file/upload';
  _fileList = [];
  options = null;
  values = null;
  fileAva = true;
  headerMsg;

  ngOnInit(): void {
    this.headerMsg = `请上传${this.acceptFormat.join(',')}格式的文件。`;
    if (this.moduleId) {
      this.uploadParams = {
        moduleId: this.moduleId,
      };
    }
  }

  // tslint:disable-next-line: typedef
  beforeUpload() {
    // tslint:disable-next-line: deprecation
    return (file: UploadFile) => {
      if (file.size > this.FILE_SIZE) {
        this.msgSrv.warning(`只允许上传20M以内的文件!`);
        return false;
      }
      if (this.validFile(file)) {
        return true;
      }
      file.status = 'error';
      return false;
    };
  }

  validFile(file: any): boolean {
    let canUpload = false;
    for (const i of this.acceptFormat) {
      if (file.name.toLowerCase().endsWith(i)) {
        canUpload = true;
        break;
      }
    }
    if (!canUpload) {
      this.msgSrv.error(this.headerMsg);
    }
    return canUpload;
  }

  save(): void {
    if (this.fileList.some((item) => item.status === 'uploading')) {
      this.msgSrv.warning('文件上传中，请稍后再试');
      return;
    }
    // const files = [];
    let params: any = {};
    for (const file of this.fileList) {
      if (!file.error && file.status !== 'error') {
        // files.push(file.response.data.fileId);
        params = {
          fileName: file.response.filename,
          fileUrl: file.response.url,
        };
      }
    }

    console.log(params);
    this.http.post('api/file/list', params).subscribe((res) => {
      console.log(res);
      this.msgSrv.success(res.msg);
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }

  onChange(event: any): void {
    this.fileAva = event.fileList && event.fileList.some((item) => item.error !== undefined);
    if (event.fileList.length === 0) {
      this.fileAva = true;
    }
  }
}
