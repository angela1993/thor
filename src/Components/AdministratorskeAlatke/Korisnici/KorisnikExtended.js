import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DogadjajiKorisnika from "../../DogadjajiKorisnika/DogadjajiKorisnika";
import Spinner from "react-bootstrap/Spinner";
class KorisnikExtended extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: this.props.show,
      korisnik: "",
      prikaziSuspenziju: false,
      datumValidacija: { potvrda: "", poruka: "" },
      datumOd: "",
      datumDo: "",
      suspenzije: [],
      loader: false,
      ucitanaSuspenzija: false
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
      this.props.sakrijDetalje();
    };

    this.crtaj = this.crtaj.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.suspenduj = this.suspenduj.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
    this.vratiSuspenziju = this.vratiSuspenziju.bind(this);
  }

  vratiSuspenziju() {
    const formData = new FormData();
    formData.append("idKorisnika", this.state.korisnik.id);
    const fetchData = { method: "post", body: formData };

    fetch("./ThOr_php/vratiSuspenziju.php", fetchData)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => {
        if (odgovor["Greska"] === "Nema") {
          this.setState({
            suspenzije: odgovor["Datum"],
            ucitanaSuspenzija: true
          });
        } else {
          alert(odgovor["Greska"]);
          this.props.logOut();
        }
      })
      .catch(er => console.log(er));
  }

  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "Nema") {
      this.vratiSuspenziju();
      this.setState({ loader: false });
      this.setState({ prikaziSuspenziju: false });
    } else {
      alert(odgovor["Greska"]);
      this.props.logOut();
    }
  }
  suspenduj() {
    let pocetniDatum = new Date(this.state.datumOd);
    let krajnjiDatum = new Date(this.state.datumDo);
    let moze = true;
    if (isNaN(pocetniDatum.getTime())) {
      this.setState({
        datumValidacija: {
          potvrda: false,
          poruka: "Nije validan datum"
        }
      });
      moze = false;
    }
    if (isNaN(krajnjiDatum.getTime())) {
      this.setState({
        datumValidacija: {
          potvrda: false,
          poruka: "Nije validan datum"
        }
      });
      moze = false;
    }
    if (pocetniDatum > krajnjiDatum) {
      moze = false;
      this.setState({
        datumValidacija: {
          potvrda: false,
          poruka: "Pocetni datum  mora biti raniji od krajnjeg"
        }
      });
    } else {
      this.setState({ filterDatumValidacija: { potvrda: "", poruka: "" } });
    }
    if (moze === true) {
      this.setState({ loader: true });
      const formData = new FormData();
      formData.append("idKorisnika", this.state.korisnik.id);
      formData.append("datumOd", this.state.datumOd);
      formData.append("datumDo", this.state.datumDo);
      const fetchData = { method: "post", body: formData };
      fetch("./ThOr_php/suspendujKorisnika.php", fetchData)
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          else return response.json();
        })
        .then(odgovor => this.obradiOdgovor(odgovor))
        .catch(er => console.log(er));
    }
  }

  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  componentDidMount() {
    this.setState({ korisnik: this.props.korisnik }, () =>
      this.vratiSuspenziju()
    );
  }

  crtaj() {
    if (isNaN(this.state.korisnik.id)) return <>Greska</>;
    return (
      <>
        <div className="suspenzija">
          <div className="suspenzijaPodaci">
            <label>
              <b>E-mail korisnika:</b>
              <br />

              {this.state.korisnik.email}
            </label>
            {this.state.ucitanaSuspenzija === true ? (
              <label>
                <b>Suspenzije:</b>
                <br />
                {this.state.suspenzije.length === 0 ? (
                  <>Korisnik nije bio suspendovan</>
                ) : (
                  this.state.suspenzije.map((i, index) => {
                    return (
                      <div key={i["Id"]}>
                        {"Od: " + i["Od"] + " Do:" + i["Do"]}
                      </div>
                    );
                  })
                )}
              </label>
            ) : (
              <></>
            )}
          </div>
        </div>

        {this.state.prikaziSuspenziju === true ? (
          <>
            {this.state.loader === true ? (
              <></>
            ) : (
              <>
                <Form>
                  <Form.Group>
                    <Form.Label>Pocetak Suspenzije</Form.Label>
                    <Form.Control
                      name="datumOd"
                      type="date"
                      placeholder="Pocetni datum"
                      isInvalid={this.state.datumValidacija.potvrda === false}
                      onChange={this.handleChange}
                    />
                    <Form.Control.Feedback type="invalid" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Kraj Suspenzije</Form.Label>
                    <Form.Control
                      name="datumDo"
                      type="date"
                      placeholder="Krajnji datum"
                      isInvalid={this.state.datumValidacija.potvrda === false}
                      onChange={this.handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.datumValidacija.poruka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form>
                <Button
                  variant="outline-danger"
                  type="button"
                  onClick={this.suspenduj}
                >
                  Suspenduj
                </Button>
              </>
            )}
          </>
        ) : (
          <></>
        )}
        <br />
        <br />
        <DogadjajiKorisnika
          logOut={this.props.logOut}
          idKorisnika={this.state.korisnik.id}
        />
      </>
    );
  }
  render() {
    return (
      <>
        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header className="suspenudjModal">
            <Modal.Title id="ProfilKorisnikaModal">
              <div>Profil: {this.state.korisnik.username}</div>
              <Button
                variant="outline-danger"
                type="button"
                onClick={() =>
                  this.setState({
                    prikaziSuspenziju: !this.state.prikaziSuspenziju
                  })
                }
              >
                {this.state.loader === true ? (
                  <>
                    <Spinner animation="border" variant="primary" /> Loading...
                  </>
                ) : (
                  <> Suspenduj Korisnika</>
                )}
              </Button>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.crtaj()}</Modal.Body>
        </Modal>
      </>
    );
  }
}
export default KorisnikExtended;
