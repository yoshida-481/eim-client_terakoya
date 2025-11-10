import {Component, forwardRef, EventEmitter, ViewChild, Input, Output, OnInit, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {EIMComponent} from 'app/shared/shared.interface';
import {EIMMessageService, EIMMessageType} from 'app/shared/services/message.service';
import {EIMOperationHistoryService} from 'app/admins/shared/services/apis/operation-history.service';
import {EIMDataGridComponent, EIMDataGridColumn} from 'app/shared/components/data-grid/data-grid.component';
import {EIMDateService} from 'app/shared/services/date.service';
import {EIMAdminsCacheService} from 'app/admins/shared/services/admins-cache.service';
import {EIMConstantService} from 'app/shared/services/constant.service';
import {EIMAdminMainComponent} from 'app/admins/admins.component';
import {EIMComponentInfo} from 'app/shared/shared.interface';
import {EIMDialogSharedManagerComponentService} from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component.service';
import {EIMAdminsConstantService} from 'app/admins/shared/services/admins-constant.service';
import {EIMServerConfigService} from 'app/shared/services/server-config.service';
import {EIMDocumentFileService} from 'app/documents/shared/services/apis/document-file.service';
import {EIMOperationHistoryDTO} from 'app/admins/shared/dtos/operation-history.dto';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';
import { CommonModule } from '@angular/common';
import { EIMAdminsModule } from 'app/admins/admins.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { EIMRadioButtonComponent } from 'app/shared/components/radio-button/radio-button.component';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { EIMMultipleSelectorModule } from 'app/shared/components/multiple-selector/multiple-selector.module';
import { EIMUserSelectorModule } from 'app/shared/components/user-selector/user-selector.module';
import { EIMDialogModule } from 'app/shared/components/dialog/dialog.module';


/**
 * 画面状態定数
 */
export namespace stateConst {
	export const EDITING = 'editing';
}

/**
 * コンポーネント情報
 */
export interface EIMContentsSearchComponentInfo extends EIMComponentInfo {
	// 検索結果グリッド
	opeHistoryListGrid?: EIMDataGridComponent;
	// 検索条件
	condition?: EIMConditionInfo;
}

/**
 * コンポーネント情報
 */
export interface EIMConditionInfo {
	/** 選択された種別 */
	searchType?: string;
	/** 選択された種別 */
	allUser?: string,
	/** 検索対象のユーザID */
	userId?: string,
	/** 検索対象のユーザ名称 */
	userName?: string,
	/** 選択されたFromカレンダー */
	inputValueFrom?: Date,
	/** 選択されたFrom時 */
	inputHhFrom?: string,
	/** 選択されたFrom分 */
	inputMmFrom?: string,
	/** 選択されたToカレンダー */
	inputValueTo?: Date,
	/** 選択されたTo時 */
	inputHhTo?: string,
	/** 選択されたTo分 */
	inputMmTo?: string,
	/** 選択された行 */
	index?: number,
}

/**
 * ボタン情報
 */
export enum EIMButtonKind {
	/** 検索して画面表示 */
	searchShowScreen,
	/** 検索してCSVダウウンロード */
	searchDownloadCsv,
}

/**
 * 操作履歴検索コンポーネント
 * @example
 *
 *      <eim-operation-history>
 *      </eim-operation-history>
 */
@Component({
    selector: 'eim-operation-history',
    templateUrl: './operation-history.component.html',
    styleUrls: ['./operation-history.component.css'],
	imports: [
		CommonModule,
		FormsModule,
		EIMAdminsModule,
		EIMSharedModule,
		TranslatePipe, 
		ButtonDirective,
		Tooltip,
		PanelModule,
		DatePickerModule,
		SelectModule,
		InputTextModule,
		EIMRadioButtonComponent
	],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMOperationHistoryComponent) },],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})

export class EIMOperationHistoryComponent implements EIMAdminMainComponent, OnInit {

	/** 検索結果グリッド */
	@ViewChild('opeHistoryListGrid', { static: true }) opeHistoryListGrid: EIMDataGridComponent;

	/** 検索条件(空白 :) */
	public space = ' ';

	/** 検索条件(時分 00) */
	public rowtime = '00';

	/** 検索条件(時 23) */
	public maxHh = '23';

	/** 検索条件(時 59) */
	public maxtime = '59';

	/** 画面識別ID */
	public viewId = 'OperationHistory'

	/** 作成者選択画面を表示するかどうか */
	public displayUserSelector = false;

	/** 状態 */
	public state: string = stateConst.EDITING;

	/** ラジオボタン0~9の10桁の値 */
	public digit: number = EIMConstantService.OPERATION_HISTORY_DIGITS;

	/** 時間の一覧 */
	public listHH: SelectItem[] = this.createPullDownList(Number(this.maxHh));

	/** 時刻分の一覧 */
	public listMM: SelectItem[] = this.createPullDownList(Number(this.maxtime));

	/** 日付フォーマット */
	public dateFormat: string = this.translateService.instant('EIM.CALENDAR.DATE_FORMAT');

	/** カレンダー年範囲 */
	public CALENDAR_YEAR_RANGE: string = EIMConstantService.CALENDAR_YEAR_RANGE;

	/** 入力可能初日 */
	public minDate = '1980-01-01';

	/** 入力可能最終日 */
	public maxDate = '2049-12-31';

	/** コンポーネント情報 */
	public info: EIMContentsSearchComponentInfo = {};

		/** 期間選択 */
	public searchType = 'allPeriodss';

	/** From日付 */
	public inputValueFrom: Date;

	/** From時 */
	public inputHhFrom = '';

	/** From分 */
	public inputMmFrom = '';

	/** To日付 */
	public inputValueTo: Date;

	/** To時 */
	public inputHhTo = '';

	/** To分 */
	public inputMmTo = '';

	/** ユーザ選択 */
	public allUser = 'allUsers';

	/** デリミタ「:」 */
	public DELIMITER_COLON: string = EIMAdminsConstantService.DELIMITER_COLON ;

	/** デリミタ「~」 */
	public DELIMITER_TIDE: string = EIMConstantService.DELIMITER_TIDE ;

	/** ユーザID */
	public userId = '';

	/** ユーザー名 */
	public userName = '';

	/** 検索ボタン押下可否 */
	public disabledCheckSearchButton = false;

	/**
	 * コンストラクタ.
	 */
	constructor(
		protected translateService: TranslateService,
		protected dateService: EIMDateService,
		protected operationHistoryService: EIMOperationHistoryService,
		protected documentsCacheService: EIMAdminsCacheService,
		protected dialogManagerComponentService: EIMDialogSharedManagerComponentService,
		protected messageService: EIMMessageService,
		protected serverConfigService: EIMServerConfigService,
		protected documentFileService: EIMDocumentFileService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 画面の状態を復元します.
	 * @param state 状態
	 */
	public setState(state: any): void {
		if (!state) {
			return;
		}
		this.info = state.info;
		this.searchType = this.info.condition.searchType;
		this.allUser = this.info.condition.allUser;
		this.userId = this.info.condition.userId;
		this.userName = this.info.condition.userName;
		this.inputValueFrom = this.info.condition.inputValueFrom;
		this.inputHhFrom = this.info.condition.inputHhFrom;
		this.inputMmFrom = this.info.condition.inputMmFrom;
		this.inputValueTo = this.info.condition.inputValueTo;
		this.inputHhTo = this.info.condition.inputHhTo;
		this.inputMmTo = this.info.condition.inputMmTo;
		this.opeHistoryListGrid.setState(state.opeHistoryListGrid);
	}

	/**
	 * 画面の状態を返却します.
	 * @return 状態
	 */
	public getState(): any {
		// 検索条件の転記
		this.info.condition.searchType = this.searchType;
		this.info.condition.allUser = this.allUser;
		this.info.condition.userName = this.userName;
		this.info.condition.inputValueFrom = this.inputValueFrom;
		this.info.condition.inputHhFrom = this.inputHhFrom;
		this.info.condition.inputMmFrom = this.inputMmFrom;
		this.info.condition.inputValueTo = this.inputValueTo;
		this.info.condition.inputHhTo = this.inputHhTo;
		this.info.condition.inputMmTo = this.inputMmTo;
		return {
			info: this.info,
			opeHistoryListGrid: this.opeHistoryListGrid.getState(),
		};
	}

	/**
	 * 画面表示をCSVダウンロードボタン押下可否を制御します.
	 * @return 画面表示をCSVダウンロードボタン押下可否
	 */
	public disabledCheckDownloadCSV(): boolean {
		let downloadFlag = true;

		if (this.opeHistoryListGrid && 0 < this.opeHistoryListGrid.getData().length) {
			downloadFlag = false;
		}
		return downloadFlag;
	}

	/**
	 * 検索して画面表示ボタン,検索してCSVダウンロードボタン押下可否を制御します.
	 * @return 検索して画面表示ボタン,検索してCSVダウンロードボタン押下可否
	 */
	public onChangeCheckSearch(): void {
		// 1980-2049以外の範囲を指定していた場合、情報を破棄する
		if (this.checkDateValid(this.dateService.getDateString(this.inputValueFrom), this.maxDate)
		|| this.checkDateValid(this.minDate, this.dateService.getDateString(this.inputValueFrom))) {
			this.inputValueFrom = null;
		}
		if (this.checkDateValid(this.dateService.getDateString(this.inputValueTo), this.maxDate)
		|| this.checkDateValid(this.minDate, this.dateService.getDateString(this.inputValueTo))) {
			this.inputValueTo = null;
		}
		// 日付が指定されていない場合、時刻情報を破棄する
		if (!this.inputValueTo) {
			this.inputHhTo = '';
			this.inputMmTo = '';
		}
		if (!this.inputValueFrom) {
			this.inputHhFrom = '';
			this.inputMmFrom = '';
		}
		// 期間指定の場合の検索条件の取得
		let params: any = this.searchConditionSet();
		// ラジオボタン:期間指定 ラジオボタン:ユーザー指定選択時
		if (this.searchType === 'specifyPeriod' && this.allUser === 'specifyUser') {
			if (!this.disabledCheckDate() && !this.disabledCheckUser()) {
				// 期間To < 期間Fromの場合
				if (this.checkDateValid(params.fromTime, params.toTime)) {
					this.disabledCheckSearchButton = true;
					return;
				}
				this.disabledCheckSearchButton = false;
				return;
			} else {
				this.disabledCheckSearchButton = true;
				return;
			}
		// ラジオボタン:期間指定 ラジオボタン:全ユーザ選択時
		} else if (this.searchType === 'specifyPeriod' && this.allUser === 'allUsers') {
			if (this.disabledCheckDate()) {
				this.disabledCheckSearchButton = true;
				return;
			} else {
				// 期間To < 期間Fromの場合
				if (this.checkDateValid(params.fromTime, params.toTime)) {
					this.disabledCheckSearchButton = true;
					return;
				}
			}
		// ラジオボタン:全期間 ラジオボタン:ユーザー指定選択時
		} else if (this.searchType === 'allPeriodss' && this.allUser === 'specifyUser') {
			if (this.disabledCheckUser()) {
				this.disabledCheckSearchButton = true;
				return;
			}
		// ラジオボタン:全期間 ラジオボタン:全ユーザ選択時
	} else if (this.searchType === 'allPeriodss' && this.allUser === 'allUsers') {
		this.disabledCheckSearchButton = false;
		return;
	}
	this.disabledCheckSearchButton = false;
}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 * @return 一致不一致
	 */
	public opeHistoryListGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.acdate === obj2.acdate && obj1.userName === obj2.userName && obj1.appType === obj2.appType && obj1.opType === obj2.opType);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
		/**
	 * 入力値初期化後イベントハンドラ.
	 */
	public ngOnInit(): void {
		// 検索条件
		this.info.condition = {
			/** 選択された種別 */
			searchType: this.searchType,
			/** 選択された種別 */
			allUser: this.allUser,
			/** 検索対象のユーザID */
			userId: this.userId,
			/** 検索対象のユーザ名称 */
			userName: this.userName,
			/** 選択された時間 */
			inputValueFrom: this.inputValueFrom,
			inputHhFrom: this.inputHhFrom,
			inputMmFrom: this.inputMmFrom,
			inputValueTo: this.inputValueTo,
			inputHhTo: this.inputHhTo,
			inputMmTo: this.inputMmTo,
		};
		this.opeHistoryListGrid.setColumns(this.createFixedColumns());
		this.info.opeHistoryListGrid = this.opeHistoryListGrid;
		this.info.condition.userId = this.userId;
		this.info.condition.userName = this.userName;
	}

	/**
	 * ユーザ選択ボタン押下時イベントハンドラ
	 * @param event イベント
	 */
	onShowUserSelector(event: any): void {
		// ユーザ選択画面を表示する
		let dialogId: string = this.dialogManagerComponentService.showUserSelector({
			selected: (data) => {
				this.dialogManagerComponentService.close(dialogId);
				this.selectCreateUser(data);
				this.onChangeCheckSearch();
			}
		}, false, false);
	}

	/**
	 * 検索ボタンクリックイベントハンドラ
	 * @param event イベント
	 * @param from 検索条件フォーム
	 */
	onSearch(event: any, from: NgForm): void {
		event.preventDefault();
		this.opeHistoryListGrid.setData([]);
		let params: any = this.searchConditionSet(EIMButtonKind.searchShowScreen);
		// 検索パラメータがnullの場合は処理を行わない
		if (!params) {
			return;
		}
		this.operationHistoryService.search(params).subscribe((resultList: EIMOperationHistoryDTO[]) => {
			// 検索結果が0件の場合メッセージを表示して処理を行わない。
			if (resultList.length === 0) {
				this.messageService.show(EIMMessageType.warn, this.translateService.instant('EIM.INFO_00003'));
				return;
			}
			// 一覧表示内容変更
			this.opeHistoryListGrid.setData(resultList);
		});
	}

	/**
	 * 画面表示をCSVダウンロードボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickCsvDownload(event: any): void {
		let fileName: string = this.serverConfigService.csvDownloadHistoryFileHeader
				+ this.dateService.getFixedCurrentDateTimeString()
				+ EIMAdminsConstantService.CSV_EXTENSION;
		let csv: string = this.opeHistoryListGrid.getDataAsCsv();
		this.documentFileService.downloadCSV(EIMAdminsConstantService.OPE_HIST_APP_ID, fileName, csv);
	}

	/**
	 * CSVダウンロードボタンクリックイベントハンドラ
	 * @param event イベント
	 */
	onClickSearchAndCsvDownload(event: any): void {
		event.preventDefault();
		let params: any = this.searchConditionSet(EIMButtonKind.searchDownloadCsv);
		// 検索パラメータがnullの場合は処理を行わない
		if (!params) {
			return;
		}
		params['selectUserId'] = params['userId'];

		this.messageService.show(EIMMessageType.confirm,
			this.translateService.instant('EIM_ADMINS.CONFIRM_00012') ,
			() => {
				let columns = this.createFixedColumns();
				let loopCnt = columns.length;
				let titleXML = '<HEADER>'
				for (let idx = 0 ; idx < loopCnt ; idx++) {
					titleXML = titleXML + '<FIELD label=\"' + columns[idx].headerName + '\" id=\"@' + columns[idx].field + '\"/>\r\n';
				}
				titleXML = titleXML + '</HEADER>\r\n';
				params[ 'listTitle' ] = titleXML;
				this.operationHistoryService.operationHistoryCsvDownload(params);
				return;
			}
		);
	}

	/**
	 * 今日ボタンクリックイベントハンドラ
	 * @param value 選択した値
	 * @param calendar 選択したカレンダー
	 */
	onClickToday(value, calendar): void {
		let crrentDate = new Date();
		calendar.currentMonth = crrentDate.getMonth();
		calendar.currentYear = crrentDate.getFullYear();
	}

	/**
	 * クリアボタンクリックイベントハンドラ
	 * @param value 選択した値
	 * @param calendar 選択したカレンダー
	 */
	onClickClear(value, calendar): void {
		calendar.currentMonth = calendar.months[0].month;
		calendar.currentYear = calendar.months[0].year;
	}

	/**
	* カレンダーボタンクリックイベントハンドラ
	* @param calendar 選択したカレンダー
	*/
	openCalendar(calendar) {
		if (calendar.value) {
			const date: Date = calendar.value;
			// 設定値と選択しているカレンダーの日にちが異なる場合は、合わせる。
			if (date.getMonth() !== calendar.currentMonth || date.getFullYear() !== calendar.currentYear) {
				calendar.currentMonth = date.getMonth();
				calendar.currentYear = date.getFullYear();
			}
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 検索パラメータ設定
	 * @param searchKind 0_検索ボタン押下・1_検索してCSVダウンロードボタン押下
	 * @return any パラメーター
	 */
	private searchConditionSet(searchKind?: number): any {
		let params: any = {};
		// 検索してCSVダウンロードの場合は入力がない場合でも初期値で送信する
		if (searchKind === EIMButtonKind.searchDownloadCsv) {
			params['fromTime'] = EIMAdminsConstantService.OPERATION_HISTORY_DEFAULT;
			params['toTime'] = EIMAdminsConstantService.OPERATION_HISTORY_DEFAULT;
			params['userId'] = EIMAdminsConstantService.OPERATION_HISTORY_DEFAULT;
		}
		// 期間指定の場合
		if (this.searchType === 'specifyPeriod') {
			// Fromの"カレンダー"に入力がある場合
			if (this.inputValueFrom) {
				// 画面表示の"カレンダー"、"時"、"分"を設定する
				params['fromTime'] = this.dateService.getDateString(new Date(this.inputValueFrom)) + this.space + this.inputHhFrom + EIMAdminsConstantService.DELIMITER_COLON + this.inputMmFrom + EIMAdminsConstantService.DELIMITER_COLON + this.rowtime;
				// "時"、分"が未入力の場合、'00'時'00'分を設定する(自動補填)
				if (!this.inputHhFrom && !this.inputMmFrom) {
					params['fromTime'] = this.dateService.getDateString(new Date(this.inputValueFrom)) + this.space + this.rowtime + EIMAdminsConstantService.DELIMITER_COLON + this.rowtime + EIMAdminsConstantService.DELIMITER_COLON + this.rowtime;
				// "時"が未入力の場合、'00'時を設定する(自動補填)
				} else if (!this.inputHhFrom) {
				params['fromTime'] = this.dateService.getDateString(new Date(this.inputValueFrom)) + this.space + this.rowtime + EIMAdminsConstantService.DELIMITER_COLON + this.inputMmFrom + EIMAdminsConstantService.DELIMITER_COLON + this.rowtime;
				// "分"が未入力の場合、'00'分を設定する(自動補填)
				} else if (!this.inputMmFrom) {
					params['fromTime'] = this.dateService.getDateString(new Date(this.inputValueFrom)) + this.space + this.inputHhFrom + EIMAdminsConstantService.DELIMITER_COLON + this.rowtime + EIMAdminsConstantService.DELIMITER_COLON + this.rowtime;
				}
			}
			// Toのカレンダーに入力がある場合
			if (this.inputValueTo) {
				// 画面表示の"カレンダー"、"時"、"分"を設定する
				params['toTime'] = this.dateService.getDateString(new Date(this.inputValueTo)) + this.space + this.inputHhTo + EIMAdminsConstantService.DELIMITER_COLON + this.inputMmTo + EIMAdminsConstantService.DELIMITER_COLON + this.maxtime;
				// "時"、"分"が未入力の場合、'23'時'59'分を設定する(自動補填)
				if (!this.inputHhTo && !this.inputMmTo) {
					params['toTime'] = this.dateService.getDateString(new Date(this.inputValueTo)) + this.space + this.maxHh + EIMAdminsConstantService.DELIMITER_COLON + this.maxtime + EIMAdminsConstantService.DELIMITER_COLON + this.maxtime;
				// "時"が未入力の場合、'23'時を設定する(自動補填)
				} else if (!this.inputHhTo) {
					params['toTime'] = this.dateService.getDateString(new Date(this.inputValueTo)) + this.space + this.maxHh + EIMAdminsConstantService.DELIMITER_COLON + this.inputMmTo + EIMAdminsConstantService.DELIMITER_COLON + this.maxtime;
				// "分"が未入力の場合、'00'分を設定する(自動補填)
				} else if (!this.inputMmTo) {
					params['toTime'] = this.dateService.getDateString(new Date(this.inputValueTo)) + this.space + this.inputHhTo + EIMAdminsConstantService.DELIMITER_COLON + this.maxtime + EIMAdminsConstantService.DELIMITER_COLON + this.maxtime;
				}
			}
		}
		// ユーザ指定の場合
		if (this.allUser === 'specifyUser') {
			params['userId'] = this.userId;
		}

		return params;
	}
	/**
	 * 固定(基本)カラムを作成します.
	 * @param info コンテンツ検索コンポーネント情報
	 * @return データグリッドカラムリスト
	 */
	private createFixedColumns(): EIMDataGridColumn[] {
		let columns: EIMDataGridColumn[] = [];
		// アクセス日時
		columns.push({field: 'acdate', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02131'), width: 170, suppressFilter: false, comparator: this.dateService.dateComparator });
		// ユーザID
		columns.push({field: 'userCode', headerName: this.translateService.instant('EIM.LABEL_02001'), width: 130, suppressFilter: false});
		// ユーザ
		columns.push({field: 'userName', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02132'), width: 130, suppressFilter: false});
		// アプリケーション
		columns.push({field: 'appType', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02133'), width: 150, 	suppressFilter: false});
		// 操作内容
		columns.push({field: 'opType', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02134'), width: 270, suppressFilter: false});
		// 操作対象情報A
		columns.push({field: 'rcInfo_A', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02135'), width: 120, suppressFilter: false});
		// 操作対象A
		columns.push({field: 'rcName_A', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02136'),  width: 90, suppressFilter: false});
		// 操作対象情報B
		columns.push({field: 'rcInfo_B', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02137'),  width: 120, suppressFilter: false});
		// 操作対象B
		columns.push({field: 'rcName_B', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02138'),  width: 90, suppressFilter: false});
		// 詳細
		columns.push({field: 'detail', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02139'),  width: 195, suppressFilter: false,
		 cellRendererFramework: EIMTooltipRendererComponent});
		return columns;
	}

	/**
	 * 期間指定の時、日付項目の入力チェック
	 * @return 日付項目の活性非活性(true・非活性false・活性)
	 */
	private disabledCheckDate(): boolean {
		// From項目
		let fromFlag = false;
		// From項目
		// カレンダーに入力がある場合
		if (this.inputValueFrom) {
			// "時分に入力がある場合"または"時に入力があり分に入力がない場合"または"時分に入力がない場合"
			if ((this.inputHhFrom && this.inputMmFrom) || (this.inputHhFrom && !this.inputMmFrom) || (!this.inputHhFrom && !this.inputMmFrom)) {
			 fromFlag = true;
		 }
		}
		// To項目
		let toFlag = false;
		// カレンダーに入力がある場合
		if (this.inputValueTo) {
			// "時分に入力がある場合"または"時に入力があり分に入力がない場合"または"時分に入力がない場合"
			if ((this.inputHhTo && this.inputMmTo) || (this.inputHhTo && !this.inputMmTo) || (!this.inputHhTo && !this.inputMmTo)) {
				toFlag = true;
			}
		}
		// From項目のカレンダーに入力があり、かつ、To項目のカレンダーに入力がある場合
		if ((this.inputValueFrom) && (this.inputValueTo)) {
			if (fromFlag && toFlag) {
				return false;
			}
			// From項目のカレンダーに入力がある場合
		} else if (this.inputValueFrom) {
			if (fromFlag) {
				return false;
			}
			// To項目のカレンダーに入力がある場合
		} else if (this.inputValueTo) {
			if (toFlag) {
				return false;
			}
		}
		return true;
	}

	/**
	 * ユーザー指定の時、入力チェック
	 * @return ユーザー項目の正誤
	 */
	private disabledCheckUser(): boolean {
		if (this.userName) {
			return false;
		}
		return true;
	}

	/**
	 * プルダウンリストの作成
	 * @param number プルダウンリスト最大値
	 * @return プルダウンリストの設定値
	 */
	private createPullDownList(max: number): any[] {
		let result = [];
		result.push({label: '　', value: ''});
		let label = ''
		for (let i = 0; i <= max; i++) {
			label = i.toString();
			if (i < this.digit) {
				label = '0' + label;
			}
			result.push({label: label, value: label});
		}
		return result;
	}

	/**
	 * 作成者選択
	 * @param users 選択されたユーザ情報
	 */
	private selectCreateUser(users: any[]): void {
		this.info.condition.userId = users[0].id;
		this.info.condition.userName = users[0].name;
		this.userId = users[0].id;
		this.userName = users[0].name;
	}

	/**
	 * 日付順序の判定を行います
	 * @param fromDate 開始日文字列
	 * @param toDate 終了日文字列
	 * @return 時系列が不正かどうか(逆順ならtrueを返却)
	 */
	private checkDateValid(fromDate: string, toDate: string): boolean {
		if (!fromDate || !toDate) {
			return false;
		}
		let formedFromDate: string = fromDate.replace( /-/g , '/' );
		let formedToDate: string = toDate.replace( /-/g , '/' );
		return (new Date(formedToDate)).getTime() < (new Date(formedFromDate)).getTime();
	}
}
