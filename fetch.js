const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');
app.use(morgan('dev'));

app.use(cors())

app.get("/", (req, res) => {
  res.send("Server running")
})

app.get('/api/data', async (req, res) => {
  const { data } = req.query;
  try {
    const result = await fetch(data);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/price", async (req, res) => {
  const { data } = req.query;
  console.log("Data received: " + data)

  try {
    const price = await getPrice(data);
    console.log(price)
    return res.json(price);
  } catch (error) {
    return res.json({ error: error.message });
  }
})


async function fetch(data) {
  const url = `https://glutentarayici.com/barkod.php?ne=${data}`;

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const title = $('.card-body center h1').text();
    const barcode = $('.card-body h3').text();
    const result = $('.card-body .card center h4').text();

    return {
      title,
      barcode,
      result,
    };
  } catch (error) {
    throw error;
  }
}

const getPrice = async (data) => {
  try {
    const res = await axios(`https://www.cimri.com/market/arama?q=${data}&sort=price-asc`);
  const main = cheerio.load(res.data);
  const link = main(".ProductCard_productCard__412iI a").attr("href");
  const res1 = await axios("https://www.cimri.com" + link);
  const $ = cheerio.load(res1.data);
  const price = $(".MainOfferCard_price_container__22jHp").text();
  return price
  } catch (error) {
    throw error;
  }
  
}
app.listen(3000, () => console.log('Server ready'));
