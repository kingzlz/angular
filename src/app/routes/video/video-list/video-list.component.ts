import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.less'],
})
export class VideoListComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('video', { static: true }) video: ElementRef;
  canvasEl: HTMLCanvasElement;
  videoEl: HTMLVideoElement;
  context: any;
  mediaStreamTrack: any;
  constructor() {}

  ngOnInit(): void {
    this.canvasEl = this.canvas.nativeElement;
    this.videoEl = this.video.nativeElement;
    this.context = this.canvasEl.getContext('2d');
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
          video: true,
          audio: true,
        })
        .then((stream) => {
          this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];
          this.videoEl.srcObject = stream;
          this.videoEl.play();
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
    this.context.drawImage(this.videoEl, 0, 0, 500, 400);
  }
  close(): void {
    // tslint:disable-next-line: no-unused-expression
    this.mediaStreamTrack && this.mediaStreamTrack.stop();
  }
  upload(): void {
    const data = this.canvasEl.toDataURL('image/png');
    console.log(data);
  }
}
