import { Component, forwardRef, ViewChild, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMObjectEditorsRelationService } from 'app/object-editors/shared/services/apis/object-editors-relation.service';
import { EIMRelationTypeTreeComponentService } from 'app/object-editors/components/relation-type-tree/relation-type-tree.component.service';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { EIMRelationDomain } from 'app/shared/domains/entity/relation.domain';
import { EIMRelationTypeDomain } from 'app/shared/domains/entity/relation-type.domain';

/**
 * リレーション登録コンポーネント
 * @example
 *
 *      <eim-relation-creator [selectedData]="selectedData">
 *      </eim-relation-creator>
 */
@Component({
    selector: 'eim-relation-creator',
    templateUrl: './relation-creator.component.html',
    styleUrls: ['./relation-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMRelationCreatorComponent) }
    ],
    standalone: false
})

export class EIMRelationCreatorComponent implements EIMCreatable, OnInit, OnDestroy {

	/** メイン画面選択オブジェクト */
	@Input() selectedData: EIMObjectDTO[];

	/** リレーション登録をモーダル表示で開いているかのフラグ */
	@Input() modal: boolean;

	/** 作成完了時のイベントエミッタ */
	@Output() created: EventEmitter<EIMObjectDTO> = new EventEmitter<EIMObjectDTO>();

	/** フォーム */
	@ViewChild('relationCreatorForm', { static: true }) relationCreatorForm: NgForm;

	/** リレーションタイプツリー */
	@ViewChild('relationTypeTree', { static: true }) relationTypeTree: EIMTreeComponent;

	/** 親オブジェクト */
	public parentObject: EIMObjectDTO;

	/** 子オブジェクト */
	public childObject: EIMObjectDTO;

	/** 親オブジェクトの再指定可能化のフラグ */
	public parentChangeable = false;

	/** 子オブジェクトの再指定可能化のフラグ */
	public childChangeable = false;

	/** 選択中リレーションタイプID */
	private selectedRelTypeId: number;

	/** ツリー初期処理時エラー発生サブスクリプション */
	private treeInitializeErrored: Subscription;

	/** ダイアログ名 */
	private dialogName: string;

	/**
	 * コンストラクタです.
	 */
	constructor(
		public relationTypeTreeComponentService: EIMRelationTypeTreeComponentService,
		protected objectEditorsRelationService: EIMObjectEditorsRelationService,
		protected dialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーションを登録します.
	 */
	public create(): void {

		let createData: EIMRelationDomain = new EIMRelationDomain();
		createData.parent = new EIMObjectDomain();
		createData.parent.id = this.parentObject.id;
		createData.child = new EIMObjectDomain();
		createData.child.id = this.childObject.id;
		createData.type = new EIMRelationTypeDomain();
		createData.type.id = this.selectedRelTypeId;

		// 登録API実行
		this.objectEditorsRelationService.createRelation(createData).subscribe(
			(newRelation: EIMObjectDTO) => {
				// 作成処理完了通知
				this.created.emit(this.parentObject);
			},
		);

	}

	/**
	 * リレーション登録可否を返却します.
	 * @return リレーション登録可否
	 */
	public creatable(): boolean {
		// リレーションタイプが未選択の場合
		if (!this.selectedRelTypeId) {
			return false;
		}

		return this.relationCreatorForm.valid;
	}

	/**
	 * 選択したオブジェクトを画面に表示します.
	 * @param data 選択オブジェクト
	 */
	public objectSelect(data: EIMObjectDTO): void {
		// 同一オブジェクトチェック
		if (this.selectedData[0].id === data.id) {
			this.messageService.show(EIMMessageType.error, this.translateService.instant('EIM_OBJECT_EDITORS.ERROR_00001'));
			return;
		}

		// メイン画面にて選択したオブジェクトが親の場合
		if (this.parentObject.id === this.selectedData[0].id) {
			// 子オブジェクトに設定
			this.childObject = data;
		} else {
			// 親オブジェクトに設定
			this.parentObject = data;
		}
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// 引数のデータを画面に設定
		this.parentObject = this.selectedData[0];
		if (this.selectedData.length === 2) {
			this.childObject = this.selectedData[1];
			this.modal = true;
			this.dialogName = dialogName.RELATION_CREATOR_MODAL;
		} else {
			// 子オブジェクトを未選択状態に設定
			this.childObject = new EIMObjectDTO();
			this.childObject.id = null;
			this.childChangeable = true;
			this.dialogName = dialogName.RELATION_CREATOR;
		}

		// ツリー初期化時にエラーが発生した場合の処理
		this.treeInitializeErrored = this.relationTypeTreeComponentService.initializeErrored.subscribe(() => {
			// ダイアログクローズを通知
			this.dialogManagerComponentService.close(this.dialogName);
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		// ダイアログクローズを通知
			this.dialogManagerComponentService.close(this.dialogName);

		if (!this.treeInitializeErrored.closed) {
			this.treeInitializeErrored.unsubscribe();
		}

		this.modal = false;
	}

	/**
	 * 入れ替えボタン押下イベントハンドラです.
	 */
	onClickReplacement(): void {
		// 親と子の入れ替え実施
		let target: EIMObjectDTO  = this.parentObject;
		this.parentObject  = this.childObject;
		this.childObject  = target;

		// 非モーダルで開いている場合、スタイルを変更
		if (!this.modal) {
			this.parentChangeable = !this.parentChangeable;
			this.childChangeable = !this.childChangeable;
		}
	}

	/**
	 * リレーションタイプ選択時イベントハンドラです.
	 */
	onSelectRelationType(): void {
		this.selectedRelTypeId = this.relationTypeTree.getSelectedData()[0].objTypeId;
	}
}
