import { EventEmitter, Output, Directive } from '@angular/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * ページレンダラーコンポーネントサービス
 */
@Directive()
@Injectable()
export class EIMPageRendererComponentService {

	/** ページクリックイベントエミッタ */
	@Output() pageClicked: EventEmitter<any> = new EventEmitter<any>();
	
	/**
	 * コンストラクタです.
	 */
	constructor(
		protected translateService: TranslateService,

	) {

	}

	/**
	 * ページ押下時処理.
	 * @param params 
	 */
	 public onClickPage(params: any, page:any): void {

		params.data["page"] = page;
		this.pageClicked.emit(params.data);
	}
}
