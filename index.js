const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-6ef9a3f5-acca-4f24-a105-46b00b4ee7c9';


  let customData = {
    "properties": {
        "property1": "",
        "property2": "",
        "property3": ""
    }
  };
  
// Маршрут для домашньої сторінки
app.get('/', (req, res) => {
    console.log('customData', customData);
    res.render('homepage', { customData }); // Передача кастомних даних на домашню сторінку
  });

app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts?properties=email,firstname,lastname,property1,property2,property3';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;

        // console.log('data', data);

        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});
// Маршрут для відображення форми створення/оновлення кастомних об'єктів
app.get('/update-cobj', async (req, res) => {
    const email = req.query.email;

    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,property1,property2,property3`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;

        // res.json(data);
        console.log('data', data);
        res.render('form', {data});
        
    } catch(err) {
        console.error(err);
    }
  });
  
  // Маршрут для обробки даних форми
  app.post('/update-cobj', async(req, res) => {

    const {email, property1, property2, property3 } = req.body;

 
  const update = {
      properties: {

          "property1": property1,
          "property2": property2,
          "property3": property3
      }
  }
  if(email){
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try { 
        await axios.patch(updateContact, update, { headers } );
        // customData={...update, ...email}
       await res.redirect('/contacts');
    } catch(err) {
        console.error(err);
    }
  }
  });



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));