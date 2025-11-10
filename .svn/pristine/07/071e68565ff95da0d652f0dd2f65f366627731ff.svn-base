import { Injectable } from '@angular/core';
import { EIMSessionStorageService } from 'app/shared/services/apis/session-storage.service';
import { EIMBoxFolderDomain } from 'app/shared/domains/box-folder.domain';
import { EIMBoxFileDomain } from 'app/shared/domains/box-file.domain';

/**
 * ドキュメントセッションストレージサービス
 */
@Injectable()
export class EIMDocumentSessionStorageService {

	private static SUB_SYSTEM_NAME = 'documents';
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected sessionStorageService: EIMSessionStorageService,
	) {}

	/**
	 * コピー対象の属性値を設定します.
	 */
	public setCopyTagetAttribute(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'property_copy_target', value);
	}

	/**
	 * コピー対象の属性値を返却します.
	 */
	public getCopyTagetAttribute(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'property_copy_target');
	}

	/**
	 * Box領域の表示状態の内、必要なプロパティのみを更新設定します.
	 * @param value 表示状態の内、必要なプロパティ設定
	 */
	public updateBoxAreaState(value: any): void {
		const _value = Object.assign(this.getBoxAreaState(), value);
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'property_box_area_state', _value);
	}

	/**
	 * Box領域の表示状態を返却します.
	 * @return 表示状態
	 */
	public getBoxAreaState(): any {
		const defaultBoxAreaState = {
			isDisplayingBox: false,
			selectedFolder: null,
			selectedContents: [],
			contents: [],
			loginUser: null
		}

		let boxState = Object.assign(defaultBoxAreaState, this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'property_box_area_state'));
		boxState.contents = this.convertToBoxObject(boxState.contents);
		boxState.selectedContents = this.convertToBoxObject(boxState.selectedContents);

		return boxState;
	}

	/**
	 * メインコンポーネント情報(ページ再読み込み用)を設定します.
	 */
	public setMainComponentInfoForPageReload(info: any) {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
			'property_main_component_info', info);
	}

	/**
	 * メインコンポーネント情報(ページ再読み込み用)を取得します.
	 */
	public getMainComponentInfoForPageReload(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
			'property_main_component_info');
	}

	/**
	 * メインコンポーネント情報(ページ再読み込み用)を削除します.
	 */
	public removeMainComponentInfoForPageReload(): void {
		this.sessionStorageService.removeItem(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
			'property_main_component_info');
	}

	/**
	 * 全ての値を削除します.
	 */
	public removeAll(): void {
		this.sessionStorageService.removeItem(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
			'property_copy_target');
		this.sessionStorageService.removeItem(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
			'property_box_area_state');
		this.removeMainComponentInfoForPageReload();
	}

	private convertToBoxObject(contents: any[]): EIMBoxFolderDomain[] | EIMBoxFileDomain[] {
		const retList = [];
		for (let i = 0; i < contents.length; i++) {
			if (contents[i].type === 'folder') {
				retList.push(new EIMBoxFolderDomain(contents[i]));
			} else if (contents[i].type === 'file') {
				retList.push(new EIMBoxFileDomain(contents[i]));
			}
		}
		return retList;
	}

	/**
	 * コンテンツ選択時の検索キーワードを設定します.
	 */
	 public setSearchKeyword(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'search_keyword_from_contents_search', value);
	}
	
	/**
	 * コンテンツ選択時の検索キーワードを返却します.
	 */
	public getSearchKeyword(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'search_keyword_from_contents_search');
	}

	/**
	 * アコーディオン検索時の条件を設定します.
	 */
	 public setSearchCondition(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'search_condition', value);
	}
	
	/**
	 * アコーディオン検索時の条件を返却します.
	 */
	public getSearchCondition(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'search_condition');
	}

	/**
	 * コンテンツ選択ダイアログを表示しているかどうかを設定します.
	 */
	public setContentsSelectDispFlg(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'contents_select_disp_flg', value);
	}
	
	/**
	 * コンテンツ選択ダイアログを表示しているかどうかを返却します.
	 */
	public getContentsSelectDispFlg(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'contents_select_disp_flg');
	}

	/**
	 * ワークスペース時の画面表示タイプ（リスト/サムネイル）を設定します.
	 */
	public setWorkspaceDisplayType(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'workspace_display_type', value);
	}
	
	/**
	 * ワークスペース時の画面表示タイプ（リスト/サムネイル）を返却します.
	 */
	public getWorkspaceDisplayType(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'workspace_display_type');
	}

	/**
	 * アコーディオン検索時の画面表示タイプ（本文抜粋／リスト/サムネイル）を設定します.
	 */
	 public setSearchDisplayType(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'search_display_type', value);
	}
	
	/**
	 * アコーディオン検索時の画面表示タイプ（本文抜粋／リスト/サムネイル）を返却します.
	 */
	public getSearchDisplayType(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'search_display_type');
	}

	/**
	 * アコーディオン選択インデックスを設定します.
	 */
	 public setAccordionActiveIndex(value: any): void {
		this.sessionStorageService.set(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'accordion_active_index', value);
	}
	
	/**
	 * アコーディオン選択インデックスを返却します.
	 */
	public getAccordionActiveIndex(): any {
		return this.sessionStorageService.get(EIMDocumentSessionStorageService.SUB_SYSTEM_NAME,
				'accordion_active_index');
	}
}
