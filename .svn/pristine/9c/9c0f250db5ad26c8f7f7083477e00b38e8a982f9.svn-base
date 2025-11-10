import { Component, forwardRef, ViewChild, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { EIMComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMDocumentsUserService } from 'app/documents/shared/services/apis/documents-user.service';

import { EIMObjectNameRendererComponent } from 'app/documents/shared/components/renderer/object-name-renderer.component';
import { EIMHistoryRendererComponent } from 'app/documents/shared/components/renderer/history-renderer.component';
import { EIMHistoryRendererComponentService } from 'app/documents/shared/components/renderer/history-renderer.component.service';
import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMPlaceRendererComponentService } from 'app/documents/shared/components/renderer/place-renderer.component.service';
import { EIMPlaceRendererComponent } from 'app/documents/shared/components/renderer/place-renderer.component';

import { EIMDateService } from 'app/shared/services/date.service';

/**
 * チェックアウト一覧コンポーネント
 * @example
 *      <eim-checkout-list>
 *      </eim-checkout-list>
 */
@Component({
    selector: 'eim-checkout-list',
    templateUrl: './checkout-list.component.html',
    styleUrls: ['./checkout-list.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMCheckoutListComponent) }
    ],
    standalone: false
})
export class EIMCheckoutListComponent implements OnInit, OnDestroy {

	/** チェックアウト一覧データグリッド */
	@ViewChild('checkoutGrid', { static: true })
			checkoutGrid: EIMDataGridComponent;

	/** エラー発生時のイベントエミッタ */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 場所アクセスイベントエミッタ */
	@Output() contentsAccess: EventEmitter<any> = new EventEmitter<any>();

	/** 場所クリック時のサブスクリプション */
	private placeRendererComponentServicePlaceClicked?: Subscription;

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected userService: EIMDocumentsUserService,
			protected translateService: TranslateService,
			protected dialogManagerComponentService: EIMDialogManagerComponentService,
			protected placeRendererComponentService: EIMPlaceRendererComponentService,
			protected historyRendererComponentService: EIMHistoryRendererComponentService,
			protected dateService: EIMDateService,
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
		columns.push({field: 'objName', headerName: this.translateService.instant('EIM.LABEL_02002'), width: 203, cellRendererFramework: EIMObjectNameRendererComponent});
		// 履歴
		columns.push( { field: 'revision', headerName: this.translateService.instant( 'EIM_DOCUMENTS.LABEL_02037' ), width: 50,
			suppressFilter: true, cellRendererFramework: EIMHistoryRendererComponent, valueGetter: this.historyRendererComponentService.valueGetter } );
		// チェックアウト日時
		columns.push({field: 'lockDate', headerName: this.translateService.instant( 'EIM_DOCUMENTS.LABEL_02189' ), width: 160, comparator: this.dateService.dateComparator});
		// 場所
		columns.push({field: 'path', headerName: this.translateService.instant('EIM_DOCUMENTS.LABEL_02038'), width: 250, cellRendererFramework: EIMPlaceRendererComponent});

		this.checkoutGrid.setColumns(columns);
		this.checkoutGrid.showAllSelectButton = false;

		// 場所クリックイベントハンドラ
		if ( !this.placeRendererComponentServicePlaceClicked ) {
			this.placeRendererComponentServicePlaceClicked = this.placeRendererComponentService.placeClicked.subscribe((data: any ) => {
				// コンテンツアクセスイベントをエミット
				this.contentsAccess.emit(data);
				// 画面を閉じる
				this.dialogManagerComponentService.close( 'CHECKOUT_LIST' );
			} );
		}

		this.show();
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.placeRendererComponentServicePlaceClicked.closed) {this.placeRendererComponentServicePlaceClicked.unsubscribe(); }
	 }

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します.
	 */
	private show(): void {
		this.userService.getCheckoutList()
		.subscribe((object: any) => {
			this.checkoutGrid.setData(object);
		}, (err: any) => {
			// エラーの場合、画面を閉じる
			window.setTimeout(() => {
				this.errored.emit();
			});

		});
	}

}
