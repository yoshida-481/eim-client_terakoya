import {Component, OnDestroy} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';

import { EIMPageRendererComponentService } from 'app/documents/shared/components/renderer/page-renderer.component.service';
import { SelectItem } from 'primeng/api';
import { EIMDocumentFormService } from '../../services/apis/document-form.service';
import { EIMDocumentSessionStorageService } from '../../services/apis/document-session-storage.service';

/**
 * ステータスレンダラーコンポーネント
 * @example
 * 		pageRendererFramework: EIMPageRendererComponent
 */
@Component({
    selector: 'eim-page-renderer',
    template: `
    <div *ngIf="params.data.isDspPageIcon" id="pageRenderer" style="text-align: center;">
		<p-select #dropdown id="drop-down" [options]="pageList" appendTo="body" [autoDisplayFirst]="false"
				(onClick)="onGetPage()" (onChange)="onSelectedPageChange($event,dropdown)" dropdownIcon="eim-icon-page-download"
				[style]="{'width': '0px','border':'none','background-color':'transparent','margin-top':'-9px','justify-content':'center'}" >
			<ng-template let-item pTemplate="selectedItem">
				<i class="{{item.label}}"></i>
			</ng-template>
		</p-select>
    </div>
		`,
    styles: [`
		::ng-deep #pageRenderer .p-select .p-select-trigger{
			border:none;
			background-color: transparent;
		}
		::ng-deep #pageRenderer .p-select-label {
			background-color: transparent;
			display: none;
		}
		::ng-deep #pageRenderer .p-select .p-select-trigger .p-select-trigger-icon {
			margin-left:0px;
		}
		::ng-deep eim-page-renderer .p-hidden-accessible {
			display: none;
		}
	`],
    standalone: false
})
export class EIMPageRendererComponent implements AgRendererComponent {
	public params: any;

	/** 選択可能データ型リスト */
	public pageList: SelectItem[];
	public selectedPage: any;

	/**
	 * コンストラクタです.
	 */
	constructor(private pageRendererComponentService: EIMPageRendererComponentService,
		private documentFormService: EIMDocumentFormService,
		private documentSessionStorageService: EIMDocumentSessionStorageService,) {

	}

	/**
	 * 入力値初期化後イベントハンドラ.
	 * @param params パラメータ
	 */
	agInit(params: any): void {
		this.params = params;

	}

	/**
	 * セルの値をリフレッシュするかどうか(agGridのインタフェース実装)
	 * @param params 行データ
	 * @return リフレッシュする場合true、しない場合false
	 */
	refresh(params: any): boolean {
		this.params = params;
		return false;
	}


	/**
	 * ページプルダウン選択時のハンドラです.
	 * @param event イベント
	 */
	 onGetPage() {
		let params: {key?: String} = {};

		// searchKeywordが設定されていればそちらを採用する
		// コンテンツ選択とアコーディオン検索でkeywordが競合してしまうため、このような処理としている
		if (this.documentSessionStorageService.getSearchKeyword() !== null) {
			params['keyword'] =  this.documentSessionStorageService.getSearchKeyword();
		} else {
			params['keyword'] =  this.documentSessionStorageService.getSearchCondition().keyword;
		}

		params['objId'] = this.params.data.objId;

		// 検索
		this.documentFormService.pageSearch(params).
			subscribe( (resultList: any) => {
				this.pageList = [];
				for (let i=0; i<resultList.length; i++){
					this.pageList.push({label:"P." + resultList[i], value:resultList[i]});
				}
			}, (err: any) => {
			}
		);

	}
  	/**
	 * ページプルダウン変更時のハンドラです.
	 * @param event イベント
	 */
	onSelectedPageChange(event,dropdown) {

		this.pageRendererComponentService.onClickPage(this.params, event.value);

		dropdown.updateSelectedOption(null);
		dropdown.value = "";
	}

}
