import { EIMDomainService } from 'app/shared/services/domain.service';

import { EIMAttributeTypeLayoutDomain } from 'app/shared/domains/attribute-type-layout.domain';

/**
 * コンテンツ属性タイプレイアウトドメイン
 * @class EIMAttributeTypeLayoutDomain
 * @module EIMSharedModule
 * @constructor
 */
export class EIMContentsAttributeTypeLayoutDomain extends EIMAttributeTypeLayoutDomain {

	/** リビジョンアップ引継ぎフラグ(true:引継ぎ対象) */
	public inheritanceFlag = false;

	/** 最新リビジョン関連付けフラグ(true:関連付け対象) */
	public relationFlag = false;

	/** 下位引継ぎ属性フラグ(true:引継ぎ属性) */
	public successionFlag = false;


	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		this.inheritanceFlag = json.inheritanceFlag;
		this.relationFlag = json.relationFlag;
		this.successionFlag = json.successionFlag;
	}
}
