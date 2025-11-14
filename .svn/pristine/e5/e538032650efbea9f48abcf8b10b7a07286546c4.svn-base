import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';

import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

export interface EIMTable {
	label?: string;
	isBranch?: boolean;
	tableId?: number;
	tableName?: string;
	selected?: boolean;
	tableDefName?: string;
	tableItemList?: EIMTableItem[];
}

export interface EIMHierarchicalTable extends EIMTable, EIMHierarchicalDomain {

}

export interface EIMTableItem {
	attTypeId?: number;
	attTypeName?: string;
	attTypeDefName?: string;
	attValTypeId?: number;
	attIsMultiple?: boolean;
	inputRule?: boolean;
	inputRuleValueList?: any[];
	notNull?: boolean;
}

/**
 * テーブルAPIサービス
 */
@Injectable()
export class EIMTableService {

	constructor(
			private httpService: EIMDocumentsHttpService,
			private jsonService: EIMJSONService) {}

	/**
	 * テーブルを登録します.
	 */
	public create(tableName: string): Observable<EIMTable[]> {

		let params: any = {};
		params['tableName'] = tableName;

		return this.httpService.postForForm('/app/document/table/actCreateTable.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * テーブルを更新します.
	 */
	public update(tableId: number, tableName: string): Observable<EIMTable[]> {

		let params: any = {};
		params['tableId'] = tableId;
		params['tableName'] = tableName;

		return this.httpService.postForForm('/app/document/table/actEditTable.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value.table.attr);
			}));
	}

	/**
	 * テーブルを削除します.
	 */
	public delete(tableId: number): Observable<EIMTable[]> {

		let params: any = {};
		params['tableId'] = tableId;

		return this.httpService.postForForm('/app/document/table/actDeleteTable.jsp', params)
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * テーブルリストを取得します.
	 */
	public getList(): Observable<EIMTable[]> {
		return this.httpService.get('/app/document/table/dspTableList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.tableList.table, this.convertToEIMTable));
			}));
	}

	/**
	 * テーブルに属性タイプを割当てます.
	 * @param tableId テーブルID
	 * @param attTypeIds 属性タイプリスト
	 */
	public applyAttributeTypeToTable(tableId: number, attTypeIds: number[]): Observable<EIMTable[]> {

		let params: any = {};
		params.tableId = tableId;
		params.attTypeIds = attTypeIds;

		return this.httpService.get('/app/document/table/actApplyAttributeTypeList.jsp', params)
		.pipe(mergeMap((res: any) => {
			return of(res.value);
		}));
	}

	/**
	 * テーブルに属するテーブルアイテムを取得します.
	 */
	public getTableItemList(id: number, defName: string): Observable<EIMTableItem[]> {
		return this.httpService.postForForm('/app/document/table/dspTableAttributeTypeList.jsp',
				{tableId: (id == null) ? '' : id, tableDefName: defName})
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.attTypeList.attType, this.convertToEIMTableItem));
			}));
	}

	/**
	 * テーブルを選択します.
	 */
	public select(id: number, defName: string): Observable<any> {
		return this.httpService.postForForm('/app/document/table/actSelectTable.jsp',
				{tableId: (id == null) ? '' : id, tableDefName: defName ? defName : ''})
			.pipe(mergeMap((res: any) => {
				return of(res.value);
			}));
	}

	/**
	 * カスタマイズデフォルトテーブルリストを取得します.
	 */
	public getCustomizeDefaultList(): Observable<any> {
		return this.httpService.get('/app/document/table/dspCustomTableList.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.convertHierarchicalDomain(res.value.customTableList.table, 'table', this.convertToEIMTable));
			}));
	}

	private convertToEIMTable(json: any): EIMTable {
		return {
			label: json.attr.label,
			isBranch: json.attr.isBranch == 'true' ? true : false,
			tableId: json.attr.tableId,
			tableName: json.attr.tableName,
			selected: json.attr.selected == '1' ? true : false,
			tableDefName: json.attr.tableDefName,
		}
	}

	private convertToEIMTableItem(data: any): EIMTableItem {

		let list: any[];
		let valueList: any[];

		if (data.attMaster) {
			valueList = [];
			list = (Array.isArray(data.attMaster) ? data.attMaster : [data.attMaster]);
			list.forEach( (attMaster: any) => {
				// 未設定(空)だとドロップダウンの高さがつぶれるので全角スペースを設定する(半角スペースでも高さがつぶれるため)
				let label: string = (attMaster.attr.value == '' ? '　' : attMaster.attr.value);
				valueList.push({label: label, value: attMaster.attr.value});
			});
		}

		return {
			attTypeId: data.attr.attTypeId,
			attTypeName: data.attr.attTypeName,
			attTypeDefName: data.attr.attTypeDefName,
			attValTypeId: data.attr.attValTypeId,
			attIsMultiple: data.attr.attIsMultiple == 'true' ? true : false,
			inputRule: data.attr.inputRule == 'true' ? true : false,
			inputRuleValueList: (valueList ? valueList : null),
			notNull: data.attr.notNull == 'true' ? true : false,
		}
	}

}
