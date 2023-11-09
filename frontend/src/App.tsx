import "./App.css";
import { Game } from "./components/Game.tsx";
import { ConnectionMode, useAppContext } from "./context/AppContext.tsx";
import { ChooseModeScreen } from "./screens/ChooseModeScreen.tsx";
import { JoinScreen } from "./screens/JoinScreen/JoinScreen.tsx";
import { HostScreen } from "./screens/HostScreen/HostScreen.tsx";

const App = () => {
  const { mode, hosted } = useAppContext();

  if (mode === ConnectionMode.NOT_SELECTED) {
    return <ChooseModeScreen />;
  }

  if (mode === ConnectionMode.JOIN) {
    return <JoinScreen />;
  }

  if (mode === ConnectionMode.HOST && !hosted) {
    return <HostScreen />;
  }

  return <Game />;
};
export default App;
