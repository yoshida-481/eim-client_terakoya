import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, ChangeDetectorRef } from '@angular/core';

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
import { NgForm } from '@angular/forms';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

/**
 * プロジェクトマスタ登録コンポーネント
 * @example
 *
 *      <eim-master-project-creator
 *      >
 *      </eim-master-project-creator>
 */
@Component({
	selector: 'eim-project-master-creator',
	templateUrl: './project-master-creator.component.html',
	styleUrls: ['./project-master-creator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProjectMasterCreatorComponent)}, ],
	standalone: false
})
export class EIMProjectMasterCreatorComponent implements EIMCreatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** プロジェクトフォーム */
	@ViewChild('projectForm', { static: true }) projectForm: EIMFormComponent;

	/** プロジェクトマスタ登録完了時イベントエミッタ */
	@Output() created: EventEmitter<{parentDTO: EIMSimpleObjectDTO, createdDTO: EIMSimpleObjectDTO}> = new EventEmitter();

	/** プロジェクト情報 */
	public projectDTO: EIMSimpleObjectDTO;

	/** プロジェクトマスタ名 */
	public projectName: string[] = [];

	/** プロジェクトタイプID */
	public projectTypeId: number[] = [];

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
	 * プロジェクト情報を登録します.
	 */
	public create(): void {
		this.projectDTO.name = this.projectName[0];
		let param: EIMObjectAPIServiceCreateParam = {
			dto: this.projectDTO,
		}
		this.objectAPIService.create(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.created.emit({parentDTO: null, createdDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロジェクトマスタ情報を登録可能かどうか返却します.
	 * @returns プロジェクトマスタ情報を登録可能ならばtrue
	 */
	public creatable(): boolean {
		return this.form.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		// 属性レイアウト情報を取得
		let param: EIMObjectAPIServiceGetParam = {
			id: 0,
			adapterId: 'getEmptyObjectServiceAdapter2',
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
				objectTypeDefinitionName: EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER,
				includeRecursiveObjectTypes: true
			}
		}
		this.objectAPIService.get(param).subscribe((res: any) => {

			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// タスク情報初期化
			this.projectDTO = formFormatResult.dto;

			// 入力欄初期化
			// 画面上部初期化
			this.propertyForm.setInputFormItems(
				this.createStaticInputFormItems(formFormatResult));

			// 画面下部初期化
			this.projectForm.setFormFormatResult(formFormatResult, this.excludeInputFormItemDefNameSet);

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
		// タスク管理テンプレートV1.0.0においてはワークスペースの子孫オブジェクトタイプは選択不可とする
		// inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
		// 	name: 'projectType', label: this.translateService.instant('EIM_TASKS.LABEL_02029'),
		// 	value: formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE].values, 
		// 	disabled: false, required: true,
		// 	options: this.getPrjectTypesOptions(formFormatResult)
		// }));
		// タスク管理テンプレートV1.0.0においてはワークスペースの子孫オブジェクトタイプは選択不可とする
		const items: SelectItem[] = this.getPrjectTypesOptions(formFormatResult);
		formFormatResult.dto.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE].values = [items?.[0]?.value];
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'projectType', label: this.translateService.instant('EIM_TASKS.LABEL_02029'),
			value: [items?.[0].label], 
			disabled: true, required: false
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

			if (projectObjectType.definitionName !== EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT) {
				// ワークスペース以外はスキップ（タスク管理テンプレートV1.0.0においてはワークスペースの子孫オブジェクトタイプは選択不可とする）
				continue;
			}

			options.push({'label': projectObjectType.name, 'value': projectObjectType.id});
		}

		return options;
	}
}
