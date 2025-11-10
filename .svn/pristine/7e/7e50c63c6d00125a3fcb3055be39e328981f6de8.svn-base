import { Component, ViewChild, Input, EventEmitter, Output, forwardRef, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceGetParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMComboBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { SelectItem } from 'primeng/api';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { AbstractControl, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { EIMInputFormItemComponentChangedEmitValueDomain } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMValueTypeEnumeration } from 'app/shared/enumerations/value-type-enumeration';
import { EIMTextAreaInputFormItemComponentService } from 'app/shared/components/input-form-item/text-area-input-form-item/text-area-input-form-item.component.service';
import { EIMResponsibleObjectRoleInputFormItemComponentService } from '../responsible-object-role-input-form-item/responsible-object-role-input-form-item.component.service';
import { EIMCalendarInputFormItemComponentService } from 'app/shared/components/input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { createRangeValidator } from 'app/shared/validators/range.validator';
import { EIMCreatedTaskDTO } from 'app/tasks/tasks.interface';

/**
 * タスク登録コンポーネント
 * @example
 *
 *      <eim-task-creator
 *				[parentDTO]="parentDTO"
 *				(created)="onCreated($event)"
 *      >
 *      </eim-task-creator>
 */
@Component({
	selector: 'eim-task-creator',
	templateUrl: './task-creator.component.html',
	styleUrls: ['./task-creator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMTaskCreatorComponent)}, ],
	standalone: false
})
export class EIMTaskCreatorComponent implements EIMCreatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** タスクフォーム */
	@ViewChild('taskForm', { static: true }) taskForm: EIMFormComponent;

	/** ワークスペースDTO */
	@Input() workspaceDTO: EIMSimpleObjectDTO;

	/** 親のオブジェクトDTO */
	@Input() parentDTO: EIMSimpleObjectDTO;

	/** タスク登録完了時のイベントエミッタ */
	@Output() created: EventEmitter<EIMCreatedTaskDTO> = new EventEmitter();

	/** タスク情報 */
	public taskDTO: EIMSimpleObjectDTO;

	/** タスク名 */
	public taskName: string[] = [];

	/** タスクタイプID */
	public taskTypeId: number[] = [];

	/** 担当役割 */
	private responsibleObjectRole: number[] = [];

	/** 作業内容 */
	private workDetails: string[] = [];

	/** 開始予定日 */
	private startYoteiDate: Date[] = [];
	
	/** 終了予定日 */
	private endYoteiDate: Date[] = [];

	/** タスクのカスタム属性値を変更したかどうかのフラグ */
	protected isChangedCustomAttributeValue = false;

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE,			// 担当
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT,		// 作業内容
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE,	// 開始予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE,	// 終了予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE,		// 完了日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,		// 進捗率
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_STATUS,				// ステータス
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_FILE,		// 雛型ファイル
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT,			// 成果物
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER,	// 成果物保存先
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_MEMO,			// メモ

		// TODO:以下のテストデータを消します。
		'app.task.dev:更新内容',
		'app.task.dev:添付ファイル',
		'app.task.dev:事前通知日',
		'app.task.dev:無効フラグ',
		'app.task.dev:担当1',
		'app.task.dev:成果物保存先_Del',
	]);


	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected messageService: EIMMessageService,
		protected changeDetectorRef: ChangeDetectorRef,
		protected objectAPIService: EIMObjectAPIService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected textAreaInputFormItemComponentService: EIMTextAreaInputFormItemComponentService,
		protected calendarInputFormItemComponentService: EIMCalendarInputFormItemComponentService,
		protected responsibleObjectRoleInputFormItemComponentService: EIMResponsibleObjectRoleInputFormItemComponentService,
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService
	) {


	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * タスク情報を登録します.
	 */
	public create(): void {
		const taskDTO = new EIMSimpleObjectDTO();
		taskDTO.name = this.taskName[0];
		taskDTO.type = {'id': this.taskTypeId[0]};

		// 属性設定（デフォルト値を設定する属性タイプの場合はフィルタ）
		taskDTO.attributeMap = Object.keys(this.taskDTO.attributeMap)
			.filter(key => 
				// 進捗率
				key !== EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE &&
				// 無効フラグ
				key !== EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_DISABLED_FLAG)
			.reduce((acc, key) => {
				acc[key] = this.taskDTO.attributeMap[key];
				return acc;
			}, {});
		
		// 担当
		taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE] = {
			valueType: EIMValueTypeEnumeration.LONG,
			values: this.responsibleObjectRole,
		};

		// 作業内容
		taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT] = {
			valueType: EIMValueTypeEnumeration.TEXT,
			values: this.workDetails,
		}

		// 開始予定日
		taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE] = {
			valueType: EIMValueTypeEnumeration.DATE,
			values: this.startYoteiDate,
		}
		
		// 終了予定日
		taskDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE] = {
			valueType: EIMValueTypeEnumeration.DATE,
			values: this.endYoteiDate,
		}

		let param: EIMObjectAPIServiceCreateParam = {
			dto: taskDTO,
			parentObjectId: this.parentDTO.id
		}
		this.objectAPIService.create(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.created.emit({parentDTO: this.parentDTO, createdDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * タスク登録可否を返却します.
	 * @return タスク登録可否
	 */
	public creatable(): boolean {
		return this.form.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngOnInit(): void {

		// 属性レイアウト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: 0,
			adapterId: 'getEmptyObjectServiceAdapter2',
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				objectTypeDefinitionName: EIMTaskConstantService.OBJECT_TYPE_NAME_TASK,
				includeRecursiveObjectTypes: true,
				[EIMConstantService.PLUG_IN_PARAM_NAME_WORKSPACE_ID]: this.workspaceDTO.id
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// タスク情報初期化
			this.taskDTO = formFormatResult.dto;
			this.taskTypeId = [formFormatResult.dto.type.id];

			// 画面上部初期化
			this.propertyForm.setInputFormItems(
				this.createStaticInputFormItems(formFormatResult));

			// 画面下部初期化
			this.taskForm.setFormFormatResult(formFormatResult, this.excludeInputFormItemDefNameSet);
		});
	}

	/**
	 * コンテンツチェック後のイベントハンドラです.
	 */
	ngAfterViewChecked(): void {
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * タスクの上部固定の入力フォーム値変更時のイベントハンドラです.
	 *
	 * @param emitValue 入力フォームコンポーネントの値変更イベントエミッタの設定値
	 */
	public onChangedStaticInputFormItemValue(emitValue: EIMInputFormItemComponentChangedEmitValueDomain): void {

		if (emitValue.name === 'taskType') {

			// カスタム属性値変更時
			if (this.isChangedCustomAttributeValue) {

				this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_TASKS.CONFIRM_00001') ,
					// YES
					() => {
						// 変更したオブジェクトタイプに紐づく属性タイプ情報リストを取得し画面下部初期化
						this.redrawTaskForm(emitValue.currentValue);
						this.isChangedCustomAttributeValue = false;
					},
					// NO
					() => {
						// 選択を元に戻す
						this.taskTypeId = [emitValue.currentValue];
						emitValue.component.writeValue(this.taskTypeId);
					}
				);
			// カスタム属性値未変更時
			} else {
				// 変更したオブジェクトタイプに紐づく属性タイプ情報リストを取得し画面下部初期化
				this.redrawTaskForm(emitValue.currentValue);
			}
		}
		
		// 開始予定日変更時
		if (emitValue.name === 'startYoteiDate') {

			// 終了予定日再検証
			this.form.controls['endYoteiDate_0']?.updateValueAndValidity();
		}
		// 終了予定日変更時
		if (emitValue.name === 'endYoteiDate') {

			// 開始予定日再検証
			this.form.controls['startYoteiDate_0']?.updateValueAndValidity();
		}
	}

	/**
	 * プロセスのカスタム属性値変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangedCustomAttributeValue(event): void {
		this.isChangedCustomAttributeValue = true;
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
			name: 'parent', label: this.translateService.instant('EIM_TASKS.LABEL_02027'),
			value: [this.parentDTO.name], disabled: true
		}));

		// タスク名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02009'),
			value: this.taskName, disabled: false, required: true
		}));

		// タスクタイプ
		inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
			name: 'taskType', label: this.translateService.instant('EIM_TASKS.LABEL_02026'),
			value: this.taskTypeId, disabled: false, required: true,
			options: this.getTaskTypesOptions(formFormatResult)
		}));

		// 担当
		inputFormItems.push(this.responsibleObjectRoleInputFormItemComponentService.createInputFormDomain({
			name: 'responsibleObjectRole', label: this.translateService.instant('EIM_TASKS.LABEL_02020'),
			value: this.responsibleObjectRole,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE, multiple: true,
			selectedObjectRoles: []
		}));

		// 作業内容
		inputFormItems.push(this.textAreaInputFormItemComponentService.createInputFormDomain({
			name: 'workDetails', label: this.translateService.instant('EIM_TASKS.LABEL_02040'),
			value: this.workDetails,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_WORK_CONTENT, disabled: false, required: false
		}));

		// 開始予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'startYoteiDate', label: this.translateService.instant('EIM_TASKS.LABEL_02014'),
			value: this.startYoteiDate,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE, disabled: false, required: false,
			validators: [
				createRangeValidator(null, this.endYoteiDate, false, true)
			]
		}));
		
		// 終了予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'endYoteiDate', label: this.translateService.instant('EIM_TASKS.LABEL_02015'),
			value: this.endYoteiDate,
			definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE, disabled: false, required: false,
			validators: [
				createRangeValidator(this.startYoteiDate, null, true)
			]
		}));

		return inputFormItems;
	}

	/**
	 * タスクタイプのオプションリストを返却します.
	 *
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns プロセスタイプのオプションリスト
	 */
	protected getTaskTypesOptions(formFormatResult: EIMFormFormatResultDTO): any {
			let options: SelectItem[] = [];

			let taskObjectTypes: EIMObjectTypeDomain[] = formFormatResult.info.taskObjectTypes;
			if (taskObjectTypes === null) {
				return [];
			}

			for (let taskObjectType of taskObjectTypes) {
				options.push({'label': taskObjectType.name, 'value': taskObjectType.id});
			}

			return options;
		}

	/**
	 * 変更したオブジェクトタイプに紐づく属性タイプ情報リストを取得し画面下部初期化
	 *
	 * @param objectTypeId 変更後のオブジェクトタイプID
	 */
	protected redrawTaskForm(objectTypeId: number): void {
		// 属性レイアウト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: 0,
			adapterId: 'getEmptyObjectServiceAdapter2',
			exParameter: {
				objectTypeId: objectTypeId, // getEmptyObjectServiceAdapter2用
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// タスク情報初期化
			this.taskDTO = formFormatResult.dto;
			this.taskTypeId = [formFormatResult.dto.type.id];

			// 画面下部初期化
			this.taskForm.setFormFormatResult(formFormatResult, this.excludeInputFormItemDefNameSet);
		});

	}

}
