import { Component, forwardRef, ViewChild, OnInit, Input, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { EIMComponent, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn, EIMDataGridColumnType } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMMessageService, EIMMessageType } from 'app/shared/services/message.service';
import { EIMAdminMainComponent } from 'app/admins/admins.component';
import { EIMAdminNameRendererComponent } from 'app/admins/shared/components/renderer/admin-name-renderer.component';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMFormatStatusRendererComponent } from 'app/admins/shared/components/renderer/format-status-renderer.component';
import { EIMAdminsFormatService } from 'app/admins/shared/services/apis/admins-format.service';
import { EIMAdminsDirectoryService } from 'app/admins/shared/services/apis/admins-directory.service';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMSplitStateService } from 'app/shared/services/split-state.service';
import { EIMFormatDTO } from 'app/admins/shared/dtos/format.dto';
import { EIMDirectoryDTO } from 'app/admins/shared/dtos/directory.dto';
import { EIMNumberRendererComponent } from 'app/shared/components/renderer/number-renderer.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PanelModule } from 'primeng/panel';


/**
 * フォーマットコンポーネント
 * @example
 *
 *      <eim-format>
 *      </eim-format>
 */
@Component({
    selector: 'eim-format',
    templateUrl: './format.component.html',
    styleUrls: ['./format.component.css'],
	imports: [
		CommonModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 
				
		AngularSplitModule,
		PanelModule, 
	],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMFormatComponent) }
    ],
	schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMFormatComponent implements EIMAdminMainComponent, OnInit {

	/** フォーマットデータグリッド */
	@ViewChild('formatDataGrid', { static: true }) formatDataGrid: EIMDataGridComponent;

	/** ディレクトリデータグリッド */
	@ViewChild('directoryDataGrid', { static: true }) directoryDataGrid: EIMDataGridComponent;

	/** スプリットの設定 */
	public splitSetting = {
		splitLeft: { size: 25 }
	}

	/** 画面識別ID */
	public viewId = 'Format';

	/** メニュー フォーマット登録 */
	private menuItemFormatCreate: EIMMenuItem =
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', command: (event) => { this.onClickCreateFormat(); } };
	/** メニュー フォーマット更新 */
	private menuItemFormatUpdate: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickUpdateFormat(); } };
	/** メニュー フォーマット削除 */
	private menuItemFormatDelete: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => { this.onClickDeleteFormat(); } };

	/** メニュー ディレクトリ登録 */
	private menuItemDirectoryCreate: EIMMenuItem =
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_03033'), icon: 'eim-icon-plus', disabled: true, command: (event) => { this.onClickCreateDirectory(); } };
	/** メニュー ディレクトリ更新 */
	private menuItemDirectoryUpdate: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03004'), icon: 'eim-icon-pencil', disabled: true, command: (event) => { this.onClickUpdateDirectory(); } };
	/** メニュー ディレクトリ削除 */
	private menuItemDirectoryDelete: EIMMenuItem =
		{ label: this.translateService.instant('EIM.LABEL_03003'), icon: 'eim-icon-trash', disabled: true, command: (event) => { this.onClickDeleteDirectory(); } };


	/** フォーマットのメニューバー*/
	public menubarItemsFormat: EIMMenuItem[] = [
		this.menuItemFormatCreate,
		this.menuItemFormatUpdate,
		this.menuItemFormatDelete,
	];

	/** フォーマットのコンテキストメニュー */
	public contentsMenuItemsFormat: EIMMenuItem[] = [
		this.menuItemFormatUpdate,
		this.menuItemFormatDelete,
	];

	/** ディレクトリのメニューバー*/
	public menubarItemsFormatDir: EIMMenuItem[] = [
		this.menuItemDirectoryCreate,
		this.menuItemDirectoryUpdate,
		this.menuItemDirectoryDelete,
	];

	/** ディレクトリのコンテキストメニュー */
	public contentsMenuItemsFormatDir: EIMMenuItem[] = [
		this.menuItemDirectoryUpdate,
		this.menuItemDirectoryDelete,
	];

	/** 選択フォーマットID */
	private selectedFormatId = 0;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected messageService: EIMMessageService,
		protected translateService: TranslateService,
		protected adminsFormatService: EIMAdminsFormatService,
		protected adminsDirectoryService: EIMAdminsDirectoryService,
		protected splitStateService: EIMSplitStateService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
	) {

	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			this.show();
			return;
		}

		// 復元します
		this.formatDataGrid.setState(state.formatDataGrid);
		this.directoryDataGrid.setState(state.directoryDataGrid);
		this.splitStateService.setState(state.split, this.splitSetting);

		// メニューバーの活性制御処理
		window.setTimeout(() => {
			this.setMenubarEnable();
		});

	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		return {
			formatDataGrid: this.formatDataGrid.getState(),
			directoryDataGrid: this.directoryDataGrid.getState(),
			split: this.splitStateService.getState(this.splitSetting)

		};
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		// フォーマット一覧項目
		let columnsFormat: EIMDataGridColumn[] = [];
		// フォーマット
		columnsFormat.push({ field: 'label', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02023'), width: 308, suppressSorting: true, suppressFilter: true, cellRendererFramework: EIMAdminNameRendererComponent });
		this.formatDataGrid.setColumns(columnsFormat);
		this.formatDataGrid.showAllSelectButton = false;
		this.formatDataGrid.multiple = false;

		// ディレクトリ一覧項目
		let columnsDir: EIMDataGridColumn[] = [];
		// ディレクトリ
		columnsDir.push({ field: 'path', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02025'), width: 526, suppressFilter: true, cellRendererFramework: EIMAdminNameRendererComponent });
		// ステータス
		columnsDir.push({ field: 'status', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02026'), width: 100, suppressFilter: true, cellRendererFramework: EIMFormatStatusRendererComponent });
		// ファイル数
		columnsDir.push({ field: 'fileCount', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02027'), width: 150, suppressFilter: true, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number });
		// 合計ファイルサイズ(Bytes)
		columnsDir.push({ field: 'fileSize', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02028'), width: 205, suppressFilter: true, cellRendererFramework: EIMNumberRendererComponent, type: EIMDataGridColumnType.number });
		this.directoryDataGrid.setColumns(columnsDir);
		this.directoryDataGrid.showAllSelectButton = false;
		this.directoryDataGrid.multiple = false;

	}

	/**
	 * フォーマット選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectedFormat(event: any): void {
		// 選択したフォーマットを取得
		let selectedDataList = this.formatDataGrid.getSelectedData();
		if (selectedDataList.length === 1) {
			let selectedData = selectedDataList[0];
			// ディレクトリ一覧を取得
			this.getDirectoryList(selectedData.id);

		} else {
			this.directoryDataGrid.setData([]);
			this.selectedFormatId = 0;
			// メニューバーの活性制御処理
			this.setMenubarEnable();
		}

	}

	/**
	 * フォーマット登録メニュー押下時のイベントハンドラです.
	 * フォーマット登録ダイアログを表示します.
	 */
	onClickCreateFormat(): void {
		// フォーマット登録画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormatCreator({
			created: (format: EIMFormatDTO) => {
				// フォーマット登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);

				this.formatComplete(format[0].id);
				// フォーマット登録メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02023') }));
			},
			errored: () => {
				// フォーマット登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * フォーマット更新メニュー押下時のイベントハンドラです.
	 * フォーマット更新ダイアログを表示します.
	 */
	onClickUpdateFormat(): void {
		// 選択したフォーマット取得
		let selectedDataList = this.formatDataGrid.getSelectedData();
		if (selectedDataList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let formatId = selectedDataList[0].id;

		// フォーマット更新画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showFormatUpdator(formatId, {
			updated: (format: EIMFormatDTO) => {
				// フォーマット更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);

				this.formatComplete(formatId);
				// フォーマット更新メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02023') }));
			},
			errored: () => {
				// フォーマット更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});

	}

	/**
	 * フォーマット削除メニュー押下時のイベントハンドラです.
	 * 選択されたフォーマットを削除します.
	 */
	onClickDeleteFormat(): void {
		// 選択したフォーマット取得
		let selectedDataList = this.formatDataGrid.getSelectedData();
		if (selectedDataList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedData = selectedDataList[0];

		// フォーマット削除確認メッセージを表示
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00001', { value: selectedData.label }),
			() => {
				// フォーマットを削除
				this.adminsFormatService.delete(selectedData.id).subscribe(
					(result: string) => {
						this.formatComplete();
						// フォーマット削除メッセージを表示
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02023') }));
					}
				);
			}
		);
	}

	/**
	 * ディレクトリ選択時のイベントハンドラです.
	 * @param event イベント
	 */
	onSelectedDirectory(event: any): void {
		// メニューバーの活性制御処理
		this.setMenubarEnable();
	}

	/**
	 * ディレクトリ登録メニュー押下時のイベントハンドラです.
	 * ディレクトリ登録ダイアログを表示します.
	 */
	onClickCreateDirectory(): void {
		// 選択したフォーマット取得
		let selectedDataList = this.formatDataGrid.getSelectedData();
		if (selectedDataList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedData = selectedDataList[0];

		// ディレクトリ登録画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showDirectoryCreator(selectedData.id, selectedData.label, {
			created: (result: string) => {
				// ディレクトリ登録画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);

				this.directoryComplete(selectedData.id);
				// ディレクトリ登録メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00001', { value: this.translateService.instant('EIM_ADMINS.LABEL_02025') }));
			}
		});
	}

	/**
	 * ディレクトリ更新メニュー押下時のイベントハンドラです.
	 * ディレクトリ更新ダイアログを表示します.
	 */
	onClickUpdateDirectory(): void {
		// 選択したフォーマット取得
		let selectedFormatList = this.formatDataGrid.getSelectedData();
		if (selectedFormatList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedFormatId = selectedFormatList[0].id;

		// 選択したディレクトリ取得
		let selectedDirList = this.directoryDataGrid.getSelectedData();
		if (selectedDirList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedDirId = selectedDirList[0].id;

		// ディレクトリ更新画面を表示
		let dialogId: string = this.adminDialogManagerComponentService.showDirectoryUpdator(selectedFormatId, selectedDirId, {
			updated: (dirDto: EIMDirectoryDTO) => {
				// ディレクトリ更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);

				this.directoryComplete(selectedFormatId);
				// ディレクトリ更新メッセージを表示
				this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00002', { value: this.translateService.instant('EIM_ADMINS.LABEL_02025') }));
			},
			errored: () => {
				// ディレクトリ更新画面を閉じる
				this.adminDialogManagerComponentService.close(dialogId);
			}
		});
	}

	/**
	 * ディレクトリ削除メニュー押下時のイベントハンドラです.
	 * 選択されたのディレクトリを削除します.
	 */
	onClickDeleteDirectory(): void {
		// 選択したフォーマット取得
		let selectedFormatList = this.formatDataGrid.getSelectedData();
		if (selectedFormatList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedFormat = selectedFormatList[0];

		// 選択したディレクトリ取得
		let selectedDirList = this.directoryDataGrid.getSelectedData();
		if (selectedDirList.length === 0) {
			// 未選択の場合、何もしない
			return;
		}
		let selectedDir = selectedDirList[0];

		// ディレクトリ削除確認メッセージを表示
		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00002', { value: selectedDir.path }),
			() => {
				// ディレクトリを削除
				this.adminsDirectoryService.delete(selectedFormat.id, selectedDir.id).subscribe(
					(result: string) => {
						this.directoryComplete(selectedFormat.id);
						// ディレクトリ削除メッセージを表示
						this.messageService.showGrowl(this.translateService.instant('EIM_ADMINS.INFO_00003', { value: this.translateService.instant('EIM_ADMINS.LABEL_02025') }));
					}
				);
			}
		);

	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * フォーマット一覧を表示します.
	 * @param formatId フォーマットID
	 */
	private show(formatId?: number): void {
		// フォーマット一覧を取得
		this.adminsFormatService.getList().subscribe(
			(formatList: EIMFormatDTO[]) => {
				this.formatDataGrid.setData(formatList);
				if (formatId) {
					// フォーマットの行を選択
					this.formatDataGrid.select([{ id: formatId }], false);
					// ディレクトリリストを取得
					this.getDirectoryList(formatId);
				} else {
					// メニューバーの活性制御処理
					this.setMenubarEnable();
				}

			}, (err: any) => {
				// フォーマットデータグリッドをクリア
				this.formatDataGrid.setData([]);
				// メニューバーの活性制御処理
				this.setMenubarEnable();
			});
	}

	/**
	 * ディレクトリを取得します.
	 * @param formatId フォーマットID
	 */
	private getDirectoryList(formatId: number): void {
		this.selectedFormatId = formatId;
		// ディレクトリ一覧を取得
		this.adminsDirectoryService.getList(formatId).subscribe(
			(directorys: EIMDirectoryDTO[]) => {
				// ディレクトリ一覧を表示
				if (this.selectedFormatId === formatId) {
					this.directoryDataGrid.setData(directorys);
					// メニューバーの活性制御処理
					this.setMenubarEnable();
				}
			}, (err: any) => {
				// ディレクトリ一覧をクリア
				this.directoryDataGrid.setData([]);
				// メニューバーの活性制御処理
				this.setMenubarEnable();
			}
		);
	}

	/**
	 * メニューバーの活性制御処理です.
	 */
	private setMenubarEnable(): void {
		// フォーマット一覧のメニューバー制御
		this.setFormatMenubarItemEnable();

		// ディレクトリのメニューバー制御
		this.setFormatDirMenubarItemEnable();

	}

	/**
	 * フォーマット一覧の制御対象メニューの活性制御処理です.
	 */
	private setFormatMenubarItemEnable(): void {
		// 選択したフォーマット取得
		let selectedFormatList = this.formatDataGrid.getSelectedData();
		if (selectedFormatList && selectedFormatList.length === 1) {
			// フォーマット更新・削除メニュー活性にする
			this.menuItemFormatUpdate.disabled = false;
			this.menuItemFormatDelete.disabled = false;

			// ディレクトリ登録メニュー活性にする
			this.menuItemDirectoryCreate.disabled = false;
		} else {
			// フォーマット更新・削除メニュー非活性にする
			this.menuItemFormatUpdate.disabled = true;
			this.menuItemFormatDelete.disabled = true;

			// ディレクトリ登録メニュー非活性にする
			this.menuItemDirectoryCreate.disabled = true;
		}
	}

	/**
	 * ディレクトリ一覧の制御対象メニューの活性制御処理です.
	 */
	private setFormatDirMenubarItemEnable(): void {
		// 選択したフォーマット取得
		let selectedDirList = this.directoryDataGrid.getSelectedData();
		if (selectedDirList && selectedDirList.length === 1) {
			// ディレクトリ更新メニュー活性にする
			this.menuItemDirectoryUpdate.disabled = false;

			// オンラインまたはファイル数が0より大きい場合、非活性にする
			if (selectedDirList[0].fileCount > 0 ||
				EIMAdminsConstantService.DIR_STATUS_ONLINE_VALUE === selectedDirList[0].status) {
				// ディレクトリ削除メニュー非活性にする
				this.menuItemDirectoryDelete.disabled = true;
			} else {
				// ディレクトリ削除メニュー活性にする
				this.menuItemDirectoryDelete.disabled = false;
			}

		} else {
			// ディレクトリ更新・削除メニュー非活性にする
			this.menuItemDirectoryUpdate.disabled = true;
			this.menuItemDirectoryDelete.disabled = true;
		}

	}

	/**
	 * フォーマット登録・更新・削除の完了後処理です.
	 * @param formatId フォーマットID
	 */
	private formatComplete(formatId?: number): void {
		// ディレクトリリストをクリア
		this.directoryDataGrid.setData([]);

		// フォーマットリストとディレクトリリストを表示します．
		this.show(formatId);

	}

	/**
	 * ディレクトリ登録・更新・削除の完了後処理です.
	 * @param formatId フォーマットID
	 */
	private directoryComplete(formatId: number): void {
		// ディレクトリリストをクリア
		this.directoryDataGrid.setData([]);
		// ディレクトリリストを取得します．
		this.getDirectoryList(formatId);
	}

}
