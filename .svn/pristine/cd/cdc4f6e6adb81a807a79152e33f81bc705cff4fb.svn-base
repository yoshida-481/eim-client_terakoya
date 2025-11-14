import { Injector, StaticProvider } from '@angular/core';

import { EIMDomainService } from 'app/shared/services/domain.service';
import { EIMStatusTypeDomain } from 'app/admins/shared/domains/status-type.domain';
import { EIMEventTypeDomain } from 'app/admins/shared/domains/event-type.domain';
import { EIMPublishSettingDomain } from 'app/admins/shared/domains/publish-setting.domain';

/**
 * ワークフロードメイン
 */
export class EIMWorkflowDomain {

	/** ワークフローID */
	public id = 0;

	/** ワークフロー名 */
	public name: string = null;

	/** 使用可能言語リスト */
	public nameList: any = {};

	/** 上長承認 */
	public defBossApproval = 'necessary';

	/** メール通知方法のデフォルト設定 */
	public defNotifyMail = '';

	/** 承認依頼先のデフォルト設定 */
	public defApproveRequest = false;

	/** 公開通知先のデフォルト設定 */
	public publishNotifyMail = false;

	/** 処理待ちポップアップ */
	public processWaitPopup = false;

	/** 差戻し・取消メール通知 */
	public backMail = false;

	/** OCRのデフォルト設定 */
	public defOcr = false;

	/** 公開処理設定 */
	public publishSettingInfo: EIMPublishSettingDomain = new EIMPublishSettingDomain();

	/** 公開通知先設定 */
	public publishNotifyList: any[] = [];

	/** ネームスペース */
	public namespace = '';

	/** ステータスタイプリスト */
	public statusTypeList: EIMStatusTypeDomain[] = [];

	/** イベントタイプタイプリスト */
	public eventTypeList: EIMEventTypeDomain[] = [];

	/** 親ワークフローID */
	public parentId: number;

	/**
	 * コンストラクタです.
	 */
	constructor(json?: any) {
		if (!json) {
			return;
		}

		const providers: StaticProvider[] = [{ provide: EIMDomainService, useClass: EIMDomainService }];
		const injector = Injector.create({providers});
		const domainService: EIMDomainService = injector.get(EIMDomainService);

		this.id = json.attr.id;
		this.name = json.attr.name;

		// 名前情報
		if (json.nameList && json.nameList.name) {
			for (let i = 0; i < json.nameList.name.length; i++) {
				let nameJson: any = json.nameList.name[i];
				if ( nameJson.attr ) {
					this.nameList[nameJson.attr.lang] = nameJson.attr.value;
				} else {
					this.nameList[nameJson.lang] = nameJson.lang.value;
				}
			}
		} else {
			this.nameList = json.nameList;
		}


		// 全般情報
		this.defBossApproval = (json.attr.defBossApproval) ? json.attr.defBossApproval : 'necessary';
		this.defNotifyMail = (json.attr.defNotifyMail) ? json.attr.defNotifyMail : '';
		this.defApproveRequest = (json.attr.defApproveRequest === '1') ? true : false;
		this.publishNotifyMail = (json.attr.publishNotifyMail === '1') ? true : false;
		this.processWaitPopup = (json.attr.processWaitPopup === '1') ? true : false;
		this.backMail = (json.attr.backMail === '1') ? true : false;
		this.defOcr = (json.attr.defOcr === '1') ? true : false;
		this.namespace = json.attr.namespace;

		// 公開設定情報
		let publishFileInfo = json.pdfsignature;
		if ( publishFileInfo && 0 !== Object.keys(publishFileInfo).length ) {
			this.publishSettingInfo = new EIMPublishSettingDomain(json.pdfsignature);
		}

		/** 公開通知先設定情報取得 */
		if ( json.publishNotifyList && json.publishNotifyList.asEntry ) {
			let pnl = json.publishNotifyList.asEntry;
			if ( pnl.length ) {
				for ( let i = 0; i < pnl.length; i++ ) {
					this.publishNotifyList.push({
						entryId: pnl[i].attr.id,
						entryType: pnl[i].attr.type,
						entryName: pnl[i].attr.name,
					});
				}
			} else {
				pnl = json.publishNotifyList.asEntry.attr;
				if ( pnl && 0 !== Object.keys(pnl).length ) {
					this.publishNotifyList.push({
						entryId: pnl.id,
						entryType: pnl.type,
						entryName: pnl.name,
					});
				}
			}
		}


		// ステータスタイプ情報
		this.statusTypeList = domainService.createObjectList(json.statusTypeList.statusType,
				(_json: any) => {
					return new EIMStatusTypeDomain(_json);
				});

		// イベントタイプ情報
		this.eventTypeList = domainService.createObjectList(json.eventTypeList.eventType,
				(_json: any) => {
					return new EIMEventTypeDomain(_json);
				});

		this.addInfo(this.statusTypeList, this.eventTypeList );

	}

	/**
	 * ステータスタイプ情報にイベントリストを追加する（外部用）。
	 */
	public selfAddInfo(): void {
		this.addInfo(this.statusTypeList, this.eventTypeList );
	}

	/**
	 * ステータスタイプ情報にイベントリストを追加する。
	 * @param statusList ステータスタイプ情報リスト
	 * @param eventList イベントリスト
	 */
	private addInfo( statusList: EIMStatusTypeDomain[], eventList: EIMEventTypeDomain[] ): void {

		if ( !statusList || statusList.length === 0 ) {
			return;
		}

		// ステータスタイプ情報にイベントリストを追加する。
		for ( let i = 0; i < statusList.length; i++ ) {
			let status = statusList[i];
			status.eventList = [];
			if ( !eventList || eventList.length === 0 ) {
				return;
			}
			for ( let n = 0; n < eventList.length; n++ ) {
				if ( statusList[i].seq  === eventList[n].fromStatusTypeSequence ) {
					statusList[i].eventList.push({
						id: eventList[n].id,
						label: eventList[n].name,
						skipFlag: eventList[n].skipFlag,
						guardConditionId: eventList[n].guardConditionId,
						baseEventTypeId: eventList[n].baseEventTypeId,
						sequence: eventList[n].sequence,
						fromStatusTypeSequence: eventList[n].fromStatusTypeSequence,
						toStatusTypeSequence: eventList[n].toStatusTypeSequence
						});
				}
			}
		}

		// イベント情報にステータスタイプIDを追加する。
		if ( !eventList || eventList.length === 0 ) {
			return;
		}
		for ( let i = 0; i < eventList.length; i++ ) {
			// 開始ステータスタイプIDの取得設定
			let fromStatusTypeSequence = eventList[i].fromStatusTypeSequence;
			if ( statusList[ fromStatusTypeSequence - 1] ) {
				eventList[i].fromStatusTypeId = statusList[ fromStatusTypeSequence - 1].id;
			}
			// 終了ステータスタイプIDの取得設定
			let toStatusTypeSequence = eventList[i].toStatusTypeSequence;
			if ( statusList[ toStatusTypeSequence - 1 ] ) {
				eventList[i].toStatusTypeId = statusList[ toStatusTypeSequence - 1 ].id;
			}

		}

	}
}
