import {Navbar, Container, Nav} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Purchases from "./charts/purchases";
import Corona from "./charts/corona";

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
                    <Nav.Link href="/corona">Corona</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Router>
            <Switch>
                <Route path="/corona">
                    <Corona/>
                </Route>
                <Route path="/purchases">
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