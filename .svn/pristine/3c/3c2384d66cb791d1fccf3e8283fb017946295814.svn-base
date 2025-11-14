import { Component, forwardRef, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMWorkflowCreatorComponent } from './workflow-creator.component';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';

/**
 * 帳票要ワークフロー登録コンポーネント
 * @example
 *
 *      <eim-form-workflow-creator>
 *      </eim-form-workflow-creator>
 */
@Component({
    selector: 'eim-form-workflow-creator',
    templateUrl: './workflow-creator.component.html',
    styleUrls: ['./workflow-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormWorkflowCreatorComponent) }
    ],
    standalone: false
})

export class EIMFormWorkflowCreatorComponent extends EIMWorkflowCreatorComponent implements OnInit, EIMCreatable {

	/** ネームスペース */
	@Input() public namespace: string;

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
	 * ワークフローを登録します.
	 */
	public create(): void {
		this.workflowService.create(this.nameList, this.namespace).subscribe(
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
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
			this.nameList[lang.lang] = '';
		}

	}

}
