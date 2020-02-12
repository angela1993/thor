import React from "react";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";
import Collapse from "react-bootstrap/Collapse";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "./TabelaDogadjaja.css";
import PopUpDetaljiDogadjaja from "./PopUpDetaljiDogadjaja";

class DogadjajiKorisnika extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      stranica: 1,
      brojZaPrikaz: 5,
      dogadjaji: [],
      brojDogadjaja: false,
      zadnjaStranica: 0,
      loading: true,
      opcije: [],
      open: false,
      filterCenaOd: 0,
      filterCenaDo: Number.MAX_SAFE_INTEGER,
      filterCenaValidacija: { potvrda: "", poruka: "" },
      filterDatumValidacija: { potvrda: "", poruka: "" },
      filterDatumOd: "",
      filterDatumDo: "",
      filterUpaljen: false,
      dogadjaj: {},
      prikaziDetaljnoDogadjaj: false
    };
    this.nacrtajStranicenje = this.nacrtajStranicenje.bind(this);
    this.promeniStranicu = this.promeniStranicu.bind(this);
    this.vratiDogadjaje = this.vratiDogadjaje.bind(this);
    this.pormenaBrojaZaPrikaz = this.pormenaBrojaZaPrikaz.bind(this);
    this.nacrtajFiltere = this.nacrtajFiltere.bind(this);
    this.obradiFilter = this.obradiFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nacrtajDetaljeDogadjaja = this.nacrtajDetaljeDogadjaja.bind(this);
    this.sakrijDetalje = this.sakrijDetalje.bind(this);
    this.promeniAktivnost = this.promeniAktivnost.bind(this);
  }

  promeniAktivnost(a) {
    let pom = { ...this.state.dogadjaj };
    pom.aktivan = a;

    this.setState({ dogadjaj: pom });
    this.props.refreshRepertoar();
  }
  sakrijDetalje() {
    this.setState({ prikaziDetaljnoDogadjaj: false });
  }

  nacrtajDetaljeDogadjaja(dogadjaj) {
    this.setState({ dogadjaj: dogadjaj }, () =>
      this.setState({ prikaziDetaljnoDogadjaj: true })
    );
  }

  obradiFilter() {
    let moze = true;
    let minCena = this.state.filterCenaOd;
    let maxCena = this.state.filterCenaDo;
    let datumOd = this.state.filterDatumOd;
    let datumDo = this.state.filterDatumDo;
    let pocetniDatum = new Date(this.state.filterDatumOd);
    let krajnjiDatum = new Date(this.state.filterDatumDo);

    if (maxCena === "") {
      maxCena = Number.MAX_SAFE_INTEGER;
    }
    if (minCena === "") {
      minCena = 0;
    }

    if (parseInt(minCena) > parseInt(maxCena)) {
      moze = false;
      this.setState({
        filterCenaValidacija: {
          potvrda: false,
          poruka: "Pocetna cena mora biti manja od krajnje cene"
        }
      });
    } else {
      this.setState({
        filterCenaValidacija: {
          potvrda: "",
          poruka: "sve okej"
        }
      });
    }
    if (isNaN(pocetniDatum.getTime())) {
      datumOd = "1900-01-01";
    }
    if (isNaN(krajnjiDatum.getTime())) {
      datumDo = "9999-01-01";
    }
    if (pocetniDatum > krajnjiDatum) {
      moze = false;
      this.setState({
        filterDatumValidacija: {
          potvrda: false,
          poruka: "Pocetni datum  mora biti raniji od krajnjeg"
        }
      });
    } else {
      this.setState({ filterDatumValidacija: { potvrda: "", poruka: "" } });
    }

    if (moze === true) {
      this.setState({ filterCenaOd: minCena }, () =>
        this.setState({ filterCenaDo: maxCena }, () =>
          this.setState({ filterDatumOd: datumOd }, () =>
            this.setState({ filterDatumDo: datumDo }, () =>
              this.setState({ filterUpaljen: true }, () =>
                this.setState({ stranica: 1 }, () =>
                  this.vratiDogadjaje(this.state.stranica)
                )
              )
            )
          )
        )
      );
    }
  }
  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  nacrtajFiltere() {
    return (
      <>
        <Container fluid="true">
          <Col className="search">
            <i
              className="fas fa-search"
              onClick={() => this.setState({ open: !this.state.open })}
              aria-controls="example-collapse-text"
              aria-expanded={this.state.open}
            />
          </Col>
        </Container>
        <Collapse in={this.state.open}>
          <Form>
            <Form.Row className="filteri">
              <div className="tabelaUnos">
                <div>
                  <Form.Group>
                    <Form.Label>Opseg cene </Form.Label>
                    <Form.Control
                      name="filterCenaOd"
                      type="number"
                      isInvalid={
                        this.state.filterCenaValidacija.potvrda === false
                      }
                      placeholder="Pocetna cena"
                      onChange={this.handleChange}
                    />
                    <Form.Control
                      name="filterCenaDo"
                      type="number"
                      isInvalid={
                        this.state.filterCenaValidacija.potvrda === false
                      }
                      placeholder="Krajnja cena"
                      onChange={this.handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.filterCenaValidacija.poruka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div>
                  <Form.Group>
                    <Form.Label>Opseg Datuma</Form.Label>
                    <Form.Control
                      name="filterDatumOd"
                      type="date"
                      placeholder="Pocetni datum"
                      isInvalid={
                        this.state.filterDatumValidacija.potvrda === false
                      }
                      onChange={this.handleChange}
                    />
                    <Form.Control
                      name="filterDatumDo"
                      type="date"
                      placeholder="Krajnji datum"
                      isInvalid={
                        this.state.filterDatumValidacija.potvrda === false
                      }
                      onChange={this.handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {this.state.filterDatumValidacija.poruka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
              <div className="tabelaDugme">
                <Form.Group>
                  <Button
                    variant="outline-secondary"
                    onClick={this.obradiFilter}
                  >
                    Filtriraj
                  </Button>
                </Form.Group>
              </div>
            </Form.Row>
          </Form>
        </Collapse>
      </>
    );
  }

  componentDidMount() {
    let opcije = [];
    for (let i = 5; i <= 25; i += 5) opcije.push(i);
    this.setState({ opcije: opcije });
    this.vratiDogadjaje(this.state.stranica);
  }
  pormenaBrojaZaPrikaz(event) {
    this.setState(
      { stranica: 1 },
      this.setState({ brojZaPrikaz: event.target.value }, () =>
        this.setState(
          {
            zadnjaStranica: Math.ceil(
              this.state.brojDogadjaja / this.state.brojZaPrikaz
            )
          },
          () => {
            this.setState({ loading: true }, () =>
              this.vratiDogadjaje(this.state.stranica)
            );
          }
        )
      )
    );
  }

  promeniStranicu(str) {
    if (
      !isNaN(str) &&
      str > 0 &&
      str <= this.state.zadnjaStranica &&
      str !== this.state.stranica
    ) {
      this.setState({ stranica: str });
      this.setState({ loading: true });
      this.vratiDogadjaje(str);
    }
  }

  vratiDogadjaje(str) {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append("stranica", str);
    formData.append("brojDogadjaja", this.state.brojZaPrikaz);
    if (this.state.filterUpaljen === true) {
      formData.append("minCena", this.state.filterCenaOd);
      formData.append("maxCena", this.state.filterCenaDo);
      formData.append("DatumOd", this.state.filterDatumOd);
      formData.append("DatumDo", this.state.filterDatumDo);
      formData.append("vratiMax", 0);
    }
    if (this.state.brojDogadjaja === false) formData.append("vratiMax", 0);
    const fetchData = { method: "post", body: formData };
    fetch("./ThOr_php/vratiStranicuDogadjaja.php", fetchData)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => this.obradiOdgovor(odgovor))
      .catch(er => console.log(er));
  }

  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "NEMA") {
      this.setState({ dogadjaji: odgovor["Dogadjaji"] }, () =>
        this.setState({ loading: false })
      );
      if (this.state.brojDogadjaja === false)
        this.setState({ brojDogadjaja: odgovor["Ukupno"] }, () =>
          this.setState({
            zadnjaStranica: Math.ceil(
              this.state.brojDogadjaja / this.state.brojZaPrikaz
            )
          })
        );
      if (odgovor["Filter"] !== "") {
        this.setState({ brojDogadjaja: odgovor["Ukupno"] }, () =>
          this.setState({
            zadnjaStranica: Math.ceil(
              this.state.brojDogadjaja / this.state.brojZaPrikaz
            )
          })
        );
      }
    } else if (odgovor["Greska"] === "NISTE_ADMIN") {
      alert("Nemate autorizaciju");
    } else {
      this.props.logOut();
      alert(odgovor["Greska"]);
    }
    this.setState({ loading: false });
  }

  nacrtajDogadjaje() {
    return (
      <>
        {this.state.loading === true ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Naziv</th>
                <th>Datum</th>
                <th>Cena</th>
                <th className="thDetalji">Detaljno</th>
              </tr>
            </thead>
            <tbody>
              {this.state.brojDogadjaja !== false &&
              this.state.brojDogadjaja !== 0 ? (
                this.state.dogadjaji.map((dogadjaj, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {index +
                          1 +
                          (this.state.stranica - 1) * this.state.brojZaPrikaz}
                      </td>
                      <td>{dogadjaj.naziv}</td>
                      <td>{dogadjaj.datum_pocetka}</td>
                      <td>{dogadjaj.cena}</td>
                      <td className="prikaziDetalje">
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Prikazi informacije
                            </Tooltip>
                          }
                        >
                          <i
                            className="fas fa-theater-masks fa-2x"
                            onClick={() =>
                              this.nacrtajDetaljeDogadjaja(dogadjaj)
                            }
                          />
                        </OverlayTrigger>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </Table>
        )}
      </>
    );
  }

  nacrtajStranicenje() {
    return (
      <>
        <Form>
          <Form.Row className="footerKorisnici">
            <Form.Group>
              <Form.Label>Stranica</Form.Label>
              <Pagination>
                <Pagination.First onClick={e => this.promeniStranicu(1)} />
                <Pagination.Prev
                  onClick={e => this.promeniStranicu(this.state.stranica - 1)}
                />
                {this.state.stranica > 1 ? (
                  <Pagination.Item
                    onClick={e => this.promeniStranicu(this.state.stranica - 1)}
                  >
                    {this.state.stranica - 1}
                  </Pagination.Item>
                ) : (
                  <></>
                )}

                <Pagination.Item active>{this.state.stranica}</Pagination.Item>
                {this.state.stranica < this.state.zadnjaStranica ? (
                  <Pagination.Item
                    onClick={e => this.promeniStranicu(this.state.stranica + 1)}
                  >
                    {this.state.stranica + 1}
                  </Pagination.Item>
                ) : (
                  <></>
                )}
                <Pagination.Next
                  onClick={e => this.promeniStranicu(this.state.stranica + 1)}
                />
                <Pagination.Last
                  onClick={e => this.promeniStranicu(this.state.zadnjaStranica)}
                />
              </Pagination>
            </Form.Group>

            <Form.Group>
              <Form.Label>Prikazi </Form.Label>
              <Form.Control
                as="select"
                value={this.state.brojZaPrikaz}
                onChange={this.pormenaBrojaZaPrikaz}
              >
                {this.state.opcije.map((x, index) => (
                  <option key={index} value={x}>
                    {x}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
        </Form>
      </>
    );
  }
  render() {
    return (
      <>
        {this.nacrtajFiltere()}
        {this.nacrtajDogadjaje()}
        {this.nacrtajStranicenje()}
        {this.state.prikaziDetaljnoDogadjaj === true ? (
          <PopUpDetaljiDogadjaja
            show={true}
            logOut={this.props.logOut}
            promeniAktivnost={this.promeniAktivnost}
            hide={this.sakrijDetalje}
            dogadjaj={this.state.dogadjaj}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}
export default DogadjajiKorisnika;
