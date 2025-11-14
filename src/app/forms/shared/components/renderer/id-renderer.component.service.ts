import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';

import { EIMFormDTO } from 'app/shared/dtos/form.dto';

/**
 * IDレンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMIdRendererComponentService {
	
	/** IDクリックイベントエミッタ */
	@Output() public idClicked: EventEmitter<any>;
	
	constructor(
	) {
		this.idClicked = new EventEmitter<any>();
	}
	
	public clicked(form: EIMFormDTO): void {
		if (this.idClicked) {
			this.idClicked.emit(form);
		}
	}
	
}
