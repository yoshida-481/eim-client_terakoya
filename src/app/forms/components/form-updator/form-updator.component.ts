import { Component, forwardRef, ViewChild, OnInit, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';

import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormDomainService } from 'app/forms/shared/services/form-domain.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormEventService } from 'app/forms/shared/services/apis/form-event.service';

import { EIMAccessRoleTypeDomain } from 'app/shared/domains/entity/access-role-type.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMEventTypeDomain } from 'app/shared/domains/entity/event-type.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormEventDomain } from 'app/shared/domains/form-event.domain';
import { EIMFormTypeDomain } from 'app/shared/domains/form-type.domain';
import { EIMObjectTypeLayoutDomain } from 'app/shared/domains/object-type-layout.domain';
import { EIMStatusTypeLayoutDomain } from 'app/shared/domains/status-type-layout.domain';

import { EIMAttributeListInputFormItemComponentService } from 'app/shared/components/attribute-list-input-form-item/attribute-list-input-form-item.component.service';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDiagramComponent } from 'app/shared/components/diagram/diagram.component';
import { EIMDiagramComponentService, EIMDiagramElement, EIMDiagramNode, EIMDiagramStyle, EIMDiagramComponentInfo } from 'app/shared/components/diagram/diagram.component.service';
import { EIMWorkflowDiagramComponentService } from 'app/forms/components/workflow-diagram/workflow-diagram.component.service';
import { EIMDialogManagerComponentService } from "app/forms/shared/components/dialog-manager/dialog-manager.component.service";

import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';
import { EIMFormAttributeTypeLayoutOptionBuilderFactoryService } from 'app/forms/shared/services/form-attribute-type-layout-option-builder-factory.service';
import { EIMFormAttributeTypeLayoutOptionBuilderService,AttributeTypeLayoutOption } from 'app/forms/shared/services/form-attribute-type-layout-option-builder.service';

/**
 * 帳票詳細コンポーネント（更新）
 * @example
 *
 *      <eim-form-updator
 *        [id]="id"
 *        [workspaceId]="workspaceId"
 *      >
 *      </eim-form-updator>
 */
@Component({
    selector: 'eim-form-updator',
    templateUrl: './form-updator.component.html',
    styleUrls: ['./form-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormUpdatorComponent) }
    ],
    standalone: false
})
export class EIMFormUpdatorComponent implements OnInit, EIMUpdatable {

	/** ワークフローダイアグラム */
	@ViewChild('workflowDiagram')
	workflowDiagram: EIMDiagramComponent;

	/** フォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: NgForm;

	/** 帳票ID */
	@Input() id: number;

	/** 帳票ワークスペースID */
	@Input() workspaceId: number;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ステータス変更時のイベントエミッタ */
	@Output() statusChanged: EventEmitter<any> = new EventEmitter<any>();

	/** 基本情報属性リスト */
	public attributeList: EIMAttributeDomain[];
	/** 基本情報属性タイプレイアウトリスト */
	public objectTypeLayout: EIMObjectTypeLayoutDomain = null;

	/** ステータスタイプ別属性リスト */
	public statusTypeAttributeListMap: any = {};
	/** 現在ステータス */
	public currentStatusTypeLayout: EIMStatusTypeLayoutDomain = null;
	/** 過去ステータス一覧 */
	public pastStatusTypeLayoutList: EIMStatusTypeLayoutDomain[] = [];
	/** 直近のイベント */
	public latestFormEvent: EIMFormEventDomain = null;

	/** 更新ボタンの表示可否 */
	public visibleUpdate: boolean = false;

	/** 更新中かどうか */
	public updating: boolean = false;

	/** URL */
	public url: string;

	/** 展開するステータスタイプアコーディオンのID SET */
	public expandStatusLayoutIdSet: any = {};

	// 画面表示関連のフラグ
	/** 編集権限あり */
	public existsUpdateRole: boolean = false;
	/** ステータス変更権限あり */
	public existsApproveRole: boolean = false;

	/** 次へ進むイベントタイプリスト */
	public forwardEventTypeList: EIMEventTypeDomain[] = [];
	/** 前へ戻るイベントタイプリスト */
	public backwordEventTypeList: EIMEventTypeDomain[] = [];
	/** 取戻しイベントタイプ */
	public regainEventType: EIMEventTypeDomain;

	/** 詳細情報 */
	public form: EIMFormDomain = new EIMFormDomain();

	/** ワークフロー情報 */
	protected workflow: EIMWorkflowDomain;

	/** 帳票タイプレイアウト フラット表示かどうか*/
	public USE_FORM_FLAT_LAYOUT = EIMFormsConstantService.USE_FORM_FLAT_LAYOUT;

	/** 表示情報 */
	public attributeTypeLayoutOption: AttributeTypeLayoutOption = {
		// 業務タイプ定義名称
		businessTypeDefinitionName: '',
		// 帳票タイプ定義名称
		formTypeDefinitionName: '',
		// 属性タイプ定義名称と上メッセージのMap
		attributeTypeDefinitionNameAndTopMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と下メッセージのMap
		attributeTypeDefinitionNameAndBottomMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と左メッセージのMap
		attributeTypeDefinitionNameAndLeftMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と下メッセージのMap
		attributeTypeDefinitionNameAndRightMessageMap: new Map<string, string>(),
		// 属性タイプ定義名称と入力部品のオプションパラメータのMap
		attributeTypeDefinitionNameAndOptionParamsMap: new Map<string, any>(),
		// // 非表示属性タイプ定義名称Set
		unvisibleAttributeTypeDefinitionNameSet: new Set<string>(),
		// ラベル非表示属性タイプ定義名称Set
		unvisibleLabelAttributeTypeDefinitionNameSet: new Set<string>(),
		// 非活性属性タイプ定義名称Set
		disabledAttributeTypeDefinitionNameSet: new Set<string>(),
	};

	/** 選択中タブ */
	selectedTab = signal<number[]>([0]);

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected attributeListInputFormItemComponentService: EIMAttributeListInputFormItemComponentService,
		protected attachementFileInputFormItemComponentService: EIMAttachementFileInputFormItemComponentService,
		protected attributeService: EIMAttributeService,
		protected messageService: EIMMessageService,
		protected formDomainService: EIMFormDomainService,
		protected formsCacheService: EIMFormsCacheService,
		protected fileService: EIMFileService,
		protected formService: EIMFormService,
		protected formEventService: EIMFormEventService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected workflowDiagramComponentService: EIMWorkflowDiagramComponentService,
		protected serverConfigService: EIMServerConfigService,
		protected attributeTypeLayoutOptionBuilderFactoryService: EIMFormAttributeTypeLayoutOptionBuilderFactoryService,
	) {


	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コンテンツ情報を更新します.
	 * @param callback 更新完了時のコールバック関数
	 */
	public update(callback?: () => void): void {
		this.updating = true;

		// 無効フラグがONのコード値の存在チェック	
		let disableCodeId: Number = this.checkCodeDisable();
		if (disableCodeId != null) {
			this.updating = false;
			this.getCodeErrorMessage(disableCodeId);
			return;
		}

		let form: EIMFormDomain = this.formDomainService.excludeNullAttributeList(this.form);

		this.formService.update(form)
			.subscribe(
				(resForm: EIMFormDomain) => {
					this.form.modificationDate = resForm.modificationDate;

					if (callback) {
						callback();
					}

					// 完了イベントを通知(画面が閉じる)
					this.updated.emit([{ id: resForm.id, attributeList: this.form.attributeList, close: !callback && this.serverConfigService.isAutoClose }]);

					// dirty初期化
					window.setTimeout(() => {
						this.propertyForm.control.markAsPristine();
					});

					this.updating = false;
				},
				(err: any) => {
					// エラー発生時
					this.updating = false;
				});


		this.attachementFileInputFormItemComponentService.clear();
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public updatable(): boolean {
		if (!this.propertyForm.dirty || this.updating) {
			return false;
		}

		// バリデーションチェック（必須は除く）
		return this.getValidWithoutRequired();
	}

	/**
	 * 必須以外のバリッド状態を返却します.
	 * @return 必須以外バリッドのみであればtrue
	 */
	public getValidWithoutRequired(): boolean {
		for (let controlsKey in this.propertyForm.controls) {
			let errors = this.propertyForm.controls[controlsKey].errors;
			for (let errorsKey in errors) {
				if (errorsKey != "required") {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * 必須のバリッド状態を返却します.
	 * @param enableAttributeTypeIdSet 属性タイプのIDセット
	 * @param enableStatusAttributeTypeIdSet ステータスに割り当てた属性タイプのIDセット
	 * @param currentStatusTypeId カレントステータスタイプのid
	 * @return 必須バリッドのみであればtrue
	 */
	public  getValidRequired(enableAttributeTypeIdSet: Set<number>, enableStatusAttributeTypeIdSet: Set<number>): boolean {

		for (let controlsKey in this.propertyForm.controls) {
			
			// controlsKeyのサンプル.
			// 非ステータスタイプ属性　attr_xxxx　or attr_xxxx_0
			// ステータスタイプ属性　　attr_xxxx_xxxx or attr_xxxx_xxxx_0
			let key = controlsKey.split('_');
			// 配列keyの一番目を取得
			let attributeiTypeId = parseInt(key[1],10);

			if (enableAttributeTypeIdSet.has(attributeiTypeId) || enableStatusAttributeTypeIdSet.has(attributeiTypeId)){
				let errors = this.propertyForm.controls[controlsKey].errors;
				for (let errorsKey in errors) {
					if (errorsKey == "required") {
						return false;

					}
				}
			}
		}
		return true;
	}

	/**	
	 * コード型属性に無効フラグがONの値の設定されているどうか確認します。
	 * @return 設定されている場合、コードのIDを返却します。
	 */
	public checkCodeDisable(): Number {
		let codeId: Number = null;
		for (let controlsKey in this.propertyForm.controls) {
			if (this.propertyForm.controls[controlsKey].value instanceof EIMCodeDomain) {
				let eimCodeDomain: EIMCodeDomain = this.propertyForm.controls[controlsKey].value;
				if (eimCodeDomain.disable) {
					return codeId = eimCodeDomain.id;
				}
			} else if (this.propertyForm.controls[controlsKey].value instanceof Array) {
				for (let i = 0; i < this.propertyForm.controls[controlsKey].value.length; i++) {
					if (this.propertyForm.controls[controlsKey].value[i] instanceof EIMCodeDomain) {
						let eimCodeDomain: EIMCodeDomain = this.propertyForm.controls[controlsKey].value[i];
						if (eimCodeDomain.disable) {
							return codeId = eimCodeDomain.id
						}
					}
				}
			}
		}
		return codeId;
	}

	/**							
	 * 無効フラグがONの値が設定されていた場合のエラーメッセージを取得します。							
	 * エラーメッセージ：属性 [ {{value1}} ] に無効な値 [ {{value2}} ] が選択されています。							
	 */
	public getCodeErrorMessage(disableCodeId: Number): void {
		//基本属性						
		for (let x = 0; x < this.form.attributeList.length; x++) {
			let attribute: EIMAttributeDomain = this.form.attributeList[x];
			if (attribute.attributeType.valueType == "CODE") {
				for (let y = 0; y < attribute.codeList.length; y++) {
					let code: EIMCodeDomain = attribute.codeList[y];
					if (code != null && code.disable && code.id == disableCodeId) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant("EIM_FORMS.ERROR_00010", { value1: attribute.attributeType.name, value2: code.name }));
					}
				}
			}
		}
		//現在ステータス属性						
		for (let x = 0; x < this.form.status.attributeList.length; x++) {
			let attribute: EIMAttributeDomain = this.form.status.attributeList[x];
			if (attribute.attributeType.valueType == "CODE") {
				for (let y = 0; y < attribute.codeList.length; y++) {
					let code: EIMCodeDomain = attribute.codeList[y];
					if (code != null && code.disable && code.id == disableCodeId) {
						this.messageService.show(EIMMessageType.error, this.translateService.instant("EIM_FORMS.ERROR_00010", { value1: attribute.attributeType.name, value2: code.name }));
					}
				}
			}
		}
	}

	/**
	 * 属性に値を設定します.
	 * @param attributeList 属性情報リスト
	 * @param definitionName 設定属性タイプの定義名称
	 * @param valueType 属性タイプの型
	 * @param valueList 属性値リスト
	 */
	public setAttributeValue(attributeList: EIMAttributeDomain[], definitionName: string, valueType: string, valueList: any[]): void {
		for (let i = 0; i < attributeList.length; i++) {
			let attribute: EIMAttributeDomain = attributeList[i];
			if (attribute.attributeType.definitionName === definitionName) {
				attribute.setValueList(valueList);
				return;
			}
		}

		// ない場合は追加する
		let attributeType: EIMAttributeTypeDomain = new EIMAttributeTypeDomain();
		attributeType.definitionName = definitionName;
		attributeType.valueType = valueType;

		let attribute: EIMAttributeDomain = new EIMAttributeDomain();
		attribute.attributeType = attributeType;
		attribute.setValueList(valueList);

		attributeList.push(attribute);

	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.propertyForm.dirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant("EIM.CONFIRM_00003"),
				() => {
					close.emit();
				}
			);

		} else {
			close.emit();
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後イベントハンドラ.
	 */
	ngOnInit() {
		this.show();
	}

	/**
	 * ワークフローダイアグラム選択時イベントハンドラ.
	 * @param event イベント
	 */
	onSelectDiagram(event: any): void {
		let selectedElement: EIMDiagramNode[] = this.workflowDiagram.getSelectedData();
		if (selectedElement.length == 0) {
			return;
		}

		let statusType: EIMStatusTypeDomain = selectedElement[0].domain;

		// アコーディオンを開く
		this.expandStatusAccrordion(statusType.id, true);

		let targetElement = document.getElementById('status_' + statusType.id);
		if (!targetElement) {
			// 該当なし。最新ステータスタイプ選択時等。
			return;
		}

		// アコーディオンを開いた後に該当箇所までスクロール
		window.setTimeout(() => {
			document.getElementById('status_' + statusType.id).offsetParent.scrollTop = targetElement.offsetTop;
		});
	}

	onExpandCurrentAccordion(event: any, isOpen: boolean): void {
		if (event.index != 1) {
			return;
		}
		this.expandStatusAccrordion(this.currentStatusTypeLayout.id, isOpen);
	}
	
	expandStatusAccrordion(id, isOpen){
		this.expandStatusLayoutIdSet[id] = isOpen;
		// expandStatusLayoutIdSetの値がtrueのものだけを抽出
		const expandedIds = Object.keys(this.expandStatusLayoutIdSet)
		.filter(key => this.expandStatusLayoutIdSet[key] === true);
		const expandedList = this.selectedTab();
		if(isOpen){
			if (!expandedList.includes(1)) {
				expandedList.push(1);
			}
		}else{
			const index = expandedList.indexOf(1);
			if (index !== -1) {
				expandedList.splice(index, 1);
			}
		}
		this.selectedTab.set(expandedList);
	}


	onExpandPastAccordion(event: any, isOpen: boolean): void {
		let past: any = this.pastStatusTypeLayoutList[event.index];
		if (!past) {
			return;
		}

		this.expandStatusAccrordion(past.id, isOpen);
	}

	/**
	 * 帳票出力ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickFormOutput(event: any): void {
		let form: EIMFormDomain = this.formDomainService.excludeNullAttributeList(this.form);

		this.formService.createExcelFile(form).subscribe(
			(filePath: string) => {
				this.fileService.downloadByFileName(filePath);
			});
	}

	/**
	 * ステータス変更ボタン押下イベントハンドラです.
	 * @param event イベント
	 * @param isForward イベントタイプの向き（次へ進む場合はtrueを指定する）
	 */
	onClickStatusChange(event: any, isForward: boolean): void {

		// 非ステータスタイプの属性タイプIDをセットする（非活性化した属性タイプを除く）
		let enableAttributeTypeIdSet = new Set<number>();
		for (let i = 0; i < this.attributeList.length; i++) {
			let attribute = this.attributeList[i];

			if ( !this.attributeTypeLayoutOption.disabledAttributeTypeDefinitionNameSet.has(attribute.attributeType.definitionName)){
				enableAttributeTypeIdSet.add(attribute.attributeType.id);
			}
		}

		// ステータスタイプの属性タイプIDをセットする（非活性化した属性タイプを除く）
		let enableStatusAttributeTypeIdSet = new Set<number>();
		let statusTypeIdList = this.currentStatusTypeLayout.attributeTypeLayoutList;
		for (let i = 0 ; i < statusTypeIdList.length; i++ ){
			let statusTypeAttribute = statusTypeIdList[i];
			
			if ( !this.attributeTypeLayoutOption.disabledAttributeTypeDefinitionNameSet.has(statusTypeAttribute.definitionName)){
				enableStatusAttributeTypeIdSet.add(statusTypeAttribute.id);
			}
		};

		// 次に進む場合のみ必須チェック
		if (isForward && !this.getValidRequired(enableAttributeTypeIdSet, enableStatusAttributeTypeIdSet)) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant("EIM.ERROR_00007"));

			//　属性タイプにダーティーを付与する（非活性化した属性タイプを除く）
			for (let controlKey in this.propertyForm.controls) {
				let controle = this.propertyForm.form.controls[controlKey];

				// controlsKeyのサンプル.
				// 非ステータスタイプ属性　attr_xxxx　or attr_xxxx_0
				// ステータスタイプ属性　　attr_xxxx_xxxx or attr_xxxx_xxxx_0
				let key = controlKey.split('_');

				// 配列keyの一番目を取得
				let attributeTypeId = parseInt(key[1],10);

				// dartyを付与
				if (enableAttributeTypeIdSet.has(attributeTypeId) || enableStatusAttributeTypeIdSet.has(attributeTypeId)) {
					controle.markAsDirty();
				}
 			}
			return;
		}

		// 無効フラグがONのコード値の存在チェック
		let disableCodeId: Number = this.checkCodeDisable();
		if (disableCodeId != null) {
			this.getCodeErrorMessage(disableCodeId);
			return;
		}

		if (this.propertyForm.dirty) {
			// 更新してから
			this.update(() => { this.showStatusChange(isForward); });
		} else {
			this.showStatusChange(isForward);
		}
	}

	/**
	 * 取戻しボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickFormRegain(event: any): void {
		let form: EIMFormDomain = this.formDomainService.excludeNullAttributeList(this.form);

		let dialogId: string = this.dialogManagerComponentService.showFormRegain(
			form, this.regainEventType, this.propertyForm.dirty, {
				executed: (data: any[]) => {
					// 取戻し画面を閉じる
					this.dialogManagerComponentService.close(dialogId);

					// ステータスの変更を通知する
					this.statusChanged.emit([{ id: this.form.id, attributeList: this.form.attributeList }]);
				},
				errored: () => {
					// 取戻し画面を閉じる
					this.dialogManagerComponentService.close(dialogId);

				}
			});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	protected show(): void {
		if (!this.id)
			return;

		// 属性情報取得
		this.formService.getById(this.id)
			.subscribe(
				(form: EIMFormDomain) => {

					this.initContents(form);
					this.setURL(form.id);

					// 帳票情報を取得
					let builder: EIMFormAttributeTypeLayoutOptionBuilderService = this.attributeTypeLayoutOptionBuilderFactoryService.create(form);
					this.attributeTypeLayoutOption = builder.build(form);

					// 権限設定
					let deleteFlagAttribute = this.attributeService.getAttributeByDefinitionName(form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_DELETE_FLAG);
					if (deleteFlagAttribute && deleteFlagAttribute.getValueList()[0] === 1) {
						// ゴミ箱の場合
						this.existsUpdateRole = false;
						this.existsApproveRole = false;
						this.visibleUpdate = false;
					} else {
						this.existsUpdateRole = this.existsRoleType(form.accessRoleTypeList, "UPDATE");
						this.existsApproveRole = this.existsRoleType(form.accessRoleTypeList, "APPROVE");
						this.visibleUpdate = this.existsUpdateRole;
					}

					// ワークフロー情報表示
					if (form.status) {
						this.formService.getWorkflow(this.form, false).subscribe(
							(workflow: EIMWorkflowDomain) => {
								this.workflow = workflow;

								// ワークフロー情報を表示
								this.workflowDiagram.clear();
								this.workflowDiagram.show({ form: form, workflow: workflow });

								if (form.statusList.length > 1) {
									// 直近のイベントを取得
									this.formEventService.getLatestByForm(this.formDomainService.excludeNullAttributeList(form), false).subscribe(
										(latestFormEvent: EIMFormEventDomain) => {
											this.latestFormEvent = latestFormEvent;
											// カレントステータスからのイベントタイプを前、後、取戻しに分けて初期化する
											this.initEventType(form, workflow, latestFormEvent);

											// 過去ステータスタイプのアコーディオン開閉を設定
											for (let i = 0; i < this.pastStatusTypeLayoutList.length; i++) {
												if (this.latestFormEvent && this.pastStatusTypeLayoutList[i].id === this.currentStatusTypeLayout.id) {
													continue;
												}
												if (this.latestFormEvent && this.pastStatusTypeLayoutList[i].id === this.latestFormEvent.fromStatus.type.id) {
													this.expandStatusAccrordion(this.pastStatusTypeLayoutList[i].id, true);
												} else {
													this.expandStatusAccrordion(this.pastStatusTypeLayoutList[i].id, false);
												}
											}
										},
										(err: any) => {
											window.setTimeout(() => {
												this.errored.emit();
											});
										});
								} else {
									// カレントステータスからのイベントタイプを前、後に分けて初期化する
									this.initEventType(form, workflow);
								}

							},
							(err: any) => {
								window.setTimeout(() => {
									this.errored.emit();
								});
							});
					}
				},
				(err: any) => {
					window.setTimeout(() => {
						this.errored.emit();
					});
				});

	}

	/**
	 * URLを設定します.
	 * 
	 */
	protected setURL(id: number): void {
		// URL設定
		let origin: string = window.location.origin; // http://localhost:4200
		let pathname: string = window.location.pathname; // /eim/client/
		this.url = origin + pathname + '#/forms' + '/login' + "?objId=" + id;
	}

	/**
	 * 画面表示を初期化します.
	 * @param form 帳票情報
	 */
	protected initContents(form: EIMFormDomain): void {

		this.form = form;

		// 階層表示かどうか
		let existsAttributeTypeLayoutConf: boolean = this.formDomainService.existsAttributeTypeLayoutConf(form);

		// 基本情報レイアウト設定
		this.attributeList = this.attributeListInputFormItemComponentService.getComplementAttributeList(
			form.formLayout.objectTypeLayout.attributeTypeLayoutList, form.attributeList);
		this.objectTypeLayout = form.formLayout.objectTypeLayout;

		let statusTypeLayoutMap: any = {};

		// カレントステータスタイプレイアウト設定
		this.currentStatusTypeLayout = form.formLayout.currentStatusTypeLayout;
		if (this.currentStatusTypeLayout) {
			this.currentStatusTypeLayout['_isDisplayable'] = this.isDisplayable(this.currentStatusTypeLayout, existsAttributeTypeLayoutConf);
			this.currentStatusTypeLayout['_id'] = 'status_' + this.currentStatusTypeLayout.id;
			statusTypeLayoutMap[this.currentStatusTypeLayout.id] = this.currentStatusTypeLayout;

			// 該当アコーディオンを展開する（過去ステータス分については直近ステータスタイプ取得後に行う）
			this.expandStatusAccrordion(this.currentStatusTypeLayout.id, true);
		}

		// 過去ステータスタイプレイアウト設定
		let pastStatusTypeLayoutList = [];
		if (form.formLayout.pastStatusTypeLayout) {
			for (let i = 0; i < form.formLayout.pastStatusTypeLayout.length; i++) {
				let pastStatusTypeLayout: EIMStatusTypeLayoutDomain = form.formLayout.pastStatusTypeLayout[i];
				if (this.currentStatusTypeLayout.name != pastStatusTypeLayout.name &&
					this.isDisplayable(pastStatusTypeLayout, existsAttributeTypeLayoutConf)) {
					pastStatusTypeLayoutList.push(pastStatusTypeLayout);
					pastStatusTypeLayout['_id'] = 'status_' + pastStatusTypeLayout.id;
				}
				statusTypeLayoutMap[pastStatusTypeLayout.id] = pastStatusTypeLayout;
			}
			this.pastStatusTypeLayoutList = pastStatusTypeLayoutList;
		}

		let statusTypeAttributeListMap = {}
		if (this.form.statusList) {
			for (let i = 0; i < this.form.statusList.length; i++) {
				let status: EIMStatusDomain = this.form.statusList[i];
				let statusTypeLayout: EIMStatusTypeLayoutDomain = statusTypeLayoutMap[status.type.id];
				if (!statusTypeLayout) {
					continue;
				}
				if (statusTypeLayout.attributeTypeLayoutList != null) {
					statusTypeAttributeListMap[status.type.id] = this.attributeListInputFormItemComponentService.getComplementAttributeList(
						statusTypeLayout.attributeTypeLayoutList, status.attributeList);
				} else {
					statusTypeAttributeListMap[status.type.id] = [];
				}
			}
			this.statusTypeAttributeListMap = statusTypeAttributeListMap;
		}
	}

	/**
	 * カレントステータスからのイベントタイプを初期化します.
	 * @param form 帳票情報
	 * @param workflow ワークフロー情報
	 * @param latestFormEvent 直近帳票イベント情報
	 */
	protected initEventType(form: EIMFormDomain, workflow: EIMWorkflowDomain, latestFormEvent?: EIMFormEventDomain): void {
		// 次へ進むイベントタイプ有無
		this.forwardEventTypeList = this.getEventTypeList(workflow.eventTypeList, EIMConstantService.EVENT_TYPE_ID_SET_ASSIGNMENT_PLAN_BASE, form.status.type.id, true);

		// 前に戻るイベントタイプ有無
		this.backwordEventTypeList = this.getEventTypeList(workflow.eventTypeList, EIMConstantService.EVENT_TYPE_ID_SET_ASSIGNMENT_PLAN_BASE, form.status.type.id, false);

		// 取戻しイベントタイプ有無
		if (latestFormEvent != null && latestFormEvent.type.base.id != EIMConstantService.EVENT_TYPE_ID_REGAIN_BASE
			&& latestFormEvent.creationUser.id == this.formsCacheService.getLoginUser().id) {
			let currentStatusRegainEventTypeList: EIMEventTypeDomain[] =
				this.getEventTypeList(workflow.eventTypeList, EIMConstantService.EVENT_TYPE_ID_REGAIN_BASE, form.status.type.id);
			for (let i = 0; i < currentStatusRegainEventTypeList.length; i++) {
				if (latestFormEvent.fromStatus.type.id == currentStatusRegainEventTypeList[i].toStatusType.id) {
					this.regainEventType = currentStatusRegainEventTypeList[i];

					break;
				}
			}
		}
	}

	/**
	 * 表示対象のステータスタイプか判定します.
	 * @param statusTypeLayout ステータスタイプレイアウト
	 * @param existsAttributeTypeLayoutConf 属性タイプレイアウト設定ありかどうか
	 * @return 表示対象のステータスタイプの場合true
	 */
	protected isDisplayable(statusTypeLayout: EIMStatusTypeLayoutDomain, existsAttributeTypeLayoutConf: boolean): boolean {
		//   表示対象属性があるか判定
		for (let i = 0; i < statusTypeLayout.attributeTypeLayoutList.length; i++) {
			if (statusTypeLayout.attributeTypeLayoutList[i].visible) {
				return true;
			}
		}

		return false;
	}

	/**
	 * アクセスロールタイプのリストに指定のロールタイプが存在するかどうかを返却します.
	 * @param accessRoleTypeList アクセスロールタイプのリスト
	 * @param definitionName 検索するロールタイプの定義名称
	 * @return 存在する場合true
	 */
	protected existsRoleType(accessRoleTypeList: EIMAccessRoleTypeDomain[], definitionName: string): boolean {
		for (let i = 0; i < accessRoleTypeList.length; i++) {
			if (accessRoleTypeList[i].definitionName === definitionName) {
				return true;
			}
		}
		return false;
	}

	/**
	 * ステータス変更画面を表示します.
	 * @param isForward イベントタイプの向き（次へ進む場合はtrueを指定する）
	 */
	protected showStatusChange(isForward: boolean): void {

		let form: EIMFormDomain = this.formDomainService.excludeNullAttributeList(this.form);
		let eventTypeList: EIMEventTypeDomain[] = this.getEventTypeList(this.workflow.eventTypeList, EIMConstantService.EVENT_TYPE_ID_SET_ASSIGNMENT_PLAN_BASE, this.form.status.type.id, isForward);

		let dialogId: string = this.dialogManagerComponentService.showStatusChange(
			form, this.workflow, eventTypeList, {
				executed: (data: any[]) => {
					// ステータス変更画面を閉じる
					this.dialogManagerComponentService.close(dialogId);
					// ステータスの変更を通知する
					this.statusChanged.emit([{ id: this.form.id, attributeList: this.form.attributeList }]);
				},
				errored: () => {
					// ステータス変更画面を閉じる
					this.dialogManagerComponentService.close(dialogId);

				}
			});
	}

	/**
	 * イベントタイプのリストから指定の向きのイベントタイプのリストを抽出して返却します.
	 * ただし、取戻し用のイベントタイプ、または遷移元のスタータスが現行ステータスでないイベントタイプは無視します.
	 * @param eventTypeList イベントタイプのリスト
	 * @param baseId イベントタイプベースID
	 * @param currentStatusTypeId 現行ステータスタイプID
	 * @param isForward イベントタイプの向き（次へ進む場合はtrueを指定する）
	 * @return 存在する場合true
	 */
	protected getEventTypeList(eventTypeList: EIMEventTypeDomain[], baseId: number, currentStatusTypeId: number, isForward?: boolean): EIMEventTypeDomain[] {
		let list: EIMEventTypeDomain[] = [];

		for (let i = 0; i < eventTypeList.length; i++) {
			let eventType: EIMEventTypeDomain = eventTypeList[i];
			if (eventType.base.id != baseId) {
				// 対象外
				continue;
			}

			if (eventType.fromStatusType.id != currentStatusTypeId) {
				// 現在のステータスタイプからのイベントタイプでない場合は対象外
				continue;
			}

			if (isForward === undefined) {
				list.push(eventType);
			} else {
				let sub: number = eventType.toStatusType.sequence - eventType.fromStatusType.sequence;
				if (isForward && sub >= 0) {
					list.push(eventType);
				}
				if (!isForward && sub <= 0) {
					list.push(eventType);
				}
			}
		}
		return list;
	}

}
