import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Zakazivanje from "./zakaziComponent";

class PopUpZakazi extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      guest: props.guest,
      administrator: props.administrator
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  render() {
    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Rezervisi kartu
        </Button>

        <Modal
          size="xl"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Rezervacija
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Zakazivanje
              rasporedSedista="10,8,7,10," // mora zarez na kraju !! tako radi algoritam, ne smarajte
              zauzetaSedista="10010001011111000000111001100000001"
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpZakazi;
