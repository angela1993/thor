import React from "react";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import ProfilKorisnika from "./ProfilKorisnika";

class PopUpProfilKorisnika extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,
      izmeni: false
    };

    this.handleShow = () => {
      this.setState({ show: true });
    };

    this.handleHide = () => {
      this.setState({ show: false });
    };
  }

  handleIzmeni() {
    let i = this.state.izmeni;
    this.setState({ izmeni: !i });
  }

  render() {
    return (
      <>
        <Nav.Link onClick={this.handleShow}>
          Profil {"  "}
          <i className="fas fa-user-circle" />
        </Nav.Link>

        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="ProfilKorisnikaModal">Profil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProfilKorisnika logOut={this.props.logOut} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpProfilKorisnika;
