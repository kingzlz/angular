import { ChangeDetectionStrategy, Component } from '@angular/core';
import { App, ModalHelper, SettingsService } from '@delon/theme';
import { LockDialogComponent } from '../../../routes/passport/lock-dialog/lock-dialog.component';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  searchToggleStatus: boolean;

  get app(): App {
    return this.settings.app;
  }

  get collapsed(): boolean {
    return this.settings.layout.collapsed;
  }

  constructor(private settings: SettingsService, private model: ModalHelper) { }

  toggleCollapsedSidebar(): void {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange(): void {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  openLock(): void {
    this.model.createStatic(LockDialogComponent).subscribe();
  }
}
