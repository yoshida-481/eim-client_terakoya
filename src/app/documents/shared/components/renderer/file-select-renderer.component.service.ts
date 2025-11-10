import { Injectable } from '@angular/core';

/**
 * ファイル選択コンポーネントサービス.
 */
@Injectable()
export class EIMFileSelectRendererComponentService {

	/** 活性状態判定関数 */
	private activeTarget: (data: any) => boolean;

	/**
	 * コンストラクタ.
	 */
	constructor(
	) {

	}

	/**
	 * 活性状態判定.
	 * @param data グリッド行データ
	 */
	public isActive(data: any): boolean {
		return this.activeTarget(data);
	}

	/**
	 * 活性状態判定関数を設定します.
	 * @param target 活性状態判定関数
	 */
	public setActiveTarget(target: (data: any) => boolean): void {
		this.activeTarget = target;
	}

}
