import React from "react";
import Modal from "react-bootstrap/Modal";
import ExtendedDogadjaj from "../Dogadjaj/ExtendedDogadjaj";
import "../Dogadjaj/DogadjajCSS.css";

class PopUpDetaljiDogadjaja extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: this.props.show
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
      this.props.hide();
    };
  }

  render() {
    return (
      <>
        <Modal
          centered="true"
          show={this.state.show}
          onHide={this.handleHide}
          className="modalExtendedDogadjaj"
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title className="title" id="example-custom-modal-styling-title">
              {this.props.dogadjaj.naziv}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <ExtendedDogadjaj
              guest={this.props.guest}
              administrator={this.props.administrator}
              tabela={true}
              idDogadjaja={this.props.dogadjaj.id}
              slika={this.props.dogadjaj.url_slike}
              naslov={this.props.dogadjaj.naziv}
              opis={this.props.dogadjaj.opis}
              datum={this.props.dogadjaj.datum_pocetka}
              duzina_trajanja={this.props.dogadjaj.duzina_trajanja}
              cena={this.props.dogadjaj.cena}
              ocena_dogadjaja={this.props.dogadjaj.prosecnaOcena}
              vreme_odrzavanja={this.props.dogadjaj.vreme_odrzavanja}
              aktivan={this.props.dogadjaj.aktivan}
              promeniAktivnost={this.props.promeniAktivnost}
              logOut={this.props.logOut}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpDetaljiDogadjaja;
