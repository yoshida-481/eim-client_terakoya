import { Component, forwardRef, ViewChild, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';

import { EIMDateService } from 'app/shared/services/date.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMServerConfigService } from 'app/shared/services/server-config.service';
import { EIMDocumentFileService } from 'app/documents/shared/services/apis/document-file.service';

/**
 * アクセス履歴コンポーネント
 * @example
 *
 *      <eim-access-history
 *          [content]="content">
 *      </eim-access-history>
 */
@Component({
    selector: 'eim-access-history',
    templateUrl: './access-history.component.html',
    styleUrls: ['./access-history.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMAccessHistoryComponent) }
    ],
    standalone: false
})
export class EIMAccessHistoryComponent implements OnInit, OnChanges {

	/** アクセス履歴データグリッド */
	@ViewChild('accessHistoryGrid', { static: true })
	accessHistoryGrid: EIMDataGridComponent;

	/** アクセス履歴データグリッド */
	@ViewChild('accessHistoryCsvGrid', { static: true })
	accessHistoryCsvGrid: EIMDataGridComponent;

	/** 対象のオブジェクト */
	@Input() content: any;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	public contentsGridMenuItems: EIMMenuItem[] =
		[
			{label: this.translateService.instant('EIM_DOCUMENTS.LABEL_03018'), name: 'csvDownload', icon: 'fa fa-download', command: (event) => {this.downloadCsv(); }},
		];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected documentFormService: EIMDocumentFormService,
			protected translateService: TranslateService,
			protected dateService: EIMDateService,
			protected serverConfigService: EIMServerConfigService,
			protected documentFileService: EIMDocumentFileService
	) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		let csvcolumns: EIMDataGridColumn[] = [];

		// アクセス日時
		columns.push({field: 'accessDate', headerName: this.translateService.instant('EIM.LABEL_02024'), width: EIMConstantService.COLUMN_WIDTH_DATETIME, comparator: this.dateService.dateComparator});
		// ユーザ
		columns.push({field: 'userName', headerName: this.translateService.instant('EIM.LABEL_02017'), width: 150});
		// アクセス内容
		columns.push({field: 'action', headerName: this.translateService.instant('EIM.LABEL_02025'), width: 348});
		this.accessHistoryGrid.setColumns(columns);
		this.accessHistoryGrid.showAllSelectButton = false;

		// 名前
		csvcolumns.push({field: 'fileName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: EIMConstantService.COLUMN_WIDTH_DATETIME});
		// アクセス日時
		csvcolumns.push({field: 'accessDate', headerName: this.translateService.instant('EIM.LABEL_02024'), width: EIMConstantService.COLUMN_WIDTH_DATETIME});
		// ユーザ
		csvcolumns.push({field: 'userName', headerName: this.translateService.instant('EIM.LABEL_02017'), width: 150});
		// メールアドレス
		let mAddressOutputFlg: boolean = this.serverConfigService.csvMailAddressOutputFlg;
		if (mAddressOutputFlg) {
			csvcolumns.push({field: 'userMail', headerName: this.translateService.instant('EIM.LABEL_02042'), width: 345});
		}
		// アクセス内容
		csvcolumns.push({field: 'action', headerName: this.translateService.instant('EIM.LABEL_02025'), width: 345});
		this.accessHistoryCsvGrid.setColumns(csvcolumns);
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 * @param changes 変更情報
	 */
	ngOnChanges(changes: SimpleChanges): void {
		this.show();
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示する。
	 */
	private show(): void {
		this.documentFormService.getAccessHistory(this.content.objId)
		.subscribe((object: any) => {
			this.accessHistoryGrid.setData(object);
			let csvlist = [];
			for ( let i = 0; i < object.length; i++) {
				let csv = object[i];
				csv['fileName'] = this.content.objName;
				csvlist.push(csv);
			}
			this.accessHistoryCsvGrid.setData(csvlist);

		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});

		});
	}
	/**
	 * Csvファイルをダウンロードする。
	 */
	private downloadCsv(): void {
		let fileName: string = this.serverConfigService.csvAccessHistoryFileHeader + this.dateService.getFixedCurrentDateTimeString() + EIMDocumentsConstantService.CSV_EXTENSION;
		let csv: string = this.accessHistoryCsvGrid.getDataAsCsv();
		this.documentFileService.downloadCSV(EIMDocumentsConstantService.OPE_HIST_APP_ID, fileName, csv);
	}

}
