import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { EIMObjectDTO } from 'app/object-editors/shared/dtos/object.dto';
import { EIMObjectEditorDialogManagerComponentService } from 'app/object-editors/shared/components/dialog-manager/dialog-manager.component.service';
import { EIMObjectDomain } from 'app/shared/domains/entity/object.domain';
/**
 * オブジェクトリストコンポーネントサービス.
 */
@Directive()
@Injectable()
export class EIMObjectListComponentService {

	/** リレーション正展開押下イベントエミッタ */
	@Output() clickedExpandRelation: EventEmitter<EIMObjectDTO> = new EventEmitter<EIMObjectDTO>();
	/** リレーション逆展開押下イベントエミッタ */
	@Output() clickedReverseExpandRelation: EventEmitter<EIMObjectDTO> = new EventEmitter<EIMObjectDTO>();
	/** リビジョン一覧押下イベントエミッタ */
	@Output() clickedRevisionList: EventEmitter<EIMObjectDTO> = new EventEmitter<EIMObjectDTO>();
	/** オブジェクト登録完了イベントエミッタ */
	@Output() createdObject: EventEmitter<EIMObjectDomain> = new EventEmitter<EIMObjectDomain>();
	/** オブジェクト更新完了イベントエミッタ */
	@Output() updatedObject: EventEmitter<EIMObjectDomain> = new EventEmitter<EIMObjectDomain>();
	/** オブジェクト登録完了イベントエミッタ */
	@Output() assignUpdator: EventEmitter<EIMObjectDTO> = new EventEmitter<EIMObjectDTO>();
	/** 表示タブクローズイベントエミッタ */
	@Output() closeSelectedTab: EventEmitter<EIMObjectDTO> = new EventEmitter<EIMObjectDTO>();

	/** リレーション登録表示中フラグ */
	public relationCreatorShow = false;

	/**
	 * コンストラクタです.
	 */
	constructor(
		protected objectEditorDialogManagerComponentService: EIMObjectEditorDialogManagerComponentService,
	) {
	}

	// ----------------------------------------
	// 公開メソッド
	// ----------------------------------------
	/**
	 * リレーション正展開タブを表示します.
	 * イベントを発火してメイン画面でタブを表示します.
	 * @param object 選択したオブジェクト
	 */
	public showExpandRelation(object: EIMObjectDTO): void {
		this.clickedExpandRelation.emit(object);
	}

	/**
	 * リレーション逆展開タブを表示します.
	 * イベントを発火してメイン画面でタブを表示します.
	 * @param object 選択したオブジェクト
	 */
	public showReverseExpandRelation(object: EIMObjectDTO): void {
		this.clickedReverseExpandRelation.emit(object);
	}

	/**
	 * オブジェクト属性を表示します.
	 * @param object 選択したオブジェクト
	 */
	public showObjectAttributeUpdator(object: EIMObjectDTO): void {
		let dialogId: string = this.objectEditorDialogManagerComponentService.showObjectUpdator(object.id, {
			updated: (newObject: EIMObjectDomain) => {
				this.showUpdatedObject(newObject);
				this.objectEditorDialogManagerComponentService.close(dialogId);
			},
			errored: () => {
				this.objectEditorDialogManagerComponentService.close(dialogId);
			},
		});
	}

	/**
	 * リビジョン一覧タブを表示します.
	 * イベントを発火してメイン画面でタブを表示します.
	 * @param object 選択したオブジェクト
	 */
	public showRevisionList(object: EIMObjectDTO): void {
		this.clickedRevisionList.emit(object);
	}

	/**
	 * オブジェクト登録完了タブを表示します.
	 * イベントを発火してメイン画面でタブを表示します.
	 * @param object 選択したオブジェクト
	 */
	public showCreatedObject(object: EIMObjectDomain): void {
		this.createdObject.emit(object);
	}

	/**
	 * オブジェクト更新完了タブを表示します.
	 * イベントを発火してメイン画面でタブを表示します.
	 * @param object 選択したオブジェクト
	 */
	public showUpdatedObject(object: EIMObjectDomain): void {
		this.updatedObject.emit(object);
	}

	/**
	 * 表示中のタブをクロ－ズします.
	 * イベントを発火してメイン画面でタブをクロ－ズします.
	 */
	public closeSelectedTabEmit(): void {
		this.closeSelectedTab.emit();
	}


}
