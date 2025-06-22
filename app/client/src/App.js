import React, { useState } from "react";
import "./app.scss";
import axios from "axios";
import {
  Form,
  FormGroup,
  Select,
  SelectItem,
  Button,
  Loading,
} from "carbon-components-react";
import { years, months, costCentres, accounts } from "./utils";
import BarChart from "./components/dataviz/BarChart";
import "@carbon/charts/styles.css"; // ✅ Import Carbon chart styles

function App() {
  const [year, setYear] = useState(2019);
  const [month, setMonth] = useState("Jan");
  const [costCentre, setCostCentre] = useState("CC101");
  const [account, setAccount] = useState(1000000);
  const [prediction, setPrediction] = useState();
  const [scores, setScores] = useState([]);

  const runPred = async (year, month, costCentre, account) => {
    setPrediction("Scoring");

    try {
      const res = await axios.post("/api/wml/score", {
        year,
        month,
        costCentre,
        account,
      });

      const rawValue = res.data.predictions[0].values[0][0];
      const forecastValue = parseFloat(rawValue); // ✅ Ensure it's a number
      const groupId = `${year}${month}${costCentre}${account}`;

      const newScore = {
        group: groupId,
        value: forecastValue,
      };

      const updatedScores = [...scores, newScore];
      setScores(updatedScores);
      setPrediction(forecastValue);

      console.log("Forecast:", forecastValue, "All Scores:", updatedScores);
    } catch (error) {
      console.error("Prediction failed:", error);
      setPrediction(null);
    }
  };

  return (
    <div className="App">
      <div className="mainContainer">
        <Form>
          <FormGroup>
            <Select
              id="select-0"
              labelText="Select Year"
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {years.map((yearVal) => (
                <SelectItem key={yearVal} text={yearVal} value={yearVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Select
              id="select-1"
              labelText="Select Month"
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((monthVal) => (
                <SelectItem key={monthVal} text={monthVal} value={monthVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Select
              id="select-2"
              labelText="Select Cost Centre"
              onChange={(e) => setCostCentre(e.target.value)}
            >
              {costCentres.map((ccVal) => (
                <SelectItem key={ccVal} text={ccVal} value={ccVal} />
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Select
              id="select-3"
              labelText="Select Account"
              onChange={(e) => setAccount(parseInt(e.target.value))}
            >
              {accounts.map((accVal) => (
                <SelectItem key={accVal} text={accVal} value={accVal} />
              ))}
            </Select>
          </FormGroup>
          <Button onClick={() => runPred(year, month, costCentre, account)}>
            Predict
          </Button>
        </Form>

        <div className="predictionContainer">
          {prediction !== "Scoring" && prediction ? "The Model Predicted" : ""}
          <div className="predictionResult">
            {prediction === "Scoring" ? (
              <Loading description="Loading..." />
            ) : prediction ? (
              prediction
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="chartContainer">
          {scores.length > 0 && <BarChart data={scores} />}
        </div>
      </div>
    </div>
  );
}

export default App;
