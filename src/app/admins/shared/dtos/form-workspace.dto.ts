import { Injector, StaticProvider } from '@angular/core';
import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMAdminDTO } from './admin.dto';
import { EIMFormTypeDTO } from 'app/shared/dtos/form-type.dto';
import { EIMFormWorkspaceSecurityDTO } from './form-workspace-security.dto';

/**
 * 帳票ワークスペースDTO
 */
export class EIMFormWorkspaceDTO implements EIMAdminDTO {

	/** ワークスペースID */
	public id: number;

	/** 言語リスト */
	public languageList: any = [];

	/** 下位セキュリティID */
	public lowerSuccessionSecId: number;

	/** ワークスペース名前 */
	public name: string;

	/** アイコンタイプ */
	public typeName = 'workspaceForm';

	/** 帳票タイプIDリスト */
	public formTypeIds: number[] = [];

	/** 帳票タイプIDリスト */
	public formTypeList: EIMFormTypeDTO[] = [];

	/** 帳票セキュリティ */
	public security: EIMFormWorkspaceSecurityDTO = null;

	/** 帳票タイプリスト */
	public children: EIMFormTypeDTO[] = null;

	/** アイコンタイプ */
	public typeLabel: string;

		/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {

		if (json) {
			const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
			const injector = Injector.create({providers});
			const domainService: EIMDomainService = injector.get(EIMDomainService);

			this.id = Number(json.id);

			this.name = json.name;
			this.typeLabel = this.name;

			this.security = json.security;
			this.languageList = json.languageList;

			if (json.formTypeList) {
				this.formTypeList = domainService.createObjectList(json.formTypeList, (childrenJson: any) => {return new EIMFormTypeDTO(childrenJson); });
			} else {
				this.formTypeList = [];
			}

			if (json.children) {
				this.children = domainService.createObjectList(json.children, (childrenJson: any) => {return new EIMFormTypeDTO(childrenJson); });
			} else {
				this.children = [];
			}

		}
	}
}
