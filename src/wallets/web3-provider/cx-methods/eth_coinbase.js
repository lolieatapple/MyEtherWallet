/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
import {
  WEB3_RECEIVE_ACC
  // WEB3_GET_CURRENT_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  const id = window.extensionID;
  const callerUrl = window.location.hostname;
  const event = new CustomEvent(WEB3_GET_ACC.replace('{{id}}', id), {
    detail: {
      from: callerUrl
    }
  });
  window.dispatchEvent(event);
  window.addEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), eventRes => {
    res(null, toPayload(payload.id, [eventRes.detail.account]));
    window.removeEventListener(
      WEB3_RECEIVE_ACC.replace('{{id}}', id),
      () => {}
    );
    window.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  });

  window.addEventListener(WEB3_REJECT.replace('{{id}}', id), () => {
    res(null, toPayload(payload.id, new Error('User cancelled request!')));
    window.removeEventListener(
      WEB3_RECEIVE_ACC.replace('{{id}}', id),
      () => {}
    );
    window.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  });
};
