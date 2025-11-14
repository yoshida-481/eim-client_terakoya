import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { EIMContentsNameRenameGeneralPipe } from 'app/documents/shared/pipes/contents-name-rename-general.pipe';

/**
 * ドキュメントタイプ選択レンダラーコンポーネントサービス
 */
@Injectable()
export class EIMDocumentTypeChangeRendererComponentService {

	/** 活性状態判定関数 */
	private activeTarget: (data: any) => boolean;

	/**
	 * コンストラクタ.
	 */
	constructor(
			protected translateService: TranslateService,
			protected contentsNameRenameGeneralPipe: EIMContentsNameRenameGeneralPipe,
	) {

	}

	/**
	 * ラベルを取得する
	 * @param data データ
	 * @return ラベル
	 */
	public getLabel(data: any): string {
		let label: string;
		label = this.contentsNameRenameGeneralPipe.transform(data.objTypeName);
		return label;
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
