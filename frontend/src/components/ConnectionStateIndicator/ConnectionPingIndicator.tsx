import { FC } from "react";
import styles from "./ConnectionStateIndicator.module.scss";
import { clsx } from "clsx";
import { useSocket } from "../../context/WebSocketContext.tsx";

export const ConnectionPingIndicator: FC = () => {
  const { ping } = useSocket();
  const pingClass = getConnectionClassNameBasedOnPing(ping);
  return <div className={clsx(styles.indicator, { [styles[pingClass]]: true })}>{ping}ms</div>;
};

const getConnectionClassNameBasedOnPing = (ping: number): "good" | "average" | "bad" => {
  if (ping < 50) return "good";
  if (ping < 80) return "average";
  return "bad";
};
