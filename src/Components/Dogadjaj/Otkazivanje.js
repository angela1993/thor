import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class Otkazivanje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false
    };
    this.otkazi = this.otkazi.bind(this);
  }

  otkazi() {
    this.setState({ loader: true });
    var pom;
    const formData = new FormData();
    formData.append("idDogadjaja", this.props.idDogadjaja);
    if (this.props.aktivan == 1) {
      formData.append("Aktivan", 0);
      pom = 0;
    } else {
      pom = 1;
      formData.append("Aktivan", 1);
    }
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/aktivnostDogadjaja.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(odg => {
        if (odg["Greska"] === "NEMA") {
          this.props.promeniAktivnost(pom);
          this.setState({ loader: false });
        } else {
          this.props.logOut();
          alert(odg["Greska"]);
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    {
      console.log("otkazivanje:" + this.props.aktivan);
    }
    return (
      <div className="Otkazivanje">
        {new Date(this.props.datum) > new Date() === true ? (
          <>
            {this.state.loader === true ? (
              <>
                {" "}
                <Spinner animation="border" variant="primary" />
              </>
            ) : (
              <Button
                variant="outline-dark"
                type="button"
                onClick={this.otkazi}
              >
                {this.props.aktivan == 1 ? (
                  <>Otkazi</>
                ) : (
                  <>Postavi Na Aktivan</>
                )}
              </Button>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default Otkazivanje;
