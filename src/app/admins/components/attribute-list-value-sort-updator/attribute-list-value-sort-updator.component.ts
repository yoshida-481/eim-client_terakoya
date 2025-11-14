import { EIMAttributeValueListRendererComponent } from 'app/admins/shared/components/renderer/attribute-list-value-renderer.component';
import { EIMListValueDTO } from 'app/admins/shared/dtos/list-value.dto';
import { EIMAdminAttributeService } from 'app/admins/shared/services/apis/attribute.service';
import { EIMDisabledNameRendererComponent } from 'app/admins/shared/components/renderer/disabled-name-renderer.component';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMAttributeTypeDTO } from 'app/admins/shared/dtos/attribute-type.dto';

/**
 * リスト値並べ替えコンポーネント
 * @example
 *      <eim-attribute-list-value-sort-updator>
 *        [attribute]="attribute"
 *        [listValueList]="listValueList">
 *      </eim-attribute-list-value-sort-updator>
 */
@Component({
  selector: 'eim-attribute-list-value-sort-updator',
  templateUrl: './attribute-list-value-sort-updator.component.html',
  styleUrls: ['./attribute-list-value-sort-updator.component.css'],
  providers: [
    {provide: EIMComponent, useExisting: forwardRef(() => EIMAttributeListValueSortUpdatorComponent)}
  ],
  standalone: false,
})
export class EIMAttributeListValueSortUpdatorComponent implements OnInit, EIMUpdatable {

	/** リスト値データグリッド */
	@ViewChild('listValueDataGrid', { static: true }) listValueDataGrid: EIMDataGridComponent;

	/** 対象属性タイプ */
	@Input() attribute: EIMAttributeTypeDTO;

	/** 対象属性タイプ */
	@Input() listValueList: EIMListValueDTO[];

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新可否フラグ */
	private updatableFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected attributeService: EIMAdminAttributeService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コード並べ替えを実行します.
	 */
	public update(): void {
		this.sort(0, this.listValueList);
	}

	/**
	 * コード並べ替え実行可否を返却します.
	 * @return コード並べ替え可否
	 */
	public updatable(): boolean {
		return this.updatableFlag;
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.value === obj2.value);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 定義値
		columns.push({field: 'value', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02088'), cellStyle: 'color',
			cellRendererFramework: EIMAttributeValueListRendererComponent, width: 345, suppressSorting: true, suppressFilter: true});
		this.listValueDataGrid.setColumns(columns);
		this.listValueDataGrid.setData(this.listValueList);
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {
		this.updatableFlag = this.listValueDataGrid.moveUpSelectedData() || this.updatableFlag;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
		this.updatableFlag = this.listValueDataGrid.moveDownSelectedData() || this.updatableFlag;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データグリッドの順序と最新のリスト値の順序が同一かどうか(ソートが完了したかどうか)を返却します.
	 * @param dataGridList 並び替え期待値一覧
	 * @param dataGridList 並び替え結果一覧
	 * @return 一致するかどうか
	 */
	private isCompleteSort(dataGridList: EIMListValueDTO[], listValueList: EIMListValueDTO[]): boolean {
		if (dataGridList.length !== listValueList.length) {
			return false;
		}
		for (let i = 0; i < dataGridList.length; i++) {
			if (!this.dataGridEquals(dataGridList[i], listValueList[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 対象の列のソート処理を再帰的に実行します.
	 * @param dropIndex 移動先列番号
	 * @param lastData 並び替え結果
	 */
	private sort(dropIndex: number, lastData: EIMListValueDTO[]): void {
		this.attributeService.updateMasterOrder(this.attribute, this.listValueDataGrid.getData()[dropIndex], dropIndex).subscribe(
			(data: EIMListValueDTO[]) => {
				dropIndex++;
				// ソート完了後、ソート対象コードタイプを返却する
				let sortList: EIMListValueDTO[] = this.listValueDataGrid.getData();
				if (this.isCompleteSort(sortList, data) || sortList.length === dropIndex) {
					// ソート結果と期待値が合致した時もしくは最終行までソート処理を行った時、処理を完了とする
					// 前者は軽量化を目的とし、後者は複数ユーザによる同時操作の対策を目的としている
					this.updated.emit(data);
				} else {
					// 処理未完の場合、次の行のソート処理を行う
					this.sort(dropIndex, data);
				}
			},
			(err: any) => {
				// 途中でエラーが生じた場合も途中までのソート結果を反映する
				this.updated.emit(lastData);
		});
	}

}
