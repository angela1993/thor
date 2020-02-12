import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Korisnici from "./Korisnici";
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
        <NavDropdown.Item onClick={this.handleShow}>Korisnici</NavDropdown.Item>

        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="KorisniciModal">Korisnici</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Korisnici logOut={this.props.logOut} show={this.handleShow}  hide={this.handleHide} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpKorisnici;
