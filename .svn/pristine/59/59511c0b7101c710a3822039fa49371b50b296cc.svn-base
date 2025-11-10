import { Component, IterableDiffers, OnInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';



import { EIMFileService } from 'app/shared/services/apis/file.service';

import { EIMMessageService } from 'app/shared/services/message.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMWebDAVService } from 'app/shared/services/webdav.service';


import { EIMAttachementFileInputFormItemComponent } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component';
import { EIMTaskAttachementFileInputFormItemComponentService } from './task-attachement-file-input-form-item.component.service';

/**
 * タスク管理用添付ファイル入力フォームアイテムコンポーネント
 * @example
 *      <eim-task-attachement-file-input-form-item
 *          [form]="form"
 *          [name]="name"
 *          [label]="label"
 *          [required]="true"
 *          [disabled]="false"
 *          [muitiple]="true"
 *          [dirty]="false"
 *      >
 *      </eim-task-attachement-file-input-form-item>
 */
@Component({
	selector: 'eim-task-attachement-file-input-form-item',
	templateUrl: '../../../shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.html',
	styleUrls: ['../../../shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.css'],
	providers: [
		{provide: NG_VALUE_ACCESSOR, useExisting: EIMTaskAttachementFileInputFormItemComponent, multi: true}
	],
	standalone: false
})
export class EIMTaskAttachementFileInputFormItemComponent extends EIMAttachementFileInputFormItemComponent implements OnInit, OnDestroy {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected fileService: EIMFileService,
			protected messageService: EIMMessageService,
			protected serverConfigService: EIMServerConfigService,
			protected webDAVService: EIMWebDAVService,
			protected attachementFileInputFormItemComponentService: EIMTaskAttachementFileInputFormItemComponentService,
			protected differs: IterableDiffers) {
		super(
			translateService,
			fileService,
			messageService,
			serverConfigService,
			webDAVService,
			attachementFileInputFormItemComponentService,
			differs
		);

	}

}
