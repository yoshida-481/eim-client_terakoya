import { EIMSecurityNameRendererComponent } from 'app/documents/shared/components/renderer/security-name-renderer.component';
import { EIMSecurity } from 'app/documents/shared/services/apis/security.service';
import { EIMConstantService } from './../../../shared/services/constant.service';
import { EIMTreeNode } from './../../../shared/components/tree/tree.component.service';
import { Component, EventEmitter, ViewChild, Input, Output, OnInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { of, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { EIMSelectorComponent, EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

import { EIMDataGridSingleSelectorComponent } from 'app/shared/components/data-grid-single-selector/data-grid-single-selector.component';
import { EIMTreeComponent } from 'app/shared/components/tree/tree.component';
import { EIMHierarchicalObjectTypeDomain } from 'app/documents/shared/domains/hierarchical-object-type.domain';
import { EIMWorkspaceService } from 'app/documents/shared/services/apis/workspace.service';

/**
 * 使用可能セキュリティ選択コンポーネント
 * @example
 *	<eim-selectable-security-selector
 *		[selectedData]="selectedData">
 *	</eim-selectable-security-selector>
 */
@Component({
    selector: 'eim-selectable-security-selector',
    templateUrl: './selectable-security-selector.component.html',
    styleUrls: ['./selectable-security-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMSelectableSecuritySelectorComponent) }],
    standalone: false
})
export class EIMSelectableSecuritySelectorComponent implements OnInit, EIMSelectorComponent<any>, EIMSelectable {

	/** 検索結果使用可能セキュリティ一覧 */
	@ViewChild('searchResultList', { static: true }) searchResultList: EIMDataGridComponent;
	/** 選択済み使用可能セキュリティ一覧 */
	@ViewChild('selectedList', { static: true }) selectedList: EIMDataGridComponent;

	/** 選択済みデータ */
	@Input() selectedData: EIMSecurity[];

	/** 初期検索結果 */
	@Input() searchResult: EIMSecurity[];

	/** 選択イベントエミッタ */
	@Output() public selected: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 検索条件 */
	public securityName = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected workspaceService: EIMWorkspaceService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 選択情報を取得します.
	 * @return 表示データの選択対象一覧
	 */
	public getSelectedData(): any[] {
		return this.selectedList.getSelectedData();
	}

	/**
	 * 選択リストを取得します.
	 * @return 表示データ
	 */
	public getData(): any[] {
		return this.selectedList.getData();
	}

	/**
	 * 選択リストを設定します.
	 * @param data 表示データ
	 */
	public setData(data: any[]): void {
		return this.selectedList.setData(data);
	}

	/**
	 * 選択します.
	 */
	public select(): void {
		this.selected.emit(this.selectedList.getData());
	}

	/**
	 * 選択可否を判定します.
	 * @return 選択可否
	 */
	public selectable(): boolean {
		return true;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値を初期化後の処理です.
	 */
	public ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		columns.push({ field: 'secName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 350,
			cellRendererFramework: EIMSecurityNameRendererComponent, suppressFilter: true, suppressSorting: true });
		this.searchResultList.setColumns(columns);
		this.selectedList.setColumns(columns);
		window.setTimeout(() => {
			this.selectedList.setData(this.selectedData);
			this.searchResultList.setData(this.searchResult);
		});
	}

	/**
	 * 追加ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickAdd(event: any): void {

		// 検索結果の選択行を選択一覧に追加
		let addData: any = this.searchResultList.getSelectedData();
		let newSecurity: EIMSecurity[] = [];
		selectedDataLoop: for (let i = 0; i < addData.length; i++) {
			for (let j = 0; j < this.selectedList.getData().length; j++) {
				if (this.selectedList.getData()[j].secId === addData[i].secId) {
					continue selectedDataLoop;
				}
			}
			newSecurity.push({
				secId: addData[i].secId,
				secName: addData[i].secName,
				entryList: [],
				updateRole: addData[i].updateRole});
		}
		this.selectedList.addRowData(newSecurity);

		function compare(a, b) {
			let comparison = 0;
			let nameA: string = a.secName;
			let nameB: string = b.secName;
			if (nameA > nameB) {
				comparison = 1;
			} else if (nameB > nameA) {
				comparison = -1;
			}
			return comparison;
		}
		this.selectedList.setData(this.selectedList.getData().sort(compare));
	}

	/**
	 * 削除ボタン選択時のイベントハンドラ.
	 * @param event イベント
	 */
	public onClickDelete(event: any): void {
		let rowIndex: number = this.selectedList.getFirstRowIndex();
		let scrollTop: number = this.selectedList.getScrollTop();
		this.selectedList.removeRowData(this.selectedList.getSelectedData());
		this.selectedList.setSelectRow(rowIndex, scrollTop);
	}

	/**
	 * セキュリティ検索ボタン押下イベントハンドラです.
	 * 検索条件に合致するセキュリティ一覧を表示します.
	 */
	onSearchSecurity(): void {

		let keyword: string = '';
		if (this.securityName && this.securityName.length > 0) {
			keyword = this.securityName;
		}
		// セキュリティ検索
		this.workspaceService.getAllSecurityList(false, keyword)
		.subscribe((data: EIMSecurity[]) => {
			this.searchResultList.setData(data);
		});
	}
}
