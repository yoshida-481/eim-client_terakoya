import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMWorkflowUpdatorComponent } from './workflow-updator.component';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';


/**
 * 帳票用ワークフロー更新コンポーネント
 * @example
 *
 *      <eim-form-workflow-updator
 *          [workflow]="workflow">
 *      </eim-form-workflow-updator>
 */
@Component({
    selector: 'eim-form-workflow-updator',
    templateUrl: '../workflow-creator/workflow-creator.component.html',
    styleUrls: ['../workflow-creator/workflow-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkflowUpdatorComponent) }
    ],
    standalone: false
})

export class EIMFormWorkflowUpdatorComponent extends EIMWorkflowUpdatorComponent implements OnInit, EIMUpdatable {

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
	 * ワークフローを更新します.
	 */
	public update(): void {

		this.workflow.nameList = this.nameList;
		this.workflowService.update(this.workflow)
			.subscribe((workflow: EIMWorkflowDomain) => {
				this.updated.emit(workflow);
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
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

		let nameList = this.workflow.nameList;
		for (let i = 0; i < this.languages.length; i++) {
			this.nameList[ this.languages[i].lang ] = this.workflow.nameList[this.languages[i].lang];
		}

	}

}
