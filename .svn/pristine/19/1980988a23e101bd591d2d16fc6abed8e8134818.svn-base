import { Component, EventEmitter, ContentChild, ViewChild, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChildren } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMComponent, EIMSelectorComponent } from 'app/shared/shared.interface';
import { EIMDataGridComponent, EIMDataGridColumn } from 'app/shared/components/data-grid/data-grid.component';

/**
 * 単数選択コンポーネント
 * @example
 * 		<eim-single-selector
 * 			[data]="data"
 * 			[selectedData]="selectedData"
 * 		>
 * 		</eim-single-selector>
 */
@Component({
    selector: 'eim-single-selector',
    templateUrl: './single-selector.component.html',
    // templateUrl: '../data-grid/data-grid.component.html',
    styleUrls: ['./single-selector.component.css'],
    standalone: false
})
export class EIMSingleSelectorComponent implements EIMSelectorComponent<any>, EIMComponent {

	/** 表示データ */
	@Input()
		data: any[];
	/** 選択データ */
	@Input()
		selectedData: any[];


	/**
	 * 情報取得完了イベントエミッタ
	 * 継承先の情報取得メソッド内で発火する想定
	 */
	@Output() public fetched: EventEmitter<any> = new EventEmitter<any>();

  public disabled = false;

	/**
	 * コンストラクタです.
	 */
	constructor() {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * 表示データを取得します.
	 * @return 表示データ
	 */
	public getData(): any[] {
			return this.data;
	}

	/**
	 * 表示データを設定します.
	 * @param data 表示データ
	 */
	public setData(data: any[]): void {
			this.data = data;
	}

	/**
	 * 選択情報を取得します.
	 */
	public getSelectedData(): any[] {
		return this.selectedData;
	}

	/**
	 * DTOリストをDomainリストに変換して変換します.
	 * @params dtos DTOリスト
	 * @return Domainリスト
	 */
	public convertDtosToDomains(dtos: any[]): any[] {
		if (!dtos) {
			return [];
		}

		let domains: any[] = [];
		for (let i = 0; i < dtos.length; i++) {
			domains.push(this.convertDtoToDomain(dtos[i]));
		}

		return domains;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * DTOをDomainに変換して変換します.
	 * @params dto DTO
	 * @return Domain
	 */
	protected convertDtoToDomain(dto: any): any {
		return dto;
	}


}
