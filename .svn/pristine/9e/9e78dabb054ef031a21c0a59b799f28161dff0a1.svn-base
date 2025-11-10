import { EIMSimpleObjectDTO } from "../dtos/simple-object.dto";
import { EIMValueTypeEnumeration } from "../enumerations/value-type-enumeration";
import { EIMAttributeDomain } from "../domains/entity/attribute.domain";
import { EIMObjectDomain } from "../domains/entity/object.domain";

/**
 * オブジェクトDTOからツリーノード情報へのコンバータ
 */
export class EIMObjectDtoToObjectDomainConverter {

	/**
	 * EIMObjectDomainに変換します.
	 */
	public static convert(objectDTO: EIMSimpleObjectDTO): EIMObjectDomain {
		let object = new EIMObjectDomain();

		object.id = objectDTO.id;
		object.name = objectDTO.name;
		object.type = objectDTO.type;
		object.revision = Number(objectDTO.revision);
		object.latest = Boolean(objectDTO.latest);
		object.creationUser = objectDTO.creationUser;
		object.creationDate = new Date(objectDTO.creationDate);
		object.modificationUser = objectDTO.modificationUser;
		object.modificationDate = new Date(objectDTO.modificationDate);
		object.lockUser = objectDTO.lockUser;
		object.lockDate = objectDTO.lockDate ? new Date(objectDTO.lockDate): null;
		object.status = objectDTO.status;
		object.security = objectDTO.security;

		object.attributeList = [];
		for (let attrTypeDefName in objectDTO.attributeMap) {

			let attrValue: {valueType: EIMValueTypeEnumeration, values: any[]} = objectDTO.attributeMap[attrTypeDefName];

			let attribute = new EIMAttributeDomain();
			switch (attrValue.valueType) {
				case EIMValueTypeEnumeration.LONG:
					attribute.longList = attrValue.values;
					break;
				case EIMValueTypeEnumeration.STRING:
					attribute.stringList = attrValue.values;
					break;
			}

		}
		return object;
	}

}