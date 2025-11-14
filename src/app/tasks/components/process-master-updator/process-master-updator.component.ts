import { Component, ViewChild, Input, EventEmitter, Output, forwardRef, SimpleChanges, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceGetParam } from 'app/shared/services/apis/object-api.service';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { SelectItem } from 'primeng/api';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMComboBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { NgForm } from '@angular/forms';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUpdatedProcessMasterDTO } from 'app/tasks/tasks.interface';

/**
 * プロセスマスタ更新コンポーネント
 * @example
 *
 *      <eim-process-master-updator>
 *				[parentDTO]="parentDTO"
 *				[processDTO]="processDTO"
 *				(created)="onCreated($event)">
 *      </eim-process-master-updator>
 */
@Component({
	selector: 'eim-process-master-updator',
	templateUrl: './process-master-updator.component.html',
	styleUrls: ['./process-master-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProcessMasterUpdatorComponent)}, ],
	standalone: false
})
export class EIMProcessMasterUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** プロセスフォーム */
	@ViewChild('processForm', { static: true }) processForm: EIMFormComponent;

	/** 親のオブジェクト */
	@Input() parentDTO: EIMSimpleObjectDTO;

	/** プロセス情報 */
	@Input() processDTO: EIMSimpleObjectDTO;

	/** プロセスマスタ更新完了時イベントエミッタ */
	@Output() updated: EventEmitter<EIMUpdatedProcessMasterDTO> = new EventEmitter();

	/** フォーム形式の簡易結果DTO（プロセス情報） */
	public formFormatResult: EIMFormFormatResultDTO;

	/** プロセス名 */
	public processName: string[] = [];

	/** プロセスタイプID */
	public processTypeId: number[] = [];

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		// プロセスタイプ
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROCESS_TYPE
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
		protected messageService: EIMMessageService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * プロセスマスタ情報を更新します.
	 */
	public update(): void {
		this.formFormatResult.dto.name = this.processName[0];
		let param: EIMObjectAPIServiceCreateParam = {
			dto: this.formFormatResult.dto,
		}
		this.objectAPIService.update(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.updated.emit({parentDTO: this.parentDTO, updatedDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロセスマスタ情報を登録可能かどうか返却します.
	 * @returns プロセスマスタ情報を登録可能ならばtrue
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

		// processDTO変更時のみ情報取得
		if (changes['processDTO'] === undefined || 
				changes['processDTO'].currentValue === changes['processDTO'].previousValue) {
			return;
		}

		// 属性レイアウト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: this.processDTO.id,
			refObjectExpansionLevel: 1, // オブジェクト型属性を取得するためには1以上を指定
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				includeRecursiveObjectTypes: true
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			this.formFormatResult = new EIMFormFormatResultDTO(res);

			// プロセスマスタ情報初期化
			this.processName = [this.formFormatResult.dto.name];

			// 画面上部初期化
			this.propertyForm.setInputFormItems(
				this.createStaticInputFormItems(this.formFormatResult));

			// 画面下部初期化
			this.processForm.setFormFormatResult(this.formFormatResult, this.excludeInputFormItemDefNameSet);
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
			name: 'parent', label: this.translateService.instant('EIM_TASKS.LABEL_02027'),
			value: [this.parentDTO.name], disabled: true
		}));

		// プロセスマスタ名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02030'),
			value: this.processName, disabled: false, required: true
		}));

		// プロセスタイプ
		inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
			name: 'projectType', label: this.translateService.instant('EIM_TASKS.LABEL_02025'),
			value: this.formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROCESS_TYPE].values,
			disabled: false, required: true,
			options: this.getProcessTypesOptions(formFormatResult)
		}));

		return inputFormItems;
	}

	/**
	 * プロセスタイプのオプションリストを返却します.
	 *
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns プロセスタイプのオプションリスト
	 */
	protected getProcessTypesOptions(formFormatResult: EIMFormFormatResultDTO): any {
		let options: SelectItem[] = [];

		let processObjectTypes: EIMObjectTypeDomain[] = formFormatResult.info.processObjectTypes ?? null;
		if (processObjectTypes === null) {
			return [];
		}

		for (let processObjectType of processObjectTypes) {
			options.push({'label': processObjectType.name, 'value': processObjectType.id});
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
