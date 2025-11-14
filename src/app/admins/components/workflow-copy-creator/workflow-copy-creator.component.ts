import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';

/**
 * 流用作成（汎用）実行コンポーネント
 * @example
 *
 *      <eim-workflow-copy-creator
 *          [workflow]="workflow">
 *      </eim-workflow-copy-creator>
 */
@Component({
    selector: 'eim-workflow-copy-creator',
    templateUrl: './workflow-copy-creator.component.html',
    styleUrls: ['./workflow-copy-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowCopyCreatorComponent) }
    ],
    standalone: false
})

export class EIMWorkflowCopyCreatorComponent implements OnInit, EIMCreatable {
	/** ワークフローフォーム */
	@ViewChild('workflowCopyCreatorForm', { static: true }) workflowCopyCreatorForm: NgForm;

	/** ワークフロー情報 */
	@Input() public workflow: EIMWorkflowDomain;

	/** 流用作成実行完了時のイベントエミッタ */
	@Output() created: EventEmitter<EIMWorkflowDomain> = new EventEmitter<EIMWorkflowDomain>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 流用元使用可能言語リスト */
	public oldNameList: { [key: string]: string; } = {};

	/** 流用先使用可能言語リスト */
	public nameList: { [key: string]: string; } = {};

	/** ネームスペース */
	public namespace: string;

	/** ネームスペースリスト */
	public namespaceSelectItems: SelectItem[] = [{
		label: this.translateService.instant('EIM_ADMINS.LABEL_02065'),
		value: 0,
	}];

	/** ネームスペースリスト */
	public inputNamespace = 0;

	/** 登録可能フラグ */
	protected createFlag = true;

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
	 * 流用作成を実行します.
	 */
	public create(): void {
		this.createFlag = false;

		this.workflow.name = this.nameList[ this.languages[0].lang ];
		this.workflow.namespace = this.getNamespaceLabel( this.inputNamespace );
		this.workflow.nameList = this.nameList;

		this.workflowService.copy(this.workflow).subscribe(
			(workflow: EIMWorkflowDomain) => {
				this.created.emit(workflow);
			}
		);
	}

	/**
	 * 流用作成実行可否を返却します.
	 * @return 流用作成実行可否
	 */
	public creatable(): boolean {
		return this.workflowCopyCreatorForm.valid && this.createFlag;
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

		this.workflowService.getNamespaceList().subscribe(
			(data: any) => {
				let namespaceList = data;
				if (Array.isArray(namespaceList)) {
					for (let i = 0; i < namespaceList.length; i++) {
						this.namespaceSelectItems.push({
							label: namespaceList[i].attr.name,
							value: i + 1,
						});

					}
				}

				for (let i = 0; i < this.namespaceSelectItems.length; i++) {
					if (this.namespaceSelectItems[i].label === this.workflow.namespace) {
						this.inputNamespace = this.namespaceSelectItems[i].value;
					}
				}
			}, (err: any) => {
				// エラーの場合
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}

	/**
	 * ワークフロー名称変更イベントハンドラ。
	 * @param value 変更内容
	 */
	onWorkFlowNameChange(value: string ): void {
		this.createFlag = true;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * idよりネームスペース名を返却する.
	 * @param ネームスペースの値
	 * @return ネームスペース名
	 */
	protected getNamespaceLabel( idx: number ): string {
		let label = ''
		for ( let i = 0; i < this.namespaceSelectItems.length; i++ ) {
			if ( this.namespaceSelectItems[i].value === idx) {
				label =  this.namespaceSelectItems[i].label;
			}
		}
		return label;

	}

}
