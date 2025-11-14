import { Component, ViewChild, AfterViewInit, OnDestroy, ViewChildren, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EIMObjectListComponentService } from 'app/object-editors/components/object-list/object-list.component.service';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
import { CommonModule } from '@angular/common';
import { EIMObjectEditorsModule } from 'app/object-editors/object-editors.module';
import { EIMSharedModule } from 'app/shared/shared.module';
import { EIMDialogSharedManagerComponent } from 'app/shared/components/dialog-shared-manager/dialog-shared-manager.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
/**
 * タブに表示するオブジェクト名の最大文字数
 */
export const TAB_MAX_STR_LENGTH = 10;

/**
 * オブジェクトエディタメインコンポーネント
 * @example
 *
 *      <eim-object-editor-main>
 *      </eim-object-editor-main>
 */
@Component({
    selector: 'eim-object-editor-main',
    templateUrl: './object-editor-main.component.html',
    styleUrls: ['./object-editor-main.component.css'],
	imports: [
		CommonModule,
		EIMObjectEditorsModule,
		EIMSharedModule,
		MatButtonModule,
		MatCheckboxModule,
		MatTabsModule,

		TranslatePipe,
	],
    providers: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	standalone: true
})
export class EIMObjectEditorMainComponent implements AfterViewInit, OnDestroy {

	/** オブジェクトリスト表示コンポーネント */
	@ViewChildren('tabComponents') tabComponents: any;

	/** タブ種別：オブジェクト検索 */
	public readonly TAB_TYPE_SEARCH_OBJECT = 'TAB_TYPE_SEARCH_OBJECT';
	/** タブ種別：リビジョン一覧表示 */
	public readonly TAB_TYPE_SHOW_REVISION_LIST = 'TAB_TYPE_SHOW_REVISION_LIST';
	/** タブ種別：リレーション正展開 */
	public readonly TAB_TYPE_EXPAND_RELATION = 'TAB_TYPE_EXPAND_RELATION';
	/** タブ種別：リレーション逆展開 */
	public readonly TAB_TYPE_REVERSE_EXPAND_RELATION = 'TAB_TYPE_REVERSE_EXPAND_RELATION';
	/** タブ種別：オブジェクト登録 */
	public readonly TAB_TYPE_NEW_OBJECT = 'TAB_TYPE_NEW_OBJECT';

	/** 表示タブ配列 */
	public tabs = [{}];

	/** 選択タブインデックス */
	public selectedTabIndex;
	/** 変更前タブインデックス */
	public beforeSelectedTabIndex = 0;

	/** アニメーション無効フラグ */
	public isDisabledAnimation = true;

	/** リレーション正展開押下時サブスクリプション */
	protected clickedExpandRelationSubscription: Subscription;
	/** リレーション逆展開押下時 */
	protected clickedReverseExpandRelationSubscription: Subscription;
	/** リビジョン一覧押下時 */
	protected clickedRevisionListSubscription: Subscription;
	/** オブジェクト登録完了押下時 */
	protected createdObjectSubscription: Subscription;
	/** オブジェクト更新完了押下時 */
	protected updatedObjectSubscription: Subscription;
	/** 表示タブクローズ時 */
	protected closeSelectedTabSubscription: Subscription;

	/** スクロールポジション */
	protected scrollPosition: {}[] = []

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,
		protected objectListComponentService: EIMObjectListComponentService,
	) {
		// リレーション正展開押下時
		this.clickedExpandRelationSubscription =
			this.objectListComponentService.clickedExpandRelation.subscribe(
				(object: EIMObjectDTO) => {
					this.addExpandRelationTab(object);
				}
			);

		// リレーション逆展開押下時
		this.clickedReverseExpandRelationSubscription =
			this.objectListComponentService.clickedReverseExpandRelation.subscribe(
				(object: EIMObjectDTO) => {
					this.addReverseExpandRelationTab(object);
				}
			);

		// リビジョン一覧押下時
		this.clickedRevisionListSubscription =
			this.objectListComponentService.clickedRevisionList.subscribe(
				(object: EIMObjectDTO) => {
					this.addRevisionListTab(object);
				}
			);

		// オブジェクト登録完了押下時
		this.createdObjectSubscription =
			this.objectListComponentService.createdObject.subscribe(
				(object: EIMObjectDomain) => {
					this.addCreatedObjectTab(object);
				}
			);

		// オブジェクト更新完了押下時
		this.updatedObjectSubscription =
			this.objectListComponentService.updatedObject.subscribe(
				(object: EIMObjectDomain) => {
					this.addUpdatedObjectTab(object);
				}
			);

		// 表示タブクローズ時
		this.closeSelectedTabSubscription =
			this.objectListComponentService.closeSelectedTab.subscribe(
				() => {
					this.onClickRemoveTab(this.selectedTabIndex);
				}
			);
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * オブジェクト検索タブを追加します.
	 */
	public addObjectSearchTab(): void {
		let newTab = {
			name: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02005'),
			type: this.TAB_TYPE_SEARCH_OBJECT,
			icon: 'fa fa-fw eim-icon-search'
		};

		this.addTab(newTab);
	}

	/**
	 * リビジョン一覧表示タブを追加します.
	 * @param object 表示対象オブジェクト
	 */
	public addRevisionListTab(object: EIMObjectDTO): void {

		let tabInfo = this.getTabNameAndTooltip(object.name);

		let newTab = {
			name: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02008', {value: tabInfo.objName}),
			type: this.TAB_TYPE_SHOW_REVISION_LIST,
			icon: 'fa fa-fw eim-icon-revision-history',
			tooltip: tabInfo.tooltip,
			data: object
		};

		this.addTab(newTab);
	}

	/**
	 * リレーション正展開タブを追加します.
	 * @param object 展開オブジェクト
	 */
	public addExpandRelationTab(object: EIMObjectDTO): void {
		let tabInfo = this.getTabNameAndTooltip(object.name);

		let newTab = {
			name: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02009', {value: tabInfo.objName}),
			type: this.TAB_TYPE_EXPAND_RELATION,
			icon: 'fa fa-fw eim-icon-relation',
			tooltip: tabInfo.tooltip,
			data: object
		};

		this.addTab(newTab);
	}

	/**
	 * リレーション逆展開タブを追加します.
	 * @param object 展開オブジェクト
	 */
	public addReverseExpandRelationTab(object: EIMObjectDTO): void {
		let tabInfo = this.getTabNameAndTooltip(object.name);

		let newTab = {
			name: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02010', {value: tabInfo.objName}),
			type: this.TAB_TYPE_REVERSE_EXPAND_RELATION,
			icon: 'fa fa-fw eim-icon-relation',
			tooltip: tabInfo.tooltip,
			data: object
		};

		this.addTab(newTab);
	}

	/**
	 * オブジェクト登録タブを追加します.
	 * @param object 登録したオブジェクト
	 */
	public addCreatedObjectTab(object: EIMObjectDomain): void {
		let tabInfo = this.getTabNameAndTooltip(object.name);

		let newTab = {
			name: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02006', {value: tabInfo.objName}),
			type: this.TAB_TYPE_NEW_OBJECT,
			icon: 'fa fa-star',
			tooltip: tabInfo.tooltip,
			data: object
		};

		this.addTab(newTab);
	}

	/**
	 * オブジェクト更新タブを追加します.
	 * @param object 更新したオブジェクト
	 */
	public addUpdatedObjectTab(object: EIMObjectDomain): void {
		let tabInfo = this.getTabNameAndTooltip(object.name);

		let newTab = {
			name: this.translateService.instant('EIM_OBJECT_EDITORS.LABEL_02016', {value: tabInfo.objName}),
			type: this.TAB_TYPE_NEW_OBJECT,
			icon: 'fa fa-star',
			tooltip: tabInfo.tooltip,
			data: object
		};

		this.addTab(newTab);
	}
	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 子コンポーネントのビュー生成後のイベントハンドラです.
	 * データグリッド列の初期化を行います.
	 */
	ngAfterViewInit(): void {
		window.setTimeout(() => {
			this.addObjectSearchTab();
		});
	}

	/**
	 * コンポーネント破棄前イベントハンドラ.
	 */
	ngOnDestroy(): void {
		if (!this.clickedExpandRelationSubscription.closed) {
			this.clickedExpandRelationSubscription.unsubscribe();
		}
		if (!this.clickedReverseExpandRelationSubscription.closed) {
			this.clickedReverseExpandRelationSubscription.unsubscribe();
		}

		if (!this.clickedRevisionListSubscription.closed) {
			this.clickedRevisionListSubscription.unsubscribe();
		}

		if (!this.createdObjectSubscription.closed) {
			this.createdObjectSubscription.unsubscribe();
		}

		if (!this.updatedObjectSubscription.closed) {
			this.updatedObjectSubscription.unsubscribe();
		}

		if (!this.closeSelectedTabSubscription.closed) {
			this.closeSelectedTabSubscription.unsubscribe();
		}
	}

	public onChangeSelectedTabIndex(event: any): void {
		// タブ変更前のスクロールバーの位置を退避
		if (this.beforeSelectedTabIndex < this.tabComponents._results.length && this.beforeSelectedTabIndex !== this.selectedTabIndex) {
			let position = this.tabComponents._results[this.beforeSelectedTabIndex].getScrollPosition();
			this.scrollPosition[this.beforeSelectedTabIndex] = position;
		}

		// 現在のタブインデックスを更新
		this.beforeSelectedTabIndex = this.selectedTabIndex;
	}

	/**
	 * タブ選択変更のイベントハンドラです.
	 * オブジェクト検索追加用のタブが選択された場合は、オブジェクト検索タブを追加します.
	 */
	public onChangeSelectedTab(event: any): void {
		if (this.selectedTabIndex !== (this.tabs.length - 1)) {
			// タブ変更後のスクロールバーの位置を復元
			this.tabComponents._results[this.selectedTabIndex].setScrollPosition(this.scrollPosition[this.selectedTabIndex]);
			return;
		}

		// オブジェクト検索追加ボタン押下時
		this.addObjectSearchTab();
	}

	/**
	 * タブ削除ボタン押下のイベントハンドラです.
	 * @params index 削除するタブのインデックス
	 */
	public onClickRemoveTab(index: number): void {
		// タブ変更前のスクロールバーの位置を退避
		let position = this.tabComponents._results[this.beforeSelectedTabIndex].getScrollPosition();
		this.scrollPosition[this.beforeSelectedTabIndex] = position;

		this.tabs.splice(index, 1);
		this.scrollPosition.splice(index, 1);
		this.selectedTabIndex = 0;
		this.beforeSelectedTabIndex = 0;
		window.setTimeout(() => {
			this.onChangeSelectedTab(null);
		});
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * タブを追加します.
	 * @param tab タブ情報
	 */
	protected addTab(tab: any): void {
		this.scrollPosition[this.tabs.length - 1] = {};
		this.tabs.splice(this.tabs.length - 1, 0, tab);

		// +タブ選択
		this.selectedTabIndex = this.tabs.length - 1;
		window.setTimeout(() => {
			// 追加時＋タブが消えないように、
			// 一度追加を選択しスクロールしたあとに、
			// 追加したタブを選択する

			// 追加タブ選択
			this.selectedTabIndex = this.tabs.length - 2;
		});
	}

	/**
	 * オブジェクト名とツールチップを取得する.
	 * @param text 対象文字列
	 * @return オブジェクト名とツールチップ
	 */
	private getTabNameAndTooltip(text: string): any {
		if (text.length > TAB_MAX_STR_LENGTH) {
			return {
				tooltip: text,
				objName: text.substr(0, TAB_MAX_STR_LENGTH) + '...'
			}
		}
		return {
			tooltip: '',
			objName: text
		}
	}
}
