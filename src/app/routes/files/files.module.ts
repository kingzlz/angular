import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';

const COMPONENTS = [FilesComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, FilesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [],
})
export class FilesModule {}
