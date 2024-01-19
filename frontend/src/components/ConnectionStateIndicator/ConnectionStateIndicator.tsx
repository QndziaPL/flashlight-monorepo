import { FC } from "react";
import styles from "./ConnectionStateIndicator.module.scss";
import { clsx } from "clsx";

export type ConnectionStateIndicatorProps = {
  state: WebSocket["readyState"];
};
export const ConnectionStateIndicator: FC<ConnectionStateIndicatorProps> = ({ state }) => (
  <div className={clsx(styles.indicator, { [styles.connected]: state === WebSocket.OPEN })}></div>
);
