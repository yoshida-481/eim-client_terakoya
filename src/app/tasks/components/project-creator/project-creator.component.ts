import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef, ChangeDetectorRef } from '@angular/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectAPIService, EIMObjectAPIServiceCreateParam, EIMObjectAPIServiceGetListParam, EIMObjectAPIServiceGetParam } from 'app/shared/services/apis/object-api.service';
import { EIMSimpleSearchObjectCriteriaBuilder } from 'app/shared/builders/simple-search/simple-search-object-criteria.builder';
import { EIMSearchOperatorEnum } from 'app/shared/domains/search/search-operator-enum';
import { EIMSimpleSearchConditionCriteria } from 'app/shared/domains/criteria/simple-search/simple-search-condition.criteria';
import { EIMFormFormatResultDTO } from 'app/shared/dtos/form-format-result.dto';
import { EIMListFormatResultDTO } from 'app/shared/dtos/list-format-result.dto';
import { EIMSearchLogicalOperatorEnum } from 'app/shared/domains/search/search-logical-operator-enum';
import { EIMSimpleSearchObjectResultAttributeType } from 'app/shared/builders/simple-search/simple-search-result-attribute-type';
import { EIMSimpleObjectDTO } from 'app/shared/dtos/simple-object.dto';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMComboBoxInputFormItemComponentService } from 'app/shared/components/input-form-item/combo-box-input-form-item/combo-box-input-form-item.component.service';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { SelectItem } from 'primeng/api';
import { EIMInputFormItemComponentChangedEmitValueDomain } from 'app/shared/components/input-form-item/input-form-item.component';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMJsonToListFormatResultDTOConverterService } from 'app/shared/services/converters/json-to-list-format-result-dto-converter.service';
import { NgForm } from '@angular/forms';
import { EIMTaskConstantService } from 'app/tasks/services/task-constant.service';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * プロジェクト登録コンポーネント
 * @example
 *
 *      <eim-project-creator
 *				(created)="onCreated($event)"
 *      >
 *      </eim-project-creator>
 */
@Component({
	selector: 'eim-project-creator',
	templateUrl: './project-creator.component.html',
	styleUrls: ['./project-creator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMProjectCreatorComponent)}, ],
	standalone: false
})
export class EIMProjectCreatorComponent implements EIMCreatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** プロセスフォーム */
	@ViewChild('projectForm', { static: true }) projectForm: EIMFormComponent;

	/** プロジェクト登録完了時のイベントエミッタ */
	@Output() created: EventEmitter<{parentDTO: EIMSimpleObjectDTO, createdDTO: EIMSimpleObjectDTO}> = new EventEmitter();

	/** プロジェクト情報 */
	public projectDTO: EIMSimpleObjectDTO;

	public projectName = [''];
	public projectMasterId = [-1];
	public options = [];

	/** 表示しない属性タイプ定義名称のセット */
	protected readonly excludeInputFormItemDefNameSet = new Set([
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_OUTPUT_FOLDER,	// 成果物保存先
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_TEMPLATE_PROJECT_NAME,	// 雛型プロジェクト名
		EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE,	// 進捗率
	]);

	/** カスタム属性値を変更したかどうかのフラグ */
	protected isChangedCustomAttributeValue = false;

	/** プロジェクトマスタIDとプロジェクトマスタDTOのマップ */
	protected projectMasterIdToDTOMap = new Map();

	/** プロジェクト情報読み込み中かどうか */
	protected isLoadingEmptyProject = true;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected changeDetectorRef: ChangeDetectorRef,
		protected objectAPIService: EIMObjectAPIService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected comboBoxInputFormItemComponentService: EIMComboBoxInputFormItemComponentService,
		protected jsonToListFormatResultDTOConverterService: EIMJsonToListFormatResultDTOConverterService,
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

		const projectDTO = new EIMSimpleObjectDTO();
		projectDTO.name = this.projectName[0];
		projectDTO.type = {'id': this.projectDTO.type.id};

		// 属性設定（デフォルト値を設定する属性タイプの場合はフィルタ）
		projectDTO.attributeMap = Object.keys(this.projectDTO.attributeMap)
		.filter(key => 
			// 進捗率
			key !== EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROGRESS_RATE)
		.reduce((acc, key) => {
			acc[key] = this.projectDTO.attributeMap[key];
			return acc;
		}, {});

		// 進捗状況に1（進行中）をセット
		projectDTO.attributeMap[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_PROGRESS].values = [1];

		let param: EIMObjectAPIServiceCreateParam = {
			dto: projectDTO,

			adapterId: 'createProjectFromProjectMasterObjectServiceAdapter',
			exParameter: {
				projectMasterId: this.projectMasterId[0].toString()
			}
		}
		this.objectAPIService.create(param).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.created.emit({parentDTO: null, createdDTO: new EIMFormFormatResultDTO(res).dto});

		});

	}

	/**
	 * プロジェクト登録可否を返却します.
	 * @return プロジェクト登録可否
	 */
	public creatable(): boolean {
		return this.form.valid && !this.isLoadingEmptyProject;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngOnInit(): void {

		// プロジェクトマスタ取得
		let apiParam: EIMObjectAPIServiceGetListParam = new EIMObjectAPIServiceGetListParam();
		// apiParam.comparatorIds = ['baseObjectTypeComparator'];
		apiParam.objectCriteria =
			new EIMSimpleSearchObjectCriteriaBuilder()
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().id().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().name().end())
			.addResultAttributeType(new EIMSimpleSearchObjectResultAttributeType().attribute(EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE).end())
			.setConditionGroup({
				op: EIMSearchLogicalOperatorEnum.AND,
				conditions: [
					new EIMSimpleSearchConditionCriteria(['type', 'definitionName'], 
						EIMSearchOperatorEnum.EQ, EIMTaskConstantService.OBJECT_TYPE_NAME_PROJECT_MASTER)
				]
			})
			.build();

		this.objectAPIService.getList(apiParam).subscribe((res: any) => {

			const listFormatResult: EIMListFormatResultDTO = this.jsonToListFormatResultDTOConverterService.convert(res);

			const options = [{label: '　', value: -1}];
			this.projectMasterIdToDTOMap = new Map();
			for (let dto of listFormatResult.dtos) {
				options.push({label: dto.name, value: dto.id});

				this.projectMasterIdToDTOMap.set(dto.id, dto);
			}
			this.options = options;

			// 属性レイアウト情報を取得
			const param: EIMObjectAPIServiceGetParam = {
				id: 0,
				adapterId: 'getEmptyObjectServiceAdapter2',
				exParameter: {
					[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
					objectTypeDefinitionName: 'ワークスペース'
				}
			}
			this.objectAPIService.get(param).subscribe((res: any) => {

				let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

				// プロジェクト情報初期化
				this.projectDTO = formFormatResult.dto;

				// 画面上部初期化
				this.propertyForm.setInputFormItems(
					this.createStaticInputFormItems(formFormatResult));

				// 画面下部初期化
				this.projectForm.setFormFormatResult(formFormatResult, 
					this.excludeInputFormItemDefNameSet, new Set([EIMTaskConstantService.NAMESPACE_APP_TASK_USER]));

				this.isLoadingEmptyProject = false;
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
	 * 上部固定の入力フォームリストを生成します.
	 * @param formFormatResult フォーム形式の簡易結果DTO
	 * @returns 上部固定の入力フォームリスト
	 */
	protected createStaticInputFormItems(formFormatResult: EIMFormFormatResultDTO): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];
		
		// プロジェクト名
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'name', label: this.translateService.instant('EIM_TASKS.LABEL_02008'),
			value: this.projectName, disabled: false, required: true
		}));

		// プロジェクトマスタ名
		inputFormItems.push(this.comboBoxInputFormItemComponentService.createInputFormDomain({
			name: 'projectMasterType', label: this.translateService.instant('EIM_TASKS.LABEL_02028'),
			value: this.projectMasterId, disabled: false, required: false,
			options: this.options
		}));

		return inputFormItems;
	}

	/**
	 * プロジェクトの上部固定の入力フォーム値変更時のイベントハンドラです.
	 *
	 * @param emitValue 入力フォームコンポーネントの値変更イベントエミッタの設定値
	 */
	public onChangedStaticInputFormItemValue(emitValue: EIMInputFormItemComponentChangedEmitValueDomain): void {

		if (emitValue.name === 'projectMasterType') {

			// プロジェクトマスタDTO
			const projectMasterDTO = this.projectMasterIdToDTOMap.get(emitValue.currentValue);

			// カスタム属性値変更時
			if (this.isChangedCustomAttributeValue) {

				this.messageService.show(EIMMessageType.confirm,
					this.translateService.instant('EIM_TASKS.CONFIRM_00001') ,
					// YES
					() => {
						// 変更したオブジェクトタイプに紐づく属性タイプ情報リストを取得し画面下部初期化
						this.redrawTaskForm(this.getProjectTypeIdFromProjectMasterDTO(projectMasterDTO));
						this.isChangedCustomAttributeValue = false;
					},
					// NO
					() => {
						// 選択を元に戻す
						this.projectMasterId = [emitValue.currentValue];
						emitValue.component.writeValue(this.projectMasterId);
					}
				);
			// カスタム属性値未変更時
			} else {
				// 変更したオブジェクトタイプに紐づく属性タイプ情報リストを取得し画面下部初期化
				this.redrawTaskForm(this.getProjectTypeIdFromProjectMasterDTO(projectMasterDTO));
			}
		}

	}


	/**
	 * プロジェクトのカスタム属性値変更時のイベントハンドラです.
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
	 * 変更したオブジェクトタイプに紐づく属性タイプ情報リストを取得し画面下部初期化
	 *
	 * @param objectTypeId 変更後のオブジェクトタイプID
	 */
	protected redrawTaskForm(objectTypeId = -1): void {

		this.isLoadingEmptyProject = true;

		// 属性レイアウト情報を取得
		const param: EIMObjectAPIServiceGetParam = {
			id: 0,
			adapterId: 'getEmptyObjectServiceAdapter2',
			exParameter: {
				[EIMConstantService.PLUG_IN_PARAM_NAME_INCLUDE_ATTRIBUTE_TYPE_LAYOUT]: true,
			}
		}

		// プロジェクトマスタ未指定の場合
		if (objectTypeId === -1) {
			param.exParameter['objectTypeDefinitionName'] = 'ワークスペース';
		}
		// プロジェクトマスタ指定の場合
		else {
			param.exParameter['objectTypeId'] = objectTypeId; // getEmptyObjectServiceAdapter2用
		}

		this.objectAPIService.get(param).subscribe((res: any) => {

			let formFormatResult: EIMFormFormatResultDTO = new EIMFormFormatResultDTO(res);

			// プロジェクト情報初期化
			this.projectDTO = formFormatResult.dto;

			// 画面下部初期化
			this.projectForm.setFormFormatResult(formFormatResult, 
				this.excludeInputFormItemDefNameSet, new Set([EIMTaskConstantService.NAMESPACE_APP_TASK_USER]));

			this.isLoadingEmptyProject = false;
		});
	}

	/**
	 * プロジェクトマスタDTOのプロジェクトタイプ属性からIDを返却します.
	 * @param dto 
	 * @returns プロジェクトタイプID
	 */
	private getProjectTypeIdFromProjectMasterDTO(dto: EIMSimpleObjectDTO): number {

		return dto?.attributeMap?.[EIMTaskConstantService.ATTRIBUTE_TYPE_NAME_PROJECT_TYPE]?.values?.[0] ?? -1;
	}
}
