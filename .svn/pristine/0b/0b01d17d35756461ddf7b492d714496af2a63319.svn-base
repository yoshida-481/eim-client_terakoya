import { Component, ViewChild, OnInit, AfterViewInit, Input, HostListener, EventEmitter, OnDestroy, Output, forwardRef } from '@angular/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { TranslateService } from '@ngx-translate/core';
import { EIMFormComponent } from 'app/shared/components/form/form.component';
import { EIMInputFormItemDomain } from 'app/shared/domains/input-form-item.domain';
import { EIMTextInputFormItemComponentService } from 'app/shared/components/input-form-item/text-input-form-item/text-input-form-item.component.service';
import { EIMObjectRoleService } from 'app/shared/services/apis/object-role.service';
import { EIMObjectRoleDomain } from 'app/shared/domains/entity/object-role.domain';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { NgForm } from '@angular/forms';
import { EIMConstantService } from 'app/shared/services/constant.service';

/**
 * 業務役割更新コンポーネント
 * @example
 *
 *      <eim-object-role-updator
 *      >
 *      </eim-object-role-updator>
 */
@Component({
	selector: 'eim-object-role-updator',
	templateUrl: './object-role-updator.component.html',
	styleUrls: ['./object-role-updator.component.scss'],

	providers: [ {provide: EIMComponent, useExisting: forwardRef(() => EIMObjectRoleUpdatorComponent)}, ],
	standalone: false,
})
export class EIMObjectRoleUpdatorComponent implements EIMUpdatable {

	/** ngフォーム */
	@ViewChild('ngForm', { static: true }) form: NgForm;

	/** プロパティフォーム */
	@ViewChild('propertyForm', { static: true }) propertyForm: EIMFormComponent;

	/** 業務役割フォーム */
	@ViewChild('objectRoleForm', { static: true }) objectRoleForm: EIMFormComponent;

	/** 更新対象の業務役割 */
	@Input()
	public objectRole: EIMObjectRoleDomain = null;

	/** 業務役割登録完了時イベントエミッタ */
	@Output()
	public updated: EventEmitter<EIMObjectRoleDomain> = new EventEmitter<EIMObjectRoleDomain>();

	/** 業務役割定義名称 */
	public objectRoleDefName: string[] = [''];

	/** 業務役割多言語名称マップ（言語ID:名称） */
	public objectRoleOtherNameMap: Map<string, string[]> = new Map<string, string[]>();

	/** 使用可能言語リスト */
	public languages: any[];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectRoleService: EIMObjectRoleService,
		protected textInputFormItemComponentService: EIMTextInputFormItemComponentService,
		protected localStorageService: EIMLocalStorageService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 業務役割情報を更新します.
	 */
	public update(): void {

		// 業務役割情報設定
		let objectRole: EIMObjectRoleDomain = {};
		// ID
		objectRole.id = this.objectRole.id;
		// 定義名称
		objectRole.definitionName = this.objectRoleDefName[0];
		// 多言語名称
		this.languages = this.localStorageService.getLanguages();

		objectRole.nameList = [];
		for (let language of this.languages) {
			let name: string[] = this.objectRoleOtherNameMap.get(language.lang);
			objectRole.nameList.push({
				langId: language.lang,
				name: name[0]
			});
		}

		this.objectRoleService.update(objectRole).subscribe((res: any) => {

			// 完了イベントを通知(画面が閉じる)
			this.updated.emit(new EIMObjectRoleDomain(res));

		});
	}

	/**
	 * 業務役割更新可否を返却します.
	 * @return 業務役割更新可否
	 */	public updatable(): boolean {
		return this.form.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {

		// 業務役割取得
		this.objectRoleService.getById(this.objectRole.id).subscribe((res: any) => {

			let objectRole = new EIMObjectRoleDomain(res);

			// 業務役割の定義名称初期化
			this.objectRoleDefName = [objectRole.definitionName];

			// 業務役割の多言語名称マップ初期化
			this.languages = this.localStorageService.getLanguages();
			for (let language of this.languages) {
				let value = '';
				for (let otherName of objectRole.nameList) {
					if (otherName.langId !== language.lang) {
						continue;
					}
					value = otherName.name;
				}

				this.objectRoleOtherNameMap.set(language.lang, [value]);
			}

			// 入力欄初期化
			this.propertyForm.setInputFormItems(
					this.createStaticInputFormItems());
		});

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	protected createStaticInputFormItems(): EIMInputFormItemDomain[] {

		let inputFormItems: EIMInputFormItemDomain[] = [];

		// 業務役割定義名称
		inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
			name: 'definitionName', label: this.translateService.instant('EIM_ADMINS.LABEL_02004'),
			value: this.objectRoleDefName, disabled: false, required: true
		}));

		// 業務役割名(多言語)
		for (let language of this.languages) {

			// 該当言語の設定を取得
			let name: string[] = this.objectRoleOtherNameMap.get(language.lang);
			inputFormItems.push(this.textInputFormItemComponentService.createInputFormDomain({
				name: 'name_' + language.lang, label: this.translateService.instant('EIM_ADMINS.LABEL_02003', { value: language.value }),
				value: name, disabled: false, required: true
			}));
		}

		return inputFormItems;
	}
}
