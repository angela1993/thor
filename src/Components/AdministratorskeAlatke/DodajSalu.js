import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import NavDropdown from "react-bootstrap/NavDropdown";
import Zakazivanje from "../Zakazivanje/zakaziComponent";
import "./DodajSaluCSS.css";

class DodajSalu extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      nazivSale: "sala1",
      rasporedSedista: "6,5,5,4,",
      zauzetaSedista: "00000000000000000000"
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
    this.promenjenaSala = this.promenjenaSala.bind(this);
    this.nacrtajCustomizaciju = this.nacrtajCustomizaciju.bind(this);
    this.PodeliNaBrojKolona = this.PodeliNaBrojKolona.bind(this);
    this.obaviUbacivanje = this.obaviUbacivanje.bind(this);
    this.imeChange = this.imeChange.bind(this);
  }
  obaviUbacivanje() {
    const formData = new FormData();
    formData.append("naziv", this.state.nazivSale);
    formData.append("konfiguracija_mesta", this.state.rasporedSedista);
    formData.append("default_zauzeta_sedista", this.state.zauzetaSedista);
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/dodajSalu.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
      })
      .catch(er => console.log(er));
    this.handleHide();
  }
  PodeliNaBrojKolona(rasporedSedista) {
    let kolonaArr = [];
    let stepen = 1;
    let broj = 0;
    let invertBroj = [];
    for (const z of rasporedSedista) {
      if (z === ",") {
        for (let i = invertBroj.length - 1; i >= 0; i--) {
          broj += invertBroj[i] * stepen;
          stepen *= 10;
        }
        invertBroj = [];
        kolonaArr.push(broj);
        stepen = 1;
        broj = 0;
      } else {
        invertBroj.push(z);
      }
    }
    return kolonaArr;
  }
  promenjenaSala() {
    let rasporedSedistaNovi = document.getElementById("FormatSaleInput").value;
    rasporedSedistaNovi += ",";
    let niz = this.PodeliNaBrojKolona(rasporedSedistaNovi);
    let count = 0;
    for (const z of niz) {
      count += parseInt(z);
    }
    let nule = "";
    for (let i = 0; i < count; i++) {
      nule += "0";
    }

    this.setState({
      rasporedSedista: rasporedSedistaNovi,
      zauzetaSedista: nule
    });
  }
  imeChange(evt) {
    this.setState({
      nazivSale: evt.target.value
    });
  }
  nacrtajCustomizaciju() {
    return (
      <div className="salaCustomization">
        <div>
          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Naziv sale</Form.Label>
              <Form.Control
                onChange={this.imeChange}
                type="imeSale"
                placeholder="Glavna sala"
              />
            </Form.Group>

            <Form.Label>Uneti format sale</Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                id="FormatSaleInput"
                placeholder="primer formata pri cemu svaki broj predstavlja koliko sedista ima u jednoj vrsti : 6,5,5,4"
              />
              <InputGroup.Append>
                <Button variant="outline-success" onClick={this.promenjenaSala}>
                  Generiši salu
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </div>
        <h4 className="PreviewTekstSala"> Preview sale </h4>
        <div className="SalaPreview">
          <Zakazivanje
            key={this.state.rasporedSedista} // Bez ovoga ne moze da se UPDATE-uje
            rasporedSedista={this.state.rasporedSedista}
            zauzetaSedista={this.state.zauzetaSedista}
          />
        </div>
        <div />
        <div className="btnSacuvajSalu">
          <Button
            variant="outline-success"
            id="dugmeSacuvajSalu"
            onClick={this.obaviUbacivanje}
          >
            Sačuvaj salu
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        <NavDropdown.Item onClick={this.handleShow}>Nova Sala</NavDropdown.Item>

        <Modal
          size="xl"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Nova sala
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.nacrtajCustomizaciju()}</Modal.Body>
        </Modal>
      </>
    );
  }
}
export default DodajSalu;
