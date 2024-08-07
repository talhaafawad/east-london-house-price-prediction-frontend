import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Plot from "react-plotly.js";
import axios from "axios";
import "./Home.scss";
import { showFailureToaster } from "../../utils/toaster";

const HousePriceForecast = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [model, setModel] = useState("");
  const [modelParams, setModelParams] = useState({});
  const [features, setFeatures] = useState("");
  const [response, setResponse] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [performance, setPerformance] = useState({});
  const [loader, setloader] = useState(false);

  const handleFeatureChange = (e) => {
    const { name, checked } = e.target;
    setFeatures((prev) => (checked ? [...prev, name] : prev.filter((f) => f !== name)));
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setModelParams((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateToFormat) => {
    const dateInstanceToFormat = new Date(dateToFormat);
    const year = dateInstanceToFormat.getFullYear();
    const month = String(dateInstanceToFormat.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(dateInstanceToFormat.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloader(true);
    setResponse("");

    if (!startDate) {
      showFailureToaster("Please select start date.");
      setloader(false);
      return;
    }

    if (!endDate) {
      showFailureToaster("Please select end date.");
      setloader(false);
      return;
    }

    if (!model) {
      showFailureToaster("Please select model.");
      setloader(false);
      return;
    }

    if (model === "tree") {
      if (!modelParams.max_depth) {
        showFailureToaster("Please enter max depth.");
        setloader(false);
        return;
      }

      if (!modelParams.min_samples_split) {
        showFailureToaster("Please enter min sample split.");
        setloader(false);
        return;
      }
    }

    if (model === "tree") {
      if (!modelParams.max_depth) {
        showFailureToaster("Please enter max depth.");
        setloader(false);
        return;
      }

      if (!modelParams.min_samples_split) {
        showFailureToaster("Please enter min sample split.");
        setloader(false);
        return;
      }
    }

    if (model === "forest") {
      if (!modelParams.n_estimators) {
        showFailureToaster("Please enter number of estimators.");
        setloader(false);
        return;
      }

      if (!modelParams.max_depth) {
        showFailureToaster("Please enter max depth.");
        setloader(false);
        return;
      }

      if (!modelParams.min_samples_split) {
        showFailureToaster("Please enter min samples split.");
        setloader(false);
        return;
      }
    }

    if (!features) {
      showFailureToaster("Please select feature.");
      setloader(false);
      return;
    }

    // console.log({
    //   startDate,
    //   endDate,
    //   model,
    //   modelParams,
    //   features,
    // });

    let queryparams = "";
    if (startDate && endDate) queryparams = "from=" + formatDate(startDate) + "&to=" + formatDate(endDate);
    if (modelParams?.n_estimators) queryparams += "&n_estimators=" + modelParams.n_estimators;
    if (modelParams?.max_depth) queryparams += "&max_depth=" + modelParams.max_depth;

//     let endpoint = "http://127.0.0.1:5000?";
    let endpoint=    "https://talhaa.pythonanywhere.com?";
    

    if (queryparams) endpoint += queryparams;

    try {
      const response = await axios.get(endpoint);
      setResponse(response.data);
      console.log("respinse data ", response.data);

      let days = [];
      let prices = [];
      if (features === "month") {
        response.data.prices.forEach((item) => {
          days.push(item.date);
          prices.push(item.predictedPrice);
        });
      } else if (features === "year") {
        response.data.prices.forEach((item) => {
          const regex = /^\d{4}-12-\d{2}$/;
          const matches = regex.test(item.date);

          if (matches) {
            days.push(item.date);
            prices.push(item.predictedPrice);
          }
        });
      }

      setForecastData({ days, prices });

      if (model === "linear") {
        setPerformance(response.data.linearRegressionModel);
      } else if (model === "tree") {
        setPerformance(response.data.decisiontree);
      } else if (model === "forest") {
        setPerformance(response.data.randomForest);
      }

      setloader(false);
    } catch (error) {
      setloader(false);
    }
  };

  return (
    <div className="home">
      <form className="homeForm">
        <h1>Machine Learning House Price Forecasting in East London</h1>
        <h3>Date Range Selection</h3>
        <div style={{ display: "flex", flexDirection: "column", rowGap: ".5rem" }}>
          <label>Select Start Date: </label>
          <div>
            <DatePicker
              minDate={new Date("1990-01-01")}
              maxDate={new Date("2019-12-31")}
              showMonthYearPicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          <label>Select End Date: </label>
          <div>
            <DatePicker
              minDate={startDate ? new Date(startDate) : new Date("1990-01-01")}
              maxDate={new Date("2019-12-31")}
              showMonthYearPicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </div>
        <div>
          <h3>Model Selection</h3>

          <label>
            <input
              type="radio"
              value="linear"
              checked={model === "linear"}
              onChange={() => setModel("linear")}
            />
            Linear Regression
          </label>
          <label>
            <input type="radio" value="tree" checked={model === "tree"} onChange={() => setModel("tree")} />
            Decision Tree
          </label>
          <label>
            <input
              type="radio"
              value="forest"
              checked={model === "forest"}
              onChange={() => setModel("forest")}
            />
            Random Forest
          </label>
        </div>

        {model === "tree" && (
          <div>
            <h3>Decision Tree Parameters</h3>
            <label>
              Max Depth:
              <input
                type="number"
                name="max_depth"
                value={modelParams.max_depth}
                onChange={handleParamChange}
              />
            </label>
            <label>
              Min Samples Split:
              <input
                type="number"
                name="min_samples_split"
                value={modelParams.min_samples_split}
                onChange={handleParamChange}
              />
            </label>
          </div>
        )}

        {model === "forest" && (
          <div>
            <h3>Random Forest Parameters</h3>
            <label>
              Number of Estimators:
              <input
                type="number"
                name="n_estimators"
                value={modelParams.n_estimators}
                onChange={handleParamChange}
              />
            </label>
            <label>
              Max Depth:
              <input
                type="number"
                name="max_depth"
                value={modelParams.max_depth}
                onChange={handleParamChange}
              />
            </label>
            <label>
              Min Samples Split:
              <input
                type="number"
                name="min_samples_split"
                value={modelParams.min_samples_split}
                onChange={handleParamChange}
              />
            </label>
          </div>
        )}

        <div>
          <h3>Feature Selection</h3>

          {/*    <label>
            <input type="checkbox" name="year" onChange={handleFeatureChange} />
            Year
          </label>
          <label>
            <input type="checkbox" name="month" onChange={handleFeatureChange} />
            Month
          </label>
          <label>
            <input type="checkbox" name="day" onChange={handleFeatureChange} />
            Day
          </label> */}

          <label>
            <input
              type="radio"
              value="month"
              checked={features === "month"}
              onChange={() => setFeatures("month")}
            />
            Monthly
          </label>

          <label>
            <input
              type="radio"
              value="year"
              checked={features === "year"}
              onChange={() => setFeatures("year")}
            />
            Yearly
          </label>
        </div>
        <button
          style={{ width: "10rem", borderRadius: ".3rem" }}
          type="submit"
          disabled={loader}
          onClick={handleSubmit}
        >
          {loader ? "Loading..." : "Submit"}
        </button>

        {response && (
          <div style={{ marginTop: "2rem" }}>
            <h1>Results and Visualization</h1>
            {/* <Plot data={forecastData} layout={{ title: "House Price Forecast" }} /> */}
            <div>
              {model === "linear" && (
                <div>
                  <p>MAE: {performance?.mae_linear || ""}</p>
                  <p>MSE: {performance?.mse_linear || ""}</p>
                  <p>RMSE: {performance?.rmse_linear || ""}</p>
                </div>
              )}

              {model === "tree" && (
                <div>
                  <p>MAE: {performance?.mae_tree || ""}</p>
                  <p>MSE: {performance?.mse_tree || ""}</p>
                  <p>RMSE: {performance?.rmse_tree || ""}</p>
                </div>
              )}

              {model === "forest" && (
                <div>
                  <p>MAE: {performance?.mae_forest || ""}</p>
                  <p>MSE: {performance?.mse_forest || ""}</p>
                  <p>RMSE: {performance?.rmse_forest || ""}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Plot
                data={[
                  {
                    x: forecastData.days,
                    y: forecastData.prices,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "blue" },
                  },
                ]}
                layout={{
                  title: `${features.toUpperCase()}LY Predicted Prices`,
                  xaxis: {
                    title: `${features.toUpperCase()}`,
                  },
                  yaxis: {
                    title: "Price",
                  },
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Plot
                data={[
                  {
                    x: forecastData.days,
                    y: forecastData.prices,
                    type: "bar",
                    // mode: "lines+markers",
                    marker: { color: "orange" },
                  },
                ]}
                layout={{
                  title: `${features.toUpperCase()}LY Predicted Prices`,
                  xaxis: {
                    title: `${features.toUpperCase()}`,
                  },
                  yaxis: {
                    title: "Price",
                  },
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default HousePriceForecast;
