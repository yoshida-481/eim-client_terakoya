import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, SimpleChange, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceGetListParam, EIMObjectAPIServiceGetParam, EIMObjectAPIServiceUpdateParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { SelectItem } from 'primeng/api';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMComboBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMTaskTemplateFileInputFormItemComponentService } from '../task-template-file-input-form-item/task-template-file-input-form-item.component.service';
import { EIMValueTypeEnumeration } from 'app/shared/enumerations/value-type-enumeration';
import { EIMSimpleRelationDTO } from 'app/shared/dtos/simple-relation.dto ';
import { NgForm } from '@angular/forms';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMTextAreaInputFormItemComponentService } from 'app/shared/components/input-form-item/text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMUpdatedTaskMasterDTO } from 'app/tasks/tasks.interface';

/**
 * タスクマスタ更新コンポーネント
 * @example
 *
 *      <eim-task-master-updator
 *          [taskId]="taskId"
 *          [parentPath]="parentPath"
 *          (updated)="onUpdated($event)">
 *      </eim-task-master-updator>
 */
@Component({
	selector: 'eim-task-master-updator',
	templateUrl: './task-master-updator.component.html',
	styleUrls: ['./task-master-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMTaskMasterUpdatorComponent)}, ],
	standalone: false
})
export class EIMTaskMasterUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** タスクフォーム */
	@ViewChild('taskForm', { static: true }) taskForm: EIMFormComponent;

	/** タスクId */
	@Input() taskId: number;

	/** 親のオブジェクト */
	@Input() parentDTO: EIMSimpleObjectDTO;

	/** 親のオブジェクトパス文字列 */
	@Input() parentPath: string;

	/** タスクマスタ更新完了時イベントエミッタ */
	@Output() updated: EventEmitter<EIMUpdatedTaskMasterDTO> = new EventEmitter();

	/** フォーム形式の簡易結果DTO（タスク情報） */
	public formFormatResult: EIMFormFormatResultDTO;

	/** タスク情報 */
	public taskDTO: EIMSimpleObjectDTO;

	/** タスク名 */
	public taskName: string[] = [];

	/** 雛型ファイル */
	public hinagataFiles: EIMSimpleObjectDTO[] = [];

	/** 固定表示する属性タイプ定義名称のセット */
	protected readonly staticInputFormItemDefNameSet = new Set([
		// タスクタイプ
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TASK_TYPE,
		// 担当
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE,
		// 作業内容
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT,

		// TODO: 以下はゴミデータを表示しないためなのでデータをきれいにしたら消してください。
		'app.task.dev:担当1',
		'app.task.dev:メンバー外表示',
		'app.task.dev:更新内容',
		'app.task.dev:雛型ファイル',
	]);

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected changeDetectorRef: ChangeDetectorRef,
		protected objectAPIService: EIMObjectAPIService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected textAreaInputFormItemComponentService: EIMTextAreaInputFormItemComponentService,
		protected templateFileInputFormItemComponentService: EIMTaskTemplateFileInputFormItemComponentService,
		protected messageService: EIMMessageService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * タスクマスタ情報を更新します.
	 */
	public update(): void {
		this.taskDTO.name = this.taskName[0];

		// TODO タスクマスタの属性から「app.task.dev:雛型ファイル」を削除したあとにdelete処理削除
		delete this.taskDTO.attributeMap['app.task.dev:雛型ファイル'];

		/** 雛型ファイル情報 */
		let hinagataDTOs: EIMSimpleRelationDTO[] = [];

		for(let hinagata of this.hinagataFiles) {
			// 雛型ファイルはObjectDTOで保持しているため、RelationDTOに入れ替える
			let hinagataDTO :EIMSimpleRelationDTO = new EIMSimpleRelationDTO();

			hinagataDTO.type = {id:0,name:'雛型',definitionName: '雛型', attributeTypeList:[]};

			hinagataDTO.attributeMap = {};
			// 成果物文書タイプ
			hinagataDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE] = 
				hinagata.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE];
			// 利用方法
			hinagataDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE] = 
				hinagata.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE];
			hinagataDTO.id = hinagata.attributeMap['リレーションID']?.values[0];
			hinagataDTO.attributeMap['リンク更新タイミング'] = hinagata.attributeMap['リンク更新タイミング'];

			hinagataDTO.child = {id:hinagata.id};

			hinagataDTOs.push(hinagataDTO);
		}

		let param: EIMObjectAPIServiceUpdateParam = {
			dto: this.taskDTO,
			exParameter: {
				hinagataDTOs: JSON.stringify(hinagataDTOs)
			}
		}
		this.objectAPIService.update(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.updated.emit({parentDTO: this.parentDTO, updatedDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * タスクマスタ情報を更新可能かどうか返却します.
	 * @returns タスクマスタ情報を更新可能ならばtrue
	 */
	public updatable(): boolean {
		return (this.form.dirty && this.form.valid);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * データバインド入力値を設定後のイベントハンドラです.
	 * @param changes 変更属性
	 */
	ngOnChanges(changes: SimpleChange) {

		// taskId変更時のみ情報取得
		if (changes['taskId'] === undefined || changes['taskId'].currentValue === changes['taskId'].previousValue) {
			return;
		}

		// タスク情報を取得
		let param: EIMObjectAPIServiceGetParam = {

			id: this.taskId,
			refObjectExpansionLevel: 1, // オブジェクト型属性を取得するためには1以上を指定
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				includeTemplateDocuments: true,
				includeRecursiveObjectTypes: true
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			this.formFormatResult = new EIMFormFormatResultDTO(res);

			// タスク情報初期化
			this.taskDTO = this.formFormatResult.dto;
			this.taskName = [this.taskDTO.name];

			// 雛型ファイル情報 relation⇒object
			this.hinagataFiles = [];
			for(const templateDocumentDto of this.taskDTO.exAttributeMap['templateDocumentDtos']) {

				const hinagataFile: EIMSimpleObjectDTO = {
					id: templateDocumentDto.child.id,
					name: templateDocumentDto.child.name,
					revision: templateDocumentDto.child.revision,
					latest: templateDocumentDto.child.latest,
					revisionGroupId: templateDocumentDto.child.revisionGroupId,
					modificationDate: templateDocumentDto.child.modificationDate,
					attributeMap: {
						'リレーションID': {
							valueType: EIMValueTypeEnumeration.LONG,
							values: [templateDocumentDto.id]
						},
						// 成果物文書タイプ
						[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE]: 
							templateDocumentDto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_TYPE],
						// '利用方法
						[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE]: 
							templateDocumentDto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_HOW_TO_USE],
						'リンク更新タイミング': templateDocumentDto.attributeMap['リンク更新タイミング']
					}
				};
				this.hinagataFiles.push(hinagataFile);
			}

			// 画面上部初期化
			this.propertyForm.setInputFormItems(
				this.createStaticInputFormItems(this.formFormatResult));

			// 画面下部初期化
			this.taskForm.setFormFormatResult(this.formFormatResult, this.staticInputFormItemDefNameSet);
		});
	}

	/**
	 * コンテンツチェック後のイベントハンドラです.
	 */
	ngAfterViewChecked(): void {
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event: any, close: EventEmitter<null>): void {
		event.preventDefault();

		if (this.form.dirty) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						close.emit();
					}
			);
		} else {
			close.emit();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 上部固定の入力フォームリストを生成します.
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns 上部固定の入力フォームリスト
	 */
	protected createStaticInputFormItems(formFormatResult: EIMFormFormatResultDTO): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];

		// 親
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'parent',
			label: this.translateService.instant('EIM_TASKS.LABEL_02027'),
			value: [this.parentDTO.name], disabled: true
		}));

		// タスクマスタ名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name',
			label: this.translateService.instant('EIM_TASKS.LABEL_02032'),
			value: this.taskName,
			disabled: false,
			required: true
		}));

		// タスクタイプ
		inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
			name: 'taskType',
			label: this.translateService.instant('EIM_TASKS.LABEL_02026'),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TASK_TYPE].values, 
			disabled: false,
			required: true,
			options: this.getTaskTypesOptions(formFormatResult)
		}));

		// 担当
		inputFormItems.push(this.responsibleObjectRoleInputFormItemComponentService.createInputFormDomain({
			name: 'responsibleObjectRole',
			label: this.translateService.instant('EIM_TASKS.LABEL_02020'),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE].values,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE,
			multiple: true,
			selectedObjectRoles: this.formFormatResult.dto.exAttributeMap['objectRoles']
		}));

		// 作業内容
		inputFormItems.push(this.textAreaInputFormItemComponentService.createInputFormDomain({
			name: 'workDetails',
			label: this.translateService.instant('EIM_TASKS.LABEL_02040'),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT].values,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT,
			required: false
		}));

		// 雛型ファイル
		inputFormItems.push(this.templateFileInputFormItemComponentService.createInputFormDomain({
			name: 'template',
			definitionName: '雛型ファイル',
			label: this.translateService.instant('EIM_TASKS.LABEL_02037'),
			value: this.hinagataFiles,
			documentObjectTypes: formFormatResult.info['documentObjectTypes'],
			templateDocumentDtos: this.hinagataFiles,
			isTemplateFilesEditable: true
		}));

		return inputFormItems;
	}

	/**
	 * タスクタイプのオプションリストを返却します.
	 *
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns タスクタイプのオプションリスト
	 */
	protected getTaskTypesOptions(formFormatResult: EIMFormFormatResultDTO): any {
		let options: SelectItem[] = [];

		let taskObjectTypes: EIMObjectTypeDomain[] = formFormatResult.info.taskObjectTypes ?? null;
		if (taskObjectTypes === null) {
			return [];
		}

		for (let taskObjectType of taskObjectTypes) {
			options.push({'label': taskObjectType.name, 'value': taskObjectType.id});
		}

		return options;
	}

	/**
	 * 属性タイプ定義名称に該当する属性タイプの名称を返却します.
	 *
	 * @param attributeTypeLayouts 属性タイプのレイアウト情報
	 * @param definitionName 定義名称
	 * @returns 属性タイプの名称
	 */
	protected getAttributeTypeName(attributeTypeLayouts: any[], definitionName: string): string {

		for (const layout of attributeTypeLayouts) {
			if (layout.definitionName !== definitionName) {
				continue;
			}

			return layout.name;
		}

		return '';
	}
}
