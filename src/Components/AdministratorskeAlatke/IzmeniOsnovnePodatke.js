import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class PopUpKreirajNalog extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      nazivPozorista: this.props.nazivPozorista,
      ulica: this.props.ulica,
      grad: this.props.grad,
      kontakt: this.props.kontakt,
      radnoVreme: this.props.radnoVreme,
      lokacijaX: this.props.lokacijaX,
      lokacijaY: this.props.lokacijaY
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
    this.podaciState = this.props.podaciState;
    this.handleChange = this.handleChange.bind(this);
    this.obradiFormu = this.obradiFormu.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.nazivPozorista !== prevProps.nazivPozorista) {
      this.setState({ nazivPozorista: this.props.nazivPozorista });
    }
    if (this.props.ulica !== prevProps.ulica) {
      this.setState({ ulica: this.props.ulica });
    }
    if (this.props.grad !== prevProps.grad) {
      this.setState({ grad: this.props.grad });
    }
    if (this.props.kontakt !== prevProps.kontakt) {
      this.setState({ kontakt: this.props.kontakt });
    }
    if (this.props.radnoVreme !== prevProps.radnoVreme) {
      this.setState({ radnoVreme: this.props.radnoVreme });
    }
    if (this.props.lokacijaX !== prevProps.lokacijaX) {
      this.setState({ lokacijaX: this.props.lokacijaX });
    }
    if (this.props.lokacijaY !== prevProps.lokacijaY) {
      this.setState({ lokacijaY: this.props.lokacijaY });
    }

  }
  obradiOdgovor(odg) {
    if (odg["Greska"] === "NEMA") {
    }
    else  if(odg["Greska"]==="NISTE_ADMIN"){
      alert("Nemate autorizaciju da menjate podatke");
    }
    else {
      this.props.logOut();
    }

    this.podaciState(
      this.state.nazivPozorista,
      this.state.ulica,
      this.state.grad,
      this.state.kontakt,
      this.state.radnoVreme,
      this.state.lokacijaX,
      this.state.lokacijaY
    );
    this.setState({ show: false });
  }

  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  obradiFormu() {
    const formData = new FormData();
    formData.append("naziv", this.state.nazivPozorista);
    formData.append("ulica", this.state.ulica);
    formData.append("grad", this.state.grad);
    formData.append("kontakt", this.state.kontakt);
    formData.append("radnoVreme", this.state.radnoVreme);
    formData.append("lokacijaX", this.state.lokacijaX);
    formData.append("lokacijaY", this.state.lokacijaY);
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/azurirajInfo.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else {
          return odg.json();
        }
      })
      .then(odg => this.obradiOdgovor(odg))
      .catch(er => console.log(er));
  }
  nacrtajTelo() {
    return (
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Naziv</Form.Label>
          <Form.Control
            name="nazivPozorista"
            type="text"
            placeholder={this.props.nazivPozorista}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group controlId="formBasicKorisnickoIme">
          <Form.Label>Adresa</Form.Label>
          <Form.Control
            name="ulica"
            type="text"
            placeholder={this.props.ulica}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group controlId="formBasicKorisnickoIme">
          <Form.Label>Grad</Form.Label>
          <Form.Control
            name="grad"
            type="text"
            placeholder={this.props.grad}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group controlId="formBasicKorisnickoIme">
          <Form.Label>Kontakt</Form.Label>
          <Form.Control
            name="kontakt"
            type="text"
            placeholder={this.props.kontakt}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group controlId="formBasicKorisnickoIme">
          <Form.Label>Radno vreme</Form.Label>
          <Form.Control
            name="radnoVreme"
            type="text"
            placeholder={this.props.radnoVreme}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>
        <Form.Group controlId="formBasicKorisnickoIme">
          <Form.Label>Koordinate</Form.Label>
          <Form.Control
            name="lokacijaX"
            type="text"
            placeholder={this.props.lokacijaX}
            onChange={this.handleChange}
          />
          <Form.Label />
          <Form.Control
            name="lokacijaY"
            type="text"
            placeholder={this.props.lokacijaY}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted" />
        </Form.Group>
        <Form.Group className="modalIzmeniInfoDugme">
          <Button variant="secondary" type="button" onClick={this.obradiFormu}>
            Sačuvaj
          </Button>
        </Form.Group>
      </Form>
    );
  }

  render() {
    return (
      <>
        <i className="fas fa-pencil-alt" onClick={this.handleShow} />

        <Modal
          centered="true"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Osnovni podaci o pozorištu
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.nacrtajTelo()}</Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpKreirajNalog;
