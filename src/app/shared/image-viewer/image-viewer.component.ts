import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { CustomEvent, ImageViewerConfig } from './image-viewer-config.model';

const DEFAULT_CONFIG: ImageViewerConfig = {
  btnClass: 'default',
  zoomFactor: 0.1,
  containerBackgroundColor: 'rgba(51, 51, 51, 0.95)',
  wheelZoom: true,
  allowFullscreen: false,
  allowKeyboardNavigation: true,
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: true,
    rotateCounterClockwise: true,
    next: true,
    prev: true,
  },
  btnIcons: {
    zoomIn: 'fa fa-plus',
    zoomOut: 'fa fa-minus',
    rotateClockwise: 'fa fa-repeat',
    rotateCounterClockwise: 'fa fa-undo',
    next: 'fa fa-arrow-right',
    prev: 'fa fa-arrow-left',
    fullscreen: 'fa fa-arrows-alt',
    close: 'fa fa-close',
  },
};

@Component({
  selector: 'app-bt-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {
  @Input()
  src: string[];

  @Input()
  index = 0;

  @Input()
  config: ImageViewerConfig;

  @Output()
  indexChange: EventEmitter<number> = new EventEmitter();
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter();

  @Output()
  configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();

  @Output()
  customEvent: EventEmitter<CustomEvent> = new EventEmitter();
  @ViewChild('image', { static: true }) private image: ElementRef;

  public style = {
    transform: '',
    msTransform: '',
    oTransform: '',
    webkitTransform: '',
  };
  public fullscreen = false;
  public loading = true;
  private scale = 1;
  private rotation = 0;
  private translateX = 0;
  private translateY = 10;
  private prevX: number;
  private prevY: number;
  private hovered = false;
  private imageEl: HTMLImageElement;
  constructor(@Optional() @Inject('config') public moduleConfig: ImageViewerConfig, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
    this.config = this.mergeConfig(merged, this.config);
    this.triggerConfigBinding();
    this.imageEl = this.image.nativeElement;
  }

  @HostListener('window:keyup.ArrowRight', ['$event'])
  nextImage(event: KeyboardEvent): void {
    if (this.canNavigate(event) && this.index < this.src.length - 1) {
      this.loading = true;
      this.index++;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  @HostListener('window:keyup.ArrowLeft', ['$event'])
  prevImage(event: KeyboardEvent): void {
    if (this.canNavigate(event) && this.index > 0) {
      this.loading = true;
      this.index--;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  zoomIn(): void {
    this.scale *= 1 + this.config.zoomFactor;
    this.updateStyle();
  }

  zoomOut(): void {
    if (this.scale > this.config.zoomFactor) {
      this.scale /= 1 + this.config.zoomFactor;
    }
    this.updateStyle();
  }

  // tslint:disable-next-line: typedef
  scrollZoom(evt) {
    if (this.config.wheelZoom) {
      evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
      return false;
    }
  }

  rotateClockwise(): void {
    this.rotation += 90;
    this.updateStyle();
  }

  rotateCounterClockwise(): void {
    this.rotation -= 90;
    this.updateStyle();
  }

  onLoad(): void {
    this.loading = false;
    const imageHeight = this.imageEl.height;
    const docHeight = this.doc.body.clientHeight;
    if (imageHeight < docHeight) {
      this.translateY = Math.ceil((docHeight - imageHeight) / 2);
      this.updateStyle();
    }
  }

  onLoadStart(): void {
    this.loading = true;
  }

  onDragOver(evt): void {
    this.translateX += evt.clientX - this.prevX;
    this.translateY += evt.clientY - this.prevY;
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
    this.updateStyle();
  }

  onDragStart(evt): void {
    if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
      evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
    }
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
  }

  toggleFullscreen(): void {
    this.fullscreen = !this.fullscreen;
    if (!this.fullscreen) {
      this.reset();
    }
  }

  closeWrapper(): void {
    this.closeEvent.emit(false);
  }

  triggerIndexBinding(): void {
    this.indexChange.emit(this.index);
  }

  triggerConfigBinding(): void {
    this.configChange.next(this.config);
  }

  fireCustomEvent(name, imageIndex): void {
    this.customEvent.emit(new CustomEvent(name, imageIndex));
  }

  reset(): void {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  @HostListener('mouseover')
  private onMouseOver(): void {
    this.hovered = true;
  }

  @HostListener('mouseleave')
  private onMouseLeave(): void {
    this.hovered = false;
  }

  private canNavigate(event: any): boolean {
    return event == null || (this.config.allowKeyboardNavigation && this.hovered);
  }

  private updateStyle(): void {
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
  }

  private mergeConfig(defaultValues: ImageViewerConfig, overrideValues: ImageViewerConfig): ImageViewerConfig {
    let result: ImageViewerConfig = { ...defaultValues };
    if (overrideValues) {
      result = { ...defaultValues, ...overrideValues };

      if (overrideValues.btnIcons) {
        result.btnIcons = {
          ...defaultValues.btnIcons,
          ...overrideValues.btnIcons,
        };
      }
    }
    return result;
  }
}
