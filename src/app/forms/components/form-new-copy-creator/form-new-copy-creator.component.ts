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
import { EIMStatusDomain } from 'app/shared/domains/entity/status.domain';
import { EIMStatusTypeDomain } from 'app/shared/domains/entity/status-type.domain';
import { EIMWorkflowDomain } from 'app/shared/domains/entity/workflow.domain';

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

import { EIMFormCreatorComponent } from 'app/forms/components/form-creator/form-creator.component';
import { take, combineLatest } from 'rxjs/operators';
import { EIMFormAttributeTypeLayoutOptionBuilderFactoryService } from 'app/forms/shared/services/form-attribute-type-layout-option-builder-factory.service';
import { EIMFormAttributeTypeLayoutOptionBuilderService } from 'app/forms/shared/services/form-attribute-type-layout-option-builder.service';

/**
 * 帳票詳細コンポーネント(流用)
 * @example
 *
 *      <eim-form-new-copy-creator
 *        [workspaceId]="workspaceId"
 *        [typeId]="typeId"
 *        [folderId]="folderId"
 *        [securityId]="securityId"
 *        [sourceId]="sourceId"
 *      >
 *      </eim-form-new-copy-creator>
 */
@Component({
    selector: 'eim-form-new-copy-creator',
    templateUrl: './form-new-copy-creator.component.html',
    styleUrls: ['./form-new-copy-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormNewCopyCreatorComponent) }
    ],
    standalone: false
})
export class EIMFormNewCopyCreatorComponent extends EIMFormCreatorComponent implements OnInit, EIMCreatable {

	/** 流用元帳票ID */
	@Input() sourceId: number;


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
		protected attributeTypeLayoutOptionBuilderFactoryService: EIMFormAttributeTypeLayoutOptionBuilderFactoryService,
	) {
		super(translateService, attributeListInputFormItemComponentService, attachementFileInputFormItemComponentService,
			attributeService, messageService, formDomainService, formsCacheService, fileService, formService, formEventService, dialogManagerComponentService,
			workflowDiagramComponentService, serverConfigService, formTypeService, attributeTypeLayoutOptionBuilderFactoryService);

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

		this.formService.newCopy(form)
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
			},
				(err: any) => {
					// エラー発生時
					this.creating = false;
				});

		this.attachementFileInputFormItemComponentService.clear();
	}


	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------


	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	protected show(): void {
		if (!this.typeId || !this.sourceId)
			return;

		// 帳票情報取得
		let formObservable = this.formService.getByIdForNewCopy(this.sourceId).pipe(combineLatest(
			this.formTypeService.getById(this.typeId),
			(sourceForm: EIMFormDomain, formType: EIMFormTypeDomain): EIMFormDomain => {
				let form: EIMFormDomain = this.createForm(formType);
				this.copyForm(sourceForm, form);

				this.workflow = formType.workflow;

				return form;
			}
		)).pipe(take(1));

		formObservable.subscribe(
			(form: EIMFormDomain) => {
				this.initContents(form);

				// 帳票情報を取得
				let builder: EIMFormAttributeTypeLayoutOptionBuilderService = this.attributeTypeLayoutOptionBuilderFactoryService.create(form);
				this.attributeTypeLayoutOption = builder.build(form);

				if (form.status) {
					// カレントステータス属性追加
					this.statusTypeAttributeListMap[this.currentStatusTypeLayout.id] = this.form.status.attributeList;


					// ワークフロー情報を表示
					window.setTimeout(() => {
						this.workflowDiagram.clear();
						let currentStatus: EIMStatusDomain = new EIMStatusDomain();
						currentStatus.type = form.type.workflow.statusTypeList[0];
						this.workflowDiagram.show({ form: form, workflow: form.type.workflow });
					});
				}
			},
			(err: any) => {
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);
	}

	/**
	 * 帳票タイプから帳票を生成します.
	 * @param formType 帳票タイプ情報
	 * @return 帳票情報
	 */
	protected createForm(formType: EIMFormTypeDomain): EIMFormDomain {
		let form = super.createForm(formType);

		// 複製元オブジェクトIDを設定
		this.setAttributeValue(form.attributeList, EIMConstantService.ATTRIBUTE_TYPE_NAME_SRC_OBJECT_ID, "LONG", [this.sourceId]);

		return form;
	}

	/**
	 * 流用元帳票を流用先帳票にコピーします.
	 * @param copyFrom 流用元帳票情報
	 * @param copyTo 流用先帳票情報
	 */
	protected copyForm(copyFrom: EIMFormDomain, copyTo: EIMFormDomain): void {
		// オブジェクトの属性値をコピー
		this.copyAttribute(
			copyFrom.formLayout.objectTypeLayout.attributeTypeLayoutList, copyFrom.attributeList,
			copyTo.formLayout.objectTypeLayout.attributeTypeLayoutList, copyTo.attributeList);

		// カレントステータスの属性値をコピー
		if (copyFrom.status && copyTo.status) {
			this.copyAttribute(
				copyFrom.formLayout.currentStatusTypeLayout.attributeTypeLayoutList, copyFrom.status.attributeList,
				copyTo.formLayout.currentStatusTypeLayout.attributeTypeLayoutList, copyTo.status.attributeList);
		}
	}

	/**
	 * 流用元帳票の属性値を流用先帳票の属性にコピーします.
	 * @param copyFromAttributeLayoutList 流用元属性レイアウト情報リスト
	 * @param copyFromAttributeList 流用元属性情報リスト
	 * @param copyToAttributeLayoutList 流用先属性レイアウト情報リスト
	 * @param copyToAttributeList 流用先属性情報リスト
	 */
	protected copyAttribute(
		copyFromAttributeLayoutList: EIMAttributeTypeLayoutDomain[], copyFromAttributeList: EIMAttributeDomain[],
		copyToAttributeLayoutList: EIMAttributeTypeLayoutDomain[], copyToAttributeList: EIMAttributeDomain[]): void {

		// 流用元のすべての属性値をマップ化
		let copyFromAttributeAllMap: any = {};
		for (let i = 0; i < copyFromAttributeList.length; i++) {
			copyFromAttributeAllMap[copyFromAttributeList[i].attributeType.id] = copyFromAttributeList[i];
		}

		// 流用元の複製フラグがONの属性値のみをマップ化
		let copyFromAttributeMap: any = {};
		for (let i = 0; i < copyFromAttributeLayoutList.length; i++) {
			let layout: EIMAttributeTypeLayoutDomain = copyFromAttributeLayoutList[i];
			if (!layout.newCopyFlag || copyFromAttributeAllMap[layout.id] == null) {
				continue;
			}
			copyFromAttributeMap[layout.id] = copyFromAttributeAllMap[layout.id];
		}

		// 流用先のすべての属性値をマップ化
		let copyToAttributeAllMap: any = {};
		for (let i = 0; i < copyToAttributeList.length; i++) {
			copyToAttributeAllMap[copyToAttributeList[i].attributeType.id] = copyToAttributeList[i];
		}

		// 流用元属性値を流用先属性値にコピー
		for (let i = 0; i < copyToAttributeLayoutList.length; i++) {
			let typeId: number = copyToAttributeLayoutList[i].id
			let copyFromAttr: EIMAttributeDomain = copyFromAttributeMap[typeId];
			let copyToAttr: EIMAttributeDomain = copyToAttributeAllMap[typeId];
			if (copyFromAttr == null) {
				continue;
			}
			if (copyFromAttr.attributeType.definitionName.startsWith(EIMConstantService.NAME_SPACE_APP_FORM_DEV + ":")) {
				continue;
			}

			if (copyToAttr == null) {
				// 追加
				copyToAttributeList.push(copyFromAttr);
			} else {
				// 更新
				copyToAttr.setValueList(copyFromAttr.getValueList());
			}
		}
	}
}
