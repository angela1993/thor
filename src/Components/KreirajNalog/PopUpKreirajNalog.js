import React from "react";
import Modal from "react-bootstrap/Modal";
import KreirajNalogComponent from "./KreirajNalogComponent";
import Nav from "react-bootstrap/Nav";
class PopUpKreirajNalog extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false,

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
        <Nav.Link onClick={this.handleShow}>Kreiraj Nalog</Nav.Link>

        <Modal
          centered="true"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Kreiraj Nalog
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <KreirajNalogComponent loginState={this.props.loginState} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpKreirajNalog;
