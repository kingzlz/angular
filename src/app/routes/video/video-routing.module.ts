import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoComponent } from './video.component';

const routes: Routes = [
  { path: '', component: VideoComponent },
  { path: 'list', component: VideoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
