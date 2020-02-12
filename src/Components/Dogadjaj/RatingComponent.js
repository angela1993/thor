import React from "react";
import StarRatingComponent from "react-star-rating-component";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class RatingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 1,
      obradjen: false,
      spinnerActive: false,
      idDogadjaja: props.idDogadjaja
    };
    this.obradiOcenjivanje = this.obradiOcenjivanje.bind(this);
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }
  obradiOcenjivanje(evt) {
    evt.target.disabled = true;
    this.setState({ spinnerActive: true });

    const formData = new FormData();
    formData.append("idDogadjaja", this.state.idDogadjaja);
    formData.append("ocena", this.state.rating);
    const fetchData = { method: "POST", body: formData };
    fetch("./ThOr_php/oceniDogadjaj.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(odg => {
        if (odg["NovaOcena"]) {
          this.props.promeniOcenu(odg["NovaOcena"]);
          this.setState({ obradjen: true, spinnerActive: false });
        } else {
          alert(odg["Greska"]);
          this.props.logOut();
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { rating } = this.state;

    return (
      <div className="divRatingComponent">
        <StarRatingComponent
          name="rate1"
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
          renderStarIcon={() => <i class="fas fa-star" />}
        />
        <Button
          className="OceniButton"
          variant="outline-dark"
          onClick={this.obradiOcenjivanje}
        >
          {// renderovanje uz pomoc IIFE
          (() => {
            if (this.state.obradjen === false) {
              if (this.state.spinnerActive === false) {
                return <>Ok</>;
              }
            }
            if (this.state.obradjen === false) {
              if (this.state.spinnerActive === true) {
                return (
                  <Spinner
                    className="spiner_zakazivanje"
                    animation="grow"
                    variant="dark"
                    size="sm"
                  />
                );
              }
            }
            if (this.state.obradjen === true) {
              return <i className="fas fa-check" />;
            }
          })()}
        </Button>
      </div>
    );
  }
}
export default RatingComponent;
