import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { Component, forwardRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EIMObjectEditorDialogManagerComponentService, dialogName } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMObjectEditorsObjectTypeService } from 'app/object-editors/shared/services/apis/object-editors-object-type.service';
import { EIMObjectTypeDTO } from 'app/object-editors/shared/dtos/object-type.dto';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { Subscription } from 'rxjs';
import { EIMObjectTypeTreeComponentService } from 'app/object-editors/components/object-type-tree/object-type-tree.component.service';

/**
 * オブジェクトタイプ選択コンポーネント
 * @example
 * 		<eim-object-type-selector>
 * 		</eim-object-type-selector>
 */
@Component({
    selector: 'eim-object-type-selector',
    templateUrl: './object-type-selector.component.html',
    styleUrls: ['./object-type-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMObjectTypeSelectorComponent) }],
    standalone: false
})
export class EIMObjectTypeSelectorComponent extends EIMSingleSelectorComponent implements EIMComponent, EIMSelectable {

	/** ツリーコンポーネント */
	@ViewChild('objectTypeTree', { static: true }) objectTypeTree: EIMTreeComponent;

	/** オブジェクトタイプ選択処理完了イベントエミッタ */
	@Output() selected: EventEmitter<EIMObjectTypeDTO> = new EventEmitter<EIMObjectTypeDTO>();

	/** ツリー初期処理時エラー発生サブスクリプション */
	private treeInitializeErrored?: Subscription;
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectEditorsObjectTypeService: EIMObjectEditorsObjectTypeService,
		public objectTypeTreeComponentService: EIMObjectTypeTreeComponentService,
		protected dialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,

	) {
		super();
		// ツリー初期化時にエラーが発生した場合の処理
		this.treeInitializeErrored = this.objectTypeTreeComponentService.initializeErrored.subscribe(() => {
			// ダイアログを閉じる
			this.dialogManagerComponentService.close(dialogName.OBJECT_TYPE_SELECTOR);
		});
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		return this.objectTypeTree.info && this.objectTypeTree.getSelectedData().length > 0;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 選択ボタン押下イベントハンドラ
	 */
	select(): void {
		let selectedData = this.objectTypeTree.getSelectedData();
		this.selected.emit(selectedData[0].data);
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
}
