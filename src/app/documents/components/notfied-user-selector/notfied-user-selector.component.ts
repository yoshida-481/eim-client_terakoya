import { Component, forwardRef, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridColumn, EIMDataGridComponent } from 'app/shared/components/data-grid/data-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { EIMDocumentsEntryService } from 'app/documents/shared/services/apis/documents-entry.service';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMTooltipRendererComponent } from 'app/shared/components/renderer/tooltip-renderer.component';

/**
 * 公開通知先参照コンポーネント
 * @example
 *      <eim-notfied-user-selector
 *        [objId]="objId">
 *      </eim-notfied-user-selector>
 */
@Component({
    selector: 'eim-notfied-user-selector',
    templateUrl: './notfied-user-selector.component.html',
    styleUrls: ['./notfied-user-selector.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMNotfiedUserSelectorComponent) }
    ],
    standalone: false
})
export class EIMNotfiedUserSelectorComponent implements OnInit {

	/** 対象のオブジェクトID */
	@Input() objId: number;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** ステータス属性データグリッド */
	@ViewChild('notfiedUserList', { static: true })
		notfiedUserList: EIMDataGridComponent;

	/** 通知タイミング */
	public publicTiming = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		private entryService: EIMDocumentsEntryService,
	) {
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * データバインド入力値初期化後の処理です.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// タイプ
		columns.push({field: 'type', headerName: this.translateService.instant('EIM.LABEL_02019'), width: 165});
		// 名前
		columns.push({field: 'name', headerName: this.translateService.instant('EIM.LABEL_02041'), width: 217,cellRendererFramework: EIMTooltipRendererComponent});
		this.notfiedUserList.setColumns(columns);

		// 公開通知先情報取得
		this.entryService.getNotfiedUser(this.objId).subscribe(
			(data: any) => {
				switch (data.publisherList.attr.publicTiming) {
					case EIMConstantService.MAILNOTICE_METHOD_IMMEDIATE:
						this.publicTiming = this.translateService.instant('EIM.LABEL_02034');
						break;
					case EIMConstantService.MAILNOTICE_METHOD_ACCUMULATE:
						this.publicTiming = this.translateService.instant('EIM.LABEL_02035');
						break;
					case EIMConstantService.MAILNOTICE_METHOD_NOTHING:
						this.publicTiming = this.translateService.instant('EIM.LABEL_02036');
						break;
					default:
						break;
				}

				// 一覧のデータ生成
				let dataList = [];
				// 公開通知先が1件以上か判定
				if (data.publisherList.publisher instanceof Array) {
					for (let i = 0; i < data.publisherList.publisher.length; i++) {
						this.pushData(dataList, data.publisherList.publisher[i]);
					}
				} else {
					this.pushData(dataList, data.publisherList.publisher);
				}
				this.notfiedUserList.setData(dataList);
		}, (err: any) => {
			window.setTimeout(() => {
				this.errored.emit();
			});
		}
	)}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * データ種別毎に追加対象リストに追加します
	 * @param dataList 追加対象リスト
	 * @param data データ
	 */
	private pushData(dataList: any[], data: any): void {

		if (!data || !data.hasOwnProperty('attr')) {
			return;
		}

		let type = '';
		let name = '';
		if (data.attr.hasOwnProperty('userId')) {
			type = this.translateService.instant('EIM.LABEL_02017');
			name = data.attr.userName;
		} else if (data.attr.hasOwnProperty('groupId')) {
			type = this.translateService.instant('EIM.LABEL_02003');
			name = data.attr.groupName;
		} else if (data.attr.hasOwnProperty('roleId')) {
			type = this.translateService.instant('EIM.LABEL_02004');
			name = data.attr.roleName;
		} else if (data.attr.hasOwnProperty('compId')) {
			type = this.translateService.instant('EIM.LABEL_02018');
			name = data.attr.compName;
		} else {
			return;
		}
		dataList.push({type: type, name: name});
		return;
	}
}

