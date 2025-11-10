import { CommonModule,  DecimalPipe } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';

//  ngx-translate
import { TranslateModule } from '@ngx-translate/core';

// primeng
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ListboxModule } from 'primeng/listbox';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

// ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';

import { EIMDataGridModule } from 'app/shared/components/data-grid/data-grid.module';
import { EIMDialogModule } from 'app/shared/components/dialog/dialog.module';

import { EIMInputFormItemComponent } from './input-form-item.component';
import { EIMAttachementFileInputFormItemComponent } from './attachement-file-input-form-item/attachement-file-input-form-item.component';
import { EIMAttachementFileInputFormItemComponentService } from './attachement-file-input-form-item/attachement-file-input-form-item.component.service';
// import { EIMRelationFileInputFormItemComponentService } from './relation-file-input-form-item/relation-file-input-form-item.component.service';
import { EIMTextInputFormItemComponent } from './text-input-form-item/text-input-form-item.component';
import { EIMTextAreaInputFormItemComponent } from './text-area-input-form-item/text-area-input-form-item.component';
import { EIMRichTextInputFormItemComponent } from './rich-text-input-form-item/rich-text-input-form-item.component';
import { EIMCheckBoxInputFormItemComponent } from './check-box-input-form-item/check-box-input-form-item.component';
import { EIMComboBoxInputFormItemComponent } from './combo-box-input-form-item/combo-box-input-form-item.component';
import { EIMCalendarInputFormItemComponent } from './calendar-input-form-item/calendar-input-form-item.component';
import { EIMMasterInputFormItemComponent } from './master-input-form-item/master-input-form-item.component';
import { EIMUserInputFormItemComponent } from './user-input-form-item/user-input-form-item.component';
import { EIMNumberInputFormItemComponent } from './number-input-form-item/number-input-form-item.component';
import { EIMTextInputFormItemComponentService } from './text-input-form-item/text-input-form-item.component.service';
import { EIMInputFormItemComponentService } from './input-form-item.component.service';
import { EIMTextAreaInputFormItemComponentService } from './text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMCalendarInputFormItemComponentService } from './calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMCheckBoxInputFormItemComponentService } from './check-box-input-form-item/check-box-input-form-item.component.service';
import { EIMComboBoxInputFormItemComponentService } from './combo-box-input-form-item/combo-box-input-form-item.component.service';
import { EIMMasterInputFormItemComponentService } from './master-input-form-item/master-input-form-item.component.service';
import { EIMNumberInputFormItemComponentService } from './number-input-form-item/number-input-form-item.component.service';
import { EIMRadioButtonInputFormItemComponentService } from './radio-button-input-form-item/radio-button-input-form-item.component.service';
import { EIMRichTextInputFormItemComponentService } from './rich-text-input-form-item/rich-text-input-form-item.component.service';
import { EIMUserInputFormItemComponentService } from './user-input-form-item/user-input-form-item.component.service';
import { EIMRadioButtonInputFormItemComponent } from './radio-button-input-form-item/radio-button-input-form-item.component';
import { EIMUrlInputFormItemComponent } from './url-input-form-item/url-input-form-item.component';
import { EIMUrlInputFormItemComponentService } from './url-input-form-item/url-input-form-item.component.service';
import { ClipboardModule } from 'ngx-clipboard';
import { EIMCheckBoxComponent } from '../checkbox/checkbox.component';
import { EIMRadioButtonComponent } from '../radio-button/radio-button.component';

/**
 * 入力フォームアイテムモジュール.
 */
@NgModule({
	declarations: [
		EIMInputFormItemComponent,
		EIMAttachementFileInputFormItemComponent,
		EIMTextInputFormItemComponent,
		EIMUrlInputFormItemComponent,
		EIMTextAreaInputFormItemComponent,
		EIMRadioButtonInputFormItemComponent,
		EIMRichTextInputFormItemComponent,
		EIMCheckBoxInputFormItemComponent,
		EIMComboBoxInputFormItemComponent,
		EIMCalendarInputFormItemComponent,
		EIMMasterInputFormItemComponent,
		EIMUserInputFormItemComponent,
		EIMNumberInputFormItemComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		AutoCompleteModule ,
		PanelModule,
		InputTextModule,
		TextareaModule,
		EditorModule,
		SharedModule,
		ButtonModule,
        DatePickerModule,
		SelectModule,
		ListboxModule,
		TooltipModule,
		InputNumberModule,
		FileUploadModule,
		EIMDataGridModule,
		EIMDialogModule,
		ClipboardModule,
		EIMCheckBoxComponent,
		EIMRadioButtonComponent
	],
	exports: [
		EIMAttachementFileInputFormItemComponent,
		EIMTextInputFormItemComponent,
		EIMUrlInputFormItemComponent,
		EIMTextAreaInputFormItemComponent,
		EIMRadioButtonInputFormItemComponent,
		EIMRichTextInputFormItemComponent,
		EIMCheckBoxInputFormItemComponent,
		EIMComboBoxInputFormItemComponent,
		EIMCalendarInputFormItemComponent,
		EIMMasterInputFormItemComponent,
		EIMUserInputFormItemComponent,
		EIMNumberInputFormItemComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	providers: [
		EIMInputFormItemComponentService,
	    EIMAttachementFileInputFormItemComponentService,
		EIMTextInputFormItemComponentService,
		EIMUrlInputFormItemComponentService,
		EIMTextAreaInputFormItemComponentService,
		EIMCalendarInputFormItemComponentService,
		EIMCheckBoxInputFormItemComponentService,
		EIMComboBoxInputFormItemComponentService,
		EIMMasterInputFormItemComponentService,
		EIMNumberInputFormItemComponentService,
		EIMRadioButtonInputFormItemComponentService,
		EIMRichTextInputFormItemComponentService,
		EIMUserInputFormItemComponentService,

// EIMRelationFileInputFormItemComponentService,
	  DecimalPipe,
	],
})
export class EIMInputFormItemModule { }
