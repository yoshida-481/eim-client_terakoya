import { EIMDisabledNameRendererComponent } from 'app/admins/shared/components/renderer/disabled-name-renderer.component';
import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { EIMCodeTypeService } from 'app/admins/shared/services/apis/codeType.service';

/**
 * コードタイプ選択コンポーネント
 * @example
 *
 *      <eim-codetype-selector>
 *      </eim-codetype-selector>
 */
@Component({
    selector: 'eim-codetype-selector',
    templateUrl: './codetype-selector.component.html',
    styleUrls: ['./codetype-selector.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeTypeSelectorComponent) }
    ],
    standalone: false
})

export class EIMCodeTypeSelectorComponent implements OnInit, EIMSelectable {
	/** コードタイプ選択フォーム */
	@ViewChild('codeTypeSelectorForm', { static: true }) codeTypeSelectorForm: NgForm;

	/** コードタイプデータグリッド */
	@ViewChild('codeTypeDataGrid', { static: true }) codeTypeDataGrid: EIMDataGridComponent;

	/** コードデータグリッド */
	@ViewChild('codeDataGrid', { static: true }) codeDataGrid: EIMDataGridComponent;

	/** 選択完了時のイベントエミッタ */
	@Output() selected: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 選択対象コードタイプID(未選択時0) */
	private selectedCodeTypeId = 0;

	/** コード一覧取得完了フラグ */
	private codeTypeFetched = false;
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected codeService: EIMCodeService,
		protected codeTypeService: EIMCodeTypeService,
	) {
	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コードタイプ選択します.
	 */
	public select(): void {
		// コード一覧取得まで待機
		if (!this.codeTypeFetched) {
			window.setTimeout(() => {
				this.select();
			});
		} else {
			let codeType: EIMCodeTypeDomain = this.codeTypeDataGrid.getSelectedData()[0];
			codeType.codeList = this.codeDataGrid.getData();
			this.selected.emit(codeType);
		}
	}

	/**
	 * コードタイプ選択可否を返却します.
	 * @return コードタイプ選択可否
	 */
	public selectable(): boolean {
		 return this.codeTypeDataGrid.getSelectedData().length > 0;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * コードタイプ選択時のイベントハンドラ
	 * @param event イベント
	 */
	onSelectCodeType(event: any): void {
		this.codeTypeFetched = false;
		let selectedCodeTypeList = this.codeTypeDataGrid.getSelectedData();
		if (selectedCodeTypeList.length === 0) {
			this.selectedCodeTypeId = 0;
			this.codeDataGrid.setData([]);
			return;
		}
		let selectedCodeType: EIMCodeTypeDomain = this.codeTypeDataGrid.getSelectedData()[0];
		this.selectedCodeTypeId = selectedCodeType.id;
		this.codeService.getList(selectedCodeType.id)
		.subscribe((object: EIMCodeDomain[]) => {
			if (selectedCodeType.id !== this.selectedCodeTypeId) {
				// サーバ問い合わせ中に選択対象が変更された場合何もしない
				return;
			}
			this.codeTypeFetched = true;
			this.codeDataGrid.setData(object);
		}, (err: any) => {
			this.codeTypeFetched = true;
		});
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let cdTypeColumns: EIMDataGridColumn[] = [];
		// 名前
		cdTypeColumns.push({field: 'definitionName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 368, suppressFilter: true});
		this.codeTypeDataGrid.setColumns(cdTypeColumns);
		let cdColumns: EIMDataGridColumn[] = [];
		// コード
		cdColumns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02119'), width: 184,
			cellRendererFramework: EIMDisabledNameRendererComponent, suppressSorting: true, suppressFilter: true});
		// 名前
		cdColumns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 184,
			cellRendererFramework: EIMDisabledNameRendererComponent, suppressSorting: true, suppressFilter: true});
		this.codeDataGrid.setColumns(cdColumns);
		this.codeTypeService.getList({}).subscribe(
		(object: EIMCodeTypeDomain[]) => {
			this.codeTypeDataGrid.setData(object);
		},
		(err: any) => {
			this.errored.emit();
		});
	}

}
