import { useEffect, useRef, useState } from "react";
import GameState from "./classes/GameState/GameState.ts";
import "./App.css";
import PlayerInput from "./classes/PlayerInput/PlayerInput.ts";
import { useSocket } from "./context/socketContext.tsx";

const App = () => {
  const { socket } = useSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>();

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.height = window.innerHeight;
      canvasRef.current.width = window.innerWidth;
      setGameState(new GameState({ canvasRef: canvasRef.current, playerInput: new PlayerInput(), socket }));
    }
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    const startGameLoop = () => {
      gameState?.tick();

      requestAnimationFrame(startGameLoop);
    };

    const frameId = requestAnimationFrame(startGameLoop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [gameState]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
export default App;
