import React from "react";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";
import KorisnikExtended from "./KorisnikExtended";
import "./Korisnici.css";

class Korisnici extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      stranica: 1,
      brojZaPrikaz: 5,
      korisnici: [],
      brojKorisnika: 0,
      zadnjaStranica: 0,
      loading: true,
      opcije: [],
      prikaziDetalje: false,
      KorisnikExtended: {}
    };

    this.nacrtajKorisnike = this.nacrtajKorisnike.bind(this);
    this.vratiKorisnike = this.vratiKorisnike.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
    this.promeniStranicu = this.promeniStranicu.bind(this);
    this.nacrtajFooter = this.nacrtajFooter.bind(this);
    this.pormenaBrojaZaPrikaz = this.pormenaBrojaZaPrikaz.bind(this);
    this.vratiBrojKorisnika = this.vratiBrojKorisnika.bind(this);
    this.prikaziDetalje = this.prikaziDetalje.bind(this);
    this.sakrijDetalje = this.sakrijDetalje.bind(this);
  }
  prikaziDetalje(korisnik) {
    this.setState({ prikaziDetalje: true });
    this.setState({ KorisnikExtended: korisnik });
  }
  sakrijDetalje() {
    this.setState({ prikaziDetalje: false });
  }
  vratiBrojKorisnika() {
    fetch("./ThOr_php/vratiBrojKorisnika.php")
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => {
        if (odgovor["Greska"] === "NEMA") {
          this.setState({ brojKorisnika: odgovor["Broj"] }, () =>
            this.setState({
              zadnjaStranica: Math.ceil(
                this.state.brojKorisnika / this.state.brojZaPrikaz
              )
            })
          );
        } else {
          if (odgovor["Greska"] === "NISTE_ADMIN") {
            alert("Niste admin");
          } else {
            alert(odgovor["Greska"]);
            this.props.logOut();
          }
        }
      })
      .catch(er => console.log(er));
  }
  pormenaBrojaZaPrikaz(event) {
    this.setState(
      { stranica: 1 },
      this.setState({ brojZaPrikaz: event.target.value }, () =>
        this.setState(
          {
            zadnjaStranica: Math.ceil(
              this.state.brojKorisnika / this.state.brojZaPrikaz
            )
          },
          () => {
            this.setState({ loading: true }, () =>
              this.vratiKorisnike(this.state.stranica)
            );
          }
        )
      )
    );
  }
  componentDidMount() {
    let opcije = [];
    for (let i = 5; i <= 25; i += 5) opcije.push(i);
    this.setState({ opcije: opcije });
    this.vratiBrojKorisnika();
    this.vratiKorisnike(this.state.stranica);
  }

  promeniStranicu(str) {
    if (!isNaN(str) && str > 0 && str <= this.state.zadnjaStranica) {
      this.setState({ stranica: str });
      this.setState({ loading: true });
      this.vratiKorisnike(str);
    }
  }
  vratiKorisnike(str) {
    const formData = new FormData();
    formData.append("stranica", str);
    formData.append("brojKorisnika", this.state.brojZaPrikaz);
    const fetchData = { method: "post", body: formData };
    fetch("./ThOr_php/vratiKorisnike.php", fetchData)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => this.obradiOdgovor(odgovor))
      .catch(er => console.log(er));
  }

  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "NEMA") {
      this.setState({ korisnici: odgovor["Korisnici"] }, () =>
        this.setState({ loading: false })
      );
    }
    else{
      alert(odgovor["Greska"]);
      this.props.logOut();
    }
  }

  nacrtajKorisnike() {
    return (
      <>
        {this.state.loading === true ? (
          <Spinner animation="border" variant="dark" />
        ) : (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Korisnicko Ime</th>
                <th className="thDetalji">Detalji</th>
              </tr>
            </thead>
            <tbody>
              {this.state.brojKorisnika !== 0 ? (
                this.state.korisnici.map((korisnik, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {index +
                          1 +
                          (this.state.stranica - 1) * this.state.brojZaPrikaz}
                      </td>
                      <td>{korisnik.email}</td>
                      <td>{korisnik.username}</td>
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
                            className="far fa-address-card fa-2x"
                            onClick={() => this.prikaziDetalje(korisnik)}
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
        {" "}
        {this.state.loading === true ? (
          <></>
        ) : (
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
                      onClick={e =>
                        this.promeniStranicu(this.state.stranica - 1)
                      }
                    >
                      {this.state.stranica - 1}
                    </Pagination.Item>
                  ) : (
                    <></>
                  )}

                  <Pagination.Item active>
                    {this.state.stranica}
                  </Pagination.Item>
                  {this.state.stranica < this.state.zadnjaStranica ? (
                    <Pagination.Item
                      onClick={e =>
                        this.promeniStranicu(this.state.stranica + 1)
                      }
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
                    onClick={e =>
                      this.promeniStranicu(this.state.zadnjaStranica)
                    }
                  />
                </Pagination>
              </Form.Group>

              <Form.Group>
                <Form.Label>Prikazi </Form.Label>
                <Form.Control
                  as="select"
                  variant="dark"
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
        )}
      </>
    );
  }
  render() {
    return (
      <>
        {this.state.prikaziDetalje === false ? (
          <>
            {" "}
            {this.nacrtajKorisnike()}
            {this.nacrtajFooter()}
          </>
        ) : (
          <>
            <KorisnikExtended
              show={true}
              sakrijDetalje={this.sakrijDetalje}
              korisnik={this.state.KorisnikExtended}
              logOut={this.props.logOut}
            />
          </>
        )}
      </>
    );
  }
}
export default Korisnici;
