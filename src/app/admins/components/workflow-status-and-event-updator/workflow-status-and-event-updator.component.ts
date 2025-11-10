import { Component, forwardRef, ViewChild, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable, EIMMenuItem } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMDocumentsConstantService } from 'app/documents/shared/services/documents-constant.service';
import { EIMLocalStorageService } from 'app/shared/services/apis/local-storage.service';
import { SelectItem } from 'primeng/api';
import { EIMWorkflowDomain } from 'app/admins/shared/domains/workflow.domain';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMWorkflowDiagramComponent } from 'app/admins/components/workflow-diagram/workflow-diagram.component';
import { EIMAdminDialogManagerComponentService } from 'app/admins/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMWorkflowCreatorEventSkipRendererComponent } from 'app/admins/shared/components/renderer/workflow-creator-event-skip-renderer.component';
import { EIMMessageType, EIMMessageService } from 'app/shared/services/message.service';
import { EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';

export namespace viewNameNamespace {
	// ステータス構成部
	export const STATUS_TYPE = 'STATUS_TYPE';
	// スキップイベント構成部
	export const SKIP = 'SKIP';
}

/**
 * ドキュメント用ワークフローステータス/イベント更新コンポーネント
 * @example
 *
 *		<eim-workflow-status-and-event-updator
 *			[workflow]="workflow"
 *		>
 *		</eim-workflow-status-and-event-updator>
 */
@Component({
    selector: 'eim-workflow-status-and-event-updator',
    templateUrl: '../workflow-creator/document-workflow-creator.component.html',
    styleUrls: ['../workflow-creator/workflow-creator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIWorkflowStatusAndEventComponent) }
    ],
    standalone: false
})

export class EIWorkflowStatusAndEventComponent implements OnInit, AfterViewInit, EIMUpdatable {
	/** ワークフローフォーム */
	@ViewChild('workflowCreatorForm', { static: true }) workflowCreatorForm: NgForm;

	/** ステータスタイプ編集中データグリッド */
	@ViewChild('statusTypeEditDataGrid') statusTypeEditDataGrid: EIMDataGridComponent;

	/** ステータスタイプ承認データグリッド */
	@ViewChild('statusTypeApproveDataGrid') statusTypeApproveDataGrid: EIMDataGridComponent;

	/** ステータスタイプ公開データグリッド */
	@ViewChild('statusTypePublishDataGrid') statusTypePublishDataGrid: EIMDataGridComponent;

	/** スキップイベントデータグリッド */
	@ViewChild('skipDataGrid') skipDataGrid: EIMDataGridComponent;

	/** ワークフロー */
	@ViewChild('workflowDiagram') workflowDiagram: EIMWorkflowDiagramComponent;

	/** ワークフロー情報 */
	@Input() public workflow: EIMWorkflowDomain;

	/** 作成完了時のイベントエミッタ */
	@Output() public updated: EventEmitter<any[]> = new EventEmitter<any[]>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/** view 使用設定 */
	public useViewConf = {
		basic: false,
		statusType: true,
		skip: true
	}

	/** 入力最大数 */
	public inputMaxLength: number = EIMConstantService.INPUT_MAX_LENGTH;

	/** 有効期限設定入力最大数 */
	public inputYuukouMaxLength: number = EIMConstantService.INPUT_YUUKOU_MAX_LENGTH;

	/** 正規表現：有効期限設定 */
	public insertionYuukou: string = EIMConstantService.REGULAR_EXPRESSION_NUMBER_ONLY;

	/** 使用可能言語リスト */
	public languages: any[];

	/** ビュー名称定義 */
	public viewName = viewNameNamespace;

	/** 選択中のビュー名称 */
	public selectedViewName = this.viewName.STATUS_TYPE;

	/** 前へボタンの活性 */
	public enableBackButton = false;

	/** 次へボタンの活性 */
	public enableNextButton = false;

	/** 非活性行CSS */
	public disableRowStyle = {background: '#ddd'};

	/** 通過条件オプション */
	public approveThroughTerm: SelectItem[] = [
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_02116'), value: EIMConstantService.APPROVE_THROUGH_ONE },
		{ label: this.translateService.instant('EIM_ADMINS.LABEL_02117'), value: EIMConstantService.APPROVE_THROUGH_ALL }
	];

	/** 遷移元ステータスタイプ */
	public fromStatusTypes: SelectItem[]= [];

	/** 遷移先ステータスタイプ */
	public toStatusTypes: SelectItem[]= [];

	/** 遷移元ステータスタイプ一覧 */
	public allFromStatusTypes: any[] = [];

	/** 遷移先ステータスタイプ一覧 */
	public allToStatusTypes: any[] = [];

	/** 遷移元選択ステータスタイプID */
	public inputFromStatusTypes = 0;

	/** 遷移先選択ステータスタイプID */
	public inputToStatusTypes = 0;

	/** モード */
	public mode = 'updator';

	/** 通過条件 */
	public inputApproveThroughTerm = '0';

	/** 使用可能言語リスト */
	public statusNameList: { [key: string]: string; } = {};

	/** ステータスタイプデータグリッドのメニュー */
	public statusTypeDataGridMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03010'), name: 'addStatusType', icon: 'eim-icon-plus',
			command: ($event) => { this.addStatusType() }
		},
		{
			label: this.translateService.instant('EIM_ADMINS.LABEL_03028'), name: 'updateStatusType', icon: 'eim-icon-pencil',
			command: ($event) => { this.updateStatusType() }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteStatusType', icon: 'eim-icon-trash',
			command: ($event) => { this.deleteStatusType() }
		},
	];

	/** ステータスタイプ承認一覧のコンテキストメニュー */
	public statusTypeApproveContentsMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteStatusType', icon: 'eim-icon-trash', disabled: true, command: (event) => { this.deleteStatusType(); }
		},
	];

	/** スキップイベントデータグリッドのメニュー */
	public skipEventDataGridMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03010'), name: 'addSkipEvent', icon: 'eim-icon-plus', disabled: true,
			command: ($event) => { this.addSkipEvent() }
		},
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteSkipEvent', icon: 'eim-icon-trash', disabled: true,
			command: ($event) => { this.deleteSkipEvent() }
		},
	];

	/** スキップイベント一覧のコンテキストメニュー */
	public skipEventContentsMenuItems: EIMMenuItem[] = [
		{
			label: this.translateService.instant('EIM.LABEL_03003'), name: 'deleteSkipEvent', icon: 'eim-icon-trash', disabled: true, command: (event) => { this.deleteSkipEvent(); }
		},
	];

	/** 編集フラグ */
	public editFlg = false;

	/** 変更保持用 */
	private updateSeq = -1;

	/** ステータス製造番号最低値 */
	private minSerial = 1;

	/**
	 * スキップイベントグリッドステート
	 */
	private skipDataGridState: any;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected workflowService: EIMAdminsWorkflowService,
		protected translateService: TranslateService,
		protected localStorageService: EIMLocalStorageService,
		protected adminDialogManagerComponentService: EIMAdminDialogManagerComponentService,
		protected messageService: EIMMessageService,
	) {

	}


	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 更新します.
	 */
	public update(): void {
		this.messageService.show(EIMMessageType.confirm,
				this.translateService.instant('EIM_ADMINS.CONFIRM_00047') ,
				() => {
					// 初期化
					let seqCnt = 1;
					this.workflow.statusTypeList = [];
					// 編集中ステータスタイプの取得
					let editingStatusDataList = this.statusTypeEditDataGrid.getData();
					if ( editingStatusDataList && editingStatusDataList.length > 0 ) {
						for ( let i = 0; i < editingStatusDataList.length; i++) {
							// 遷移元リストデータを作成する。
							editingStatusDataList[i][ 'approveId' ] = EIMAdminsConstantService.STATUS_TYPE_EDIT;		// 編集中
							editingStatusDataList[i].No = -seqCnt;

							// ワークフローデータを作成する。
							let statusType = new EIMStatusTypeDomain(editingStatusDataList[i]);
							statusType.name = statusType.nameList[this.localStorageService.getLangId()];
							statusType.seq = seqCnt;
							this.workflow.statusTypeList.push( statusType );

							seqCnt++;
						}
					}

					// 承認依頼中ステータスタイプの取得
					let approveStatusDataList = this.statusTypeApproveDataGrid.getData();
					if ( approveStatusDataList && approveStatusDataList.length > 0 ) {
						for ( let i = 0; i < approveStatusDataList.length; i++) {
							// 遷移元、遷移先リストデータを作成する。
							approveStatusDataList[i][ 'approveId' ] = EIMAdminsConstantService.STATUS_TYPE_APPROVAL;		// 承認中
							approveStatusDataList[i].No = -seqCnt;
							// ワークフローデータ作成
							let statusType = new EIMStatusTypeDomain(approveStatusDataList[i]);
							statusType.name = statusType.nameList[this.localStorageService.getLangId()];
							statusType.seq = seqCnt;
							this.workflow.statusTypeList.push( statusType );

							seqCnt++;
						}
					}
					// 公開処理ステータスタイプの取得
					let publishStatusDataList = this.statusTypePublishDataGrid.getData();
					if ( publishStatusDataList && publishStatusDataList.length > 0 ) {
						for ( let i = 0; i < publishStatusDataList.length; i++) {
							// 遷移先リストデータを作成する。
							publishStatusDataList[i][ 'approveId' ] = EIMAdminsConstantService.STATUS_TYPE_PUBLISH;		// 公開
							publishStatusDataList[i].No = -seqCnt;

							let statusType = new EIMStatusTypeDomain(publishStatusDataList[i]);
							statusType.name = statusType.nameList[this.localStorageService.getLangId()];
							statusType.seq = seqCnt;
							this.workflow.statusTypeList.push(statusType);

							seqCnt++;
						}
					}
					this.makeStatusAndEventInfo();
					this.makeFromToList();
					this.renameSkipEvent();
					this.skipEventSetting();

					this.workflow.name = this.workflow.nameList[ this.languages[0].lang ];
					// 更新
					this.workflowService.updateStatusEventForDocument( this.workflow ).subscribe(
						(data: any) => {
							this.updated.emit(data);
						}
					);
				});
	}

	/**
	 * スキップイベント選択イベントハンドラです.
	 * @param event イベント
	 */
	public onSelectedSkipData(event: any): void {
		// ステータスタイプ選択選択
		let selectedData = this.skipDataGrid.getSelectedData()
		if (selectedData.length !== 1) {
			this.workflowDiagram.select([]);
			this.setEnableSkipEventMenuButton();
			return;
		}
		let data = selectedData[0];
		this.workflowDiagram.select([
			{
				id: data.fromSeq,
				seq: data.fromSeq,
				domain: {constructor: EIMStatusTypeDomain}
			},
			{
				id: data.toSeq,
				seq: data.toSeq,
				domain: {constructor: EIMStatusTypeDomain}
			}
		]);
		this.setEnableSkipEventMenuButton();
	}

	/**
	 * ダイアログを閉じます.
	 * 変更がある場合は破棄確認ダイアログを表示します。
	 * @param event イベント
	 * @param close クローズエミッタ
	 */
	public close(event, close: EventEmitter<null>): void {
		if (this.workflowCreatorForm.dirty || this.editFlg ) {
			// 破棄確認ダイアログ
			this.messageService.show(EIMMessageType.confirm, this.translateService.instant('EIM.CONFIRM_00003'),
					() => {
						close.emit();
					}
			);

		} else {
			close.emit();
		}
	}

	/**
	 * 登録可否を返却します.
	 * @return 登録可否
	 */
	public updatable(): boolean {
		this.setEnableNextAndBackButton();
		return this.editFlg;
	}

	/**
	 * 同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 同一かどうか
	 */
	public equalsStatusType(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	/**
	 * データグリッド同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 判定結果
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		if ( obj1.fromId === obj2.fromId && obj1.toId === obj2.toId) {
			return true;
		}
		return false;

	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 上長承認ラジオボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickDefBossApproval(event: any): void {
	}

	/**
	 * ステータスタイプ名変更イベントハンドラ
	 * @param event イベント
	 */
	onStatusNameChange(event: any ): void {
	}

	/**
	 * 承認依頼選択イベントハンドラです.
	 * @param event イベント
	 */
	onInputChangeForAddApprove(event: any): void {
	}

	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.languages = this.localStorageService.getLanguages();
		let lang: any;
		for (let idx = 0; idx < this.languages.length; idx++) {
			lang = this.languages[idx];
		}
		if ( this.workflow.nameList && this.workflow.nameList.name && this.workflow.nameList.name.length > 0 ) {
			for ( let i = 0; i < this.workflow.nameList.name.length; i++ ) {
				this.workflow.nameList[ this.workflow.nameList.name[i][ 'attr' ].lang ] = this.workflow.nameList.name[i][ 'attr' ].value;
			}
		}
	}

	/**
	 * ビュー初期化イベントハンドラ.
	 */
	ngAfterViewInit() {
		window.setTimeout(() => {

			let columns: EIMDataGridColumn[] = [];
			// 編集中リスト
			// STEP
			columns.push({field: 'seq', headerName: 'STEP', width: 60});
			// 名前
			columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 415});
			this.statusTypeEditDataGrid.setColumns(columns);

			// 承認リスト
			columns = [];
			// STEP
			columns.push({field: 'seq', headerName: 'STEP', width: 60});
			// 名前
			columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 415});
			this.statusTypeApproveDataGrid.setColumns(columns);

			// 公開リスト
			columns = [];
			// STEP
			columns.push({field: 'seq', headerName: 'STEP', width: 60});
			// 名前
			columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 415});
			this.statusTypePublishDataGrid.setColumns(columns);

			// ステータスタイプリストの取得
			let statusTypeList =  this.workflow.statusTypeList;
			if ( !statusTypeList || statusTypeList.length <= 0 ) {
				return;
			}

			// ステータスタイプリストより、編集、承認、公開を分ける
			let setData = [];
			let allData = []
			let kind = 0;
			for ( let idx = 0; idx < statusTypeList.length; idx++ ) {
				//
				if ( kind !== Number( statusTypeList[idx].kind ) ) {
					if ( kind === 0 ) {
						kind = Number( statusTypeList[idx].kind );
					} else if ( kind === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_EDITTING ) {
						setData[0].serial = 0;
						this.statusTypeEditDataGrid.setData(setData);
						kind = Number( statusTypeList[idx].kind );
						setData = [];
					} else if ( kind === EIMDocumentsConstantService.STATUS_TYPE_KIND_ID_APPROVAL_REQUEST ) {
						this.statusTypeApproveDataGrid.setData(setData);
						kind = Number( statusTypeList[idx].kind );
						setData = [];
					}
				}

				let data = {
					id: statusTypeList[idx].id,
					seq: statusTypeList[idx].seq,
					auto: statusTypeList[idx].auto,
					kind: statusTypeList[idx].kind,
					through: statusTypeList[idx].through,
					nameList: statusTypeList[ idx ].nameList,
					name: statusTypeList[ idx ].name,
					asEntryList: statusTypeList[ idx ].asEntryList,
					serial: this.getSerial(),
				};

				setData.push(data);
				allData.push(data);
			}
			if (setData.length > 0 ) {
				setData[setData.length - 1].serial = -1;
				this.statusTypePublishDataGrid.setData(setData);
			}

			if (this.skipDataGridState) {
				this.skipDataGrid.setState(this.skipDataGridState);
			} else {
				this.skipDataGrid.setColumns([
					{field: 'fromLabel', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02299'), width: 240, suppressSorting: true, suppressFilter: true}, // 遷移元
					{field: 'icon', headerName: '', width: 30, cellRendererFramework: EIMWorkflowCreatorEventSkipRendererComponent, suppressSorting: true, suppressFilter: true},
					{field: 'toLabel', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02300'), width: 240, suppressSorting: true, suppressFilter: true} // 遷移先
				]);

				// スキップイベント一覧の作成
				let data = [];
				if (this.workflow.eventTypeList && this.workflow.eventTypeList.length > 0) {
					let skipEventData: any = [];
					for ( let i = 0; i < this.workflow.eventTypeList.length; i++ ) {
						let eventType = this.workflow.eventTypeList[i];
						if ( eventType.skipFlag ) {
							let fromSerial = 0;
							let toSerial = 0;
							for (let j = 0; j < allData.length; j++) {
								if (allData[j].id === eventType.fromStatusTypeId) {
									fromSerial = allData[j].serial;
								}

								if (allData[j].id === eventType.toStatusTypeId) {
									toSerial = allData[j].serial;
								}
							}
							let fromLabel = this.getNameFromList(this.workflow.statusTypeList, eventType.fromStatusTypeId);
							let toLabel = this.getNameFromList(this.workflow.statusTypeList, eventType.toStatusTypeId);
							skipEventData.push({
								fromId: eventType.fromStatusTypeId,
								fromLabel: fromLabel,
								toId: eventType.toStatusTypeId,
								toLabel: toLabel,
								fromSeq: eventType.fromStatusTypeSequence,
								toSeq: eventType.toStatusTypeSequence,
								fromSerial: fromSerial,
								toSerial: toSerial,
							});
						}
					}
					this.skipDataGrid.setData(skipEventData);
					this.setEnableNextAndBackButton();
					this.setEnableStatusTypeMenuButton();
				}
			}
		});
	}

	/**
	 * 有効期限設定チェックボックス変更イベントハンドラ
	 * @param event イベント
	 */
	onExpirationDateChange(event: any): void {
	}

	/**
	 * 前へボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	public onClickBack(event: any): void {
		if (this.selectedViewName === this.viewName.SKIP) {
			this.skipDataGridState = this.skipDataGrid.getState();
			this.selectedViewName = this.viewName.STATUS_TYPE;
		}
	}

	/**
	 * 次へボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickNext(event: any): void {
		if (this.selectedViewName === this.viewName.STATUS_TYPE) {
			this.makeStatusAndEventInfo();
			this.workflowDiagram.show({workflow: this.workflow})

			this.makeFromToList();
			this.addNoInfoToSkipEvent();
			this.selectedViewName = this.viewName.SKIP;
			this.renameSkipEvent();
		}
		this.setEnableNextAndBackButton();
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * フォーマットコンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onStatusTypeApproveContextMenuWorkflow(event: any): void {
		// 選択した承認依頼中ステータス取得
		let selectedFormatList = this.statusTypeApproveDataGrid.getSelectedData();
		if (selectedFormatList && selectedFormatList.length > 0) {
			// 承認依頼中ステータス削除ボタン活性にします。
			this.getMenuItem (this.statusTypeApproveContentsMenuItems, 'deleteStatusType' ).disabled = false;
		} else {
			// 承認依頼中ステータス削除ボタン非活性にします。
			this.getMenuItem (this.statusTypeApproveContentsMenuItems, 'deleteStatusType' ).disabled = true;
		}
	}

	/**
	 * コンテンツリスト右クリックイベントハンドラ.
	 * PrimNGのコンテキストメニュー表示前に呼び出されるので
	 * フォーマットコンテンツメニューアイテムの活性非活性制御を行う
	 * @param event イベント
	 */
	onSkipEventContextMenuWorkflow(event: any): void {
		// 選択したスッキプイベント取得
		let selectedFormatList = this.skipDataGrid.getSelectedData();
		if (selectedFormatList && selectedFormatList.length > 0) {
			// スッキプイベント削除ボタン活性にします。
			this.getMenuItem (this.skipEventContentsMenuItems, 'deleteSkipEvent' ).disabled = false;
		} else {
			// スッキプイベント削除ボタン非活性にします。
			this.getMenuItem (this.skipEventContentsMenuItems, 'deleteSkipEvent' ).disabled = true;
		}
	}

	/**
	 * 承認依頼選択イベントハンドラです.
	 * @param event イベント
	 */
	public onSelectedStatusTypeApprove(event: any): void {
		if ( this.statusTypeApproveDataGrid.getSelectedData().length === 0 ) {
			this.setEnableStatusTypeMenuButton();
			return;
		}
		let data = this.statusTypeApproveDataGrid.getSelectedData()[0];
		this.statusNameList = Object.assign({}, data.nameList);
		this.inputApproveThroughTerm = data.through;
		this.updateSeq = data.seq;
		this.setEnableStatusTypeMenuButton();
	}

	/**
	 * 上へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickStatusTypeUp(event: any): void {
		if ( this.statusTypeApproveDataGrid.getSelectedData().length <= 0 ) {
			return;
		}
		let data = this.statusTypeApproveDataGrid.getData();
		let selectedIndex = this.statusTypeApproveDataGrid.getRowIndex();

		// 先頭行の場合は無効
		if (selectedIndex === 0) {
			return;
		}

		let selectedRow = data[selectedIndex];
		let swapRow = data[selectedIndex - 1];

		// 選択行削除
		this.statusTypeApproveDataGrid.removeRowData([selectedRow]);

		// seq入れ替え
		let tmpSeq = selectedRow.seq;
		selectedRow.seq = swapRow.seq;
		swapRow.seq = tmpSeq;

		// 選択行挿入
		this.statusTypeApproveDataGrid.addRowDataToIndex([selectedRow], selectedIndex - 1);

		// 入れ替わる行の更新
		this.statusTypeApproveDataGrid.removeRowData([swapRow]);
		this.statusTypeApproveDataGrid.addRowDataToIndex([swapRow], selectedIndex);

		this.statusTypeApproveDataGrid.select(selectedRow);
		this.editFlg = true;
	}

	/**
	 * 下へ移動ボタン押下イベントハンドラです.
	 * @param event イベント
	 */
	onClickStatusTypeDown(event: any): void {
		if ( this.statusTypeApproveDataGrid.getSelectedData().length <= 0 ) {
			return;
		}

		let data = this.statusTypeApproveDataGrid.getData();
		let selectedIndex = this.statusTypeApproveDataGrid.getRowIndex();

		// 最終行の場合は何もしない
		if (selectedIndex === data.length - 1) {
			return;
		}

		let selectedRow = data[selectedIndex];
		let swapRow = data[selectedIndex + 1];

		// 選択行削除
		this.statusTypeApproveDataGrid.removeRowData([selectedRow]);
		let tmpSeq = selectedRow.seq;
		selectedRow.seq = swapRow.seq;
		swapRow.seq = tmpSeq;

		// 選択行挿入
		this.statusTypeApproveDataGrid.addRowDataToIndex([selectedRow], selectedIndex + 1);

		// 入れ替わる行の更新
		this.statusTypeApproveDataGrid.removeRowData([swapRow]);
		this.statusTypeApproveDataGrid.addRowDataToIndex([swapRow], selectedIndex);

		this.statusTypeApproveDataGrid.select(selectedRow);
		this.editFlg = true;
	}

	/**
	 * 遷移元変更イベントハンドラです.
	 * @param event イベント
	 */
	onChangeFromStatusTypes(event: any): void {
		this.skipDataGrid.allNotSelect();
		let seletedStatusTypeId = event.value;

		// 遷移元未選択の場合
		if ( seletedStatusTypeId === 0 ) {
			this.makeFromToList();
			this.setEnableSkipEventMenuButton();
			this.workflowDiagram.select([]);
			return;
		}

		// from の選択データ取得
		let fromStatusType;
		for (let i = 0; i < this.allFromStatusTypes.length; i++ ) {
			if ( this.allFromStatusTypes[i].No === seletedStatusTypeId ) {
				fromStatusType = this.allFromStatusTypes[i];
				break;
			}
		}
		// ダイアグラム選択リスト
		let diagramSelectedData = [{
			id: fromStatusType.seq,
		}];
		// to の選択があればダイアグラム選択リストに追加
		if (this.inputToStatusTypes !== 0) {
			for (let i = 0; i < this.allToStatusTypes.length; i++) {
				if (this.allToStatusTypes[i].No === this.inputToStatusTypes) {
					diagramSelectedData.push({
						id: this.allToStatusTypes[i].seq
					});
					break;
				}
			}
		}
		this.workflowDiagram.select(diagramSelectedData);

		// 遷移先未選択の場合
		if ( this.inputToStatusTypes !== 0 ) {
			this.setEnableSkipEventMenuButton();
		}

		// 遷移先リストの作成
		// 自身の処理IDを取得
		this.toStatusTypes = [];
		this.toStatusTypes.push({label: '　', value: 0 });
		// 遷移先未選択にする
		let approveId: number = fromStatusType.approveId;
		let seq: number = fromStatusType.seq;


		// 追加済みリストの取得
		let selectdSkipStatusTypes = this.skipDataGrid.getData();
		// 遷移先リストの作成
		for (let i = 0; i < this.allToStatusTypes.length; i++ ) {
			let statusType = this.allToStatusTypes[i];
			let selectedFlg = true;
			if (statusType.seq <= seq + 1) {
				// 自身より先頭、自身、近隣の場合
				selectedFlg = false;
			}

			if ( approveId === EIMAdminsConstantService.STATUS_TYPE_EDIT && statusType.approveId === EIMAdminsConstantService.STATUS_TYPE_PUBLISH ) {
				selectedFlg = false;
			}

			for ( let n = 0; n < selectdSkipStatusTypes.length; n++ ) {
				if ( seletedStatusTypeId === selectdSkipStatusTypes[n].fromNo && statusType.No === selectdSkipStatusTypes[n].toNo ) {
					selectedFlg = false;
					break;
				}
			}

			if ( selectedFlg ) {
				this.toStatusTypes.push({
					label: statusType.name,
					value: statusType.No,
				});
			}
		}
		this.setEnableSkipEventMenuButton();
	}

	/**
	 * 遷移先変更イベントハンドラです.
	 * @param event イベント
	 */
	onChangeToStatusTypes(event: any): void {
		this.skipDataGrid.allNotSelect();
		// ステータスタイプ取得
		let seletedStatusTypeId = event.value;
		// 遷移先未選択の場合
		if ( seletedStatusTypeId === 0 ) {
			this.makeFromToList();
			this.setEnableSkipEventMenuButton();
			this.workflowDiagram.select([]);
			return;
		}

		let toStatusType;
		for (let i = 0; i < this.allToStatusTypes.length; i++ ) {
			if ( this.allToStatusTypes[i].No === seletedStatusTypeId ) {
				toStatusType = this.allToStatusTypes[i];
				break;
			}
		}
		let diagramSelectedData = [{
			id: toStatusType.seq,
		}];
		// to の選択があればダイアグラム選択リストに追加
		if (this.inputFromStatusTypes !== 0) {
			for (let i = 0; i < this.allFromStatusTypes.length; i++) {
				if (this.allFromStatusTypes[i].No === this.inputFromStatusTypes) {
					diagramSelectedData.push({
						id: this.allFromStatusTypes[i].seq
					});
					break;
				}
			}
		}
		this.workflowDiagram.select(diagramSelectedData);

		if ( this.inputFromStatusTypes !== 0 ) {
			this.setEnableSkipEventMenuButton();
		}

		// 遷移先元リストの作成
		// 自身の処理IDを取得
		this.fromStatusTypes = [];
		this.fromStatusTypes.push({label: '　', value: 0 });
		let approveId: number;
		let seq: number;
		approveId = toStatusType.approveId;
		seq = toStatusType.seq;
		// 追加済みリストの取得
		let selectdSkipStatusTypes = this.skipDataGrid.getData();
		// 遷移元リストの作成
		for (let i = 0; i < this.allFromStatusTypes.length; i++ ) {
			let statusType = this.allFromStatusTypes[i];
			let selectedFlg = true;
			if (seq - 1 <= statusType.seq) {
				// 自身より先頭、自身、近隣の場合
				selectedFlg = false;
			}

			if ( approveId === EIMAdminsConstantService.STATUS_TYPE_PUBLISH && statusType.approveId === EIMAdminsConstantService.STATUS_TYPE_EDIT ) {
				selectedFlg = false;
			}

			for ( let n = 0; n < selectdSkipStatusTypes.length; n++ ) {
				if ( seletedStatusTypeId === selectdSkipStatusTypes[n].toNo && statusType.No === selectdSkipStatusTypes[n].fromNo ) {
					selectedFlg = false;
					break;
				}
			}

			if ( selectedFlg ) {
				this.fromStatusTypes.push({
					label: statusType.name,
					value: statusType.No,
				});
			}
		}
		this.setEnableSkipEventMenuButton();
		this.inputToStatusTypes = seletedStatusTypeId;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * スキップイベント削除ボタンのの活性/非活性を設定します.
	 */
	private setEnableSkipEventMenuButton(): void {
		if ( this.inputFromStatusTypes === 0 || this.inputToStatusTypes === 0 ) {
			this.getMenuItem(this.skipEventDataGridMenuItems, 'addSkipEvent').disabled = true;
		} else {
			this.getMenuItem(this.skipEventDataGridMenuItems, 'addSkipEvent').disabled = false;
		}
		let selectedData = this.skipDataGrid.getSelectedData();
		if ( selectedData && selectedData.length > 0 ) {
			this.getMenuItem(this.skipEventDataGridMenuItems, 'deleteSkipEvent').disabled = false;
			this.getMenuItem(this.skipEventContentsMenuItems, 'deleteSkipEvent').disabled = false;
		} else {
			this.getMenuItem(this.skipEventDataGridMenuItems, 'deleteSkipEvent').disabled = true;
			this.getMenuItem(this.skipEventContentsMenuItems, 'deleteSkipEvent').disabled = true;
		}
	}

	/**
	 * 遷移元リスト、遷移先リストを作成する。
	 */
	private makeFromToList(): void {
		// 遷移元リスト、遷移先リストの作成
		this.fromStatusTypes = [];
		this.fromStatusTypes.push({label: '　', value: 0 });
		this.inputFromStatusTypes = 0;
		this.toStatusTypes = [];
		this.toStatusTypes.push({label: '　', value: 0 });
		this.inputToStatusTypes = 0;
		// 遷移元リストの作成
		for (let i = 0; i < this.allFromStatusTypes.length; i++ ) {
			let statusType = this.allFromStatusTypes[i];
			if ( String(this.allFromStatusTypes[i].through) === EIMConstantService.APPROVE_THROUGH_ONE ) {
				this.fromStatusTypes.push({
					label: statusType.name,
					value: statusType.No,
				});
			}
		}

		// 遷移先リストの作成
		for (let i = 0; i < this.allToStatusTypes.length; i++ ) {
			let statusType = this.allToStatusTypes[i];
			this.toStatusTypes.push({
				label: statusType.name,
				value: statusType.No,
			});
		}
	}

	/**
	 * ステータスタイプの名称を取得する.
	 * @param list ステータスタイプリスト
	 * @param id ステータスタイプID
	 * @return ステータスタイプの名称
	 */
	private getNameFromList(list: any[], id: number ): string {
		if ( !list || list.length === 0 ) {
			return null;
		}
		for (let i = 0; i < list.length; i++ ) {
			if (list[i].id === id ) {
				return list[i].name;
			}
		}
	}

	/**
	 * 承認依頼を追加する。
	 */
	private addStatusType(): void {
		this.updateSeq = -1;

		if (this.checkInputAddStatusType()) {
			return;
		}

		let newData = {
				id: this.getNewId().toString(),
				seq: 0,
				auto: '',
				kind: EIMConstantService.STATUS_TYPE_KIND_ID_APPROVE,
				through: this.inputApproveThroughTerm,
				nameList: this.statusNameList,
				name: this.statusNameList[this.localStorageService.getLangId()],
				serial: this.getSerial()
		}
		this.statusTypeApproveDataGrid.addRowData([newData]);
		this.editFlg = true;
		this.resetSeq();
		this.statusNameList = {};
		this.setEnableNextAndBackButton();
		this.setEnableStatusTypeMenuButton();

		let nameList = this.workflow.nameList;
	}

		/**
	 * idを作成する。
	 */
	private getNewId(): number {
		let id = -1;
		let idList = [];

		let statusTypeEditList = this.statusTypeEditDataGrid.getData();
		if ( statusTypeEditList && statusTypeEditList.length > 0 ) {
			for ( let i = 0; i < statusTypeEditList.length; i++ ) {
				idList.push({
					id: statusTypeEditList[i]['id'],
				});

			}
		}

		let statusTypeApproveData = this.statusTypeApproveDataGrid.getData();
		if ( statusTypeApproveData && statusTypeApproveData.length > 0 ) {
			for ( let i = 0; i < statusTypeApproveData.length; i++ ) {
				idList.push({
					id: statusTypeApproveData[i]['id'],
				});

			}
		}

		let statusTypePublishList = this.statusTypePublishDataGrid.getData();
		if ( statusTypePublishList && statusTypePublishList.length > 0 ) {
			for ( let i = 0; i < statusTypePublishList.length; i++ ) {
				idList.push({
					id: statusTypePublishList[i]['id'],
				});

			}
		}

		let min = Math.min.apply(null, idList.map(function(o) {return o.id; }));
		if ( id < min ) {
			return id;
		} else {
			return min - 1;
		}
	}

	/**
	 * 入力チェックを行います.
	 * @return エラー有無
	 */
	private checkInputAddStatusType(): boolean {

		let keys = Object.keys(this.statusNameList);
		let statusTypeApproveList = this.statusTypeApproveDataGrid.getData();
		let statusTypeEditList = this.statusTypeEditDataGrid.getData();
		let statusTypePublishList = this.statusTypePublishDataGrid.getData();
		for (let i = 0; i < this.languages.length; i++) {
			// 名前未入力チェック
			if (!this.statusNameList.hasOwnProperty(this.languages[i].lang) || this.statusNameList[this.languages[i].lang] === '') {
				this.messageService.show(
					EIMMessageType.error,
					this.translateService.instant('EIM_ADMINS.ERROR_00008', {value: this.translateService.instant('EIM_ADMINS.LABEL_02003', {value: this.languages[i].value})})
				)
				return true;
			}
			// 編集中重複チェック
			for (let j = 0; j < statusTypeEditList.length; j++) {
				if (statusTypeEditList[j].nameList[this.languages[i].lang] === this.statusNameList[this.languages[i].lang]) {
					this.messageService.show(
						EIMMessageType.error,
						this.translateService.instant('EIM_ADMINS.ERROR_00009')
					)
					return true;
				}
			}
			// 承認依頼重複チェック
			for (let j = 0; j < statusTypeApproveList.length; j++) {
				if ( this.updateSeq > 0 ) {
					if ( this.updateSeq !== statusTypeApproveList[j].seq ) {
						if (statusTypeApproveList[j].nameList[this.languages[i].lang] === this.statusNameList[this.languages[i].lang]) {
							this.messageService.show(
								EIMMessageType.error,
								this.translateService.instant('EIM_ADMINS.ERROR_00009')
							)
							return true;
						}
					}
				} else {
					if (statusTypeApproveList[j].nameList[this.languages[i].lang] === this.statusNameList[this.languages[i].lang]) {
						this.messageService.show(
							EIMMessageType.error,
							this.translateService.instant('EIM_ADMINS.ERROR_00009')
						)
						return true;
					}
				}
			}
			// 公開重複チェック
			for (let j = 0; j < statusTypePublishList.length; j++) {
				if (statusTypePublishList[j].nameList[this.languages[i].lang] === this.statusNameList[this.languages[i].lang]) {
					this.messageService.show(
						EIMMessageType.error,
						this.translateService.instant('EIM_ADMINS.ERROR_00009')
					)
					return true;
				}
			}
		}
		// 通過条件
		if ( this.inputApproveThroughTerm === '0') {
			this.messageService.show(
				EIMMessageType.error,
				this.translateService.instant('EIM_ADMINS.ERROR_00007', {value: this.translateService.instant('EIM_ADMINS.LABEL_02271')})
			);
			return true;
		}
	}

	/** ステータス製造時に製造番号を生成します. */
	private getSerial(): number {
		this.minSerial++;
		return this.minSerial;
	}

	/**
	 * シーケンスをリセットします.
	 */
	private resetSeq(): void {
		let seqNo = 1;
		// 編集中データグリッド
		let dataList = this.statusTypeEditDataGrid.getData();
		for ( let i = 0; i < dataList.length; i++ ) {
			dataList[i].seq = seqNo++;
		}
		this.statusTypeEditDataGrid.setData(dataList);

		// 承認中データグリッド
		dataList = this.statusTypeApproveDataGrid.getData();
		if (dataList) {
			for (let i = 0; i < dataList.length; i++) {
				dataList[i].seq = seqNo++;
			}
			this.statusTypeApproveDataGrid.setData(dataList);
		}

		// 公開データグリッド
		dataList = this.statusTypePublishDataGrid.getData();
		for ( let i = 0; i < dataList.length; i++ ) {
			dataList[i].seq = seqNo++;
		}
		this.statusTypePublishDataGrid.setData(dataList);
	}

	/**
	 * 承認依頼を変更する。
	 */
	private updateStatusType(): void {
		let data = this.statusTypeApproveDataGrid.getSelectedData()[0];
		this.updateSeq = data.seq;
		if (this.checkInputAddStatusType()) {
			return;
		}
		let base = this.statusTypeApproveDataGrid.getSelectedData()[0];
		base.through = this.inputApproveThroughTerm;
		base.nameList = this.statusNameList;
		base.name =  this.statusNameList[this.localStorageService.getLangId()];
		this.statusTypeApproveDataGrid.updateRowData(base);
		this.editFlg = true;
		this.statusNameList = {};
		this.inputApproveThroughTerm = '0';
		this.statusTypeApproveDataGrid.select([]);
		this.setEnableStatusTypeMenuButton();
	}

	/**
	 * 承認依頼を削除する。
	 */
	private deleteStatusType(): void {
		let selectedStatusType = this.statusTypeApproveDataGrid.getSelectedData();
		this.statusTypeApproveDataGrid.removeRowData(selectedStatusType);
		this.statusTypeApproveDataGrid.refreshView();
		this.resetSeq();
		this.updateSeq = -1;
		this.statusNameList = {};
		this.setEnableNextAndBackButton();
		this.setEnableStatusTypeMenuButton();
		this.inputApproveThroughTerm = '0';

		// スキップイベントグリッド編集
		let skipEventList = this.skipDataGrid.getData();
		let deleteSkipEventList = [];
		// 公開ステータスタイプ取得
		let publishStatusTypeList = this.statusTypePublishDataGrid.getData();

		for (let i = 0; i < skipEventList.length; i++) {
			// 削除したステータスタイプを使用している場合削除対象とする
			if (selectedStatusType[0].id === skipEventList[i].fromId || selectedStatusType[0].id === skipEventList[i].toId) {
				deleteSkipEventList.push(skipEventList[i]);
				continue;
			}
			// 削除によってイベントが隣接した場合削除対象とする
			// to公開済みの場合、公開処理中分+1
			if (publishStatusTypeList[1].id === skipEventList[i].toId) {
				if (skipEventList[i].toSeq - skipEventList[i].fromSeq <= 2) {
					deleteSkipEventList.push(skipEventList[i]);
				}
			} else {
				if (skipEventList[i].toSeq - skipEventList[i].fromSeq <= 1) {
					deleteSkipEventList.push(skipEventList[i]);
				}
			}
		}
		// スキップイベント削除
		if (deleteSkipEventList.length > 0) {
			this.skipDataGrid.removeRowData(deleteSkipEventList);
			this.skipDataGrid.refreshView();
			this.setEnableNextAndBackButton();
			this.setEnableSkipEventMenuButton();
			this.workflowDiagram.select([]);
		}
		this.editFlg = true;
	}

	/**
	 * スキップイベントを追加する。
	 */
	private addSkipEvent(): void {
		window.setTimeout(() => {
			let skipEvent = this.skipDataGrid.getData();
			let data = {
					fromId: this.getIdByNo( this.inputFromStatusTypes, this.allFromStatusTypes ),
					fromNo: this.inputFromStatusTypes,
					fromLabel: this.getLabel(this.fromStatusTypes, this.inputFromStatusTypes),
					fromSeq: this.getSeqByNo(this.inputFromStatusTypes, this.allFromStatusTypes),
					fromSerial: this.getSerialByNo(this.inputFromStatusTypes, this.allFromStatusTypes),

					toId: this.getIdByNo( this.inputToStatusTypes, this.allToStatusTypes),
					toNo: this.inputToStatusTypes,
					toLabel: this.getLabel(this.toStatusTypes, this.inputToStatusTypes),
					toSeq: this.getSeqByNo(this.inputToStatusTypes, this.allToStatusTypes),
					toSerial: this.getSerialByNo(this.inputToStatusTypes, this.allToStatusTypes),
				};
			skipEvent.push(data);
			this.skipDataGrid.setData(skipEvent);
			this.skipDataGrid.allNotSelect();
			this.skipDataGrid.select([data]);
			this.editFlg = true;
			this.makeFromToList();
			this.setEnableSkipEventMenuButton();
		});
	}

	/**
	 * スキップイベントを再命名する。
	 */
	private renameSkipEvent(): void {
		let skipEventList = this.skipDataGrid.getData();
		for (let i = 0; i < skipEventList.length; i++) {
			let fromSerial = skipEventList[i].fromSerial;
			let toSerial = skipEventList[i].toSerial;
			// 全員承認の場合削除処理を行う
			if (this.checkThroughAll(fromSerial, this.allFromStatusTypes)) {
				skipEventList.splice(i, 1);
				i--;
				continue;
			}
			if (fromSerial !== undefined) {
				skipEventList[i].fromLabel = this.getLabelBySerial(fromSerial, this.allFromStatusTypes);
				skipEventList[i].fromSeq = this.getSeqBySerial(fromSerial, this.allFromStatusTypes);
			}

			if (toSerial !== undefined) {
				skipEventList[i].toLabel = this.getLabelBySerial(toSerial, this.allToStatusTypes);
				skipEventList[i].toSeq = this.getSeqBySerial(toSerial, this.allToStatusTypes);
			}
			// 差が1以下の場合削除処理を行う
			if (skipEventList[i].fromSeq === 0 || skipEventList[i].toSeq === 0 || -1 <= skipEventList[i].fromSeq - skipEventList[i].toSeq && skipEventList[i].fromSeq - skipEventList[i].toSeq <= 1) {
				skipEventList.splice(i, 1);
				i--;
			}
		}
		this.skipDataGrid.setData(skipEventList);
	}

	/**
	 * seqを取得します.
	 * @param no ステータスタイプNo
	 * @param statusTypes ステータスタイプリスト
	 * return シーケンス番号
	 */
	private getSeqByNo(no: number, statusTypes: any[]): number {

		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(no) === Number(statusTypes[i].No)) {
				return statusTypes[i].seq;
			}
		}
		return 0;
	}

	/**
	 * Idを取得します.
	 * @param No ステータスタイプNo
	 * @param statusTypes ステータスタイプリスト
	 * return シーケンス番号
	 */
	private getIdByNo(id: number, statusTypes: any[]): number {

		for (let i = 0; i < statusTypes.length; i++) {
			if (id === statusTypes[i].No) {
				return statusTypes[i].id;
			}
		}
		return 0;
	}

	/**
	 * serialを取得します.
	 * @param no ステータスタイプNo
	 * @param statusTypes ステータスタイプリスト
	 * @return ステータスタイプの製造番号
	 */
	private getSerialByNo(no: number, statusTypes: any[]): number {

		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(no) === Number(statusTypes[i].No)) {
				return statusTypes[i].serial;
			}
		}
		return 0;
	}


		/**
	 * seqを取得します.
	 * @param serial ステータス製造番号
	 * @param statusTypes ステータスタイプリスト
	 * @return ステータスタイプのシーケンスNo
	 */
	private getSeqBySerial(serial: number, statusTypes: any[]): number {
		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(serial) === Number(statusTypes[i].serial)) {
				return statusTypes[i].seq;
			}
		}
		return 0;
	}

	/**
	 * 製造番号を元に全員承認かどうか判定します.
	 * @param serial ステータス製造番号
	 * @param statusTypes ステータスタイプリスト
	 * @return 全員承認かどうか
	 */
	private checkThroughAll(serial: number, statusTypes: any[]): boolean {
		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(serial) === Number(statusTypes[i].serial)) {
				return statusTypes[i].through === EIMConstantService.APPROVE_THROUGH_ALL;
			}
		}
		return false;
	}

	/**
	 * nameを取得します.
	 * @param serial ステータス製造番号
	 * @param statusTypes ステータスタイプリスト
	 * @return ステータスタイプの名称
	 */
	private getLabelBySerial(serial: number, statusTypes: any[]): string {
		for (let i = 0; i < statusTypes.length; i++) {
			if (Number(serial) === Number(statusTypes[i].serial)) {
				return statusTypes[i].name;
			}
		}
		return;
	}

	/**
	 * スキップイベントを削除する。
	 */
	private deleteSkipEvent(): void {
		window.setTimeout(() => {
			let skipEvent = this.skipDataGrid.getSelectedData();
			this.skipDataGrid.removeRowData(skipEvent);
			this.editFlg = true;
			this.skipDataGrid.refreshView();
			this.makeFromToList();
		});
	}

	/**
	 * ラベルを取得します.
	 * @param statusTypes ステータスタイプ配列
	 * @param value ステータスタイプ値
	 * @return ステータスタイプのラベル
	 */
	private getLabel( statusTypes: any[], value: number ): string {
		if ( !statusTypes || statusTypes.length === 0) {
			return;
		}
		for ( let i = 0; i < statusTypes.length; i++ ) {
			if ( statusTypes[i].value === value) {
				return statusTypes[i].label;
			}
		}
	}

	/**
	 * ステータス登録、更新、削除ボタンのの活性/非活性を設定します.
	 */
	private setEnableStatusTypeMenuButton(): void {
		let selectedData = this.statusTypeApproveDataGrid.getSelectedData();
		if ( selectedData && selectedData.length > 0 ) {
			this.getMenuItem(this.statusTypeDataGridMenuItems, 'updateStatusType').disabled = false;
			this.getMenuItem(this.statusTypeDataGridMenuItems, 'deleteStatusType').disabled = false;
			this.getMenuItem(this.statusTypeApproveContentsMenuItems, 'deleteStatusType').disabled = false;
		} else {
			this.getMenuItem(this.statusTypeDataGridMenuItems, 'updateStatusType').disabled = true;
			this.getMenuItem(this.statusTypeDataGridMenuItems, 'deleteStatusType').disabled = true;
			this.getMenuItem(this.statusTypeApproveContentsMenuItems, 'deleteStatusType').disabled = true;
		}
	}

	/**
	 * 次へ/前へボタンの活性/非活性を設定します.
	 */
	private setEnableNextAndBackButton(): void {
			if (this.selectedViewName === this.viewName.STATUS_TYPE) {
				// ステータスタイプタブの場合
				if ( this.enableBackButton === true ) {
					window.setTimeout(() => {
						this.enableBackButton = false;
					});
				}

				if ( this.statusTypeApproveDataGrid && this.statusTypeApproveDataGrid.getData() && this.statusTypeApproveDataGrid.getData().length > 1 ) {
					if ( this.enableNextButton === false ) {
						window.setTimeout(() => {
							this.enableNextButton = true;
						});
					}
				} else {
					if ( this.enableNextButton ) {
						window.setTimeout(() => {
							this.enableNextButton = false;
						});
					}
				}
			} else if (this.selectedViewName === this.viewName.SKIP) {
				// スキップ承認タブの場合
				if ( this.enableBackButton === false ) {
						window.setTimeout(() => {
							this.enableBackButton = true;
						});
				}
				if ( this.enableNextButton ) {
					window.setTimeout(() => {
						this.enableNextButton = false;
					});
				}
			}
	}

	/**
	 * メニューアイテムリストから名前を元に対象アイテムを取得します.
	 * @param menuItems 対象メニューアイテムリスト
	 * @param name 選択対象メニュー名称
	 * @return 選択対象メニューアイテム
	 */
	protected getMenuItem(menuItems: EIMMenuItem[], name: string): EIMMenuItem {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].name === name) {
				return menuItems[i];
			}
		}
		return null;
	}

	/**
	 * スキプイベント情報を設定する。
	 */
	private skipEventSetting(): void {
		// スキップイベント
		let skipEventList = this.skipDataGrid.getData();
		if (skipEventList.length > 0) {
			for ( let i = 0; i < skipEventList.length; i++ ) {
				let skipEvent = skipEventList[i];
				// イベントタイプデータを作成する
				let eventType = new EIMEventTypeDomain( {
					id: '',
					seq: '',
					fromStatusTypeSeq: skipEvent.fromSeq,
					toStatusTypeSeq: skipEvent.toSeq,
					fromStatusTypeId: skipEvent.fromSeq,
					toStatusTypeId: skipEvent.toSeq,
					baseEventTypeId: '',
					guardConditionId: '',
					skipFlag: 'true',
					nameList:  null,
					name: null,
				}
				);
				this.workflow.eventTypeList.push( eventType );
			}
		}
	}

	/**
	 * スキプイベント情報に順番情報を追加する。
	 */
	private addNoInfoToSkipEvent(): void {
		let skipEvents = this.skipDataGrid.getData();
		if ( !skipEvents || skipEvents.length === 0 ) {
			return;
		}
		for ( let i = 0; i < skipEvents.length; i++ ) {
			let skipEvent = skipEvents[i];
			if ( this.allFromStatusTypes && this.allFromStatusTypes.length > 0 ) {
				for ( let n = 0; n < this.allFromStatusTypes.length; n++ ) {
					let statusType = this.allFromStatusTypes[n];
					if ( statusType.id === skipEvent.fromId ) {
						skipEvents[i]['fromNo'] = statusType.No;
					}
				}
			}

			if ( this.allToStatusTypes && this.allToStatusTypes.length > 0 ) {
				for ( let n = 0; n < this.allToStatusTypes.length; n++ ) {
					let statusType = this.allToStatusTypes[n];
					if ( statusType.id === skipEvent.toId ) {
						skipEvents[i]['toNo'] = statusType.No;
					}
				}
			}

		}
	}

	/**
	 * ステータスタイプとイベントタイプ情報を作成する。
	 */
	private makeStatusAndEventInfo(): void {
		// スキプイベント編集
		// 初期化
		let seqCnt = 1;
		this.workflow.statusTypeList = [];
		this.workflow.eventTypeList = [];
		this.allFromStatusTypes = [];
		this.allToStatusTypes = [];
		// 編集中ステータスタイプの取得
		let editingStatusDataList = this.statusTypeEditDataGrid.getData();
		if ( editingStatusDataList && editingStatusDataList.length > 0 ) {
			for ( let i = 0; i < editingStatusDataList.length; i++) {
				// 遷移元リストデータを作成する。
				editingStatusDataList[i][ 'approveId' ] = EIMAdminsConstantService.STATUS_TYPE_EDIT;		// 編集中
				editingStatusDataList[i].No = -seqCnt;
				if ( i === 0 ) {
					// 遷移元リストに追加する。
					this.allFromStatusTypes.push(editingStatusDataList[i]);
				}

				// ワークフローデータを作成する。
				let statusType = new EIMStatusTypeDomain(editingStatusDataList[i]);
				statusType.name = statusType.nameList[this.localStorageService.getLangId()];
				statusType.seq = seqCnt;
				this.workflow.statusTypeList.push( statusType );

				// イベントタイプデータを作成する
				let eventType = new EIMEventTypeDomain( {
					id: seqCnt,
					seq: 1,
					fromStatusTypeSeq: seqCnt,
					toStatusTypeSeq: seqCnt + 1,
					baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_REQ_APPROVE,
					guardConditionId: EIMConstantService.GUARD_COND_ID_NOHTING,
					skipFlag: false,
					nameList:  statusType.nameList,
					name: this.translateService.instant( 'EIM_DOCUMETS.LABEL_01018' ),
				}
				);
				this.workflow.eventTypeList.push( eventType );
				seqCnt++;
			}
		}

		// 承認依頼中ステータスタイプの取得
		let approveStatusDataList = this.statusTypeApproveDataGrid.getData();
		if ( approveStatusDataList && approveStatusDataList.length > 0 ) {
			for ( let i = 0; i < approveStatusDataList.length; i++) {
				// 遷移元、遷移先リストデータを作成する。
				approveStatusDataList[i][ 'approveId' ] = EIMAdminsConstantService.STATUS_TYPE_APPROVAL;		// 承認中
				approveStatusDataList[i].No = -seqCnt;
				if ( i < approveStatusDataList.length - 1 ) {
					// 遷移元リストに追加する。
					this.allFromStatusTypes.push(approveStatusDataList[i]);
				}
				if ( i !== 0 ) {
					// 遷移先リストに追加する。
					this.allToStatusTypes.push(approveStatusDataList[i]);
				}
				// ワークフローデータ作成
				let statusType = new EIMStatusTypeDomain(approveStatusDataList[i]);
				statusType.name = statusType.nameList[this.localStorageService.getLangId()];
				statusType.seq = seqCnt;
				this.workflow.statusTypeList.push( statusType );

				let eventType = new EIMEventTypeDomain( {
					id: seqCnt,
					seq: 1,
					fromStatusTypeSeq: seqCnt,
					toStatusTypeSeq: seqCnt + 1,
					baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_APPROVAL,
					guardConditionId: EIMConstantService.GUARD_COND_ID_NOHTING,
					skipFlag: false,
					nameList: statusType.nameList,
					name: this.translateService.instant( 'EIM_ADMINS.LABEL_02155' ),
				}
				);
				this.workflow.eventTypeList.push( eventType );
				seqCnt++;
			}
		}
		// 公開処理ステータスタイプの取得
		let publishStatusDataList = this.statusTypePublishDataGrid.getData();
		if ( publishStatusDataList && publishStatusDataList.length > 0 ) {
			for ( let i = 0; i < publishStatusDataList.length; i++) {
				// 遷移先リストデータを作成する。
				publishStatusDataList[i][ 'approveId' ] = EIMAdminsConstantService.STATUS_TYPE_PUBLISH;		// 公開
				publishStatusDataList[i].No = -seqCnt;
				if ( i === publishStatusDataList.length - 1 ) {
					// 遷移先リストに追加する。
					this.allToStatusTypes.push(publishStatusDataList[i]);
				}

				let statusType = new EIMStatusTypeDomain(publishStatusDataList[i]);
				statusType.name = statusType.nameList[this.localStorageService.getLangId()];
				statusType.seq = seqCnt;
				this.workflow.statusTypeList.push( statusType );

				if ( i < publishStatusDataList.length - 1 ) {
					let eventType = new EIMEventTypeDomain( {
						id: seqCnt,
						seq: 1,
						fromStatusTypeSeq: seqCnt,
						toStatusTypeSeq: seqCnt + 1,
						baseEventTypeId: EIMConstantService.BASE_EVENT_TYPE_ID_PUBLIC,
						guardConditionId: EIMConstantService.GUARD_COND_ID_NOHTING,
						skipFlag: false,
						nameList: statusType.nameList,
						name: this.translateService.instant( 'EIM_DOCUMETS.LABEL_02036' ),
					}
					);
					this.workflow.eventTypeList.push( eventType );
				}
				seqCnt++;
			}
		}

		if ( this.workflow.eventTypeList.length > 0 ) {
			for ( let m = 0; m < this.workflow.eventTypeList.length; m++ ) {
				let fromSeq = this.workflow.eventTypeList[m].fromStatusTypeSequence;
				let toSeq = this.workflow.eventTypeList[m].toStatusTypeSequence;
				for ( let n = 0; n <  this.workflow.statusTypeList.length; n++) {
					if ( fromSeq === this.workflow.statusTypeList[n].seq ) {
						this.workflow.eventTypeList[m].fromStatusTypeId = this.workflow.statusTypeList[n].id;
					}
					if ( toSeq === this.workflow.statusTypeList[n].seq ) {
						this.workflow.eventTypeList[m].toStatusTypeId = this.workflow.statusTypeList[n].id;
					}
				}
			}
		}
	}

}
