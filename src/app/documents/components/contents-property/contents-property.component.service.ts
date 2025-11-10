import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * プロパティコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMContentsPropertyComponentService {

	/** 対象にジャンプイベントエミッタ */
	@Output() jumpTargetClicked: EventEmitter<any>;

	/** 更新完了エミッタ */
	@Output() updated: EventEmitter<any>;

	constructor(
	) {
		this.jumpTargetClicked = new EventEmitter<any>();
		this.updated = new EventEmitter<any>();
	}

	/**
	 * 対象にジャンプイベントエミッタをエミットします.
	 * @param objId オブジェクトID
	 */
	public jumpTargetClickedEmit(data: any): void {
		if (this.jumpTargetClicked) {
			this.jumpTargetClicked.emit(data);
		}
	}

	/**
	 * 更新完了エミッタをエミットします.
	 * @param objId オブジェクトID
	 */
	public updatedEmit(data: any): void {
		if (this.updated) {
			this.updated.emit(data);
		}
	}
}
