const express = require('express');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 
    'client_secret': 
  });

const app = express();

app.get('/', (req, res)=> res.render('index'));

app.post('/pay', (req,res)=>{
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "PluralSight",
                    "sku": "001",
                    "price": "20.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "20.00"
            },
            "description": "Plural sight monthly subscription."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i =0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
})


app.get('/success', (req,res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json ={
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "20.00"
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment){
        if(error){
            console.log(error.response);
            throw error;
        }
        else{
            console.log("get payment response");
            console.log(JSON.stringify(payment));
            // res.send('Success')
            let token = 'alotofcharsandnumbers1212312312'
            res.send('great success');
        }
    })
})

app.get('/cancel', (req,res)=> res.send('Cancelled'))



app.listen(3000, ()=> console.log(`Server listening on port 3000`));
