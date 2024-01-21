import "./App.css";
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
  console.log(mode, hosted);
  if (mode === ConnectionMode.HOST && !hosted) {
    return <HostScreen />;
  }

  return "FUCKUP";

  // return <Game />;
};
export default App;
