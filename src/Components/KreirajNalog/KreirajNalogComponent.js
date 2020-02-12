import React, { Component } from "react";
import "./KreirajNalogCSS.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default class KreirajNalogComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      korisnickoIme: "",
      lozinka: "",
      potvrdaLozinke: "",
      email: "",
      korisnickoImeValidacija: { potvrda: "", poruka: "" },
      emailValidacija: { potvrda: "", poruka: "" },
      lozinkaValidacija: { potvrda: "", poruka: "" },
      potvrdaLozinkeValidacija: { potvrda: "", poruka: "" },
      show: true
    };
    this.loginState = this.props.loginState;
    this.obradiFormu = this.obradiFormu.bind(this);
    this.changeProfilePictureURL = this.changeProfilePictureURL.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
    this.proveriPodatke = this.proveriPodatke.bind(this);
    this.proveriLozinku = this.proveriLozinku.bind(this);
    this.proveriKorisnickoIme = this.proveriKorisnickoIme.bind(this);
    this.proveriEmail = this.proveriEmail.bind(this);
  }
  proveriEmail() {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let poruka = "Email koji ste uneli nije validan!";
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
  proveriPodatke() {
    let ret = true;
    if (!this.proveriEmail()) ret = false;
    if (!this.proveriKorisnickoIme()) ret = false;
    if (!this.proveriLozinku()) ret = false;
    return ret;
  }
  obradiFormu(event) {
    if (!this.proveriPodatke()) return;
    const formData = new FormData();
    formData.append("email", this.state.email);
    formData.append(
      "korisnickoIme",
      this.state.korisnickoIme.replace(/'/gi, "''")
    );

    formData.append("lozinka", this.state.lozinka.replace(/'/gi, "''"));
    const fetchData = { method: "post", body: formData };
    this.setState({ show: false });
    fetch("./ThOr_php/kreirajNalog.php", fetchData)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => this.obradiOdgovor(odgovor))
      .catch(er => console.log(er));
  }

  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "email") {
      let poruka = "Vec postoji nalog sa tim email-om";
      this.setState({ korisnickoImeValidacija: { potvrda: "", poruka: "" } });
      this.setState({ lozinkaValidacija: { potvrda: "", poruka: "" } });
      this.setState({ potvrdaLozinkeValidacija: { potvrda: "", poruka: "" } });

      this.setState(
        { emailValidacija: { potvrda: false, poruka: poruka } },
        () => this.setState({ show: true })
      );
    } else {
      if (odgovor["Greska"] === "Greska u bazi") {
        alert("Greska[Problem sa bazom], pokusajte kasnije");
        this.setState({ korisnickoImeValidacija: { potvrda: "", poruka: "" } });
        this.setState({ lozinkaValidacija: { potvrda: "", poruka: "" } });
        this.setState({
          potvrdaLozinkeValidacija: { potvrda: "", poruka: "" }
        });
        this.setState({ emailValidacija: { potvrda: "", poruka: "" } });

        this.setState({ show: true });
      } else {
        this.setState({ show: true }, () => this.loginState(false));
      }
    }
  }
  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  changeProfilePictureURL() {
    let noviUrl = document.querySelector("input[type='profileImage']").value;
    this.setState({
      profilePicture: noviUrl
    });
  }
  render() {
    return (
      <>
        {this.state.show ? (
          <div>
            <Form>
              <Form.Group controlId="formKreirajNalogEmail">
                <Form.Label>Email adresa</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Unesite email"
                  name="email"
                  onChange={this.handleChange}
                  isValid={this.state.emailValidacija.potvrda === true}
                  isInvalid={this.state.emailValidacija.potvrda === false}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.emailValidacija.poruka}
                </Form.Control.Feedback>

                <Form.Text className="text-muted" />
              </Form.Group>

              <Form.Group controlId="formKreirajNalogKorisnickoIme">
                <Form.Label>Korisnicko Ime</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unesite korisnicko ime"
                  name="korisnickoIme"
                  onChange={this.handleChange}
                  isValid={this.state.korisnickoImeValidacija.potvrda === true}
                  isInvalid={
                    this.state.korisnickoImeValidacija.potvrda === false
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.korisnickoImeValidacija.poruka}
                </Form.Control.Feedback>
                <Form.Text className="text-muted" />
              </Form.Group>

              <Form.Group controlId="formKreirajNalogLozinka">
                <Form.Label>Lozinka</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Unesite lozinka"
                  name="lozinka"
                  onChange={this.handleChange}
                  isValid={this.state.lozinkaValidacija.potvrda === true}
                  isInvalid={this.state.lozinkaValidacija.potvrda === false}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.lozinkaValidacija.poruka}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formKreirajNalogLozinkaPotvrda">
                <Form.Label>Potvrda Lozinke</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Potvrdite lozinku"
                  name="potvrdaLozinke"
                  onChange={this.handleChange}
                  isValid={this.state.potvrdaLozinkeValidacija.potvrda === true}
                  isInvalid={
                    this.state.potvrdaLozinkeValidacija.potvrda === false
                  }
                />
              </Form.Group>
              <br />

              <Button variant="dark" type="button" onClick={this.obradiFormu}>
                Kreiraj Nalog
              </Button>
            </Form>
          </div>
        ) : (
          <Spinner animation="border" variant="primary" />
        )}
      </>
    );
  }
}
