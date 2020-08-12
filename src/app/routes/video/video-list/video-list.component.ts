import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.less'],
})
export class VideoListComponent implements OnInit {
  @ViewChild('st', { static: true })
  st: STComponent;
  url = '';
  columns: STColumn[] = [{ title: '编号', index: 'id' }];

  constructor() {}

  ngOnInit(): void {}
  getData(): any {
    // const res = this.replayService.getData();
  }
}
