import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.less'],
})
export class VideoListComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('video', { static: true }) video: ElementRef;
  canvasEl: HTMLCanvasElement;
  videoEl: HTMLVideoElement;
  context: any;
  mediaStreamTrack: any;
  constructor(private http: _HttpClient, private msgSrv: NzMessageService) {}

  ngOnInit(): void {
    this.canvasEl = this.canvas.nativeElement;
    this.videoEl = this.video.nativeElement;
    this.context = this.canvasEl.getContext('2d');
  }

  ngOnDestroy(): void {
    this.close();
  }

  start(): void {
    (window.navigator as any).getMedia =
      navigator.getUserMedia ||
      (window.navigator as any).webkitGetUserMedia ||
      (window.navigator as any).mozGetUserMeddia ||
      (window.navigator as any).msGetUserMedia;

    if ((window.navigator as any).mediaDevices && (window.navigator as any).mediaDevices.getUserMedia) {
      (window.navigator as any).mediaDevices
        .getUserMedia({
          video: { width: 500, height: 375 },
          audio: false,
        })
        .then((stream) => {
          this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
          this.videoEl.srcObject = stream;
          this.videoEl.onloadedmetadata = (e) => {
            this.videoEl.play();
          };
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // 使用旧方法打开摄像头
    else if ((window.navigator as any).getMedia) {
      (window.navigator as any).getMedia(
        {
          video: true,
        },
        (stream) => {
          this.mediaStreamTrack = stream.getTracks()[0];

          this.videoEl.src = ((window.URL || window.webkitURL) as any).createObjectURL(stream);
          this.videoEl.play();
        },
        (err) => {
          console.log(err);
        },
      );
    }
  }
  // 拍照
  proCapture(): void {
    this.context.drawImage(this.videoEl, 0, 0, 300, 170);
  }

  close(): void {
    // tslint:disable-next-line: no-unused-expression
    this.mediaStreamTrack && this.mediaStreamTrack.stop();
  }

  upload(): void {
    const data = this.canvasEl.toDataURL('image/png');
    this.http
      .post('api/file/upload/base64', { fileName: `${this.uuid()}.png`, image64: data })
      .pipe(map((res) => res))
      .subscribe(({ fileName, fileUrl }) => {
        this.http.post('api/file/list', { fileName, fileUrl }).subscribe(() => {
          this.msgSrv.success('保存成功');
        });
      });
  }

  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
