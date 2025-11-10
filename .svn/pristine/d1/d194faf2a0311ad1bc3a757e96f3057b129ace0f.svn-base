import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, SimpleChange, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceGetParam, EIMObjectAPIServiceUpdateParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { NgForm } from '@angular/forms';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMCalendarInputFormItemComponentService } from 'app/shared/components/input-form-item/calendar-input-form-item/calendar-input-form-item.component.service';
import { EIMAttributeService } from 'app/shared/services/attribute.service';
import { EIMNumberInputFormItemComponentService } from 'app/shared/components/input-form-item/number-input-form-item/number-input-form-item.component.service';
import { EIMUpdatedProcessDTO } from 'app/tasks/tasks.interface';

/**
 * プロセス更新コンポーネント
 * @example
 *
 *      <eim-process-updator
 *          [processId]="processId"
 *					[parentDTO]="parentDTO"
 *          (updated)="onUpdated($event)"
 *      >
 *      </eim-process-updator>
 */
@Component({
	selector: 'eim-process-updator',
	templateUrl: './process-updator.component.html',
	styleUrls: ['./process-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProcessUpdatorComponent)}, ],
	standalone: false
})
export class EIMProcessUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** プロセスフォーム */
	@ViewChild('processForm', { static: true }) processForm: EIMFormComponent;

	/** プロセスId */
	@Input() processId: number;

	/** 親のオブジェクト */
	@Input() parentDTO: EIMSimpleObjectDTO;

	/** 無効かどうか */
	@Input() public disabled = false;

	/** プロセス更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<EIMUpdatedProcessDTO> = new EventEmitter();

	/** 無効かどうか */
	public componentDisabled = true;

	/** プロセス情報 */
	public processDTO: EIMSimpleObjectDTO;

	/** フォーム形式の簡易結果DTO（プロセス情報） */
	public formFormatResult: EIMFormFormatResultDTO;

	/** プロセス名 */
	public processName: string[] = [];

	/** 編集権限有無(フッタボタン表示可否判定時に使用) */
	public hasUpdateAccessAuthority = false;

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROCESS_TYPE,		// プロセスタイプ
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE,	// 開始予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE,	// 終了予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE,		// 完了日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,		// 進捗率
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE,			// 担当
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_STATUS,				// ステータス
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
		protected messageService: EIMMessageService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * プロセス情報を更新します.
	 */
	public update(): void {
		this.processDTO.name = this.processName[0];
		let param: EIMObjectAPIServiceUpdateParam = {
			dto: this.processDTO,
		}
		this.objectAPIService.update(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.updated.emit({parentDTO: this.parentDTO, updatedDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロセス更新可否を返却します.
	 * @return プロセス更新可否
	 */
	public updatable(): boolean {
		return this.form.dirty && this.form.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngOnInit(): void {

		// プロセス情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: this.processId,
			refObjectExpansionLevel: 1, // オブジェクト型属性を取得するためには1以上を指定
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ACCESS_ROLE_TYPE_NAME_MAP]: {
					[EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS]: ['UPDATE']
				},
				[EIMTaskConstantService.PLUG_IN_PARAM_NAME_INCLUDE_PROGRESS_AND_SCHEDULE]: true,
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			this.formFormatResult = new EIMFormFormatResultDTO(res);

			// 編集権限チェック
			this.hasUpdateAccessAuthority = this.formFormatResult.dto.exAttributeMap?.accessRoleTypeNameMap?.UPDATE === true;

			this.componentDisabled = this.disabled || 
						!this.hasUpdateAccessAuthority;

			// プロセス情報初期化
			this.processDTO = this.formFormatResult.dto;
			this.processName = [this.processDTO.name];

			// this.disabledが反映されるまで待つ
			window.setTimeout(() => {
				// 画面上部初期化
				this.propertyForm.setInputFormItems(
					this.createStaticInputFormItems(this.formFormatResult));

				
				// 画面下部初期化
				this.processForm.setFormFormatResult(this.formFormatResult, this.excludeInputFormItemDefNameSet);
					
			});
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

		// パス
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'path', label: this.translateService.instant('EIM_TASKS.LABEL_02027'),
			value: [this.parentDTO.name], disabled: true
		}));

		// プロセス名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02013'),
			value: this.processName, required: true
		}));

		// プロセスタイプ
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'processType', label: this.translateService.instant('EIM_TASKS.LABEL_02025'),
			value: [this.processDTO.type.name], disabled: true
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
		}));

		// 終了予定日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'endDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE),
			value: formFormatResult.dto.exAttributeMap['maxEndDate'] ? [formFormatResult.dto.exAttributeMap['maxEndDate']] : [],
			disabled: true, useTimeNumber: true,
		}));

		// 完了日
		inputFormItems.push(this.calendarInputFormItemComponentService.createInputFormDomain({
			name: 'completeDate', definitionName: EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE,
			label: this.attributeService.getAttributeTypeName(formFormatResult.info.attributeTypeLayouts, EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE),
			value: formFormatResult.dto.exAttributeMap['maxCompletionDate'] ? [formFormatResult.dto.exAttributeMap['maxCompletionDate']] : [],
			disabled: true, useTimeNumber: true
		}));

		return inputFormItems;
	}

}
