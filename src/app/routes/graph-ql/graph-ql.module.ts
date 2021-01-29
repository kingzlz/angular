import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './graph.component';

const COMPONENTS = [GraphComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, GraphRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [],
})
export class GraphQlModule {}
