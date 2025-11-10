import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, forwardRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMSelectable } from 'app/shared/shared.interface';
import { EIMConstantService } from 'app/shared/services/constant.service';
import { EIMSingleSelectorComponent } from 'app/shared/components/single-selector/single-selector.component';
import { EIMAdminsWorkflowService } from 'app/admins/shared/services/apis/admins-workflow.service';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';
import { EIMMailTypeDTO } from 'app/admins/shared/dtos/mail-type.dto';

/**
 * メール種別選択コンポーネント
 * @example
 * 		<eim-workflow-mail-kind-single-selector
 * 			[multiple]="false"
 * 		>
 * 		</eim-workflow-mail-kind-single-selector>
 */
@Component({
    selector: 'eim-workflow-mail-kind-single-selector',
    templateUrl: './workflow-mail-kind-single-selector.component.html',
    styleUrls: ['./workflow-mail-kind-single-selector.component.css'],
    providers: [{ provide: EIMComponent, useExisting: forwardRef(() => EIMWorkflowMailKindSingleSelectorComponent) },
        { provide: EIMSingleSelectorComponent, useExisting: forwardRef(() => EIMWorkflowMailKindSingleSelectorComponent) }],
    standalone: false
})
export class EIMWorkflowMailKindSingleSelectorComponent extends EIMSingleSelectorComponent implements OnInit, EIMSelectable {
	/** 検索結果リスト */
	@ViewChild('mailTypeList', { static: true }) mailTypeList: EIMDataGridComponent;

	/** 複数選択可否 */
	@Input() public multiple = false;

	/** WorkFlowConfのidのうち表示する最小値のid（マイナス値のためMin/Maxを間違えないように） */
	@Input() public idMin = 0;

	/** WorkFlowConfのidのうち表示する最大値のid */
	@Input() public idMax = Number.MIN_SAFE_INTEGER;

	/** 選択イベントエミッタ */
	@Output() public selected: EventEmitter<any> = new EventEmitter<any>();

	/** エラー発生時のイベントエミッタ */
	@Output() public errored: EventEmitter<null> = new EventEmitter<null>();

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected translateService: TranslateService,
			protected workflowService: EIMAdminsWorkflowService,
	) {
		super();
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 選択ボタン押下時の処理を実施します.
	 * selectedイベントエミッタを発火します.
	 */
	public select(): void {
		// 選択したメール種別を呼び出し元に通知
		this.selected.emit(this.mailTypeList.getSelectedData()[0]);
	}

	/**
	 * 選択ボタン押下可否を返却します.
	 */
	public selectable(): boolean {
		let selectdDataList = this.mailTypeList.getSelectedData();
		return (selectdDataList && selectdDataList.length > 0);
	}

	/**
	 * 選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		return this.mailTypeList.getSelectedData();
	}

	/**
	 * フィルタを実行します.
	 * 何もしません.
	 * @param unvisibleData 非表示データ
	 */
	public filter(unvisibleData: any[]): void {
	}

	/**
	 * デフォルト同一行判定関数
	 * @param obj1 行データ
	 * @param obj2 行データ
	 */
	public dataGridEquals(obj1: any, obj2: any): boolean {
		return (obj1.id === obj2.id);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		let columns: EIMDataGridColumn[] = [];
		// 一覧項目
		columns.push({field: 'name', headerName: this.translateService.instant('EIM_ADMINS.LABEL_02112'), width: 369, suppressSorting: true, suppressFilter: true});
		this.mailTypeList.setColumns(columns);

		// メール種別一覧を取得します．
		this.workflowService.getMailTypeList().subscribe(
			(mailTypeList: EIMMailTypeDTO[]) => {

				const filteredMailTypeList = mailTypeList.filter((mailType) => 
					(this.idMin <= Number(mailType.id) && Number(mailType.id) <= this.idMax)
				)
				this.mailTypeList.setData(filteredMailTypeList);
			}, (err: any) => {
				// エラーの場合
				window.setTimeout(() => {
					this.errored.emit();
				});
			}
		);

	}

}
