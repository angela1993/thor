import React from "react";
import Button from "react-bootstrap/Button";
import RatingComponent from "./RatingComponent";

import Zakazivanje from "../Zakazivanje/zakaziComponent";
import Collapse from "react-bootstrap/Collapse";
import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
//za komentare u okviru istog popup-a
import JedanKomentar from "./Komentar";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import "./DogadjajCSS.css";
import Otkazivanje from "./Otkazivanje";
class ExtendedDogadjaj extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "komentari",
      guest: this.props.guest,
      administrator: this.props.administrator,
      idDogadjaja: this.props.idDogadjaja,
      slika: this.props.slika,
      naslov: this.props.naslov,
      opis: this.props.opis,
      datum: this.props.datum,
      duzina_trajanja: this.props.duzina_trajanja,
      cena: this.props.cena,
      aktivan: this.props.aktivan,
      ocena_dogadjaja: Number.parseFloat(this.props.ocena_dogadjaja).toFixed(1),
      vreme_odrzavanja: this.props.vreme_odrzavanja,
      korisnikovKomentar: " ",
      open: false,
      show: false,
      openKomentari: false,
      konf_sedista: "",
      zauzeta_sedista: "",
      upisanKomentar: false,
      spinnerDodajemKomentar: false,

      informacijeOkomentarima: []
    };
    this.Sadrzaj = this.Sadrzaj.bind(this);
    this.handleZakazi = this.handleZakazi.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleKomentari = this.handleKomentari.bind(this);
    this.nacrtaj_zakazivanje = this.nacrtaj_zakazivanje.bind(this);
    this.KomentarOnChageHandler = this.KomentarOnChageHandler.bind(this);
    this.unesiKomentarHandler = this.unesiKomentarHandler.bind(this);
    this.promeniZauzetaMesta = this.promeniZauzetaMesta.bind(this);
    this.promeniOcenu = this.promeniOcenu.bind(this);
    this.vratiKomentare = this.vratiKomentare.bind(this);
    this.izbrisanKomentar = this.izbrisanKomentar.bind(this);
  }

  vratiKomentare() {
    const formData = new FormData();
    formData.append("idDogadjaja", this.state.idDogadjaja);
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/vratiKomentare.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(odg => {
        if (odg["Greska"] === "NEMA") {
          this.setState(
            {
              informacijeOkomentarima: odg["Informacije"],
              UcitaniKomentari: true
            },
            () => this.setState({ key: "komentari" })
          );
        } else {
          this.props.logOut();
        }
      })
      .catch(err => console.log(err));
  }

  promeniZauzetaMesta(nova) {
    this.setState({ zauzeta_sedista: nova });
  }
  izbrisanKomentar(idKomentara) {
    var novi = this.state.informacijeOkomentarima;
    var index = novi.findIndex(function(o) {
      return o.id === idKomentara;
    });
    if (index !== -1) novi.splice(index, 1);

    this.setState({ informacijeOkomentarima: novi });
  }

  promeniOcenu(novaOcena) {
    this.setState({ ocena_dogadjaja: Number.parseFloat(novaOcena).toFixed(1) });
  }
  componentDidUpdate(prevProps) {
    if (this.props.guest !== prevProps.guest) {
      this.setState({ guest: this.props.guest });
    }
    if (this.props.administrator !== prevProps.administrator) {
      this.setState({ administrator: this.props.administrator });
    }
  }

  componentDidMount() {
    // Ucitavamo stolice
    fetch("./ThOr_php/vratiDogadjaje.php")
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(dogadjaji => {
        dogadjaji.forEach(dogadjaj => {
          if (dogadjaj.id === this.state.idDogadjaja) {
            let trazena_sala = dogadjaj.idIzabraneSale;
            fetch("./ThOr_php/vratiSale.php")
              .then(odg1 => {
                if (!odg1.ok) throw new Error("fetch greska");
                else return odg1.json();
              })
              .then(sale => {
                sale.forEach(sala => {
                  if (sala.id === trazena_sala) {
                    let rSedista = sala.konfiguracija_mesta; // dobijen je raspored sedista

                    const formData = new FormData();
                    formData.append("idDogadjaja", this.state.idDogadjaja);
                    const fetchData = { method: "POST", body: formData };
                    fetch("./ThOr_php/vratiZauzetaMesta.php", fetchData)
                      .then(odg => {
                        if (!odg.ok) throw new Error("fetch greska");
                        else return odg.json();
                      })
                      .then(zauzeta_mesta => {
                        this.setState({
                          konf_sedista: rSedista,
                          zauzeta_sedista: zauzeta_mesta,
                          ucitanaSedista: true
                        });
                      })
                      .catch(err => console.log(err));
                  }
                });
              })
              .catch(er => console.log(er));
          }
        });
      })
      .catch(er => console.log(er));
    // Ucitavamo komentare

    this.vratiKomentare();
    
  }
  vratiMesec() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let datum = new Date(this.state.datum);
    return monthNames[datum.getMonth()];
  }
  vratiDan() {
    let datum = new Date(this.state.datum);
    return datum.getDate();
  }
  Sadrzaj() {
 
    return (
      <div className="extendedDogadjaj">
        <div className="ExtendedSadrzaj">
          <div className="SadrzajOpis">
            <div className="extendedHeader">
              <h3 className="DogadjajNaslov">{this.state.naslov}</h3>
              <div className="dogadjajTrajanje">
                {this.state.duzina_trajanja}
              </div>
            </div>
            <div className="linija" />
            {this.state.opis}
          </div>
          <div className="SadrzajBar">
            <div className="gornjiDeo">
              <Image className="ExtendedSlika" src={this.state.slika} fluid />
            </div>

            <div className="sadrzajOcena">
              <div className="postojecaOcena">
                {this.state.ocena_dogadjaja}

                {"/5  "}

                <i className="fas fa-star" />
              </div>

              {this.props.tabela !== true ? (
                <>
                  <div className="crticaOcena" />
                  <div className="novaOcena">
                    <OverlayTrigger
                      trigger="click"
                      placement="left"
                      overlay={
                        <Popover id="popover-ocenjivanje" title="">
                          {this.state.guest === false ? (
                            <RatingComponent
                              logOut={this.props.logOut}
                              promeniOcenu={this.promeniOcenu}
                              idDogadjaja={this.state.idDogadjaja}
                            />
                          ) : (
                            <>Morate se prijaviti da bi ocenili događaj</>
                          )}
                        </Popover>
                      }
                    >
                      <div>
                        <i className="far fa-star" />
                        {"  "}
                        Oceni
                      </div>
                    </OverlayTrigger>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="sadrzajVreme">
              <div className="sat">
                <i className="far fa-clock" />
              </div>
              <div>{this.state.vreme_odrzavanja}</div>
            </div>
            <div className="sadrzajDatum">
              <div className="kalendar">
                <i className="far fa-calendar-alt" />
              </div>
              <div>
                {this.vratiDan()}
                {"  "}
                {this.vratiMesec()}
              </div>
            </div>

            <div className="sadrzajCena">
              <div className="novac">
                <i className="fas fa-money-bill-wave" />
              </div>
              <div>{this.state.cena}</div>
            </div>
          </div>
        </div>

        {this.props.tabela !== true ? (
          <div className="kontrole">
            <div
              className="ostaviMesto"
              onClick={this.state.guest ? this.handleShow : this.handleZakazi}
            >
              Rezerviši kartu{"  "}
              <i className="fas fa-ticket-alt" />
            </div>
            <div
              className="ostaviKomentar"
              onClick={
                this.state.guest ? this.handleShow : this.handleKomentari
              }
            >
              Ostavi Komentar{"  "} <i className="fas fa-comment-medical" />
            </div>{" "}
          </div>
        ) : (
          <Otkazivanje
            className="otkazivanje"
            promeniAktivnost={this.props.promeniAktivnost}
            idDogadjaja={this.props.idDogadjaja}
            aktivan={this.props.aktivan}
            datum={this.props.datum}
            logOut={this.props.logOut}
          />
        )}
      </div>
    );
  }

  handleHide() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }

  nacrtaj_zakazivanje() {
    return (
      <>
        {this.state.ucitanaSedista === false ? (
          <Spinner className="spiner" animation="border" variant="info" />
        ) : (
          <div className="divZakazivanje">
            <Zakazivanje
              rasporedSedista={this.state.konf_sedista}
              zauzetaSedista={this.state.zauzeta_sedista}
              idDogadjaja={this.state.idDogadjaja}
              izvrsenaZamena={this.promeniZauzetaMesta}
              logOut={this.props.logOut}
              naslov={this.state.naslov}
              datum={this.state.datum}
              vreme={this.state.vreme_odrzavanja}
            />
          </div>
        )}
      </>
    );
  }
  handleZakazi() {
    let o = !this.state.open;
    this.setState({
      open: o
    });
  }
  handleKomentari() {
    let o = !this.state.openKomentari;
    this.setState({
      openKomentari: o
    });
  }

  //za komentare u okviru istog popup-a

  getKomentari() {
    let komentari = [];
    let i = 0;
    this.state.informacijeOkomentarima.forEach(info => {
      komentari.push(
        <JedanKomentar
          key={i}
          guest={this.state.guest}
          administrator={this.state.administrator}
          id={info["id"]}
          username={info["username"]}
          date={info["datum"]}
          message={info["komentar"]}
          izbrisanKomentar={this.izbrisanKomentar}
        />
      );
      i++;
    });

    return <div className="komentariKontejner">{komentari} </div>;
  }
  unesiKomentarHandler(evt) {
    this.setState({ UcitaniKomentari: false });
    this.setState({
      upisanKomentar: false,
      spinnerDodajemKomentar: true
    });
    const formData = new FormData();
    formData.append("idDogadjaja", this.state.idDogadjaja);
    formData.append("komentar", this.state.korisnikovKomentar);
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/dodajKomentar.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(odg => {
        if (odg["Greska"] === "NEMA") {
          this.vratiKomentare();
          this.setState({
            upisanKomentar: false,
            spinnerDodajemKomentar: false
          });
        } else {
          this.props.logOut();
          this.handleKomentari();
          this.setState({
            upisanKomentar: false,
            spinnerDodajemKomentar: false,
            UcitaniKomentari: false,
            show: true
          });
        }
      })
      .catch(err => console.log(err));
  }
  KomentarOnChageHandler(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  napraviKomentarSection() {
    return (
      <div className="komentarSection">
        {this.state.UcitaniKomentari === true ? (
          <Tabs
            defaultActiveKey="komentari"
            transition={false}
            className="komentariTabs"
            activeKey={this.state.key}
            onSelect={key => this.setState({ key: key })}
          >
            <Tab eventKey="komentari" title="Komentari">
              {this.state.UcitaniKomentari === true ? (
                this.getKomentari()
              ) : (
                <Spinner animation="border" variant="success" />
              )}
            </Tab>
            <Tab eventKey="dodajKomentar" title="Dodaj Komentar">
              <Form.Group controlId="sopstveniKomentar">
                <Form.Control
                  as="textarea"
                  name="korisnikovKomentar"
                  rows="5"
                  placeholder="Vas komentar"
                  onChange={this.KomentarOnChageHandler}
                />
                <hr />
                <Button
                  variant="outline-success"
                  onClick={this.unesiKomentarHandler}
                >
                  {//upisanKomentar: false,spinnerDodajemKomentar: false,
                  (() => {
                    if (this.state.upisanKomentar === false) {
                      if (this.state.spinnerDodajemKomentar === false)
                        return <>Upišite komentar</>;
                    }
                    if (this.state.upisanKomentar === true) {
                      return <i className="fas fa-check" />;
                    }
                    if (this.state.upisanKomentar === false) {
                      if (this.state.spinnerDodajemKomentar === true) {
                        return (
                          <Spinner
                            className="spiner_zakazivanje"
                            animation="grow"
                            variant="dark"
                            size="sm"
                          />
                        );
                      }
                    }
                  })()}
                </Button>
              </Form.Group>
            </Tab>{" "}
          </Tabs>
        ) : (
          <Spinner animation="border" variant="success" />
        )}
      </div>
    );
  }
  //kraj
  render() {
    return (
      <>
        <div className="ExtendedGlavni">
          {/*<Image fluid className="ExtendedSlika" src={this.state.slika} />
          <h3 className="DogadjajNaslov">{this.state.naslov}</h3>*/}

          {this.Sadrzaj()}
          {this.props.tabela !== true ? (
            <>
              {" "}
              <Collapse in={this.state.open}>
                <div className="sedista">{this.nacrtaj_zakazivanje()}</div>
              </Collapse>
              <Collapse in={this.state.openKomentari}>
                <div className="sedista">{this.napraviKomentarSection()}</div>
              </Collapse>
            </>
          ) : (
            <></>
          )}
        </div>

        <Alert show={this.state.show} variant="light">
          <Alert.Heading>Niste prijavljeni</Alert.Heading>
          <p>Da bi pristupili dodatnom sadržaju morate biti prijavljeni.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={this.handleHide} variant="outline-secondary">
              U redu.
            </Button>
          </div>
        </Alert>
      </>
    );
  }
}
export default ExtendedDogadjaj;
