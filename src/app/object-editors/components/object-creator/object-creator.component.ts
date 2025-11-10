import { Component, forwardRef, ViewChild, AfterViewInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';
import { EIMAttributeTypeDTO } from 'app/object-editors/shared/dtos/attribute-type.dto';
import { EIMObjectEditorsObjectTypeService } from 'app/object-editors/shared/services/apis/object-editors-object-type.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMSecurity } from 'app/object-editors/shared/services/apis/object-editors-security.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMAttributeDomain } from 'app/shared/domains/entity/attribute.domain';
import { EIMAttributeTypeDomain } from 'app/shared/domains/entity/attribute-type.domain';
import { EIMObjectEditorsObjectService } from 'app/object-editors/shared/services/apis/object-editors-object.service';
import { EIMSecurityDomain } from 'app/shared/domains/entity/security.domain';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';
import { EIMConvertService } from 'app/object-editors/shared/services/convert.service';

/**
 * オブジェクト登録コンポーネント
 * @example
 *
 *      <eim-object-creator
 *        [selectedObjTypeId]="selectedObjTypeId">
 *      </eim-object-creator>
 */
@Component({
    selector: 'eim-object-creator',
    templateUrl: './object-creator.component.html',
    styleUrls: ['./object-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMObjectCreatorComponent) }
    ],
    standalone: false
})

export class EIMObjectCreatorComponent implements EIMCreatable, AfterViewInit, OnDestroy {

	/** 選択中オブジェクトタイプID */
	@Input() selectedObjTypeId: number;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<EIMObjectDomain> = new EventEmitter<EIMObjectDomain>();

	/** フォーム */
	@ViewChild('objectCreatorForm', { static: true }) objectCreatorForm: NgForm;

	/** オブジェクトタイプツリー */
	@ViewChild('objectTypeTree', { static: true }) objectTypeTree: EIMTreeComponent;

	// 最大入力文字数
	public maxLength = EIMConstantService.INPUT_MAX_LENGTH;

	/** オブジェクトに割り当てられた属性リスト */
	public attributeList: EIMAttributeDomain[];

	/** 名前 */
	public name = '';

	/** オブジェクトタイプID */
	private objTypeId: number;

	/** セキュリティ */
	public security: EIMSecurity = {};

	/** ツリー初期処理時エラー発生サブスクリプション */
	private treeInitializeErrored: Subscription;

	/** 初期処理時フラグ */
	private statusInit = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public objectTypeTreeComponentService: EIMObjectTypeTreeComponentService,
		protected objectEditorsObjectTypeService: EIMObjectEditorsObjectTypeService,
		protected objectEditorsObjectService: EIMObjectEditorsObjectService,
		protected dialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected convertService: EIMConvertService,
	) {
		// ツリー初期化時にエラーが発生した場合の処理
		this.treeInitializeErrored = this.objectTypeTreeComponentService.initializeErrored.subscribe(() => {
			// ダイアログを閉じる
			this.dialogManagerComponentService.close(dialogName.OBJECT_CREATOR);
		});
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * オブジェクトを登録します.
	 */
	public create(): void {
		let object: EIMObjectDomain = new EIMObjectDomain();
		object.type = new EIMObjectTypeDomain();
		object.type.id = this.objectTypeTree.getSelectedData()[0].data.id;
		object.name = this.name;
		object.security = new EIMSecurityDomain();
		object.security.id = this.security.secId;
		object.attributeList = this.attributeList;

		this.objectEditorsObjectService.create(object).subscribe(
			(newObject: EIMObjectDomain) => {
				// 作成処理完了通知
				this.created.emit(newObject);
			},
		);
	}

	/**
	 * オブジェクト登録可否を返却します.
	 * @return オブジェクト登録可否
	 */
	public creatable(): boolean {
		// オブジェクトタイプ未選択の場合
		if (!this.objTypeId) {
			return false;
		}

		return this.objectCreatorForm.valid;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {
		if (this.selectedObjTypeId) {
			window.setTimeout(() => {
				this.statusInit = true;
				this.objectTypeTree.select([{objTypeId: this.selectedObjTypeId}]);
			});
		}
	}

	/**
	 * オブジェクトタイプツリーのノード選択時のイベントハンドラです.
	 */
	 onSelectObjectType(): void {
		this.attributeList = null;
		this.objTypeId = this.objectTypeTree.getSelectedData()[0].data.id;
		// 属性タイプリスト取得
		this.objectEditorsObjectTypeService.getAttributeTypeList(this.objTypeId).subscribe(
			(attributeTypeList: EIMAttributeTypeDTO[]) => {
				// DTOからドメインへ変換
				this.attributeList = this.convertService.convertAttributeDomainListFromDTO(attributeTypeList);
				this.statusInit = false;
			},
			() => {
				if (this.statusInit) {
					// ダイアログクローズ
					this.dialogManagerComponentService.close(dialogName.OBJECT_CREATOR);
				}
			}
		);
	}

	/**
	 * セキュリティ削除ボタンクリックイベントハンドラです.
	 */
	onClickSecurityDelete(): void {
		this.security = {};
	}

	/**
	 * セキュリティ選択ボタンクリックイベントハンドラです.
	 */
	onClickSecuritySelect(): void {
		let dialogId = this.dialogManagerComponentService.showObjectEditorsSecuritySelector(this.security.secId, {
			selected: (security: EIMSecurity[]) => {
				this.dialogManagerComponentService.close(dialogId);
				this.security = security[0];
			}
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.treeInitializeErrored.closed) {
			this.treeInitializeErrored.unsubscribe();
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
