import { Component, forwardRef, ViewChild, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';

import { EIMAttachementFileInputFormItemComponentService } from 'app/shared/components/input-form-item/attachement-file-input-form-item/attachement-file-input-form-item.component.service';

import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMFormDomainService } from 'app/forms/shared/services/form-domain.service';
import { EIMFormsCacheService } from 'app/forms/shared/services/forms-cache.service';

import { EIMFileService } from 'app/shared/services/apis/file.service';
import { EIMFormService } from 'app/forms/shared/services/apis/form.service';
import { EIMFormEventService } from 'app/forms/shared/services/apis/form-event.service';
import { EIMFormTypeService } from 'app/forms/shared/services/apis/form-type.service';

import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMSecurityDomain } from 'app/shared/domains/entity/security.domain';
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';
import { EIMFormDomain } from 'app/shared/domains/form.domain';
import { EIMFormEventDomain } from 'app/shared/domains/form-event.domain';
import { EIMFormLayoutDomain } from 'app/shared/domains/form-layout.domain';
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

import { EIMFormUpdatorComponent } from 'app/forms/components/form-updator/form-updator.component';
import { EIMFormsConstantService } from 'app/forms/shared/services/forms-constant.service';
import { EIMFormAttributeTypeLayoutOptionBuilderFactoryService } from 'app/forms/shared/services/form-attribute-type-layout-option-builder-factory.service';
import { AttributeTypeLayoutOption, EIMFormAttributeTypeLayoutOptionBuilderService } from 'app/forms/shared/services/form-attribute-type-layout-option-builder.service';
/**
 * 帳票詳細コンポーネント（新規登録）
 * @example
 *
 *      <eim-form-creator
 *        [workspaceId]="workspaceId"
 *        [typeId]="typeId"
 *        [folderId]="folderId"
 *        [securityId]="securityId"
 *      >
 *      </eim-form-creator>
 */
@Component({
    selector: 'eim-form-creator',
    templateUrl: './form-creator.component.html',
    styleUrls: ['./form-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormCreatorComponent) }
    ],
    standalone: false
})
export class EIMFormCreatorComponent extends EIMFormUpdatorComponent implements OnInit, EIMCreatable {

	/** 帳票タイプID */
	@Input() typeId: number;

	/** 帳票フォルダID */
	@Input() folderId: number;

	/** 帳票セキュリティID */
	@Input() securityId: number;

	/** 登録完了時のイベントエミッタ */
	@Output() created: EventEmitter<any> = new EventEmitter<any>();

	/** 登録ボタンの表示可否 */
	public visibleCreate: boolean = true;

	/** 登録中かどうか */
	public creating: boolean = false;

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
		// 非表示属性タイプ定義名称Set
		unvisibleAttributeTypeDefinitionNameSet: new Set<string>(),
		// ラベル非表示属性タイプ定義名称Set
		unvisibleLabelAttributeTypeDefinitionNameSet: new Set<string>(),
		// 非活性属性タイプ定義名称Set
		disabledAttributeTypeDefinitionNameSet: new Set<string>(),
	};

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
		protected formTypeService: EIMFormTypeService,
		protected attributeTypeLayoutOptionBuilderFactoryService: EIMFormAttributeTypeLayoutOptionBuilderFactoryService
	) {
		super(translateService, attributeListInputFormItemComponentService, attachementFileInputFormItemComponentService,
			attributeService, messageService, formDomainService, formsCacheService, fileService, formService, formEventService, dialogManagerComponentService,
			workflowDiagramComponentService, serverConfigService, attributeTypeLayoutOptionBuilderFactoryService);

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 帳票情報を登録します.
	 * @param callback 登録完了時のコールバック関数
	 */
	public create(callback?): void {
		this.creating = true;

		// 無効フラグがONのコード値の存在チェック	
		let disableCodeId: Number = this.checkCodeDisable();
		if (disableCodeId != null) {
			this.creating = false;
			this.getCodeErrorMessage(disableCodeId);
			return;
		}

		let form: EIMFormDomain = this.formDomainService.excludeNullAttributeList(this.form);

		this.formService.create(form)
			.subscribe((resForm: EIMFormDomain) => {
				this.id = resForm.id;
				this.form.id = resForm.id;
				this.form.name = resForm.name;
				this.form.modificationDate = resForm.modificationDate;
				if (resForm.status) {
					// WFなしはstatusが空
					this.form.status.id = resForm.status.id;
				}
				for (let i = 0; i < this.form.statusList.length; i++) {
					this.form.statusList[i].id = resForm.statusList[i].id
				}

				this.setURL(resForm.id);

				// ワークフロー情報表示
				this.formService.getWorkflow(resForm)
					.subscribe(
						(workflow: EIMWorkflowDomain) => {
							this.workflow = workflow;

							this.visibleCreate = false;
							this.visibleUpdate = true;

							if (callback) {
								callback();
							}
						});

				// 完了イベントを通知(画面が閉じる)
				this.created.emit([{ id: resForm.id, attributeList: this.form.attributeList, close: !callback && this.serverConfigService.isAutoClose }]);

				// dirty初期化
				window.setTimeout(() => {
					this.propertyForm.control.markAsPristine();
				});

				this.creating = false;
			},
				(err: any) => {
					// エラー発生時
					this.creating = false;
				});

		this.attachementFileInputFormItemComponentService.clear();
	}

	/**
	 * 帳票情報登録可否を返却します.
	 * @return 帳票情報登録可否
	 */
	public creatable(): boolean {
		return this.form.id == 0 && !this.creating && this.getValidWithoutRequired();
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public updatable(): boolean {
		if (this.form.id == 0) {
			// 帳票未登録時
			return this.getValidWithoutRequired();
		}
		return super.updatable();
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

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * ステータス変更ボタン押下イベントハンドラです.
	 * @param event イベント
	 * @param isForward イベントタイプの向き（次へ進む場合はtrueを指定する）
	 */
	onClickStatusChange(event: any, isForward: boolean): void {

		// 非ステータスタイプの属性タイプIDをセットする（非活性化した属性タイプを除く
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

		// 次に進む場合のみ必須チェック.
		if (isForward && !this.getValidRequired(enableAttributeTypeIdSet ,enableStatusAttributeTypeIdSet)) {
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

		if (this.form.id == 0) {
			// 新規登録してから
			this.create(() => { this.showStatusChange(isForward); });

		} else if (this.propertyForm.dirty) {
			// 更新してから
			this.update(() => { this.showStatusChange(isForward); });
		} else {
			this.showStatusChange(isForward);
		}
	}


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	protected show(): void {
		if (!this.typeId)
			return;

		// 属性情報取得
		this.formTypeService.getById(this.typeId)
			.subscribe(
				(formType: EIMFormTypeDomain) => {
					let form: EIMFormDomain = this.createForm(formType);
					this.initContents(form);

					// 帳票情報を取得
					let builder: EIMFormAttributeTypeLayoutOptionBuilderService = this.attributeTypeLayoutOptionBuilderFactoryService.create(form);
					this.attributeTypeLayoutOption = builder.build(form);

					if (form.status) {
						// カレントステータス属性追加
						this.statusTypeAttributeListMap[this.currentStatusTypeLayout.id] = this.form.status.attributeList;

						this.workflow = formType.workflow;

						// ワークフロー情報を表示
						window.setTimeout(() => {
							this.workflowDiagram.clear();
							let currentStatus: EIMStatusDomain = new EIMStatusDomain();
							currentStatus.type = formType.workflow.statusTypeList[0];
							this.workflowDiagram.show({ form: form, workflow: formType.workflow });
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
	 * 帳票タイプから帳票を生成します.
	 * @param formType 帳票タイプ情報
	 * @return 帳票情報
	 */
	protected createForm(formType: EIMFormTypeDomain): EIMFormDomain {
		let form = new EIMFormDomain();

		form.type = formType;
		form.formLayout = formType.formLayout;
		form.attributeList = this.createAttributeList(formType.attributeTypeList);
		// 属性値に初期値設定
		form.attributeList = this.attributeService.getInitializedAttributeList(form.formLayout.objectTypeLayout.attributeTypeLayoutList);

		// 帳票ワークスペースIDを設定
		this.setAttributeValue(form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_WORKSPACE_ID, "LONG", [this.workspaceId]);
		// 帳票タイプフォルダIDを設定
		this.setAttributeValue(form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_FORM_TYPE_FOLDER_ID, "LONG", [this.folderId]);
		// 無効フラグを設定
		this.setAttributeValue(form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_DELETE_FLAG, "LONG", [0]);

		let currentStatus: EIMStatusDomain = this.createCurrentStatus(form, formType);
		if (currentStatus) {
			form.statusList = [currentStatus];
			form.status = currentStatus;
			// ステータスの属性値に初期値設定
			form.status.attributeList = this.attributeService.getInitializedAttributeList(form.formLayout.currentStatusTypeLayout.attributeTypeLayoutList);
		}

		form.security = new EIMSecurityDomain();
		form.security.id = this.securityId;


		return form;
	}

	/**
	 * 属性タイプリストから属性タイプリストを生成します.
	 * @param attributeTypeList 属性タイプ情報リスト
	 * @return 属性情報リスト
	 */
	protected createAttributeList(attributeTypeList: EIMAttributeTypeDomain[]): EIMAttributeDomain[] {
		let attributeList: EIMAttributeDomain[] = [];

		for (let i = 0; i < attributeTypeList.length; i++) {
			let attributeType: EIMAttributeTypeDomain = attributeTypeList[i];
			let attribute: EIMAttributeDomain = new EIMAttributeDomain();
			attribute.attributeType = attributeType;
			attributeList.push(attribute);
		}

		return attributeList;
	}

	/**
	 * カレントステータスを生成します.
	 * @param form 帳票情報
	 * @param formType 帳票タイプ情報
	 * @return カレントステータス
	 */
	protected createCurrentStatus(form: EIMFormDomain, formType: EIMFormTypeDomain): EIMStatusDomain {
		if (formType.workflow == null) {
			return null;
		}

		let status: EIMStatusDomain = new EIMStatusDomain();

		status.attributeList = [];
		status.type = formType.workflow.statusTypeList[0];

		// 属性値を設定
		if (this.formDomainService.existsAttributeTypeLayoutConf(form)) {
			// 属性タイプレイアウト設定ありの場合
			// オブジェクト属性にステータス属性含めた全属性がある
			// そのため、オブジェクト属性から該当するステータス属性を取得して設定する
			let attributeTypeLayoutList: EIMAttributeTypeLayoutDomain[] = formType.formLayout.currentStatusTypeLayout.attributeTypeLayoutList;
			for (let i = 0; i < attributeTypeLayoutList.length; i++) {
				let attributeTypeId: number = attributeTypeLayoutList[i].id;
				for (let j = 0; j < form.attributeList.length; j++) {
					let attribute: EIMAttributeDomain = form.attributeList[j];
					if (attribute.attributeType.id === attributeTypeId) {
						status.attributeList.push(attribute);
					}
				}
			}
		}

		return status;
	}
}
