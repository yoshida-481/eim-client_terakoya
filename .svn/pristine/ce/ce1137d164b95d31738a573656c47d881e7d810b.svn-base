import {EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { EIMDataGridColumn, EIMDataGridColumnGroup, EIMDataGridColumnType, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { EIMConstantService } from 'app/shared/services/constant.service';

import { EIMBoxNameRendererComponent } from 'app/documents/shared/components/renderer/box-name-renderer.component';
import { EIMBoxObjectDomain } from 'app/shared/domains/box-object.domain';
import { EIMObjectNameRendererComponent } from "app/documents/shared/components/renderer/object-name-renderer.component";
import { BoxEIMFileDragComponentService } from "../eim-file-drag/eim-file-drag.component.service";
import { EIMDialogManagerComponentService } from "app/documents/shared/components/dialog-manager/dialog-manager.component.service";
import { EIMCreatable } from "app/shared/shared.interface";
import { MenuItem } from "primeng/api";7
/**
 * Boxコンテンツリストコンポーネントサービス
 */
@Injectable()
export class EIMBoxContentsListComponentService implements EIMCreatable {
	/** コンテンツ選択イベント */
	private contentsSelected = new Subject<any[]>();
	private documentCreateSubject = new Subject<any[]>();
	private documentPublicFlagSubject = new Subject<any[]>();
	private documentDeleteFlagSubject = new Subject<any[]>();
	contentsSelected$ = this.contentsSelected.asObservable();

	/** Boxファイル選択フラグ */
	public selectedBoxFlag: boolean = false;

	/** Boxファイル連携フラグ*/
	public copyToEIMFlag: boolean = false;

	/** EIMへのコピーの有効/無効 **/
	public enableEIMPaste: boolean = false;

	/** Boxファイル削除ボタンの有効/無効 **/
	public enableBoxFileDelete: boolean = false;

	/** BoxからEIMへの連携対象ファイルID */
	public selectedBoxFileId: String[] = [];

	/** 選択したファイルのBoxファイルパス */
	public breadcrumbItems: MenuItem[] = [];

	/**
	 * コンストラクタです.
	 */
	/** フォーマット選択ダイアログ */
	constructor(
		protected translateService: TranslateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService
	) {
	}

	/** ダイアログ登録実行 */
	visibleCreate?: boolean;
	created: EventEmitter<any>;
	create(): void { }
	public creatable(): boolean {
		return true;
	}
	disabled?: boolean;
	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択されたコンテンツ情報の配列を設定します.
	 * @param selectedData 選択されたコンテンツ情報の配列
	 */
	setSelectedContents(selectedData: any[]): void {
		this.contentsSelected.next(selectedData);

	}

	/**
	 * コンテンツリストのデータグリッドカラム情報を返却します.
	 * @return コンテンツリストのデータグリッドカラム情報
	 */
	getColumns(): Observable<(EIMDataGridColumn | EIMDataGridColumnGroup)[]> {
		return zip(
			this.translateService.get('EIM_DOCUMENTS.LABEL_02000'),
			this.translateService.get('EIM_DOCUMENTS.LABEL_02037'),
			this.translateService.get('EIM.LABEL_02032'),
			this.translateService.get('EIM.LABEL_02033'),
		).pipe(map(([name, revision, modificationUser, modificationDate]) => [
			// 名前
			{ field: 'name', headerName: name, cellRendererFramework: EIMBoxNameRendererComponent, width: 300, cellRendererParams:{ draggableToEIMArea: true, }, },
			// 履歴
			{ field: 'revision', headerName: revision, type: EIMDataGridColumnType.number, width: 70, valueGetter: this.getRevision },
			// 更新者
			{ field: 'modificationUser', headerName: modificationUser, width: 120 },
			// 更新日時
			{ field: 'modificationDate', headerName: modificationDate, type: EIMDataGridColumnType.dateTime, width: EIMConstantService.COLUMN_WIDTH_DATETIME },
		]));
	}

	/**
	 * コンテンツリストデータグリッド同一行判定関数
	 * @param a Boxオブジェクトドメイン
	 * @param b Boxオブジェクトドメイン
	 * @return 同一の場合true
	 */
	boxObjectEquals(a: EIMBoxObjectDomain, b: EIMBoxObjectDomain): boolean {
		return a.id === b.id;
	}

	/**
	 * 画面表示用に履歴（サーバから取得した版+1）を返却します.
	 * @param params パラメータ
	 * @return 履歴
	 */
	getRevision(params: any): string {
		let value: string = null;
		let key: string = params.colDef.field;

		if (params.data) {
			if (params.data.hasOwnProperty(key) && params.data[key] !== null && params.data[key] !== '') {
				value = params.data[key] + 1;
			}
		}

		return value;
	}

	public showBoxFormat(selectedData: any, boxData: any): void {
		let dialogId: string = this.dialogManagerComponentService.showBoxFormat(
			selectedData,
			boxData,
			{}
		);
	}
	
	/**  box-selectorのBox公開サービス */
	private selectDataSet = new Subject<any>();

	/**  ダイアログからのデータ受け取りサービス */
	boxSelectCreate(data: any) {
		this.selectDataSet.next(data);
	}
	/**  ダイアログからのデータ取得サービス */
	getBoxCreate() {
		return this.selectDataSet.asObservable();
	}

	/** EIMANAGERにBoxファイル登録後のグリッド更新イベントハンドラ. */
	boxDataGridRefresh() {
		this.documentCreateSubject.next(null);
	}

	/** EIMANAGERにBoxファイル登録後のグリッド更新イベントハンドラ呼び出し. */
	getBoxDataGridRefresh() {
		return this.documentCreateSubject.asObservable();
	}

	/** EIMANAGERのデータグリッド選択後の公開ボタンイベントハンドラ. */
	documentPublicFlag() {
		this.documentPublicFlagSubject.next(null);
	}

	/** EIMANAGERのデータグリッド選択後の公開ボタンイベントハンドラ呼び出し. */
	getDocumentPublicFlag() {
		return this.documentPublicFlagSubject.asObservable();
	}

	/** EIMANAGERのデータグリッド選択後のBoxファイル削除ボタンイベントハンドラ. */
	documentDeleteFlag() {
		this.documentDeleteFlagSubject.next(null);
	}

	/** EIMANAGERのデータグリッド選択後のBoxファイル削除ボタンイベントハンドラ呼び出し. */
	getDocumentDeleteFlag() {
		return this.documentDeleteFlagSubject.asObservable();
	}
}
