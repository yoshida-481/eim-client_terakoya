import { Injectable, Output, Directive } from '@angular/core';
import { EventEmitter } from '@angular/core';

/**
 * リロードサービス
 */
@Directive()
@Injectable()
export class EIMReloadService {
	/** リロードイベントエミッタ */
	@Output() reload: EventEmitter<any>;

	/** リロードイベントエミッタ */
	@Output() disabled: EventEmitter<boolean>;

	constructor() {
		this.reload = new EventEmitter<any>();
		this.disabled = new EventEmitter<boolean>();
	}

	public doReload(): void {
		this.reload.emit();
	}

	public doDisable(disabled: boolean): void {
		this.disabled.emit(disabled);
	}

}
