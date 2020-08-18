import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';

import { UserState } from './states/user.state';

const NGXS_STATES = [UserState];

@NgModule({
  declarations: [],
  imports: [NgxsModule.forRoot([...NGXS_STATES]), NgxsReduxDevtoolsPluginModule.forRoot(), NgxsLoggerPluginModule.forRoot()],
  exports: [NgxsModule],
})
export class StoreModule {}
