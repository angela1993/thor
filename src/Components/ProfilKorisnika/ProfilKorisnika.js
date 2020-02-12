import React from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "./ProfilKorisnikaCSS.css";
import DogadjajiKorisnika from "../DogadjajiKorisnika/DogadjajiKorisnika";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
class ProfilKorisnika extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      korisnik: {},
      loading: true,
      prikaziDogadjaje: false,
      email: "",
      cbxObavestenje: true,
      emailValidacija: { potvrda: "", poruka: "" },
      korisnickoIme: "",
      korisnickoImeValidacija: { potvrda: "", poruka: "" },
      staraLozinka: "",
      staraLozinkaValidacija: { potvrda: "", poruka: "" },
      lozinka: "",
      potvrdaLozinke: "",
      lozinkaValidacija: { potvrda: "", poruka: "" },
      potvrdaLozinkeValidacija: { potvrda: "", poruka: "" }
    };

    this.vratiProfil = this.vratiProfil.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
    this.prikaziDogadjaje = this.prikaziDogadjaje.bind(this);
    this.sacuvajPromene = this.sacuvajPromene.bind(this);
    this.proveriEmail = this.proveriEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCbxChange = this.handleCbxChange.bind(this);
    this.proveriKorisnickoIme = this.proveriKorisnickoIme.bind(this);
    this.proveriLozinku = this.proveriLozinku.bind(this);
    this.obradiPromenu = this.obradiPromenu.bind(this);
  }

  handleCbxChange(ev) {
    this.setState({ [ev.target.name]: ev.target.checked });
  }
  obradiPromenu(odgovor) {
    if (
      odgovor["Greska"] === "SESIJA_ISTEKLA" ||
      odgovor["Greska"] === "NIJE_PRIJAVLJEN"
    ) {
      this.props.logOut();
    } else {
      if (odgovor["Ime"] !== "") {
        this.setState({
          korisnickoImeValidacija: {
            potvrda: true,
            poruka: odgovor["Ime"]["Poruka"]
          }
        });
      }
      if (odgovor["Email"] !== "") {
        if (odgovor["Email"]["EmailGreska"] === true) {
          this.setState({
            emailValidacija: {
              potvrda: false,
              poruka: odgovor["Email"]["Poruka"]
            }
          });
        } else {
          this.setState({
            emailValidacija: {
              potvrda: true,
              poruka: odgovor["Email"]["Poruka"]
            }
          });
        }
      }
      if (odgovor["Lozinka"] !== "") {
        if (odgovor["Lozinka"]["LozinkaGreska"] === true) {
          this.setState({
            staraLozinkaValidacija: {
              potvrda: false,
              poruka: odgovor["Lozinka"]["Poruka"]
            }
          });
        } else {
          this.setState({
            staraLozinkaValidacija: {
              potvrda: true,
              poruka: odgovor["Lozinka"]["Poruka"]
            }
          });
        }
      }
      this.setState({ staraLozinka: "" });
      this.setState({ lozinka: "" });
      this.setState({ potvrdaLozinke: "" }, () => this.vratiProfil());
    }
  }
  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  proveriEmail() {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let poruka = "Novi email koji ste uneli nije validan!";
    if (!re.test(this.state.email)) {
      this.setState({ emailValidacija: { potvrda: false, poruka: poruka } });
      return false;
    }
    this.setState({ emailValidacija: { potvrda: true, poruka: "" } });
    return true;
  }
  proveriKorisnickoIme() {
    let poruka = "Korisnicko ime mora da ime najmanje 6 karaktera";
    if (this.state.korisnickoIme.length < 6) {
      this.setState({
        korisnickoImeValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }
    this.setState({ korisnickoImeValidacija: { potvrda: true, poruka: "" } });
    return true;
  }
  sacuvajPromene() {
    const formData = new FormData();
    let salji = true;
    let promena = false;
    if (
      this.state.email !== "" &&
      this.state.email !== this.state.korisnik.email
    ) {
      if (this.proveriEmail()) {
        formData.append("Email", this.state.email);
        promena = true;
      } else {
        salji = false;
      }
    } else {
      this.setState({ emailValidacija: { potvrda: "", poruka: "" } });
    }

    if (
      this.state.korisnickoIme !== "" &&
      this.state.korisnickoIme !== this.state.korisnik.username
    ) {
      if (this.proveriKorisnickoIme()) {
        promena = true;

        formData.append("KorisnickoIme", this.state.korisnickoIme);
      } else {
        salji = false;
      }
    } else {
      this.setState({ korisnickoImeValidacija: { potvrda: "", poruka: "" } });
    }

    if (this.state.staraLozinka !== "") {
      if (this.state.staraLozinka.length < 6) {
        this.setState({
          staraLozinkaValidacija: {
            potvrda: false,
            poruka: "Lozinka mora da ima bar 6 karaktera"
          }
        });
        salji = false;
      } else {
        if (this.proveriLozinku()) {
          formData.append("StaraLozinka", this.state.staraLozinka);
          formData.append("NovaLozinka", this.state.lozinka);
          promena = true;
        } else {
          salji = false;
        }
      }
    } else {
      this.setState({ staraLozinkaValidacija: { potvrda: "", poruka: "" } });
    }
    let promenaObavestenja;
    if (this.state.cbxObavestenje === true) promenaObavestenja = "DA";
    else promenaObavestenja = "NE";
    if (promenaObavestenja !== this.state.korisnik.primajObavestenja) {
      formData.append("Obavestenje", promenaObavestenja);
      promena = true;
    }

    if (salji === true && promena === true) {
      formData.append("promena", true);
      const fetchData = { method: "post", body: formData };
      this.setState({ loading: true });
      fetch("./ThOr_php/Korisnik/promeniPodatke.php", fetchData)
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          else return response.json();
        })
        .then(odgovor => this.obradiPromenu(odgovor))
        .catch(er => console.log(er));
    }
  }
  prikaziDogadjaje() {
    this.setState({ prikaziDogadjaje: !this.state.prikaziDogadjaje });
  }
  componentDidMount() {
    this.vratiProfil();
  }

  vratiProfil() {
    fetch("./ThOr_php/Korisnik/vratiProfil.php")
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => this.obradiOdgovor(odgovor))
      .catch(er => console.log(er));
  }

  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "NEMA") {
      this.setState({ korisnik: odgovor["Korisnik"] }, () => {
        if (this.state.korisnik.primajObavestenja === "DA")
          this.setState({ cbxObavestenje: true }, () =>
            this.setState({ loading: false })
          );
        else
          this.setState({ cbxObavestenje: false }, () =>
            this.setState({ loading: false })
          );
      });
    } else {
      
      this.props.logOut();
    }
  }

  proveriLozinku() {
    let poruka =
      "lozinka mora da ima 6 karaktera, da se razlikuje od korisničkog imena i email-a, i da sadrži lowercase,uppercase i bar jedan numerički karakter";

    if (this.state.lozinka.length < 6) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }

    if (this.state.lozinka === this.state.email) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }
    if (this.state.lozinka === this.state.korisnickoIme) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }
    if (this.state.lozinka === this.state.staraLozinka) {
      this.setState({
        lozinkaValidacija: {
          potvrda: false,
          poruka: "Nova lozinka treba da se razlikuje od stare"
        }
      });
      return false;
    }
    let re = /[0-9]/;
    if (!re.test(this.state.lozinka)) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }
    re = /[a-z]/;
    if (!re.test(this.state.lozinka)) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }
    re = /[A-Z]/;
    if (!re.test(this.state.lozinka)) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: poruka }
      });
      return false;
    }
    if (this.state.lozinka !== this.state.potvrdaLozinke) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: "lozinke se ne poklapaju" }
      });
      this.setState({
        potvrdaLozinkeValidacija: { potvrda: false, poruka: "" }
      });
      return false;
    }
    this.setState({ lozinkaValidacija: { potvrda: true, poruka: "" } });
    this.setState({ potvrdaLozinkeValidacija: { potvrda: true, poruka: "" } });
    return true;
  }
  render() {
    return (
      <>
        {this.state.loading === true ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            <Form>
              <Row>
                <Col>
                  <Form.Group controlId="formProfilNalogEmail">
                    <Form.Label>Email adresa</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={this.state.korisnik.email}
                      name="email"
                      onChange={this.handleChange}
                      isValid={this.state.emailValidacija.potvrda === true}
                      isInvalid={this.state.emailValidacija.potvrda === false}
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.emailValidacija.poruka}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      {this.state.emailValidacija.poruka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formProfilNalogKorisnickoIme">
                    <Form.Label>Korisnicko Ime</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={this.state.korisnik.username}
                      name="korisnickoIme"
                      onChange={this.handleChange}
                      isValid={
                        this.state.korisnickoImeValidacija.potvrda === true
                      }
                      isInvalid={
                        this.state.korisnickoImeValidacija.potvrda === false
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.korisnickoImeValidacija.poruka}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      {this.state.korisnickoImeValidacija.poruka}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formProfilNalogStaraLozinka">
                <Form.Label>Stara Lozinka</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Unesite staru lozinku"
                  name="staraLozinka"
                  onChange={this.handleChange}
                  isValid={this.state.staraLozinkaValidacija.potvrda === true}
                  isInvalid={
                    this.state.staraLozinkaValidacija.potvrda === false
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.staraLozinkaValidacija.poruka}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                  {this.state.staraLozinkaValidacija.poruka}
                </Form.Control.Feedback>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlId="formProfilNalogLozinka">
                    <Form.Label>Nova Lozinka</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Unesite novu lozinku"
                      name="lozinka"
                      onChange={this.handleChange}
                      isValid={this.state.lozinkaValidacija.potvrda === true}
                      isInvalid={this.state.lozinkaValidacija.potvrda === false}
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.lozinkaValidacija.poruka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formProfilNalogLozinkaPotvrda">
                    <Form.Label>Potvrda Nove Lozinke</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Potvrdite novu lozinku"
                      name="potvrdaLozinke"
                      value={this.state.potvrdaLozinke}
                      onChange={this.handleChange}
                      isValid={
                        this.state.potvrdaLozinkeValidacija.potvrda === true
                      }
                      isInvalid={
                        this.state.potvrdaLozinkeValidacija.potvrda === false
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <input
                  type="checkbox"
                  name="cbxObavestenje"
                  checked={this.state.cbxObavestenje}
                  onChange={this.handleCbxChange}
                />{" "}
                Želim obaveštenja
              </Form.Group>

              <Button
                variant="outline-dark"
                type="button"
                onClick={this.sacuvajPromene}
              >
                Sačuvaj Promene
              </Button>
            </Form>
            <hr />
            <Button
              variant="outline-dark"
              type="button"
              onClick={this.prikaziDogadjaje}
            >
              {this.state.prikaziDogadjaje ? (
                <>Sakrij Dogadjaje</>
              ) : (
                <>Prikazi Dogadjaje</>
              )}
            </Button>
            <br />
            <br />
            {this.state.prikaziDogadjaje ? (
              <DogadjajiKorisnika logOut={this.props.logOut} idKorisnika={false} />
            ) : (
              <></>
            )}
          </>
        )}
      </>
    );
  }
}
export default ProfilKorisnika;
