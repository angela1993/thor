import React from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class JedanKomentar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guest: props.guest,
      administrator: props.administrator,
      username: props.username,
      id: props.id,
      date: props.date,
      message: props.message,
      picture: props.picture
    };
    this.IzbrisiHandler = this.IzbrisiHandler.bind(this);
  }
  IzbrisiHandler(evt) {
    let idKomentara;
    if (evt.target.nodeName === "I") {
      idKomentara = evt.target.parentElement.value;
    } else {
      idKomentara = evt.target.value;
    }
    const formData = new FormData();
    formData.append("id", idKomentara);
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/izbrisiKomentar.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else {
          this.props.izbrisanKomentar(idKomentara);
          return odg.json();
        }
      })
      .then(odg => {
        console.log(odg);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="komentar">
        <Image
          className="komentar-slika"
          src="https://images.unsplash.com/photo-1536164261511-3a17e671d380?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=330&q=80"
          alt="profile"
          roundedCircle
        />
        <div className="komentar-telo">
          <div className="well well-lg">
            <div className="komentar-header">
              <div className="komentar-korisnik">{this.state.username} </div>
              <div className="komentar-datum">{this.state.date}</div>
            </div>

            <p className="komentar-tekst">{this.state.message}</p>
          </div>

          <div className="samoZaDugme">
            {this.state.administrator && (
              <>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">Obrisi komentar</Tooltip>
                  }
                >
                  <Button
                    className="btnIzbrisi"
                    variant="outline-danger"
                    value={this.state.id}
                    onClick={this.IzbrisiHandler}
                  >
                    <i className="fas fa-times" />
                  </Button>
                </OverlayTrigger>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default JedanKomentar;
