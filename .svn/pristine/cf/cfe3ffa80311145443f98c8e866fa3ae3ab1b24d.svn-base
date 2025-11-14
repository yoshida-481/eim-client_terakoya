import { Injectable,EventEmitter } from "@angular/core";
import { EIMUserDomain } from 'app/shared/domains/entity/user.domain';

/**
 * ユーザセッションサービス
 */
@Injectable()
export class EIMUserSessionService {

    /**ユーザセッション取得後のイベントエミッタ */
    afterUserSessionGot = new EventEmitter<EIMUserDomain>();

    doGetUserSession(user:any): void {
        this.afterUserSessionGot.emit(user);
    }
}