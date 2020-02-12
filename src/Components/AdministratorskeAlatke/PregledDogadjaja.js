import React from "react";
import Modal from "react-bootstrap/Modal";
import NavDropdown from "react-bootstrap/NavDropdown";
import TabelaDogadjaja from "../TabelaDogadjaja/TabelaDogadjaja";
class PregledDogadjaja extends React.Component {
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
          Pregled Događaja
        </NavDropdown.Item>

        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleHide}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="BanujModal">Dogadjaji</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TabelaDogadjaja
              refreshRepertoar={this.props.refreshRepertoar}
              guest={this.props.guest}
              administrator={this.props.administrator}
              logOut={this.props.logOut}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default PregledDogadjaja;
