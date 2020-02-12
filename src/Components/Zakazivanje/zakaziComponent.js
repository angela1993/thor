import React from "react";
import "./ZakaziCss.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class Zakazivanje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinerActive: false,
      stiklica: false,
      idDogadjaja: props.idDogadjaja
    };

    this.handleClickSediste = this.handleClickSediste.bind(this);
    this.handleCLickZakazi = this.handleCLickZakazi.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.zauzetaSedista !== prevProps.zauzetaSedista) {
      this.obojiZazuzetaSedista();
    }
  }
  componentDidMount() {
    this.obojiZazuzetaSedista();
  }
  PodeliNaBrojKolona() {
    let kolonaArr = [];
    let stepen = 1;
    let broj = 0;
    let invertBroj = [];

    for (const z of this.props.rasporedSedista) {
      if (z === ",") {
        for (let i = invertBroj.length - 1; i >= 0; i--) {
          broj += invertBroj[i] * stepen;
          stepen *= 10;
        }
        invertBroj = [];
        kolonaArr.push(broj);
        stepen = 1;
        broj = 0;
      } else {
        invertBroj.push(z);
      }
    }
    return kolonaArr;
  }
  handleClickSediste(e) {
    if (e.target.nodeName === "I") {
      // dodatna provera jer kad se klikne na dugme , a zapravo se klikne na ikonicu onda on misli da se kliknulo na ikonicu
      let dugme = document.querySelector(
        "button[value='" + e.target.parentElement.value + "']"
      );
      if (dugme.style.backgroundColor !== "red") {
        dugme.style.backgroundColor = "#045FB4";
      }
    } else {
      let dugme = document.querySelector(
        "button[value='" + e.target.value + "']"
      );
      if (dugme.style.backgroundColor !== "red") {
        dugme.style.backgroundColor = "#045FB4"; // ovo je vezano za Zakazi ! Pazi kad menjas
      }
    }
  }
  handleCLickZakazi(e) {
    this.setState({
      spinerActive: true
    });
    let sve_stolice = document.querySelectorAll(".btnSediste");

    let zakazane_stolice = [];
    // proverimo da li je plava boja, naprostije tako
    sve_stolice.forEach(x => {
      let boja = x.style.backgroundColor;
      if (boja === "rgb(4, 95, 180)") {
        zakazane_stolice.push(x);
      }
    });
    let indeksi_zakazanih = [];
    zakazane_stolice.forEach(x => {
      let vrsta_off = x.value.split(".");

      let konf = this.props.rasporedSedista.split(",");
      let brojac = 0;
      for (let i = 0; i < vrsta_off[0]; i++) {
        brojac += parseInt(konf[i]);
      }
      brojac += parseInt(vrsta_off[1]);
      indeksi_zakazanih.push(brojac);
    });
    //podesavamo string za Rezervaciju
    let zakazane_stolice_string_array = [];
    zakazane_stolice.forEach(x => {
      zakazane_stolice_string_array.push(x.value);
    });
    let zakazane_stolice_string = zakazane_stolice_string_array.join(",");
    // u zakazane_stolice_string se nalaze sedista za rezervaciju

    let string_za_bazu = indeksi_zakazanih.join(",");
    const formData = new FormData();
    formData.append("string_zauzetih_indeksa", string_za_bazu);
    formData.append("idDogadjaja", this.state.idDogadjaja);
    const fetchData = { method: "POST", body: formData };
        let novaZauzeta;
    fetch("./ThOr_php/zakaziMesta.php", fetchData)
      .then(odg => {
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(odg => {
        if (odg["Greska"] === "NEMA") {
          novaZauzeta=odg["Ret"];
          
        } else {
          alert(odg["Greska"]);
          this.props.logOut();
          return;
        }
      })
      .catch(err => console.log(err));

    const formData1 = new FormData();
    formData1.append("string_mesta", zakazane_stolice_string);
    formData1.append("idDogadjaja", this.state.idDogadjaja);
    formData1.append("naslov",this.props.naslov);
    formData1.append("datum",this.props.datum);
    formData1.append("vreme",this.props.vreme);
    const fetchData1 = { method: "POST", body: formData1 };

    fetch("./ThOr_php/upisiRezervaciju.php", fetchData1)
      .then(odg => {
     
        if (!odg.ok) throw new Error("fetch greska");
        else return odg.json();
      })
      .then(odg => {
        if (odg["Greska"] !== "NEMA") {
          alert(odg["Greska"]);
          this.props.logOut();
          return;
        }
        else
        {
          this.props.izvrsenaZamena(novaZauzeta);
          this.setState({
            spinerActive: false,
            stiklica: true
          });
        }
      })
      .catch(err => console.log(err));

    // ovde bi sad trebao da bude fetch(odradiUpisUbazu) pa nakon toga da se setujeSpiner na false i da se pojavi neka Stiklica
  }
  IscrtajSedista() {
    let niz = this.PodeliNaBrojKolona();

    let vrsta = 0;

    let KonacniNiz = niz.map(broj_sedista => {
      // ovo je fora
      let vrstaSedista = [];
      for (let i = 0; i < broj_sedista; i++) {
        let val = vrsta + "." + i;
        vrstaSedista.push(
          <Button
            variant="info"
            className="btnSediste"
            key={val}
            value={val}
            onClick={this.handleClickSediste}
          >
            <i className="fas fa-chair" size="0.5x" />
          </Button>
        );
      }
      vrsta += 1;
      return (
        <div className="jednaVrsta" key={vrsta}>
          {vrstaSedista}
        </div>
      ); // mnogo dobra fora
    });

    return KonacniNiz;
  }
  obojiZazuzetaSedista() {
    let kolonaArray = this.PodeliNaBrojKolona();

    let trenutna_vrsta = 0;
    let trenutnaGranica = kolonaArray[trenutna_vrsta];
    let brojac_sedista = 0;
    let offset = 0;
    if (this.props.zauzetaSedista !== null)
      for (let x of this.props.zauzetaSedista) {
        if (brojac_sedista < trenutnaGranica) {
          if (x === "1") {
            let dugme = document.querySelector(
              "button[value='" + trenutna_vrsta + "." + offset + "']"
            );

            dugme.style.backgroundColor = "red";
          }

          brojac_sedista++;
          offset++;
        } else {
          trenutna_vrsta++;
          trenutnaGranica += kolonaArray[trenutna_vrsta];
          offset = 0;
          if (brojac_sedista < trenutnaGranica) {
            if (x === "1") {
              let dugme = document.querySelector(
                "button[value='" + trenutna_vrsta + "." + offset + "']"
              );

              dugme.style.backgroundColor = "red";
            }
          }

          brojac_sedista++;
          offset++;
        }
      }
  }
  renderSpinner() {
    return (
      <Spinner size="sm" role="status" animation="grow" variant="success" />
    );
  }

  render() {
    return (
      <div className="divZakazivanje">
        <div className="divSedista">{this.IscrtajSedista()}</div>

        <div className="kontroleZakazi">
          <div className="btnZakazi">
            <Button
              className="btnZakazi"
              variant="outline-success"
              onClick={this.handleCLickZakazi}
            >
              Zakaži mesta
              {this.state.spinerActive && this.renderSpinner()}
            </Button>
          </div>
          <div className="InvisibleSpiner" />

          {this.state.stiklica && (
            <Button variant="success">
              {" "}
              <i className="fas fa-check-circle" />{" "}
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default Zakazivanje;
