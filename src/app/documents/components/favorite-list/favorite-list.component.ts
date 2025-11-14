import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { MenuItem } from 'primeng/api';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';

import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';

/**
 * お気に入り一覧コンポーネント
 * @example
 *      <eim-favorite-list>
 *      </eim-favorite-list>
 */
@Component({
    selector: 'eim-favorite-list',
    templateUrl: './favorite-list.component.html',
    styleUrls: ['./favorite-list.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFavoriteListComponent) }
    ],
    standalone: false
})
export class EIMFavoriteListComponent implements OnInit {

	/** お気に入り一覧データグリッド */
	@ViewChild('favoriteGrid', { static: true })
	favoriteGrid: EIMDataGridComponent;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 名前選択イベントエミッタ */
	@Output() onNodeSelect: EventEmitter<any> = new EventEmitter<any>();

	/** 削除メニューアイテム */
	private deleteMenuItem: MenuItem = {label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash',
			disabled: true, command: (event) => {this.onClickDelete(event); }}

	/** お気に入り一覧のメニュー */
	public menuItems: MenuItem[] = [
		this.deleteMenuItem,
	];

	/** ドキュメント一覧のコンテキストメニュー */
	public contextMenuItems: MenuItem[] = [
		this.deleteMenuItem,
	];

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected userService: EIMDocumentsUserService,
			protected translateService: TranslateService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected messageService: EIMMessageService,
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
		// 名前
		columns.push({field: 'path', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 207, cellRendererFramework: EIMObjectNameRendererComponent});
		// 場所
		columns.push({field: 'parentPath', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 306});
		this.favoriteGrid.setColumns(columns);

		// 削除ボタンの初期状態は非活性
		this.deleteMenuItem.disabled = true;

		this.show();
	}

	/**
	 * 削除ボタンクリックイベントハンドラです.
	 * @param event イベント
	 */
	onClickDelete(event: any): void {
		this.deleteFavorites();
	}

	/**
	 * ドキュメントクリックイベントハンドラです.
	 * @param event イベント
	 */
	onSelectFile (event: any): void {
		let selectedData: any = this.favoriteGrid.getSelectedData();
		this.changeEnableMenuItem(selectedData);
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラです.
	 * @param event イベント
	 */
	onContextMenuContentsList(event: MouseEvent): void {
		window.setTimeout(() => {
			let selectedFiles = this.favoriteGrid.getSelectedData();
			if ((selectedFiles.length > 0)) {
				this.deleteMenuItem.disabled = false;
			} else {
				this.deleteMenuItem.disabled = true;
			}
		});
	}

	/**
	 * グリッド内名前選択イベントハンドラです.
	 * @param event イベント
	 */
	onNodeSelectEmit(event: any): void {
		// 名前選択イベントエミッタをエミット
		this.onNodeSelect.emit(event);
		// 検索画面を閉じる
		this.dialogManagerComponentService.close('FAVORITE_LIST');
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 */
	private show(): void {
		this.userService.getFavoriteList()
		.subscribe((object: any) => {
			this.favoriteGrid.setData(object);
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});

		});
	}

	/**
	 * 選択状況に応じて削除メニューの有効/無効を切り替えます.
	 * @param selectFileItems 選択されたファイルアイテム配列
	 */
	private changeEnableMenuItem(selectedFiles: any[]): void {
		// 削除ボタンの押下可否を切り替える
		if (selectedFiles.length > 0) {
			this.deleteMenuItem.disabled = false;
		} else {
			this.deleteMenuItem.disabled = true;
		}
	}

	/**
	 * お気に入りを削除します.
	 */
	private deleteFavorites(): void {
		// 確認ダイアログ
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_DOCUMENTS.CONFIRM_00008', {value: this.translateService.instant('EIM_DOCUMENTS.LABEL_02187')}),
			() => {
				let selectedDataList: any = this.favoriteGrid.getSelectedData();
				let rowIndex: number = this.favoriteGrid.getFirstRowIndex();
				let scrollTop: number = this.favoriteGrid.getScrollTop();

				for (let i = 0; i < selectedDataList.length; i++) {
					this.userService.deleteFavorite(selectedDataList[i].fvrtObjId)
						.subscribe((object: any) => {
							let deletedList = new Array();
							deletedList.push(selectedDataList[i]);
							this.favoriteGrid.removeRowData(deletedList);
							if (i === selectedDataList.length - 1) {
								this.favoriteGrid.setSelectRow(rowIndex, scrollTop);
								this.changeEnableMenuItem(this.favoriteGrid.getSelectedData());
							}
					}, (err: any) => {
						this.errored.emit();
					});
				}
			});
	}
}
