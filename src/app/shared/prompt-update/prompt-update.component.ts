import { Component, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-prompt-update',
  templateUrl: './prompt-update.component.html',
})
export class PromptUpdateComponent {
  @Input()
  tips: string;

  constructor(private drawerRef: NzDrawerRef<{ result: number }>) {}

  refresh(): void {
    this.drawerRef.close({
      result: 1,
    });
  }

  close(): void {
    this.drawerRef.close({
      result: 0,
    });
  }
}
