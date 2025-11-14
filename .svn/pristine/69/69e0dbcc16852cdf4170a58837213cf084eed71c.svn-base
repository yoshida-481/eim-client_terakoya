import { Component, ViewChild, Input, EventEmitter, Output, forwardRef, SimpleChanges, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceGetParam, EIMObjectAPIServiceUpdateParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMNumberInputFormItemComponentService } from 'app/shared/components/input-form-item/number-input-form-item/number-input-form-item.component.service';
import { NgForm } from '@angular/forms';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMCalendarInputFormItemComponentService } from 'app/shared/components/input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMComboBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { SelectItem } from 'primeng/api';
import { EIMUpdatedProjectDTO } from 'app/tasks/tasks.interface';
import { EIMConfigService } from 'app/shared/services/config.service';

/**
 * プロジェクト更新コンポーネント
 * @example
 *
 *      <eim-project-updator
 *				[projectId]="projectId"
 *				[disabled]="disabled"
 *				(changed)="onChanged($event)"
 *				(updated)="onUpdated($event)"
 *      >
 *      </eim-project-updator>
 */
@Component({
	selector: 'eim-project-updator',
	templateUrl: './project-updator.component.html',
	styleUrls: ['./project-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProjectUpdatorComponent)}, ],
	standalone: false
})
export class EIMProjectUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** タスクフォーム */
	@ViewChild('projectForm', { static: true }) projectForm: EIMFormComponent;

	/** プロジェクトId */
	@Input() projectId: number;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** プロジェクト情報取得完了時のイベントエミッタ */
	@Output() initialized: EventEmitter<EIMSimpleObjectDTO> = new EventEmitter<EIMSimpleObjectDTO>();

	/** 属性値変更変更イベントエミッタ */
	@Output() changed: EventEmitter<any> = new EventEmitter<any>();

	/** プロジェクト更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<EIMUpdatedProjectDTO> = new EventEmitter();

	/** 無効かどうか */
	public componentDisabled = true;

	/** プロジェクトのフォーム形式の簡易結果DTO */
	public projectFormFormatResult: EIMFormFormatResultDTO;
	/** プロジェクト情報 */
	public projectDto: EIMSimpleObjectDTO;

	/** プロジェクト名 */
	public projectName: string[] = [];

	/** 編集権限有無(フッタボタン表示可否判定時に使用) */
	public hasUpdateAccessAuthority = false;

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		// 成果物保存先
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER,
		// 雛型プロジェクト名
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_PROJECT_NAME,
		// 進捗率	
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,
	]);

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected changeDetectorRef: ChangeDetectorRef,
		protected objectAPIService: EIMObjectAPIService,
		protected attributeService: EIMAttributeService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected numberInputFormItemComponentService: EIMNumberInputFormItemComponentService,
		protected calendarInputFormItemComponentService: EIMCalendarInputFormItemComponentService,
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService,
		protected messageService: EIMMessageService,
		protected configService: EIMConfigService
	) {


	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {

		if (this.projectId) {

			// フォームを初期化
			this.initializeForm();

		}
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
		};
	}

	/**
	 * プロジェクト情報を更新します.
	 */
	public update(): void {
		this.projectDto.name = this.projectName[0];
		let param: EIMObjectAPIServiceUpdateParam = {
			dto: this.projectDto,
		}
		this.objectAPIService.update(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.updated.emit({parentDTO: null, updatedDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロジェクト更新可否を返却します.
	 * @return プロジェクト更新可否
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
	ngOnChanges(changes: SimpleChanges) {

		// 非活性変更時
		// if (changes.hasOwnProperty('disabled')) {
		// 	this.disabled = changes.disabled.currentValue ?? false;
		// }

		if (!this.projectId) {
			return;
		}

		// 表示対象のプロジェクトIDの変更チェック
		if (!changes.projectId && this.projectFormFormatResult) {
			if (changes.disabled) {
				this.updateComponentDisabled();
			}
			window.setTimeout(() => {
				// フォーム初期化
				this.initializeInputFormItems(this.projectFormFormatResult);
			});
			return;
		} else {

			// フォームを初期化
			this.initializeForm();
		}
	}

	/**
	 * コンテンツチェック後のイベントハンドラです.
	 */
	ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

	/**
	 * 属性変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangeAttribute(event): void {
		this.changed.emit();
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

		// プロジェクト名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02008'),
			value: this.projectName, required: true
		}));

		// プロジェクト進捗状況
		inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
			name: 'progress', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS),
			value: formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS].values,
			options: this.getProgressOptions(formFormatResult)
		}));	

		// 進捗率
		inputFormItems.push(this.numberInputFormItemComponentService.createInputFormDomain({
			name: 'progressRate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE),
			valueType: 'LONG',
			value: formFormatResult.dto.exAttributeMap['progressRate'] ? [formFormatResult.dto.exAttributeMap['progressRate']] : [0], 
			disabled: true,
			styleClass: 'eim-task-input-form-item-progress-rate'
		}));

		// 開始予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'startDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE),
			value: formFormatResult.dto.exAttributeMap['minStartDate'] ? [formFormatResult.dto.exAttributeMap['minStartDate']] : [],
			disabled: true, useTimeNumber: true, 

			// @contentが使用できないための暫定処置として開始予定日/終了予定日を縦並びにする
			// （横並びにするとワークスペース-ホームで表示した際、終了予定日のラベルが見えなくなる）
			// https://ctcg.sharepoint.com/:x:/t/EIMANAGER747/EcyyPbKeZFdHhunmUiDGjfkBKqH64dAcBTok9Dh6oPUlMQ?e=Ckfn5z
			// No211参照
			styleClass: ' eim-md-12' 

		}));

		// 終了予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'endDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE),
			value: formFormatResult.dto.exAttributeMap['maxEndDate'] ? [formFormatResult.dto.exAttributeMap['maxEndDate']] : [],
			disabled: true, useTimeNumber: true, 

			// @contentが使用できないための暫定処置として開始予定日/終了予定日を縦並びにする
			// （横並びにするとワークスペース-ホームで表示した際、終了予定日のラベルが見えなくなる）
			// https://ctcg.sharepoint.com/:x:/t/EIMANAGER747/EcyyPbKeZFdHhunmUiDGjfkBKqH64dAcBTok9Dh6oPUlMQ?e=Ckfn5z
			// No211参照
			styleClass: ' eim-md-12' 
		}));

		// 完了日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'completeDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE),
			value: formFormatResult.dto.exAttributeMap['maxCompletionDate'] ? [formFormatResult.dto.exAttributeMap['maxCompletionDate']] : [],
			disabled: true, useTimeNumber: true
		}));


		// 雛型プロジェクト名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02052'),
			value: formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_PROJECT_NAME].values, 
			disabled: true, required: false
		}));

		return inputFormItems;
	}

	/**
	 * プロジェクト進捗状況のオプションリストを返却します.
	 *
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns プロセスタイプのオプションリスト
	 */
	protected getProgressOptions(formFormatResult: EIMFormFormatResultDTO): any {
		let options: SelectItem[] = [];

		const mapObject = this.configService.get('tasks.projectProgressIdToResourceId');
		for (const key in mapObject) {
			options.push({'label': this.translateService.instant(mapObject[key]), 'value': Number(key)});
		}

		return options;
	}

	/**
	 * フォームを初期化します.
	 */
	private initializeForm(): void {

		// プロジェクト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: this.projectId,
			refObjectExpansionLevel: 1, // オブジェクト型属性を取得するためには1以上を指定
		}
		param.exParameter = {
			[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
			[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ACCESS_ROLE_TYPE_NAME_MAP]: {
				[EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT]: [EIMConstantService.PROC_DEFNAME_UPDATE]
			},
			[EIMTaskConstantService.PLUG_IN_PARAM_NAME_INCLUDE_PROGRESS_AND_SCHEDULE]: true,
		}

		this.objectAPIService.get(param).subscribe((res: any) => {

			const formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			if (formFormatResult.dto.id !== this.projectId) {
				return;
			}

			// 編集権限チェック
			this.hasUpdateAccessAuthority = formFormatResult.dto.exAttributeMap?.accessRoleTypeNameMap?.UPDATE === true;

			this.updateComponentDisabled();

			// プロジェクト情報初期化
			this.projectFormFormatResult = formFormatResult;
			this.projectDto = formFormatResult.dto;
			this.projectName = [this.projectDto.name];

			// this.disabledが反映されるまで待つ
			window.setTimeout(() => {
			
				// フォーム初期化
				this.initializeInputFormItems(formFormatResult);

				this.initialized.emit(this.projectDto);
			});
		});
		
	}
	/**
	 * 入力フォームアイテムリストを初期化します.
	 * 
	 * @param projectFormFormatResult プロジェクトのフォーム形式の簡易結果DTO
	 */
	private initializeInputFormItems(projectFormFormatResult: EIMFormFormatResultDTO): void {

		// 画面上部初期化
		this.propertyForm.setInputFormItems(
			this.createStaticInputFormItems(projectFormFormatResult));
		// 画面下部初期化
		this.projectForm.setFormFormatResult(projectFormFormatResult, 
				this.excludeInputFormItemDefNameSet, new Set([EIMTaskConstantService.NAMESPACE_APP_TASK_USER]));
	}

	/**
	 * 編集可否を更新します.
	 */
	private updateComponentDisabled(): void {
	
		this.componentDisabled = this.disabled || 
			!this.hasUpdateAccessAuthority;

	}
}
