import { MessagesOneWay } from "../../chrome-api/messages";
import { BasicColorLogger } from "../../utils/assorted-vanillajs/logging";

export const logChannel = new MessagesOneWay<
  {
    message: any;
    sender: "popup" | "offscreen";
  },
  undefined
>("logChannel");

export function logToBackground(sender: "popup" | "offscreen", message: any) {
  console.log(`in ${sender}:`, message);
  logChannel.sendP2P({
    message,
    sender,
  });
}

// define static methods here
export class MessageHandler {
  static onLogToBackground() {
    logChannel.listen(({ message, sender }) => {
      BasicColorLogger.info(`from ${sender}:`);
      BasicColorLogger.info(`---`.repeat(10));
      console.log(message);
      BasicColorLogger.info(`---`.repeat(10));
    });
  }
}
