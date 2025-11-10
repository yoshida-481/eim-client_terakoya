import { EIMObjectTypeTreeMultipleSelectorComponentSerivce } from 'app/documents/components/object-type-tree-selector/object-type-tree-multiple-selector.component.service';
import { Component, ViewChildren, OnInit, SimpleChanges, Input, EventEmitter, Output, QueryList, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMDialogComponent } from 'app/shared/components/dialog/dialog.component';
import { EIMDialogManagerComponentService, EIMDialogManagerComponentInfo, dialogName } from './dialog-manager.component.service';

import { EIMAttributeTypeSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-selector.component.service';
import { EIMAttributeTypeMultipleSelectorComponentService } from 'app/documents/components/attribute-type-selector/attribute-type-multiple-selector.component.service';
import { EIMContentsMultipleSelectorComponentService } from 'app/documents/components/contents-selector/contents-multiple-selector.component.service';
import { EIMMultipleSelectorComponentService } from 'app/shared/components/multiple-selector/multiple-selector.component.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'eim-document-dialog-manager',
    templateUrl: './dialog-manager.component.html',
    styleUrls: ['./dialog-manager.component.css'],
    providers: [],
    standalone: false
})
export class EIMDialogManagerComponent implements AfterViewInit, OnChanges, OnDestroy {
	@ViewChildren(EIMDialogComponent)
		dialogs: QueryList<EIMDialogComponent>;

	public display: any[] = [];
	public data: any[] = [];
	public DialogName = dialogName;
	showHeader = true;

	/** ダイアログ表示状況変更サブスクリプション */
	protected changesSubscription: Subscription;

	/** ダイアログにコールバック関数を設定出来なかったインフォメーションのリスト */
	protected infoPool: EIMDialogManagerComponentInfo[] = [];

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translate: TranslateService,
		protected dialogManagerComponentService: EIMDialogManagerComponentService,
		protected attributeTypeSelectorComponentService: EIMAttributeTypeSelectorComponentService,
		protected attributeTypeMultipleSelectorComponentService: EIMAttributeTypeMultipleSelectorComponentService,
		protected approverMultipleSelectorComponentService: EIMMultipleSelectorComponentService,
		protected contentsMultipleSelectorComponentService: EIMContentsMultipleSelectorComponentService,
		protected objectTypeTreeMultipleSelectorComponentService: EIMObjectTypeTreeMultipleSelectorComponentSerivce,
	) {
		dialogManagerComponentService.show.subscribe((info: EIMDialogManagerComponentInfo) => {this.onShow(info); });
		dialogManagerComponentService.closed.subscribe((dialogId: string) => {this.onClose(dialogId); });
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 * onShowにてコールバック関数の紐づけができなかったダイアログに再度紐づけを行います.
	 */
	ngAfterViewInit() {
		this.changesSubscription = this.dialogs.changes.subscribe(_ => {
			for (let i = this.infoPool.length - 1; i >= 0; i--) {
				this.setCallbacks(this.infoPool[i]);
				// このタイミングでもコールバック関数を登録できない場合もプールから削除する
				this.infoPool.splice(i, 1);
			}
		});
	}

	/**
	 * 入力値変更後のイベントハンドラです.
	 */
	ngOnChanges() {
	}

	/**
	 * コンポーネント破棄前イベントハンドラです.
	 */
	ngOnDestroy(): void {
		if (!this.changesSubscription.closed) { this.changesSubscription.unsubscribe(); };
	}

	/**
	 * ダイアログ表示依頼通知のハンドラです.
	 * ダイアログを表示し、ダイアログマネージャインフォメーションのコールバック関数を紐づけます.
	 * @param this
	 * @param info ダイアログマネージャインフォメーション
	 */
	private onShow(this, info: EIMDialogManagerComponentInfo): void {
		this.data[info.name] = info.data;
		this.display[info.name] = true;

		window.setTimeout(() => {
			if (!this.setCallbacks(info)) {
				// ダイアログを開く起点となったイベントによって、ダイアログが表示される前に当関数が呼ばれることがある.(例 ダイアグラムの承認者選択ボタンクリック時)
				// 一旦プールし、ngAfterViewInit（表示状態が変わったタイミング）で再度コールバックを登録する.
				this.infoPool.push(info);
			}
		});
	}

	/**
	 * ダイアログ消去依頼通知のハンドラです.
	 * 該当ダイアログを閉じます.
	 * @param dialogId ダイアログID
	 */
	private onClose(dialogId: string): void {
		this.display[dialogId] = false;

		if (this.dialogs && this.dialogs.length > 0) {
			let targetDialog: EIMDialogComponent;
			for (let i = 0; i < this.dialogs.length; i++) {
				if (this.dialogs['_results'][i].name == dialogId) {
					targetDialog = this.dialogs['_results'][i];
					break;
				}
			}

			if (targetDialog && targetDialog.content['closed']) {
				targetDialog.content['closed'].emit();
			}
		}
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 表示したダイアログにダイアログマネージャインフォメーションのコールバック関数を登録します.
	 * @param info ダイアログマネージャインフォメーション
	 * @return コールバック関数を登録できた場合はtrue
	 */
	private setCallbacks(info: EIMDialogManagerComponentInfo): boolean {
		let targetDialog: EIMDialogComponent;
		for (let i = 0; i < this.dialogs.length; i++) {
			if (this.dialogs['_results'][i].name == info.name) {
				targetDialog = this.dialogs['_results'][i];
			}
		}

		if (!targetDialog) {
			return false;
		}

		if (targetDialog && info.callbacks) {
			for (let key in info.callbacks) {
				if (info.callbacks.hasOwnProperty(key)) {
					(<any>targetDialog.content)[key].subscribe((result) => info.callbacks[key](result));
				}
			}
		}
		if (targetDialog) {
			this.dialogManagerComponentService.dialogs[targetDialog.name] = targetDialog;
		}
		return true;
	}

}
