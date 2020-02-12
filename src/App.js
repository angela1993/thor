import React from "react";
import "./App.css";
import Telo from "./Components/Telo/Telo";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import PopUpLogin from "./Components/LogIn/PopUpLogIn";
import "react-sticky-header/styles.css";
import StickyHeader from "react-sticky-header";
import PopUpKreirajNalog from "./Components/KreirajNalog/PopUpKreirajNalog";
import PopUpProfilKorisnika from "./Components/ProfilKorisnika/PopUpProfilKorisnika";
import DodajSalu from "C:/Users/Andjela/thor/src/Components/AdministratorskeAlatke/DodajSalu";
import NavDropdown from "react-bootstrap/NavDropdown";
import PregledDogadjaja from "./Components/AdministratorskeAlatke/PregledDogadjaja";
import PopUpKorisnici from "./Components/AdministratorskeAlatke/Korisnici/PopUpKorisnici";
import PopUpPosaljiObavestenje from "./Components/AdministratorskeAlatke/Obavestenje/PopUpPosaljiObavestenje";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolled: false,
      guest: false,
      administrator: true,
      refreshRepertoar: true
    };
    this.handleLogInClicked = this.handleLogInClicked.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.podesiStanje = this.podesiStanje.bind(this);
    this.refreshRepertoar=this.refreshRepertoar.bind(this);
    this.podesiStanje();
  }

  refreshRepertoar(){
    this.setState({refreshRepertoar:!this.state.refreshRepertoar});
  }

  podesiStanje() {
    fetch("./ThOr_php/proveriPrijavu.php")
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => {
        this.setState({
          guest: odgovor["Guest"],
          administrator: odgovor["Admin"]
        });
      })
      .catch(er => console.log(er));

  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }


  handleScroll() {
    let windowsScrollTop = window.scrollY;
    if (windowsScrollTop >= 50) {
      this.setState({ isScrolled: true });
    } else {
      this.setState({ isScrolled: false });
    }
  }
  handleLogInClicked(administrator) {
    let x = administrator;
    this.setState({
      guest: false,
      administrator: x
    });
  }

  handleLogOut() {
    fetch("./ThOr_php/odjava.php")
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return true;
      })
      .catch(er => console.log(er));

    this.setState({ guest: true, administrator: false });
  }

  nacrtajAlatke() {
    return (
      <NavDropdown title="Alati" id="dropDownAlatke" variant="dark">
        <DodajSalu />
        <PopUpKorisnici logOut={this.handleLogOut} />
        <PregledDogadjaja
          guest={this.state.guest}
          administrator={this.state.administrator}
          refreshRepertoar={this.refreshRepertoar}
          logOut={this.handleLogOut}
        />
        <PopUpPosaljiObavestenje logOut={this.handleLogOut} />
      </NavDropdown>
    );
  }

  render() {
    return (
      <div className="App">
        <StickyHeader
          header={
            <>
              <Navbar
                className={
                  this.state.isScrolled
                    ? "glavniNavbarScrolled"
                    : "glavniNavbar"
                }
                bg="dark"
                variant="dark"
                expand="md"
              >
                <Navbar.Brand href="#Home">
                  <i className="fas fa-theater-masks" />
                </Navbar.Brand>{" "}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link href="#Home">Početak</Nav.Link>
                    <Nav.Link href="#Repertoar">Reperotar</Nav.Link>
                    <Nav.Link href="#Lokacija">Lokacija</Nav.Link>
                    {this.state.administrator ? this.nacrtajAlatke() : <></>}
                  </Nav>

                  <Nav>
                    {this.state.guest ? (
                      <>
                        <PopUpLogin loginState={this.handleLogInClicked} />
                        <PopUpKreirajNalog
                          loginState={this.handleLogInClicked}
                        />
                      </>
                    ) : (
                      <>
                        <Nav.Link variant="dark" onClick={this.handleLogOut}>
                          Odjavi se
                        </Nav.Link>
                        {<PopUpProfilKorisnika logOut={this.handleLogOut} />}
                      </>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </>
          }
        />
        <Telo
          refreshRepertoar={this.state.refreshRepertoar}
          loginState={this.handleLogInClicked}
          logOut={this.handleLogOut}
          guest={this.state.guest}
          administrator={this.state.administrator}
        />
       
      </div>
    );
  }
}

export default App;
