import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { finalize } from "rxjs/operators";

/**
 * Boxオブジェクトドメイン
 */
export class EIMBoxObjectDomain {
	/** ID */
	public id: String;
	/** タイプ */
	public type: string;
	/** 名前 */
	public name: string;
	/** 更新者名 */
	public modificationUser?: string;
	/** 更新日時 */
	public modificationDate?: Date;
	/** 説明 */
	public property?: string;
	/** パスリスト */
	public pathList?: EIMBoxObjectDomain[];
	/** ファイルサイズ */
	public size: number;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json: any) {
		this.id = json.id;
		this.type = json.type;
		this.name = json.name;
		this.size = json.size;
		if (json.modificationUser) { this.modificationUser = json.modificationUser; }
		if (json.modificationDate) { this.modificationDate = json.modificationDate; }
		if (json.property) { this.property = json.property; }

		if (json.pathList) {
			const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
			const injector = Injector.create({providers});
			const domainService: EIMDomainService = injector.get(EIMDomainService);

			this.pathList = domainService.createObjectList(json.pathList,
				(path) => new EIMBoxObjectDomain(path));
		}
	}
}
