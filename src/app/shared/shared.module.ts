import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BtBusinessCoreModule } from '@bigtree/business-core';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { CountdownModule } from 'ngx-countdown';
import { NgxTinymceModule } from 'ngx-tinymce';
import { UEditorModule } from 'ngx-ueditor';
import { ImageViewerModule } from './image-viewer/image-viewer.module';
import { PromptUpdateComponent } from './prompt-update/prompt-update.component';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
const THIRDMODULES = [CountdownModule, UEditorModule, NgxTinymceModule];
// #endregion

// #region your componets & directives
const COMPONENTS = [PromptUpdateComponent];
const DIRECTIVES = [];
const ENTRYCOMPONENTS = [PromptUpdateComponent];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    ImageViewerModule.forRoot(),
    BtBusinessCoreModule.forChild(),
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    BtBusinessCoreModule,
    TranslateModule,
    ImageViewerModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  entryComponents: [...ENTRYCOMPONENTS],
})
export class SharedModule {}
