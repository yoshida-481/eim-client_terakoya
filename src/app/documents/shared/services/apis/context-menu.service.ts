import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { EIMJSONService } from 'app/shared/services/json.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { EIMDocumentsHttpService } from '../documents-http.service';

/**
 * コンテキストメニュー情報
 */
export interface EIMContextMenu {
	itemJpName?: string,
	itemEnName?: string,
	separatorBefore?: boolean,
}

/**
 * メインメニュー情報
 */
export interface EIMMainMenu {
	itemJpName?: string,
	itemEnName?: string,
	visible?: boolean,
}

/**
 * コンテキストメニューAPIサービス
 */
@Injectable()
export class EIMContextMenuService {

	constructor(
			private httpService: EIMDocumentsHttpService,
			private jsonService: EIMJSONService) {}

	/**
	 * コンテキストメニューアイテムリストを取得します.
	 * @return コンテキストメニューアイテムリスト
	 */
	public getContextMenuItemList(): Observable<EIMContextMenu[]> {
		return this.httpService.postForForm('/app/document/conf/dspContextMenuItemConfXML.jsp')
			.pipe(mergeMap((res: any) => {
				return of(this.jsonService.getJsonChildren(res.value.ContextMenuItemConf.Item, this.convertToEIMContextMenu));
			}));
	}

	/**
	 * コンテキストメニューアイテムリストとメインメニューアイテムリストを取得します.
	 * @return コンテキストメニューアイテムリストとメインメニューアイテムリスト
	 */
	public getContextItemListAndMainMenuItemList(): Observable<any[]> {
		return this.httpService.postForForm('/app/document/conf/dspContextMenuItemConfXML.jsp')
			.pipe(mergeMap((res: any) => {
				let result: any[] = [];
				result.push(this.jsonService.getJsonChildren(res.value.ContextMenuItemConf.Item, this.convertToEIMContextMenu));
				result.push(this.jsonService.getJsonChildren(res.value.MainMenuItemConf.Item, this.convertToEIMMainMenu));
				return of(result);
			}));
	}

	/**
	 * コンテキストメニュー情報
	 * @param json JSONデータ
	 */
	private convertToEIMContextMenu(json: any): EIMContextMenu {
		return {
			itemJpName: json.attr.ItemJpName,
			itemEnName: json.attr.ItemEnName,
			separatorBefore: json.attr.SeparatorBefore === 'true' ? true : false,
		}
	}

	/**
	 * オプションメニュー情報
	 * @param json JSONデータ
	 */
	private convertToEIMMainMenu(json: any): EIMMainMenu {
		return {
			itemJpName: json.attr.ItemJpName,
			itemEnName: json.attr.ItemEnName,
			visible: json.attr.visible === 'true' ? true : false,
		}
	}
}
