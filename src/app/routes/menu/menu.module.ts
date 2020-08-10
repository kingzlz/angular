import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';

import { AddComponent } from './add-dialog/add-dialog.component';
import { MenuService } from './menu.service';

const COMPONENTS = [MenuComponent];
const COMPONENTS_NOROUNT = [AddComponent];

@NgModule({
  imports: [SharedModule, MenuRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [MenuService],
})
export class MenuModule {}
