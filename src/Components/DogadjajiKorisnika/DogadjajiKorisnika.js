import React from "react";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";

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
      idKorisnika: this.props.idKorisnika,
      opis: "",
      prikaziOpis: false,
      naslov: ""
    };
    this.nacrtajFooter = this.nacrtajFooter.bind(this);
    this.promeniStranicu = this.promeniStranicu.bind(this);
    this.vratiDogadjaje = this.vratiDogadjaje.bind(this);
    this.pormenaBrojaZaPrikaz = this.pormenaBrojaZaPrikaz.bind(this);
    this.sakrijOpis = this.sakrijOpis.bind(this);
  }

  sakrijOpis() {
    this.setState({ prikaziOpis: false });
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
    const formData = new FormData();
    formData.append("stranica", str);
    formData.append("brojDogadjaja", this.state.brojZaPrikaz);
    if (this.state.idKorisnika !== false) {
      formData.append("Id", this.state.idKorisnika);
    }
    if (this.state.brojDogadjaja === false) formData.append("vratiMax", 0);
    const fetchData = { method: "post", body: formData };
    fetch("./ThOr_php/Korisnik/vratiKorisnikoveDogadjaje.php", fetchData)
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
    } else {
      this.props.logOut();
    }
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
                <th>Ocena</th>
                <th>Opis</th>
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
                      <td>{dogadjaj.prosecnaOcena}</td>
                      <td>
                        {" "}
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Prikazi opis
                            </Tooltip>
                          }
                        >
                          <i
                            className="fas fa-info-circle fa-2x"
                            onClick={() =>
                              this.setState({ opis: dogadjaj.opis }, () =>
                                this.setState({
                                  prikaziOpis: true,
                                  naslov: dogadjaj.naziv
                                })
                              )
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

  nacrtajFooter() {
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
              <Form.Label>Prikaži </Form.Label>
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
        {this.state.loading === true ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            {this.state.prikaziOpis === false ? (
              <>
                {parseInt(this.state.brojDogadjaja) === 0 ? (
                  <>
                    <b>Broj događaja:</b> 0 <br />
                  </>
                ) : (
                  <>
                    <>
                      <b>Broj događaja:</b> {this.state.brojDogadjaja} <br />
                    </>
                    {this.nacrtajDogadjaje()}
                    {this.nacrtajFooter()}
                  </>
                )}
              </>
            ) : (
              <>
                <h1>{this.state.naslov}</h1>
                <p>{this.state.opis}</p>
                <Button variant="dark" type="button" onClick={this.sakrijOpis}>
                  Sakrij opis
                </Button>
              </>
            )}
          </>
        )}
      </>
    );
  }
}
export default DogadjajiKorisnika;
