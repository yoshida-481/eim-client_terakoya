import { EIMCodeDomain } from 'app/shared/domains/entity/code.domain';
import { EIMDisabledNameRendererComponent } from 'app/admins/shared/components/renderer/disabled-name-renderer.component';
import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMCodeService } from 'app/admins/shared/services/apis/code.service';
import { EIMCodeTypeDomain } from 'app/shared/domains/entity/code-type.domain';

/**
 * コード並べ替えコンポーネント
 * @example
 *      <eim-code-sort-updator>
 *          [id]="id">
 *      </eim-code-sort-updator>
 */
@Component({
    selector: 'eim-code-sort-updator',
    templateUrl: './code-sort-updator.component.html',
    styleUrls: ['./code-sort-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCodeSortUpdatorComponent) }
    ],
    standalone: false
})

export class EIMCodeSortUpdatorComponent implements OnInit, EIMUpdatable {

	/** コードデータグリッド */
	@ViewChild('codeDataGrid', { static: true }) codeDataGrid: EIMDataGridComponent;

	/** 対象コードタイプ */
	@Input() codeType: EIMCodeTypeDomain;

	/** 更新完了時のイベントエミッタ */
	@Output() updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新可否フラグ */
	public updatableFlag = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected localStorageService: EIMLocalStorageService,
			protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
			protected codeService: EIMCodeService,
	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * コード並べ替えを実行します.
	 */
	public update(): void {
		let codeList: EIMCodeDomain[] = [];
		for (let i = 0; i < this.codeDataGrid.getData().length; i++) {
			let code: EIMCodeDomain = new EIMCodeDomain(this.codeDataGrid.getData()[i]);
			code.sequence = i;
			codeList.push(code);
		}
		this.codeService.sortSequence(this.codeType, codeList).subscribe(
			(data: number) => {
				// ソート完了後、ソート対象コードタイプを返却する
				this.updated.emit();
			}
		);
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
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickUp(event: any): void {
		this.updatableFlag = this.codeDataGrid.moveUpSelectedData() || this.updatableFlag;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickDown(event: any): void {
		this.updatableFlag = this.codeDataGrid.moveDownSelectedData() || this.updatableFlag;
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// コード
		columns.push({field: 'code', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02119'), width: 274,
			cellRendererFramework: EIMDisabledNameRendererComponent, suppressSorting: true, suppressFilter: true});
		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02016'), width: 273,
			cellRendererFramework: EIMDisabledNameRendererComponent, suppressSorting: true, suppressFilter: true});
		this.codeDataGrid.setColumns(columns);
		this.codeService.getList(this.codeType.id).subscribe(
			(object: any) => {
				this.codeDataGrid.setData(object);
			},
			(err: any) => {
			window.setTimeout(() => {
				this.errored.emit();
			});
		});
	}
}
