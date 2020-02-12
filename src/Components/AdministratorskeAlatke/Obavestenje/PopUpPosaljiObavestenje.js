import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Obavestenje from "./Obavestenje";
class PopUpKorisnici extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false
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
        <NavDropdown.Item onClick={this.handleShow}>
          Pošalji Obaveštenje
        </NavDropdown.Item>

        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="ObavestenjeModal">Obaveštenje</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Obavestenje hide={this.handleHide} logOut={this.props.logOut} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpKorisnici;
