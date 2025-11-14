import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMHierarchicalDomainService } from 'app/shared/services/hierarchical-domain.service';
import { EIMListComponent, EIMListComponentService, EIMListComponentInfo } from 'app/shared/shared.interface';
import { EIMTreeComponentService, EIMTreeNode } from 'app/shared/components/tree/tree.component.service';
import { EIMHierarchicalContentsService, EIMHierarchicalContents } from 'app/admins/shared/services/apis/hierarchical-contents.service';
import { EIMAdminsConstantService } from 'app/admins/shared/services/admins-constant.service';
import { EIMClassTreeComponentService } from 'app/admins/components/class-tree/class-tree.component.service';


/**
 * コンテンツツリーコンポーネントサービス.
 */
@Injectable()
export class EIMFormClassTreeComponentService extends EIMClassTreeComponentService {

	constructor(
			protected hierarchicalDomainService: EIMHierarchicalDomainService,
			protected hierarchicalContentsService: EIMHierarchicalContentsService
	) {
		super(hierarchicalDomainService, hierarchicalContentsService);
	}

	// ----------------------------------------
	// イベントハンドラ
	// ----------------------------------------

	// ----------------------------------------
	// 非公開メソッド
	// ----------------------------------------
	/**
	 * アイコンを取得する
	 * @param node ツリーノード
	 * @return アイコンクラス文字列
	 */
	protected getIcon(node): string {
		return 'eim-icon-type';
	}

}
