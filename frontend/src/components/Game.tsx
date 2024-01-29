import { FC } from "react";

export type GameProps = {};
export const Game: FC<GameProps> = () => {
  return null;
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [gameState, setGameState] = useState<GameState>();
  // const {client} = useSocket();
  //
  // useEffect(() => {
  //   if (canvasRef.current)
  //     canvasRef.current.height = window.innerHeight;
  //     canvasRef.current.width = window.innerWidth;
  //     setGameState(new GameState({ canvasRef: canvasRef.current, playerInput: new PlayerInput(), client: client }));
  //   }
  // }, []);
  //
  // useEffect(() => {
  //   const startGameLoop = () => {
  //     gameState?.tick();
  //
  //     requestAnimationFrame(startGameLoop);
  //   };
  //
  //   const frameId = requestAnimationFrame(startGameLoop);
  //
  //   return () => {
  //     cancelAnimationFrame(frameId);
  //   };
  // }, [gameState]);
  // return <div>{/*<canvas ref={canvasRef} />*/}</div>;
};
