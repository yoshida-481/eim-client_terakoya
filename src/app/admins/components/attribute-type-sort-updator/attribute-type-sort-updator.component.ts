import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, Directive } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMCreatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMAttributeTypeService } from 'app/admins/shared/services/apis/attribute-type.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * 属性タイプ並べ替えコンポーネント
 */
@Directive()
export class EIMAttributeTypeSortUpdatorComponent {
	/** 属性タイプデータグリッド */
	@ViewChild('attTypeDataGrid', { static: true })
	attTypeDataGrid: EIMDataGridComponent;

	/** オブジェクトタイプID */
	@Input() objTypeId: number;

	/** 属性タイプリスト */
	@Input() selectedData: any[];

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新ボタン活性フラグ */
	protected updateFlag: boolean;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected attributeTypeService: EIMAttributeTypeService,
			protected translateService: TranslateService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,

	) {

	}
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 属性タイプ並べ替えを登録します.
	 */
	public update(): void {
		let attTypeIdList: any[] = [];
		let gridData: EIMAttributeTypeDTO[] = this.attTypeDataGrid.getData();
		// 属性タイプ並べ替えを登録します．
		if (this.selectedData) {
			this.updated.emit(gridData);
		} else {
			for (let i = 0; i < gridData.length; i++) {
				attTypeIdList.push(gridData[i].attTypeId);
			}
			this.attributeTypeService.sortAttribute(attTypeIdList, this.objTypeId).subscribe(
				(data: any) => {
					this.updated.emit(data);
				},
				(err: any) => {
					// エラーの場合
						this.errored.emit();
				}
			);
		}
	}

	/**
	 * 属性タイプ並べ替え可否を返却します.
	 * @return 属性タイプ並べ替え可否
	 */
	public updatable(): boolean {
		return this.updateFlag;
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.attTypeId === obj2.attTypeId);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {
		if (this.attTypeDataGrid.moveUpSelectedData()) {
			this.updateFlag = true;
			// スクロール位置を設定
			let rowIndex = this.attTypeDataGrid.getFirstRowIndex();
			if (0 < rowIndex) {
				this.attTypeDataGrid.ensureIndexVisible(rowIndex);
			}
		}
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
		if (this.attTypeDataGrid.moveDownSelectedData()) {
			this.updateFlag = true;
			// スクロール位置を設定
			let rowIndex = this.attTypeDataGrid.getFirstRowIndex();
			if (0 < rowIndex) {
				this.attTypeDataGrid.ensureIndexVisible(rowIndex);
			}
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * ステータスタイプのドロップダウンリストのデータを取得します.
	 * @param objTypeId ステータスタイプ配列
	 */
	protected getAttTypeList(objTypeId: number): void {

		this.attributeTypeService.getList(objTypeId).subscribe(
			(attTypeList: EIMAttributeTypeDTO[]) => {
				this.attTypeDataGrid.setData(attTypeList);
			// エラーの場合
			}, (err: any) => {
				// ドロップダウンリストをクリア
				this.attTypeDataGrid.setData([]);
				window.setTimeout(() => {
					this.errored.emit();
				})
			});
	}
}
