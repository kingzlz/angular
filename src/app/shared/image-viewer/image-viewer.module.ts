import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImageViewerConfig } from './image-viewer-config.model';
import { ImageViewerComponent } from './image-viewer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ImageViewerComponent],
  exports: [ImageViewerComponent],
})
export class ImageViewerModule {
  static forRoot(config?: ImageViewerConfig): ModuleWithProviders<ImageViewerModule> {
    return {
      ngModule: ImageViewerModule,
      providers: [{ provide: 'config', useValue: config }],
    };
  }
}
