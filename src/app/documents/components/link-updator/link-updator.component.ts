import { Component, forwardRef, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EIMComponent, EIMUpdatable } from 'app/shared/shared.interface';

import { EIMDialogManagerComponentService } from 'app/documents/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMDocumentFormService } from 'app/documents/shared/services/apis/document-form.service';

/**
 * リンク設定コンポーネント
 * @example
 *      <eim-link-updator
 *          [objId]="objId"
 *          [parentObjId]="parentObjId"
 *          [isDocumentLink]="isDocumentLink">
 *      </eim-link-updator>
 */
@Component({
    selector: 'eim-link-updator',
    templateUrl: './link-updator.component.html',
    styleUrls: ['./link-updator.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMLinkUpdatoComponent) }
    ],
    standalone: false
})
export class EIMLinkUpdatoComponent implements OnInit, EIMUpdatable {
	/** オブジェクトID. */
	@Input() public objId: number;

	/** 親オブジェクトID. */
	@Input() public parentObjId: number;

	/** 文字列型true */
	private readonly FLAG_TRUE = 'true';

	/** 文字列型false */
	private readonly FLAG_FALSE = 'false';

	/** ドキュメントリングフラグ. */
	@Input() public isDocumentLink = this.FLAG_FALSE;

	/** エラー発生時のイベントエミッタ. */
	@Output() errored: EventEmitter<null> = new EventEmitter<null>();

	/** 更新完了時のイベントエミッタ. */
	@Output() updated: EventEmitter<any> = new EventEmitter<any>();

	/** ドキュメントリンク更新タイミング. */
	public documentLinkUpdateTiming = '';

	/** 更新フラグ. */
	public updatableFlg = false;

	/** 変更前更新タイミング. */
	public defaultTiming = '';

	/**
	 * コンストラクタです.
	 */
	constructor(
			protected documentFormService: EIMDocumentFormService
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------

	/**
	 * コンテンツ情報を更新します.
	 */
	public update(): void {
		if (this.isDocumentLink === this.FLAG_FALSE) {
			this.parentObjId = 0;
		}
		// 完了イベントを通知(画面が閉じる)
		this.updated.emit({objId: this.objId, parentObjId: this.parentObjId, isDocumentLink: this.isDocumentLink, documentLinkUpdateTiming: this.documentLinkUpdateTiming});
	}

	/**
	 * コンテンツ情報更新可否を返却します.
	 * @return コンテンツ情報更新可否
	 */
	public updatable(): boolean {
		if (this.defaultTiming === this.documentLinkUpdateTiming) {
			return false;
		}
		return this.updatableFlg;
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------
	/**
	 * 入力値初期化後のイベントハンドラです.
	 */
	ngOnInit(): void {
		this.show();
	}

	/**
	 * 入力内容変更イベントハンドラ.
	 * @param event イベント
	 */
	onChange() {
		this.updatableFlg = true;
	}

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * 画面を表示します
	 */
	private show(): void {
		if (this.isDocumentLink === this.FLAG_TRUE) {
			this.documentFormService.getObjectLinkSettings(this.objId, this.parentObjId, this.isDocumentLink)
			.subscribe((object: any) => {
				this.documentLinkUpdateTiming = object.documentLinkUpdateTiming;
				this.defaultTiming = object.documentLinkUpdateTiming;
			}, (err: any) => {
				// エラーの場合、画面を閉じる
				window.setTimeout(() => {
					this.errored.emit();
				});
			});
		}
	}
}
