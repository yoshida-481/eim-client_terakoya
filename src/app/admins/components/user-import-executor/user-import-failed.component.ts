import { EIMComponent } from 'app/shared/shared.interface';
import { Component, forwardRef, Input } from '@angular/core';

/**
 * ユーザインポート失敗コンポーネント
 * @example
 *      <eim-user-import-failed
 *          [errorMessage]="errorMessage">
 *      </eim-user-import-failed>
 */
@Component({
    selector: 'eim-user-import-failed',
    templateUrl: './user-import-failed.component.html',
    styleUrls: ['./user-import-failed.component.css'],
    providers: [
        { provide: EIMComponent, useExisting: forwardRef(() => EIMUserImportFailedComponent) }
    ],
    standalone: false
})

export class EIMUserImportFailedComponent {
	/** エラーメッセージ */
	@Input() errorMessage: string;

	/**
	 * コンストラクタです.
	 */
	constructor() {
	}
}
