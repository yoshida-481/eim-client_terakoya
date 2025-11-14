import { Component, forwardRef, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMWorkflowCopyCreatorComponent } from './workflow-copy-creator.component';

/**
 * 流用作成（帳票）実行コンポーネント
 * @example
 *
 *      <eim-form-workflow-copy-creator
 *          [workflow]="workflow">
 *      </eim-form-workflow-copy-creator>
 */
@Component({
    selector: 'eim-form-workflow-copy-creator',
    templateUrl: './workflow-copy-creator.component.html',
    styleUrls: ['./workflow-copy-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkflowCopyCreatorComponent) }
    ],
    standalone: false
})

export class EIMFormWorkflowCopyCreatorComponent extends EIMWorkflowCopyCreatorComponent implements OnInit, EIMCreatable {

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
	 * 流用作成を実行します.
	 */
	public create(): void {
		this.createFlag = false;

		this.workflow.name = this.nameList[ this.languages[0].lang ];
		this.workflow.nameList = this.nameList;

		this.workflowService.copy(this.workflow).subscribe(
			(workflow: EIMWorkflowDomain) => {
				this.created.emit(workflow);
			}
		);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		if (!this.languages) {
			window.setTimeout(() => {
				this.errored.emit();
			});
			return;
		}
		let lang: any;

		for (let i = 0; i < this.languages.length; i++) {
			this.oldNameList[ this.languages[i].lang ] = this.workflow.nameList[this.languages[i].lang];
		}

		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = EIMAdminsConstantService.COPY_WORD[ lang.lang ] + this.oldNameList[lang.lang];
		}
	}
}
