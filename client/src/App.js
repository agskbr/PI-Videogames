import "./App.css";
import { Route } from "react-router-dom";
import LandingPage from "./views/LandingPage/LandingPage";
import HomePage from "./views/HomePage/HomePage";
import DetailPage from "./views/DetailPage/DetailPage.jsx";
import CreateGamePage from "./views/CreateGamePage/CreateGamePage";
function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LandingPage} />
      <Route path="/home" component={HomePage} />

      <Route
        path="/videogame/detail/:gameId"
        render={(routeProps) => (
          <DetailPage
            state={routeProps.location.state}
            gameId={routeProps.match.params.gameId}
          />
        )}
      />
      <Route path="/videogame/create" component={CreateGamePage} />
    </div>
  );
}

export default App;
