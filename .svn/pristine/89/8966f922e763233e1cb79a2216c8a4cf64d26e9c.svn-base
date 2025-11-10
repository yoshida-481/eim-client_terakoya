import {Component, forwardRef, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {EIMComponent, EIMUpdatable} from 'app/shared/shared.interface';
import {EIMAdminDialogManagerComponentService, dialogName} from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * 属性階層順序詳細設定コンポーネント
 * @example
 *
 *      <attribute-tree-view-attribute-updator
 *          [attrId]="attrId"
 *          [viewNoValuesFlag]="viewNoValuesFlag"
 *      </attribute-tree-view-attribute-updator>
 */
@Component({
  selector: 'eim-attribute-tree-view-attribute-updator',
  templateUrl: './attribute-tree-view-attribute-updator.component.html',
  styleUrls: ['./attribute-tree-view-attribute-updator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeTreeViewAttributeUpdatorComponent)}
  ],
  standalone: false,
})

export class EIMAttributeTreeViewAttributeUpdatorComponent implements OnInit, EIMUpdatable {

	/** 属性ID */
	@Input() attrId: number;

	/** 「属性値なし」も表示 */
	@Input() viewNoValuesFlag: string;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<string> = new EventEmitter<string>();

	/** 「属性値なし」も表示 */
	private temporaryNoValuesFlag = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリー所属属性値なし表示フラグを更新します.
	 */
	public update(): void {
		this.updated.emit(this.viewNoValuesFlag);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性ツリー所属属性値なし表示フラグを返却します.
	 * @return 属性ツリー所属属性値なし表示フラグ更新可否
	 */
	public updatable(): boolean {
		if (this.temporaryNoValuesFlag === this.viewNoValuesFlag) {
			return false;
		}
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.viewNoValuesFlag = this.viewNoValuesFlag;
		this.temporaryNoValuesFlag = this.viewNoValuesFlag;
	}
}
