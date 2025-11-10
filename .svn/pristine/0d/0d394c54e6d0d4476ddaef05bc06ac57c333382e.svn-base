import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMDateTimeRendererComponentService } from 'app/shared/components/renderer/date-time-renderer.component.service';
import { EIMDateTimeRendererComponent } from 'app/shared/components/renderer/date-time-renderer.component';
import { EIMMenuItem } from './../../../shared/shared.interface';

import { Component, forwardRef, ViewChild, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';
import { EIMCompareFileNameRendererComponent } from 'app/documents/shared/components/renderer/compare-file-name-renderer.component';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * 公開ファイル比較結果一覧コンポーネント
 * @example
 *
 *      <eim-public-file-compare-list>
 *      </eim-public-file-compare-list>
 */
@Component({
    selector: 'eim-public-file-compare-list',
    templateUrl: './public-file-compare-list.component.html',
    styleUrls: ['./public-file-compare-list.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMPublicFileCompareListComponent) }
    ],
    standalone: false
})
export class EIMPublicFileCompareListComponent implements OnInit {

	/** 公開ファイル比較結果データグリッド */
	@ViewChild('compareFileList', { static: true })
	compareFileList: EIMDataGridComponent;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 比較結果ファイル一覧のメニュー */
	public compareListMenu: EIMMenuItem[] = [
		{label: this.translateService.instant('EIM.LABEL_03003'), icon: 'fa fa-trash-o', disabled: true, command: (event) => {this.onClickDelete(event); }},
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected userService: EIMDocumentsUserService,
			protected translateService: TranslateService,
			protected dateTimeRendererComponentService: EIMDateTimeRendererComponentService,
			protected messageService: EIMMessageService,
			protected dateService: EIMDateService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * 画面を表示します
	 */
	public show(): void {
		this.userService.getPublicFileCompareList()
		.subscribe((object: any) => {
			this.compareFileList.setData(object);
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});
		});
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 名前
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02000'), width: 300,
			cellRendererFramework: EIMCompareFileNameRendererComponent});
		// 作成日時
		columns.push({field: 'createDateTime', headerName: this.translateService.instant('EIM.LABEL_02031'), width: 210,
            cellRendererFramework: EIMDateTimeRendererComponent, valueGetter: this.dateTimeRendererComponentService.valueGetter, comparator: this.dateService.dateComparator
        });
		this.compareFileList.setColumns(columns);
		this.show();
	}

	/**
	 * 一覧表示選択変更時のイベントハンドラです.
	 * @param event イベント
	 */
	public onChangeDataGrid(event): void {
		for (let i = 0; i < this.compareListMenu.length; i++) {
			this.compareListMenu[i].disabled = this.compareFileList.getSelectedData().length === 0;
		}
	}

	/**
	 * 対象のドキュメントを削除します.
	 * @param event イベント
	 */
	public onClickDelete(event: any): void {
		// 削除完了リスト
		let deleteList = []
		let targetList = this.compareFileList.getSelectedData();
		let deleteTargetCnt = 0;
		let deleteSuccess = false;
		let message: string;
		if (targetList.length === 1) {
			message = this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00008', {value: targetList[0].objName});
		} else {
			message = this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00007');
		}
		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm, message,
				() => {
					for (let i = 0; i < targetList.length; i++) {
						this.userService.deletePublicFileCompareFile(targetList[i].objId)
							.subscribe((object: any) => {
								deleteList.push(targetList[i]);
								deleteTargetCnt++;
								deleteSuccess = true;
								if (deleteSuccess && deleteTargetCnt === targetList.length) {
									this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00010'));
									this.compareFileList.removeRowData(deleteList);
								}
						}, (err: any) => {
							// エラーの場合削除処理を行わない
							deleteTargetCnt++;
							if (deleteSuccess && deleteTargetCnt === targetList.length) {
								this.messageService.showGrowl(this.translateService.instant('EIM_DOCUMENTS.INFO_00010'));
								this.compareFileList.removeRowData(deleteList);
							}
						});
					}
				}
		);
	}


}
