import {Navbar, Container, Nav} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Purchases from "./charts/purchases";
import CoronaMap from "./charts/corona-map";
import CoronaLine from './charts/corona-line';

function App() {
    
    return (
    <div>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">D3JS project</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link href="/purchases">Purchases</Nav.Link>
                    <Nav.Link href="/corona/map">Corona Map</Nav.Link>
                    <Nav.Link href="/corona/line">Corona Line Chart</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Router>
            <Switch>
                <Route path="/corona/map">
                    <CoronaMap/>
                </Route>
                <Route path="/corona/line">
                    <CoronaLine/>
                </Route>
                <Route path="/business/purchases">
                    <Purchases/>
                </Route>
                <Route path="/">
                    <Purchases/>
                </Route>
            </Switch>
        </Router>
    </div>)
}


export default App;