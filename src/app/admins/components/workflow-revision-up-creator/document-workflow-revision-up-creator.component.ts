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
 *      <eim-document-workflow-revision-up-creator
 *          [workflow]="workflow"
 *          [isRevisionUpRegist]="isRevisionUpRegist">
 *      </eim-document-workflow-revision-up-creator
 */
@Component({
    selector: 'eim-document-workflow-revision-up-creator',
    templateUrl: './workflow-revision-up-creator.component.html',
    styleUrls: ['./workflow-revision-up-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMDocumentWorkflowRevisionUpCreatorComponent) }
    ],
    standalone: false
})

export class EIMDocumentWorkflowRevisionUpCreatorComponent extends EIMWorkflowRevisionUpCreatorComponent implements OnInit, EIMCreatable {


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
	 * リビジョンアップを実行します.
	 */
	public create(): void {
		let params: any = {};
		params['workflowId'] = this.workflow.id;
		params['prmSrcId'] = this.workflow.id;
		if ( this.isRevisionUpRegist ) {
			params['registFlg'] = false;
		} else {
			params['registFlg'] = true;
		}
		params['newDefNameJP'] = this.defName;
		params['nmSpace'] = this.inputNamespace;

		{
			let keys = Object.keys(this.nameList);
			for (let m = 0; m < keys.length; m++) {
				let key = keys[m];
				params['wfName' + this.JA2JP[key]] = this.nameList[key];
			}

		}

		// リビジョンアップ
		this.workflowService.revisionUp(params).subscribe(
			(workflow: EIMWorkflowDomain) => {
				if ( this.isRevisionUpRegist ) {
					this.updateWorkflow( workflow );
				} else {
					this.created.emit( workflow );
				}
			}
		);
	}

	/**
	 * ワークフローを登録する.
	 * @param newWorkflow ワークフロー情報
	 */
	public updateWorkflow( newWorkflow: EIMWorkflowDomain): void {
		this.workflowService.workflowRegistForDocument(this.workflow, false, newWorkflow.id )
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
