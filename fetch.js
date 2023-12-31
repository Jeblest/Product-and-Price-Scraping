const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const cheerio = require('cheerio');
app.use(morgan('dev'));

app.use(cors({ origin: '*' }));

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

const axiosConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  },
};

const getPrice = async (data) => {
  try {
    const res = await axios.get(`https://www.cimri.com/market/arama?q=${data}&sort=price-asc`, axiosConfig);
    const html = await res.data;
    const main = cheerio.load(html);
    const link = main(".ProductCard_productCard__412iI a").attr("href");
    return link
/*     const res1 = await axios.get("https://www.cimri.com" + link, axiosConfig);
    const $ = cheerio.load(res1.data);
    const price = $(".MainOfferCard_price_container__22jHp").text();
    console.log(price)
    return price */
  } catch (error) {

    throw error;
  }

}
app.listen(3000, () => console.log('Server ready'));
