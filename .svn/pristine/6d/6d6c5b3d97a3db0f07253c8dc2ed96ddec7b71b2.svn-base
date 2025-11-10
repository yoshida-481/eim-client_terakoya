import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, SimpleChanges, OnChanges, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMCreatable, EIMUpdatable } from 'app/shared/shared.interface';
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
import { NgForm } from '@angular/forms';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMUpdatedProjectMasterDTO } from 'app/tasks/tasks.interface';

/**
 * プロジェクトマスタ更新コンポーネント
 * @example
 *
 *      <eim-project-master-updator
 *      >
 *      </eim-project-master-updator>
 */
@Component({
	selector: 'eim-project-master-updator',
	templateUrl: './project-master-updator.component.html',
	styleUrls: ['./project-master-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProjectMasterUpdatorComponent)}, ],
	standalone: false
})
export class EIMProjectMasterUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** プロジェクトフォーム */
	@ViewChild('projectForm', { static: true }) projectForm: EIMFormComponent;

	/** プロジェクト情報 */
	@Input() projectDTO: EIMSimpleObjectDTO;

	/** プロジェクトマスタ更新完了時イベントエミッタ */
	@Output() updated: EventEmitter<EIMUpdatedProjectMasterDTO> = new EventEmitter();

	/** プロジェクトマスタ名 */
	public projectName: string[] = [];

	/** プロジェクトタイプID */
	public projectTypeId: number[] = [];

	/** フォーム形式の簡易結果DTO（プロセス情報） */
	public formFormatResult: EIMFormFormatResultDTO;

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		// プロジェクトタイプ
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE
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
	 * プロジェクト情報を更新します.
	 */
	public update(): void {
		this.formFormatResult.dto.name = this.projectName[0];
		let param: EIMObjectAPIServiceCreateParam = {
			dto: this.formFormatResult.dto,
		}
		this.objectAPIService.update(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.updated.emit({parentDTO: null, updatedDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロジェクトマスタ情報を更新可能かどうか返却します.
	 * @returns プロジェクトマスタ情報を更新可能ならばtrue
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

		// projectDTO変更時のみ情報取得
		if (changes['projectDTO'] === undefined || 
				changes['projectDTO'].currentValue === changes['projectDTO'].previousValue) {
			return;
		}

		// 属性レイアウト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: this.projectDTO.id,
			refObjectExpansionLevel: 1, // オブジェクト型属性を取得するためには1以上を指定
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				includeRecursiveObjectTypes: true
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			this.formFormatResult = new EIMFormFormatResultDTO(res);

			// プロジェクトマスタ情報初期化
			this.projectName = [this.formFormatResult.dto.name];

			// 入力欄初期化
			// 画面上部初期化
			this.propertyForm.setInputFormItems(
				this.createStaticInputFormItems(this.formFormatResult));

			// 画面下部初期化
			this.projectForm.setFormFormatResult(this.formFormatResult, this.excludeInputFormItemDefNameSet);

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

		// プロジェクトマスタ名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02028'),
			value: this.projectName, disabled: false, required: true
		}));

		// プロジェクトタイプ
		// inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
		// 	name: 'projectType', label: this.translateService.instant('EIM_TASKS.LABEL_02029'),
		// 	value: formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE].values, 
		// 	disabled: false, required: true,
		// 	options: this.getPrjectTypesOptions(formFormatResult)
		// }));
		// タスク管理テンプレートV1.0.0においてはワークスペースの子孫オブジェクトタイプは選択不可とする
		const items: SelectItem[] = this.getPrjectTypesOptions(formFormatResult);
		const projectTypeItems = items.filter(( item:SelectItem ) => {
			return item.value === formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE].values?.[0];
		})

		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'projectType', label: this.translateService.instant('EIM_TASKS.LABEL_02029'),
			value: [projectTypeItems?.[0].label], 
			disabled: true, required: false,
		}));

		return inputFormItems;
	}

	/**
	 * プロジェクトタイプのオプションリストを返却します.
	 *
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns プロジェクトタイプのオプションリスト
	 */
	protected getPrjectTypesOptions(formFormatResult: EIMFormFormatResultDTO): SelectItem[] {
		let options: SelectItem[] = [];

		let projectObjectTypes: EIMObjectTypeDomain[] = formFormatResult.info.projectObjectTypes ?? null;
		if (projectObjectTypes === null) {
			return [];
		}

		for (let projectObjectType of projectObjectTypes) {

			options.push({'label': projectObjectType.name, 'value': projectObjectType.id});
		}

		return options;
	}
}
