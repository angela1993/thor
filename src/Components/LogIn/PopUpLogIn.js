import React from "react";
import Modal from "react-bootstrap/Modal";
import LogInComponent from "./LogInComponent";
import Nav from "react-bootstrap/Nav";
import "./PopUpLogIn.css";

class PopUpLogIn extends React.Component {
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
        <Nav.Link onClick={this.handleShow}>Prijavi se</Nav.Link>

        <Modal
          centered="true"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          scrollable="false"
        >
          <Modal.Header closeButton>
            <Modal.Title className="title" id="example-custom-modal-styling-title">
              Prijava
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LogInComponent loginState={this.props.loginState} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PopUpLogIn;
