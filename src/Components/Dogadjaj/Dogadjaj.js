import React from "react";
import Card from "react-bootstrap/Card";
import "./DogadjajCSS.css";
import ExtendedDogadjaj from "./ExtendedDogadjaj";
import Modal from "react-bootstrap/Modal";

class Dogadjaj extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      guest: props.guest,
      administrator: props.administrator,
      idDogadjaja: props.idDogadjaja,
      slika: props.slika,
      naslov: props.naslov,
      opis: props.opis,
      datum: props.datum,
      duzina_trajanja: props.duzina_trajanja,
      cena: props.cena,
      ocena_dogadjaja: props.ocena_dogadjaja,
      vreme_odrzavanja: props.vreme_odrzavanja,
      aktivan: props.aktivan,
      zaModal: false
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.guest !== prevProps.guest) {
      this.setState({ guest: this.props.guest });
    }
    if (this.props.administrator !== prevProps.administrator) {
      this.setState({ administrator: this.props.administrator });
    }
  }

  handleClose = () => {
    this.setState({ zaModal: false });
  };

  handleShow = () => {
    this.setState({ zaModal: true });
  };
  vratiMesec() {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let datum = new Date(this.state.datum);
    return monthNames[datum.getMonth()];
  }
  vratiDan() {
    let datum = new Date(this.state.datum);
    return datum.getDate();
  }
  vratiVreme() {
    return this.state.vreme_odrzavanja;
  }
  vratiDanText() {
    const dayNames = [
      "Nedelja",
      "Ponedeljak",
      "Utorak",
      "Sreda",
      "Cetvrtak",
      "Petak",
      "Subota"
    ];
    let datum = new Date(this.state.datum);
    return dayNames[datum.getDay()];
  }

  render() {
    return (
      <>
        <Card
          className="eventCard"
          onClick={this.handleShow}
          style={{ width: "18rem" }}
        >
          <Card.Title className="karticaNaslov">{this.state.naslov}</Card.Title>
          <Card.Img className="eventImage" src={this.state.slika} />

          <Card.Body>
            {/*<Card.Text>{this.state.opis}</Card.Text>*/}
            <div className="karticaTelo">
              <div className="karticaDatum">
                <div className="karticaDan">{this.vratiDan()}</div>
                <div className="karticaMesec">{this.vratiMesec()}</div>
              </div>
              <div className="spacer" />
              <div className="karticaVreme">
                <div className="karticaDanTxt">{this.vratiDanText()}</div>
                <div className="karticaSat">{this.vratiVreme()}</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Modal
          centered="true"
          show={this.state.zaModal}
          onHide={this.handleClose}
          className="modalExtendedDogadjaj"
          size="xl"
        >
          <Modal.Body>
            <ExtendedDogadjaj
              logOut={this.props.logOut}
              guest={this.props.guest}
              administrator={this.props.administrator}
              idDogadjaja={this.state.idDogadjaja}
              slika={this.state.slika}
              naslov={this.state.naslov}
              opis={this.state.opis}
              datum={this.state.datum}
              duzina_trajanja={this.state.duzina_trajanja}
              cena={this.state.cena}
              ocena_dogadjaja={this.state.ocena_dogadjaja}
              vreme_odrzavanja={this.state.vreme_odrzavanja}
              aktivan={this.state.aktivan}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default Dogadjaj;
