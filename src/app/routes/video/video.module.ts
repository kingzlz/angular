import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { VideoRoutingModule } from './video-routing.module';
import { VideoComponent } from './video.component';
import { VideoListComponent } from './video-list/video-list.component';

const COMPONENTS = [VideoComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, VideoRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, VideoListComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class VideoModule {}
