const Pool = require('pg').Pool;
const axios = require('axios');
const { xml2json } = require('xml-js');
require('dotenv').config()
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRESS_DB,
});

async function main() {
  try {
    let json;
    await axios.get('http://www.nationalbank.kz/rss/rates_all.xml')
      .then((res) =>
        json = JSON.parse(xml2json(res.data, { compact: true })),
      )
      .catch(err => console.log(err));
    const items = json.rss.channel.item;
    const currency = await  pool.query('SELECT id FROM currency')
    if (!currency.rows.length){
       for (const item of items){
         await  pool.query('INSERT INTO currency (name,rate) values ($1,$2)',[item.title._text,item.description._text])
       }
       return
    }else {
      for (const item of items){
        await  pool.query('UPDATE currency SET rate = $2 WHERE name = $1',[item.title._text,item.description._text])
      }
      return
    }
  } catch (e) {
    console.log(e);
  }
}

main();
