import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
class Obavestenje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      naslov: "",
      sadrzaj: "",
      loading: false
    };

    this.posaljiMejl = this.posaljiMejl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.obradiOdgovor = this.obradiOdgovor.bind(this);
  }

  posaljiMejl() {
    this.setState({ loading: true });

    const formData = new FormData();
    formData.append("naslov", this.state.naslov);
    formData.append("sadrzaj", this.state.sadrzaj);
    const fetchData = { method: "post", body: formData };

    fetch("./ThOr_php/posaljiObavestenje", fetchData)
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        else return response.json();
      })
      .then(odgovor => this.obradiOdgovor(odgovor))
      .catch(er => console.log(er));
      this.props.hide();
  }

  obradiOdgovor(odgovor) {
    if (odgovor["Greska"] === "NEMA") {
      console.log("Obavestenje je poslato");
      this.setState({ loading: false });
    }
    else  if(odgovor["Greska"]==="NISTE_ADMIN"||odgovor["Greska"]==="SESIJA_ISTEKLA"||odgovor["Greska"]==="NIJE_PRIJAVLJEN"){
      alert(odgovor["Greska"]);
      this.props.logOut();
    }
    else
    {
      console.log("Doslo je do greske pri slanju obavestanja");
    }
  }

  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  render() {
    return (
      <>
        {this.state.loading === true ? (
          <>
            <Spinner animation="border" variant="primary" />
          </>
        ) : (
          <Form>
            <Form.Group controlId="mailForm.Subject">
              <Form.Label>Naslov</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="naslov"
                type="text"
                placeholder="naslov"
              />
            </Form.Group>
            <Form.Group controlId="mailForm.Content">
              <Form.Label>Sadržaj</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="sadrzaj"
                as="textarea"
                rows="10"
                placeholder="..."
              />
            </Form.Group>
            <Button variant="dark" type="button" onClick={this.posaljiMejl}>
              Pošalji
            </Button>
          </Form>
        )}
      </>
    );
  }
}

export default Obavestenje;
