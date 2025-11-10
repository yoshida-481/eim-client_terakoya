import { EIMHierarchicalDomain } from 'app/shared/shared.interface';
import { EIMObjectTypeDomain } from 'app/shared/domains/entity/object-type.domain';

/**
 * 階層オブジェクトタイプドメイン
 */
export class EIMHierarchicalObjectTypeDomain extends EIMObjectTypeDomain implements EIMHierarchicalDomain {
	public children?: EIMHierarchicalObjectTypeDomain[];
}
