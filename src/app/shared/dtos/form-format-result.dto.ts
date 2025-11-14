import { Injector } from "@angular/core";
import { EIMSimpleObjectDTO } from "./simple-object.dto";
import { EIMDomainService } from "../services/domain.service";
import { EIMJsonConvertibleDTO } from "./json-convertible.dto";

/**
 * フォーム形式の簡易結果DTO
 */
export class EIMFormFormatResultDTO extends EIMJsonConvertibleDTO {

	/** DTO */
	public dto: any = null;

	/** 付加情報 */
	public info: any = null;

	/**
	 * コンストラクタです.
	 * @param json JSON
	 */
	constructor(json?: any) {
		super(json);

		if (!json) {
			return;
		}

		const injector = Injector.create({providers: [{provide: EIMDomainService, deps: []}]});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.dto = new EIMSimpleObjectDTO(json.dto);
		this.info = json.info;
	}
}
