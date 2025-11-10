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
import { NgForm } from '@angular/forms';
import { EIMInputFormItemComponentChangedEmitValueDomain } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMCreatedProcessDTO } from 'app/tasks/tasks.interface';

/**
 * プロセス登録コンポーネント
 * @example
 *
 *      <eim-process-creator
 *				[parentDTO]="parentDTO"
 *				(created)="onCreated($event)"
 *      >
 *      </eim-process-creator>
 */
@Component({
	selector: 'eim-process-creator',
	templateUrl: './process-creator.component.html',
	styleUrls: ['./process-creator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProcessCreatorComponent)}, ],
	standalone: false
})
export class EIMProcessCreatorComponent implements EIMCreatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** プロセスフォーム */
	@ViewChild('processForm', { static: true }) processForm: EIMFormComponent;

	/** 親のオブジェクト */
	@Input() parentDTO: EIMSimpleObjectDTO;

	/** プロセス登録完了時のイベントエミッタ */
	@Output() created: EventEmitter<EIMCreatedProcessDTO> = new EventEmitter();

	/** プロセス情報 */
	public processDTO: EIMSimpleObjectDTO;

	/** プロセス名 */
	public processName: string[] = [];

	/** プロセスタイプID */
	public processTypeId: number[] = [];

	/** プロセスのカスタム属性値を変更したかどうかのフラグ */
	protected isChangedCustomAttributeValue = false;

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_STATUS,				// ステータス
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_START_DATE,	// 開始予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PLANNED_END_DATE,	// 終了予定日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_COMPLETION_DATE,		// 完了日
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,		// 進捗率
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_RESPONSIBLE,			// 担当
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
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * プロセス情報を登録します.
	 */
	public create(): void {
		
		const processDTO = new EIMSimpleObjectDTO();
		processDTO.name = this.processName[0];
		processDTO.type = {'id': this.processTypeId[0]};

		// 属性設定（デフォルト値を設定する属性タイプの場合はフィルタ）
		processDTO.attributeMap = Object.keys(this.processDTO.attributeMap)
		.filter(key => 
			// 進捗率
			key !== EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE)
		.reduce((acc, key) => {
			acc[key] = this.processDTO.attributeMap[key];
			return acc;
		}, {});

		let param: EIMObjectAPIServiceCreateParam = {
			dto: processDTO,
			parentObjectId: this.parentDTO.id,
		}
		this.objectAPIService.create(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.created.emit({parentDTO: this.parentDTO, createdDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロセス登録可否を返却します.
	 * @return プロセス登録可否
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
				objectTypeDefinitionName: EIMTaskConstantService.OBJECT_TYPE_NAME_PROCESS,
				includeRecursiveObjectTypes: true
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// プロセス情報初期化
			this.processDTO = formFormatResult.dto;
			this.processTypeId = [formFormatResult.dto.type.id];

			// 画面上部初期化
			this.propertyForm.setInputFormItems(
				this.createStaticInputFormItems(formFormatResult));

			// 画面下部初期化
			this.processForm.setFormFormatResult(formFormatResult, this.excludeInputFormItemDefNameSet);
		});

	}

	/**
	 * コンテンツチェック後のイベントハンドラです.
	 */
	ngAfterViewChecked(): void {
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * プロセスの上部固定の入力フォーム値変更時のイベントハンドラです.
	 *
	 * @param emitValue 入力フォームコンポーネントの値変更イベントエミッタの設定値
	 */
	public onChangedStaticInputFormItemValue(emitValue: EIMInputFormItemComponentChangedEmitValueDomain): void {

		if (emitValue.name === 'processType') {

			// カスタム属性値変更時
			if (this.isChangedCustomAttributeValue) {

				this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_TASKS.CONFIRM_00001') ,
					// YES
					() => {
						// 変更したオブジェクトタイプに紐づく属性たプ情報リストを取得し画面下部初期化
						this.redrawProcessForm(emitValue.currentValue);
						this.isChangedCustomAttributeValue = false;
					},
					// NO
					() => {
						// 選択を元に戻す
						this.processTypeId = [emitValue.previousValue];
						emitValue.component.writeValue(this.processTypeId);
					}
				);
			// カスタム属性値未変更時
			} else {
				// 変更したオブジェクトタイプに紐づく属性たプ情報リストを取得し画面下部初期化
				this.redrawProcessForm(emitValue.currentValue);
			}
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

		// プロセス名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02013'),
			value: this.processName, disabled: false, required: true
		}));

		// プロセスタイプ
		inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
			name: 'processType', label: this.translateService.instant('EIM_TASKS.LABEL_02025'),
			value: this.processTypeId, disabled: false, required: true,
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

		let processObjectTypes: EIMObjectTypeDomain[] = formFormatResult.info.processObjectTypes;
		if (processObjectTypes === null) {
			return [];
		}

		for (let processObjectType of processObjectTypes) {
			options.push({'label': processObjectType.name, 'value': processObjectType.id});
		}

		return options;
	}

	/**
	 * 表示する入力フォームアイテム情報リストを生成します.
	 * @param formFormatResult フォーム形式結果情報
	 * @return 表示する入力フォームアイテム情報リスト
	 */
	protected redrawProcessForm(objectTypeId: number): void {
		// 属性レイアウト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: 0,
			adapterId: 'getEmptyObjectServiceAdapter2',
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				objectTypeId: objectTypeId
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// プロセス情報初期化
			this.processDTO = formFormatResult.dto;
			this.processTypeId = [formFormatResult.dto.type.id];

			// 画面下部初期化
			this.processForm.setFormFormatResult(formFormatResult, this.excludeInputFormItemDefNameSet);
		});

	}

}
