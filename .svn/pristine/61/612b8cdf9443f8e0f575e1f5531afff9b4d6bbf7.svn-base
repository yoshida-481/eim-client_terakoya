import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMAdminsCacheService } from 'app/admins/shared/services/admins-cache.service';

/**
 * 汎用ワークフロー更新コンポーネント
 * @example
 *
 *      <eim-workflow-updator
 *          [workflow]="workflow">
 *      </eim-workflow-updator>
 */
@Component({
    selector: 'eim-workflow-updator',
    templateUrl: '../workflow-creator/workflow-creator.component.html',
    styleUrls: ['../workflow-creator/workflow-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowUpdatorComponent) }
    ],
    standalone: false
})

export class EIMWorkflowUpdatorComponent implements OnInit, EIMUpdatable {
	/** ワークフローフォーム */
	@ViewChild('workflowCreatorForm', { static: true }) workflowCreatorForm: NgForm;

	/** ワークフロー情報 */
	@Input() public workflow: EIMWorkflowDomain;

	/** 更新完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<EIMWorkflowDomain> = new EventEmitter<EIMWorkflowDomain>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 使用可能言語リスト */
	public languages: any[];

	/** 使用可能言語リスト */
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
	 * ワークフローを更新します.
	 */
	public update(): void {

		this.workflow.namespace = this.getNamespaceLabel( this.inputNamespace );
		this.workflow.nameList = this.nameList;
		this.workflowService.update(this.workflow).subscribe(
			(workflow: EIMWorkflowDomain) => {
				this.updated.emit(workflow);
			}
		);
	}

	/**
	 * ワークフロー更新可否を返却します.
	 * @return ワークフロー更新可否
	 */
	public updatable(): boolean {
		return this.workflowCreatorForm.valid && this.workflowCreatorForm.dirty;
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

		this.workflowService.getNamespaceList()
			.subscribe((data: any) => {
				let namespaceList = data;
				if (Array.isArray(namespaceList)) {
					for (let i = 0; i < namespaceList.length; i++) {
						this.namespaceSelectItems.push({
							label: namespaceList[i].attr.name,
							value: i + 1,
						});

					}
				}
				let namespace = this.workflow.namespace;
				for (let i = 0; i < this.namespaceSelectItems.length; i++) {
					if (this.namespaceSelectItems[i].label === namespace) {
						this.inputNamespace = this.namespaceSelectItems[i].value;
					}
				}
			}, (err: any) => {
				// エラーの場合
				window.setTimeout(() => {
					this.errored.emit();
				});
			});

		let nameList = this.workflow.nameList;

		for (let i = 0; i < this.languages.length; i++) {
			this.nameList[ this.languages[i].lang ] = this.workflow.nameList[this.languages[i].lang];
		}

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
