import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMUserDTO } from 'app/shared/dtos/user.dto';

/**
 * ユーザDTO
 */
export class EIMEntryUserDTO extends EIMUserDTO {

	/** 上長フラグ */
	public isBoss = false;

	constructor(json?: any) {
        super(json);
        if (!json) {
    			return;
    		}
        this.isBoss = json.isBoss == true ? true : false;
	}
	/**
	 * ユーザDTOコピー貼り付け用.
	 * @ return EIMEntryUserDTO
	 */
	public makeEntryUserClone(): EIMEntryUserDTO {
		let cloneEntryUserDTO = new EIMEntryUserDTO;
		cloneEntryUserDTO.name = this.name;
		cloneEntryUserDTO.id = this.id;
		cloneEntryUserDTO.kana = this.kana;
		cloneEntryUserDTO.code = this.code;
		cloneEntryUserDTO.mail = this.mail;
		cloneEntryUserDTO.groupNames = this.groupNames;
		cloneEntryUserDTO.roleNames = this.roleNames;
		cloneEntryUserDTO.admin = this.admin;
		cloneEntryUserDTO.disable = this.disable;
		cloneEntryUserDTO.lang = this.lang;
		cloneEntryUserDTO.config = this.config;
		return cloneEntryUserDTO
	}
}
