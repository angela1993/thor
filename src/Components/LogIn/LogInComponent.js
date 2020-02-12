import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "./PopUpLogIn.css";
export default class LogInComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      lozinka: "",
      show: true,
      emailValidacija: { potvrda: "", poruka: "" },
      lozinkaValidacija: { potvrda: "", poruka: "" }
    };

    this.loginState = this.props.loginState;
    this.obradiFormu = this.obradiFormu.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.proveriPodatke = this.proveriPodatke.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  proveriPodatke() {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let poruka = "Email koji ste uneli nije validan!";
    let ret = true;
    if (!re.test(this.state.email)) {
      this.setState({ emailValidacija: { potvrda: false, poruka: poruka } });
      ret = false;
    } else {
      this.setState({ emailValidacija: { potvrda: true, poruka: poruka } });
    }
    if (this.state.lozinka.length < 6) {
      this.setState({
        lozinkaValidacija: { potvrda: false, poruka: "Nije validna lozinka" }
      });
      ret = false;
    } else {
      this.setState({ lozinkaValidacija: { potvrda: true, poruka: "" } });
    }
    return ret;
  }

  obradiFormu() {
    if (!this.proveriPodatke()) return;
    const formData = new FormData();
    formData.append("email", this.state.email);
    formData.append("lozinka", this.state.lozinka.replace(/'/gi, "''"));
    this.setState({ show: false });
    const fetchData = { method: "post", body: formData };
    fetch("./ThOr_php/prijava.php", fetchData)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => this.obradiOdgovor(odgovor))
      .catch(er => console.log(er));
  }
  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "email") {
      this.setState(
        {
          emailValidacija: {
            potvrda: false,
            poruka: "Ne postoji nalog sa tim email-om"
          }
        },
        () => this.setState({ show: true })
      );
    } else if (odgovor["Greska"] === "lozinka") {
      this.setState(
        { lozinkaValidacija: { potvrda: false, poruka: "Pogrešna lozinka" } },
        () => this.setState({ show: true })
      );
    } else if(odgovor["Greska"]==="Nema") {
      let admin = true;
      if (odgovor["Admin"] === "NE") admin = false;
      this.loginState(admin);
    }
    else
    {
      this.setState({
        emailValidacija:{potvrda:false,poruka:"Trenutno ste suspendovani [Do:"+odgovor["Do"]+" ]"}
      }, () => this.setState({ show: true }));
    }
  }
  onKeyPress = e => {
    if (e.which === 13) {
      this.obradiFormu();
    }
  };

  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  render() {
    return (
      <div>
        {this.state.show ? (
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email adresa</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Unesite email"
                onChange={this.handleChange}
                isInvalid={this.state.emailValidacija.potvrda === false}
                onKeyPress={this.onKeyPress}
              />
              <Form.Control.Feedback type="invalid">
                {this.state.emailValidacija.poruka}
              </Form.Control.Feedback>
              <Form.Text className="text-muted" />
            </Form.Group>

            <Form.Group controlId="formBasicLozinka">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                name="lozinka"
                type="password"
                placeholder="Unesite lozinka"
                onChange={this.handleChange}
                isInvalid={this.state.lozinkaValidacija.potvrda === false}
                onKeyPress={this.onKeyPress}
              />

              <Form.Control.Feedback type="invalid">
                {this.state.lozinkaValidacija.poruka}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="dark" type="button" onClick={this.obradiFormu}>
              Prijavi se
            </Button>
          </Form>
        ) : (
          <Spinner animation="border" variant="primary" />
        )}
      </div>
    );
  }
}
