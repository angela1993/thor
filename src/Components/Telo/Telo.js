import React from "react";
import Dogadjaj from "../Dogadjaj/Dogadjaj";
import KreirajNalogComponent from "../KreirajNalog/KreirajNalogComponent";
import "./Telo.css";
import DodajEventModal from "../AdministratorskeAlatke/DodajDogadjaj";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import IzmeniOsnovnePodatke from "../AdministratorskeAlatke/IzmeniOsnovnePodatke";


class Telo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dogadjaji: [],
      dogadjajiZaPrikaz: [],
      guest: props.guest,
      administrator: props.administrator,
      open: false,
      nazivPozorista: "",
      ulica: "",
      grad: "",
      kontakt: "",
      radnoVreme: "",
      lokacijaX: "",
      lokacijaY: "",
      filterCenaDo: 99999,
      cenaDo: 99999,
      filterDatum: "2100-09-12",
      datum: "2100-09-12",
      kljuc: 0,
      drugaNaslovna: false
    };
    this.vratiDogadjaje = this.vratiDogadjaje.bind(this);
    this.handlePromenaPodataka = this.handlePromenaPodataka.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nacrtajDogadjaje = this.nacrtajDogadjaje.bind(this);
    this.dodajDogadjaj = this.dodajDogadjaj.bind(this);
    this.vratiDogadjaje();
    this.vratiInfo();

  }
  dodajDogadjaj(dogadjaj) {
    console.log(dogadjaj);
    this.setState({ dogadjaji: [...this.state.dogadjaji, dogadjaj] });
  }

  componentDidUpdate(prevProps) {
    if (this.props.guest !== prevProps.guest) {
      this.setState({ guest: this.props.guest });
    }
    if (this.props.administrator !== prevProps.administrator) {
      this.setState({ administrator: this.props.administrator });
    }
    if (this.props.refreshRepertoar !== prevProps.refreshRepertoar) {
      this.vratiDogadjaje();
    }
  }
  componentDidMount() {
    this.interval = setInterval(
      () => this.setState({ drugaNaslovna: !this.state.drugaNaslovna }),
      7000
    );
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handlePromenaPodataka(naziv, adr, gr, kont, vreme, lokX, lokY) {
    let naz = naziv;
    this.setState({
      nazivPozorista: naz,
      ulica: adr,
      grad: gr,
      kontakt: kont,
      radnoVreme: vreme,
      lokacijaX: lokX,
      lokacijaY: lokY
    });
  }

  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  nacrtajDodajEventDugme() {
    if (this.state.administrator === true)
      return (
        <div>
          <DodajEventModal dodajDogadjaj={this.dodajDogadjaj} />
        </div>
      );
  }
  nacrtajIzmeniPodatke() {
    if (this.state.administrator === true)
      return (
        <div>
          <IzmeniOsnovnePodatke
            podaciState={this.handlePromenaPodataka}
            nazivPozorista={this.state.nazivPozorista}
            ulica={this.state.ulica}
            grad={this.state.grad}
            kontakt={this.state.kontakt}
            radnoVreme={this.state.radnoVreme}
            lokacijaX={this.state.lokacijaX}
            lokacijaY={this.state.lokacijaY}
            logOut={this.props.logOut}
          />
        </div>
      );
  }

  obradiFilter() {
    let novi = [];
    this.state.dogadjaji.map(dogadjaj => {
      if (parseInt(dogadjaj.cena) <= parseInt(this.state.filterCenaDo)) {
        if (
          new Date(this.state.filterDatum) - new Date(dogadjaj.datum_pocetka) >
          0
        )
          novi.push(dogadjaj);
      }
    });
    this.setState({ dogadjajiZaPrikaz: novi });
  }
  nacrtajDogadjaj(dogadjaj) {
    return (
      <Dogadjaj
        logOut={this.props.logOut}
        key={dogadjaj.id}
        guest={this.state.guest}
        administrator={this.state.administrator}
        idDogadjaja={dogadjaj.id}
        slika={dogadjaj.url_slike}
        naslov={dogadjaj.naziv}
        opis={dogadjaj.opis}
        datum={dogadjaj.datum_pocetka}
        duzina_trajanja={dogadjaj.duzina_trajanja}
        cena={dogadjaj.cena}
        ocena_dogadjaja={dogadjaj.prosecnaOcena}
        vreme_odrzavanja={dogadjaj.vreme_odrzavanja}
        aktivan={dogadjaj.aktivan}
      />
    );
  }
  vratiInfo() {
    fetch("./ThOr_php/vratiInfo.php")
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(info =>
        this.setState({
          nazivPozorista: info.naziv,
          ulica: info.ulica,
          grad: info.grad,
          kontakt: info.kontakt,
          radnoVreme: info.radnoVreme,
          lokacijaX: info.lokacijaX,
          lokacijaY: info.lokacijaY
        })
      )
      .catch(er => console.log(er));
  }

  vratiDogadjaje() {
    fetch("./ThOr_php/vratiDogadjaje.php")
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(od => this.setState({ dogadjaji: od, dogadjajiZaPrikaz: od }))
      .catch(er => console.log(er));
  }

  nacrtajDogadjaje() {
    let kartice = [];
    let open = this.state.open;
    this.state.dogadjajiZaPrikaz.map(dogadjaj => {
      if (dogadjaj.aktivan == 1) kartice.push(this.nacrtajDogadjaj(dogadjaj));
    });

    return (
      <div className="daBiMoglaPozadinaLepa">
        <div className="repertoar" id="Repertoar">
          <Container className="reperoarNaslovKontejner" fluid="true">
            <Row>
              <Col>
                <h1 className="repertoarNaslov">Repertoar</h1>
              </Col>
              <Col className="search">
                <Button
                  variant="outline-light"
                  onClick={() => this.setState({ open: !open })}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  Filtriraj{"  "}
                  <i className="fas fa-search" />
                </Button>
              </Col>
            </Row>
          </Container>
          <Collapse className="filteriTelo" in={this.state.open}>
            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Maksimalna cena karte: </Form.Label>
                  <Form.Control
                    name="filterCenaDo"
                    type="number"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Krajnji datum:</Form.Label>
                  <Form.Control
                    name="filterDatum"
                    type="date"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} />
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    this.obradiFilter();
                  }}
                >
                  <i className="fas fa-search" />
                </Button>
              </Form.Row>
            </Form>
          </Collapse>
          <div className="linija" />
          <div className="divDogadjaji">
            {kartice}
            {this.nacrtajDodajEventDugme()}
          </div>
        </div>
      </div>
    );
  }
  nacrtajSlide() {
    return (
      <div className={this.state.drugaNaslovna ? "naslovna" : "naslovna2"}>
        <h1 className="naslov">
          SA POZORIŠTEM <br />
          NA TI
        </h1>
      </div>
     
    );
  }
  nacrtajMapu() {
    return (
      <div className="mapa">
        <Map
          center={[this.state.lokacijaX, this.state.lokacijaY]}
          zoom={13}
          style={{
            height: "80vh"
          }}
          scrollWheelZoom={false}
          boxZoom={false}
         
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <Marker className="marker" position={[this.state.lokacijaX, this.state.lokacijaY]}>
          
          </Marker>
        </Map>
      </div>
    );
  }
  nacrtajLokaciju() {
    return (
      <div className="lokacija" id="Lokacija">
        {this.nacrtajMapu()}
        <div className="lokacijaOpis">
          <h3 className="lokacijaNaslov">KAKO DO NAS</h3>
          <p>
            <strong>
              {this.state.nazivPozorista}
              <br />
            </strong>
            {this.state.ulica}
            <br />
            {this.state.grad}
            <br />
          </p>
          <p>
            <strong>Kontakt:</strong>
            <br />
            {this.state.kontakt}
          </p>
          <p>
            <strong>RadnoVreme:</strong>
            <br />
            {this.state.radnoVreme}
          </p>
          <div className="dugmeIzmeni">{this.nacrtajIzmeniPodatke()}</div>
        </div>
      </div>
    );
  }
  nacrtajPropagandu() {
    return (
      <div className="propagandaGlavni">
        <div className="propagandaUnutrasni">
          <h1>
            Ne propustite nijedan <br />
            događaj!
          </h1>
          <div className="propaganda">
            <div className="propagandaLogin">
              {this.state.guest ? (
                <KreirajNalogComponent loginState={this.props.loginState} />
              ) : (
                this.akoJeVecUlogovan()
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  akoJeVecUlogovan() {
    return (
      <div className="vecUlogovan">
        <div>
          <strong>Prijavljeni ste!</strong>
          <br />
        </div>
        <i className="fas fa-mail-bulk" />
        <div className="fusnota">
          Bićete obavešteni o predstojećim događajima
        </div>
      </div>
    );
  }

  nacrtajAbout() {
    return (
      <footer className="about">
        <div className="about-levo">
          <i className="fas fa-theater-masks" />
          <p>Theatre</p>
        </div>
        <div className="about-desno">
          <h5>{this.state.nazivPozorista}</h5>
          <p>
            {this.state.ulica}
            <br />
            {this.state.grad}
            <br />
            Kontakt: {this.state.kontakt}
          </p>
        </div>
      </footer>
    );
  }

  render() {
    return (
      <div className="Telo" id="Home">
        {this.nacrtajSlide()}
        {this.nacrtajDogadjaje()}
        {this.nacrtajPropagandu()}
        {this.nacrtajLokaciju()}

        {this.nacrtajAbout()}
        
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css"
        />
        <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js" />
      </div>
    );
  }
}
export default Telo;
