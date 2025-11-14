import { Component, forwardRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMFormWorkflowCopyCreatorComponent } from './form-workflow-copy-creator.component';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';

/**
 * 流用作成（ドキュメント）実行コンポーネント
 * @example
 *
 *      <eim-document-workflow-copy-creator
 *          [workflow]="workflow">
 *      </eim-document-workflow-copy-creator>
 */
@Component({
    selector: 'eim-document-workflow-copy-creator',
    templateUrl: './workflow-copy-creator.component.html',
    styleUrls: ['./workflow-copy-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentWorkflowCopyCreatorComponent) }
    ],
    standalone: false
})

export class EIMDocumentWorkflowCopyCreatorComponent extends EIMFormWorkflowCopyCreatorComponent implements OnInit, EIMCreatable {

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected workflowService: EIMAdminsWorkflowService,
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			public adminsCacheService: EIMAdminsCacheService,
	) {
		super(
				workflowService,
				translateService,
				localStorageService,
				adminsCacheService
				)
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 流用作成を実行します.
	 */
	public create(): void {
		this.createFlag = false;

		this.workflow.name = this.nameList[ this.languages[0].lang ]
		this.workflow.nameList = this.nameList;

		this.workflowService.copyForDocument(this.workflow).subscribe(
			(workflow: EIMWorkflowDomain) => {
				this.created.emit(workflow);
			}
		);
	}
}
