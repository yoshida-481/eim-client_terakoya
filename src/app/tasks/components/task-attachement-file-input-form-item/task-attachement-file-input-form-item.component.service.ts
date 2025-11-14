import { Injectable, Type } from '@angular/core';



import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMTempFileObjectService } from 'app/shared/services/apis/temp-file-object.service';
import { EIMTemplateFileService } from 'app/shared/services/apis/template-file.service';

import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';
import { EIMTaskFileObjectCreatorService } from 'app/tasks/services/apis/task-file-object-creator.service';
import { EIMInputFormItemComponentDomain } from 'app/shared/components/input-form-item/input-form-item.component.service';
import { EIMTaskAttachementFileInputFormItemComponent } from './task-attachement-file-input-form-item.component';
import { EIMInputFormItemComponent } from 'app/shared/components/input-form-item/input-form-item.component';

export interface EIMAttachementFileInputFormItemComponentDomain extends EIMInputFormItemComponentDomain {
};


/**
 * 添付ファイル入力フォームコンポーネントサービス
 * @see {@link EIMInputFormItemComponentService}
 */
@Injectable()
export class EIMTaskAttachementFileInputFormItemComponentService extends EIMAttachementFileInputFormItemComponentService {

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected fileService: EIMFileService,
		protected fileObjectCreatorService: EIMTaskFileObjectCreatorService,
		protected tempFileObjectService: EIMTempFileObjectService,
		protected templateFileService: EIMTemplateFileService,
	) {
		super(fileService, fileObjectCreatorService, tempFileObjectService, templateFileService);
	}

	/**
	 * 対応するコンポーネントを返却します.
	 * @see {@link EIMInputFormItemComponentService}
	 *
	 * @returns 対応するコンポーネント
	 */
	public override getComponent(): Type<EIMInputFormItemComponent> {
		return EIMTaskAttachementFileInputFormItemComponent;
	};

	
}
