import { useEffect, useState } from 'react';
import './App.css';
import ClipLoader from "react-spinners/ClipLoader";
import StockChart from './StockChart';


function App() {

  
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("IBM");
  const [interval, setInterval] = useState("5min");
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    fetchStockData().then(data => {
      setStockData(data);
    });
  }, []);

  const fetchStockData = async () => {
    if (loading)return;
    setLoading(true);

    try {
      const response = await fetch(
        // MSFT, IBM
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=demo`
      );
      const data = await response.json();
      let timeSeriesData = data['Time Series (5min)'] // Object.entries(data['Time Series (5min)']).slice(5).map(entry => entry[1]);

      timeSeriesData = Object.entries(timeSeriesData).slice(0,5).map(([date, values]) => {
        return {
            date,
            ...(values as object)
        };
    })

    console.log("timeSeriesData", timeSeriesData)

      return timeSeriesData;
    } catch(e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="App my-5 text-center">
      <h3>Time Series Stock Visualization using React.js, TypeScript, D3.js and AlphaVantage</h3>

      <h4 className="my-4">Developed by: Khaled Alam &lt;<a className='underline' href="mailto:khaledalam.net@gmail.com">khaledalam.net@gmail.com</a>&gt; </h4>

      <hr className="my-5 w-[50%] m-auto" />

      {loading && <ClipLoader
        color={"#ffffff"}
        loading={loading}
        cssOverride={{
          display: "block",
          margin: "auto",
          borderColor: "red"
        }}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />}
      {!loading && stockData && (<>
        <h4>Symbol: <b className='cursor-pointer'>{symbol}👆🏻</b> ─── ⋆⋅☆⋅⋆ ── Interval: <small className='cursor-pointer'>{interval} 🕒</small></h4>
        <StockChart data={stockData} />
      </>)}
    </div>
  );
}

export default App;
