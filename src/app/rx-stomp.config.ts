import { InjectableRxStompConfig } from "@stomp/ng2-stompjs";
import * as SockJS from "sockjs-client";
import { GlobalConfig } from "./global";

export const rxStompConfig: InjectableRxStompConfig = {
  // Which server?
  brokerURL: GlobalConfig.SOCKET_URL + "/notifications",

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    sessionKey: GlobalConfig.BASE_AUTH_USER,
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 40000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 10000,

  webSocketFactory: () => {
    return new SockJS(GlobalConfig.SOCKET_URL + "/notifications");
  },

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    // console.log(new Date(), msg);
  },
};
