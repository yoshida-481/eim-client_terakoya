import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMWorkflowRevisionUpCreatorComponent } from './workflow-revision-up-creator.component';

/**
 * リビジョンアップ実行コンポーネント
 * @example
 *
 *      <eim-form-workflow-revision-up-creator
 *          [workflow]="workflow"
 *          [isRevisionUpRegist]="isRevisionUpRegist">
 *      </eim-form-workflow-revision-up-creator
 */
@Component({
    selector: 'eim-form-workflow-revision-up-creator',
    templateUrl: './workflow-revision-up-creator.component.html',
    styleUrls: ['./workflow-revision-up-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkflowRevisionUpCreatorComponent) }
    ],
    standalone: false
})

export class EIMFormWorkflowRevisionUpCreatorComponent extends EIMWorkflowRevisionUpCreatorComponent implements OnInit, EIMCreatable {


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
		);

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * ワークフローを登録する.
	 * @param newWorkflow ワークフロー情報
	 */
	public updateWorkflow( newWorkflow: EIMWorkflowDomain): void {

		this.workflowService.workflowRegist(this.workflow)
		.subscribe(() => {
			this.created.emit(newWorkflow);
		}, (err: any) => {
			// エラーの場合
			return;
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
