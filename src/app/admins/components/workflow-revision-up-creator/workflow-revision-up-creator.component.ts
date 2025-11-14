import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';

/**
 * リビジョンアップ実行コンポーネント
 * @example
 *
 *      <eim-workflow-revision-up-creator
 *          [workflow]="workflow"
 *          [isRevisionUpRegist]="isRevisionUpRegist">
 *      </eim-workflow-revision-up-creator>
 */
@Component({
    selector: 'eim-workflow-revision-up-creator',
    templateUrl: './workflow-revision-up-creator.component.html',
    styleUrls: ['./workflow-revision-up-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowRevisionUpCreatorComponent) }
    ],
    standalone: false
})

export class EIMWorkflowRevisionUpCreatorComponent implements OnInit, EIMCreatable {
	/** ワークフローフォーム */
	@ViewChild('workflowRevupCreatorForm', { static: true }) workflowRevupCreatorForm: NgForm;

	/** ワークフロー情報 */
	@Input() public workflow: EIMWorkflowDomain;

	/** 登録からリビジョンアップか */
	@Input() public isRevisionUpRegist = false;

	/** 実行完了時のイベントエミッタ */
	@Output() public created: EventEmitter<EIMWorkflowDomain> = new EventEmitter<EIMWorkflowDomain>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 旧使用可能言語リスト */
	public oldNameList: { [key: string]: string; } = {};

	/** 新使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

		/** 旧定義名称 */
	public oldDefName = '';

	/** 定義名称  */
	public defName = '';

	/** ネームスペース */
	public inputNamespace = '';

	/** エントリタイプ英語名称から文言に変換用 */
	protected JA2JP = {
		'JA': 'JP',
		'EN': 'EN',
	};


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected workflowService: EIMAdminsWorkflowService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		public adminsCacheService: EIMAdminsCacheService,
	) {

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
					this.workflow.id = workflow.id;
					this.updateWorkflow( this.workflow );
				} else {
					this.created.emit( workflow );
				}
			}
		);
	}

	/**
	 * リビジョンアップ実行可否を返却します.
	 * @return リビジョンアップ実行可否
	 */
	public creatable(): boolean {
		return this.workflowRevupCreatorForm.valid && this.workflowRevupCreatorForm.dirty;
	}

	/**
	 * リビジョンアップ実行可否を返却します.
	 * @return リビジョンアップ実行可否
	 */
	public updateWorkflow( newWorkflow: EIMWorkflowDomain): void {
		if ( this.workflow.namespace && this.workflow.namespace !== '' ) {
			this.workflow.name = this.workflow.name + '(' + this.workflow.namespace + ')'
		}
		this.workflowService.workflowRegist(this.workflow)
		.subscribe(() => {
			this.created.emit(newWorkflow);
		}, (err: any) => {
			// エラーの場合
			return;
		});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;

		this.workflowService.getWorkFlowForRevisionUpById(this.workflow.id).subscribe(
			(data: any) => {
				this.defName = data[0].workflow.attr.workflowDefName;
				this.oldDefName = data[0].workflow.attr.workflowDefName;
				this.inputNamespace = this.workflow.namespace;

				for (let idx = 0; idx < this.languages.length; idx++) {
					lang = this.languages[idx];
					this.nameList[lang.lang] = data[0].workflow.attr['workflowName' + this.JA2JP[lang.lang]];
					this.oldNameList[lang.lang] = data[0].workflow.attr['workflowName' + this.JA2JP[lang.lang]];
				}
			}, (err: any) => {
				// エラーの場合
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}



	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------

}
