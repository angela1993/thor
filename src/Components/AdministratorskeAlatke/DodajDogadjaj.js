import React from "react";
import "./DodajDogadjaj.css";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class DodajDogadjaj extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      previewNaslov: "Naslov",
      previewOpis: "Opis:",
      previewDatum: "2000-01-01",
      previewSatnica: "20:00",
      previewDuzinaTrajanja: "",
      previewCena: 100,
      idIzabraneSale: 0,
      nazivButtona: "Izaberite salu",
      sale: [],
      previewSlikaUrl:
        "https://imaging.broadway.com/images/poster-178275/w230/222222/96929-15.jpeg",

      show: false,
      dogadjaj: {}
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };

    this.iscrtajformu = this.iscrtajformu.bind(this);
    this.menjajPreviewKarticu = this.menjajPreviewKarticu.bind(this);
    this.obaviUbacivanje = this.obaviUbacivanje.bind(this);
    this.ucitajSale = this.ucitajSale.bind(this);
    this.iscrtajOpcijeZaSalu = this.iscrtajOpcijeZaSalu.bind(this);
    this.izabranaSala = this.izabranaSala.bind(this);
    this.ucitajSale();
  }
  obaviUbacivanje() {
    if (this.state.idIzabraneSale === 0) {
      return;
    }
    // ubacivanje dogadjaja u bazu
    let opis = this.state.previewOpis.replace(/'/gi, "''"); // ovo /'/gi umesto "'"       => radi kao global case-insensitive replacement
    let naslov = this.state.previewNaslov.replace(/'/gi, "''");
    let url = this.state.previewSlikaUrl.replace(/'/gi, "''");

    const formData = new FormData();
    formData.append("naziv", naslov);
    formData.append("datum_pocetka", this.state.previewDatum);
    formData.append("cena", this.state.previewCena);
    formData.append("duzina_trajanja", this.state.previewDuzinaTrajanja);
    formData.append("aktivan", "1");
    formData.append("opis", opis);
    formData.append("url_slike", url);
    formData.append("idIzabraneSale", this.state.idIzabraneSale);
    formData.append("vreme_odrzavanja", this.state.previewSatnica);

    const fetchData = { method: "POST", body: formData };

    fetch("./ThOr_php/dodajDogadjaj.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else {
          // MORA OVDE DA BI BILO SIHRONIZOVANO
          //trazimo id Poslednjeg dogadjaja
          return odg.json();
        }
      })
      .then(odg => {
        this.props.dodajDogadjaj(odg);
        fetch("./ThOr_php/vratiIdNajnovijegDogadjaja.php")
          .then(odg2 => {
            if (!odg2.ok) throw new Error("fetch greska");
            else {
              return odg2.json();
            }
          })
          .then(idPoslednjegDogadjaja => {
            // trazimo default konfiguraciju sale
            fetch("./ThOr_php/vratiSale.php")
              .then(odg => {
                if (!odg.ok) throw new Error("fetch greska");
                else {
                  return odg.json();
                }
              })
              .then(sale => {
                sale.forEach(e => {
                  if (e.id === this.state.idIzabraneSale) {
                    //ovde konacno pozivamo da se upise to u tabelu Zauzet mesta
                    const formData1 = new FormData();
                    formData1.append("idDogadjaj", idPoslednjegDogadjaja);
                    formData1.append("zauzetaMesta", e.default_zauzeta_sedista);

                    const fetchData1 = { method: "POST", body: formData1 };
                    fetch("./ThOr_php/dodajUtabeluZauzetaMesta.php", fetchData1)
                      .then(odg => {
                        if (!odg.ok) throw new Error("fetch greska");
                      })

                      .catch(er => console.log(er));
                  }
                });
              })
              .catch(er => console.log(er));
          })
          .catch(er => console.log(er));
      })
      .catch(er => console.log(er));

    this.handleHide();
  }
  componentWillUnmount() {
    this.setState = {
      previewNaslov: "Naslov",
      previewOpis: "Opis:",
      previewDatum: "2000-01-01",
      previewSatnica: "20:00",
      previewDuzinaTrajanja: "",
      idIzabraneSale: 0,
      sale: [],

      previewCena: "",
      previewSlikaUrl: "",

      show: false
    };
  }
  menjajPreviewKarticu(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }
  ucitajSale() {
    fetch("./ThOr_php/vratiSale.php")
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(od => this.setState({ sale: od }))
      .catch(er => console.log(er));
  }
  izabranaSala(evt) {
    // let sal = evt.target.name;       Nikako u setState da se stavlja promenljiva neka !
    // let salIme = "sala : " + sal;
    this.setState({
      idIzabraneSale: evt.target.name,
      nazivButtona: "sala id: " + evt.target.name
    });
  }
  iscrtajOpcijeZaSalu() {
    let niz_sala_html = this.state.sale.map((x, index) => {
      return (
        <Dropdown.Item key={index} onClick={this.izabranaSala} name={x.id}>
          {x.naziv} id:{x.id}
        </Dropdown.Item>
      );
    });
    return niz_sala_html;
  }

  iscrtajformu() {
    return (
      <div className="divZaFormu">
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Naslov</Form.Label>
            <Form.Control
              onChange={this.menjajPreviewKarticu}
              type="text"
              name="previewNaslov"
              placeholder="naziv dogadjaja"
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Datum</Form.Label>
            <Form.Control
              name="previewDatum"
              onChange={this.menjajPreviewKarticu}
              type="date"
              placeholder="12.10.2010"
            />
          </Form.Group>

          <Form.Group controlId="Cena">
            <Form.Label>Cena</Form.Label>
            <Form.Control
              name="previewCena"
              onChange={this.menjajPreviewKarticu}
              type="number"
              placeholder="500din"
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Satnica</Form.Label>
            <Form.Control
              name="previewSatnica"
              onChange={this.menjajPreviewKarticu}
              type="text"
              placeholder="17:00"
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Duzina trajanja</Form.Label>
            <Form.Control
              name="previewDuzinaTrajanja"
              onChange={this.menjajPreviewKarticu}
              type="text"
              placeholder="1h"
            />
          </Form.Group>
          <Form.Group controlId="opisPreviewCartice">
            <Form.Label>Opis dogadjaja</Form.Label>
            <Form.Control
              name="previewOpis"
              onChange={this.menjajPreviewKarticu}
              as="textarea"
              rows="3"
            />
          </Form.Group>
          <Form.Group controlId="url">
            <Form.Label>Navedite url slike</Form.Label>
            <Form.Control
              name="previewSlikaUrl"
              onChange={this.menjajPreviewKarticu}
              type="urlSlike"
              placeholder="example :https://cdn-img...."
            />
          </Form.Group>
          <Form.Group className="kontroleDodajDogadjaj">
            <DropdownButton
              variant="secondary"
              id="dropdownSala"
              title={this.state.nazivButtona}
            >
              {this.iscrtajOpcijeZaSalu()}
            </DropdownButton>

            <Button variant="success" onClick={this.obaviUbacivanje}>
              Dodaj dogadjaj
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
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
    let datum = new Date(this.state.previewDatum);
    return monthNames[datum.getMonth()];
  }
  vratiDan() {
    let datum = new Date(this.state.previewDatum);
    return datum.getDate();
  }
  vratiVreme() {
    return this.state.previewSatnica;
  }
  vratiDanText() {
    const dayNames = [
      "Nedelja",
      "Ponedeljak",
      "Utorak",
      "Sreda",
      "Cetvrtak",
      "Petak",
      "Subota"
    ];
    let datum = new Date(this.state.previewDatum);
    return dayNames[datum.getDay()];
  }
  iscrtajPreviewKarticu() {
    return (
      <Card
        className="previewCard"
        onClick={this.handleShow}
        style={{ width: "18rem" }}
      >
        <Card.Title className="karticaNaslov">
          {this.state.previewNaslov}
        </Card.Title>
        <Card.Img className="eventImage" src={this.state.previewSlikaUrl} />

        <Card.Body>
          {/*<Card.Text>{this.state.opis}</Card.Text>*/}
          <div className="karticaTelo">
            <div className="karticaDatum">
              <div className="karticaDan">{this.vratiDan()}</div>
              <div className="karticaMesec">{this.vratiMesec()}</div>
            </div>
            <div className="spacer" />
            <div className="karticaVreme">
              <div className="karticaDanTxt">{this.vratiDanText()}</div>
              <div className="karticaSat">{this.vratiVreme()}</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
  render() {
    return (
      <>
        <Card
          className="dodajDogadjajKartica"
          onClick={this.handleShow}
          style={{ width: "18rem" }}
        >
          <Card.Body>
            <i className="fas fa-plus" />
          </Card.Body>
        </Card>

        <Modal
          size="xl"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Dodaj novi dogadjaj
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="DodajEventFormaBox">
              {this.iscrtajformu()}
              {this.iscrtajPreviewKarticu()}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default DodajDogadjaj;
