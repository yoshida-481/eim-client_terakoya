import { CommonModule } from '@angular/common';
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
import { CheckboxModule } from 'primeng/checkbox';

// ng2-file-upload
import { FileUploadModule } from 'ng2-file-upload';

import { EIMDialogModule } from 'app/shared/components/dialog/dialog.module';

import { EIMSearchInputFormItemComponent } from './search-input-form-item.component';
import { EIMTextSearchInputFormItemComponent } from './text-search-input-form-item/text-search-input-form-item.component';
import { EIMSearchComboBoxInputFormItemComponent } from './combo-box-search-input-form-item/combo-box-search-input-form-item.component';
import { EIMSearchCalendarInputFormItemComponent } from './calendar-search-input-form-item/calendar-search-input-form-item.component';
import { EIMSearchCheckBoxInputFormItemComponent } from './check-box-search-input-form-item/check-box-search-input-form-item.component';
import { EIMSearchLongRangeInputFormItemComponent } from './long-range-search-input-form-item/long-range-search-input-form-item.component';


/**
 * 入力フォームアイテムモジュール.
 */
@NgModule({
	declarations: [
		EIMSearchInputFormItemComponent,
		EIMTextSearchInputFormItemComponent,
		EIMSearchComboBoxInputFormItemComponent,
		EIMSearchCalendarInputFormItemComponent,
		EIMSearchCheckBoxInputFormItemComponent,
		EIMSearchLongRangeInputFormItemComponent,
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
		CheckboxModule,
		FileUploadModule,
		EIMDialogModule,
	],
	exports: [
		EIMTextSearchInputFormItemComponent,
		EIMSearchCheckBoxInputFormItemComponent,
		EIMSearchComboBoxInputFormItemComponent,
		EIMSearchCalendarInputFormItemComponent,
		EIMSearchLongRangeInputFormItemComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	providers: [
	],
})
export class EIMSearchInputFormItemModule { }
