const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json({
  limit:'50mb'
}));

app.use(express.urlencoded({
  limit:'50mb',
  extended:true
}));

app.use(express.static(__dirname));

// DATABASE
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// HOME

// USERS
app.get('/users', async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM users ORDER BY id'
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Users error'
    });

  }

});
// LOGIN
app.post('/login', async (req,res)=>{

  const { username, password } = req.body;

  try {

    const result = await pool.query(

      'SELECT * FROM users WHERE username=$1',

      [username]

    );

    if(result.rows.length === 0){

      return res.status(401).json({
        error:'User not found'
      });

    }

    const user = result.rows[0];

    if(password !== user.password){

      return res.status(401).json({
        error:'Wrong password'
      });

    }

    const token = jwt.sign(

      {
        id:user.id,
        name:user.name,
        role:user.role
      },

      'skc-secret'

    );

    res.json({

      token,

      user:{
        id:user.id,
        name:user.name,
        role:user.role
      }

    });

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Login error'
    });

  }

});

// SEND WHATSAPP MESSAGE

async function sendWhatsAppMessage(

  amount,
  from_name,
  to_name,
  transaction_id

){

  try {

    await fetch(

      `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,

      {

        method:'POST',

        headers:{

          'Content-Type':'application/json',

          'Authorization':
            `Bearer ${process.env.WHATSAPP_TOKEN}`

        },

        body: JSON.stringify({

          messaging_product:'whatsapp',

          to:'971559146028',

type:'text',

text:{
  body:
`New Transaction Pending Approval

Amount: ₹${amount}

From: ${from_name}

To: ${to_name}

Transaction ID: ${transaction_id}`
}
        })

      }

    );

    console.log(
      'WhatsApp message sent'
    );

  } catch(error){

    console.log(error);

  }

}

// ADD TRANSACTION
app.post('/transaction', async (req, res) => {

const {

  type,

  amount,

  from_user_id,

  to_user_id,

  from_name,

  to_name,

  remark,

  created_by,

  proof_url

} = req.body;

  try {

await pool.query(

`INSERT INTO transactions (

type,

amount,

from_user_id,

to_user_id,

from_name,

to_name,

remark,

status,

created_by,

proof_url

)

VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,

[

type,

amount,

from_user_id,

to_user_id,

from_name,

to_name,

remark,

'pending',

created_by,

proof_url

]

);

const latest = await pool.query(

  `SELECT id
   FROM transactions
   ORDER BY id DESC
   LIMIT 1`

);

const transaction_id =
  latest.rows[0].id;

await sendWhatsAppMessage(

  amount,
  from_name,
  to_name,
  transaction_id

);

    res.json({
      message: 'Transaction saved'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Transaction error'
    });

  }

});

// PENDING
app.get('/pending', async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT *
       FROM transactions
       WHERE status='pending'
       ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Pending error'
    });

  }

});

// APPROVE
app.post('/approve/:id', async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      `UPDATE transactions
       SET status='approved'
       WHERE id=$1`,
      [id]
    );

    res.json({
      message: 'Approved'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Approve error'
    });

  }

});

app.post('/reject/:id', async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      `UPDATE transactions
       SET status='rejected'
       WHERE id=$1`,
      [id]
    );

    res.json({
      message: 'Rejected'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Reject error'
    });

  }

});

// LEDGER
app.get('/ledger', async (req, res) => {

  try {

    const result = await pool.query(

      `SELECT
        id,
        amount,
        status,
        remark,
        created_at,
        from_name,
        to_name,
        created_by,
        proof_url

      FROM transactions

      ORDER BY created_at DESC`

    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Ledger error'
    });

  }

});

// EMPLOYEE BALANCE

app.get('/balance/:user_id', async (req, res) => {

  const { user_id } = req.params;

  try {

    const received = await pool.query(

      `SELECT
      COALESCE(SUM(amount),0) AS total

      FROM transactions

      WHERE to_user_id=$1

      AND status != 'deleted'`,

      [user_id]

    );

    const given = await pool.query(

      `SELECT
      COALESCE(SUM(amount),0) AS total

      FROM transactions

      WHERE from_user_id=$1

      AND status != 'deleted'`,

      [user_id]

    );

    const balance =

      received.rows[0].total -
      given.rows[0].total;

    res.json({

      user_id,

      received:
        received.rows[0].total,

      given:
        given.rows[0].total,

      balance

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
      'Error calculating balance'
    });

  }

});

// DELETE TRANSACTION

// DELETE TRANSACTION

app.post('/delete/:id', async (req,res)=>{

  const { id } = req.params;

  const {
    deleted_by,
    deleted_reason
  } = req.body;

  try {

    await pool.query(

      `UPDATE transactions

      SET

      status='deleted',

      deleted_by=$1,

      deleted_reason=$2,

      deleted_at=NOW()

      WHERE id=$3`,

      [
        deleted_by,
        deleted_reason,
        id
      ]

    );

    res.json({
      message:'Deleted'
    });

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Delete failed'
    });

  }

});
// DELETED TRANSACTIONS

app.get('/deleted', async (req,res)=>{

  try {

    const result = await pool.query(

      `SELECT *

      FROM transactions

      WHERE status='deleted'

      ORDER BY deleted_at DESC`

    );

    res.json(result.rows);

  } catch(error){

    console.log(error);

    res.status(500).json({

      error:'Deleted audit error'

    });

  }

});

// GET USER PROFILE

app.get('/user/:id', async (req,res)=>{

  const { id } = req.params;

  try {

    const result = await pool.query(

      `SELECT
        id,
        name,
        email,
        mobile,
        whatsapp

      FROM users

      WHERE id=$1`,

      [id]

    );

    res.json(result.rows[0]);

  } catch(error){

    console.log(error);

    res.status(500).json({

      error:'Profile fetch error'

    });

  }

});


// UPDATE USER PROFILE

app.put('/user/:id', async (req,res)=>{

  const { id } = req.params;

  const {

    name,
    email,
    mobile,
    whatsapp,
    password

  } = req.body;

  try {

    await pool.query(

      `UPDATE users

      SET

      name=$1,
      email=$2,
      mobile=$3,
      whatsapp=$4,
      password=$5

      WHERE id=$6`,

      [

        name,
        email,
        mobile,
        whatsapp,
        password || '',
        id

      ]

    );

    res.json({

      message:'Profile updated'

    });

  } catch(error){

    console.log(error);

    res.status(500).json({

      error:'Profile update failed'

    });

  }

});

// WHATSAPP WEBHOOK VERIFY

app.get('/webhook', (req,res)=>{

  const verify_token = 'skcverify123';

  const mode =
    req.query['hub.mode'];

  const token =
    req.query['hub.verify_token'];

  const challenge =
    req.query['hub.challenge'];

  if(

    mode === 'subscribe'

    &&

    token === verify_token

  ){

    console.log('Webhook verified');

    res.status(200).send(challenge);

  } else {

    res.sendStatus(403);

  }

});

// RECEIVE WHATSAPP REPLIES

app.post('/webhook', async (req,res)=>{

  try {

    const message =

      req.body
      ?.entry?.[0]
      ?.changes?.[0]
      ?.value?.messages?.[0];

    if(!message){

      return res.sendStatus(200);

    }

    const text =

      message?.text?.body
      ?.toLowerCase()
      ?.trim();

    console.log(
      'WhatsApp reply:',
      text
    );

    if(text.startsWith('approve')){

      const id =
        text.split(' ')[1];

      await pool.query(

        `UPDATE transactions

         SET status='approved'

         WHERE id=$1`,

        [id]

      );

      console.log(
        'Approved transaction',
        id
      );

    }

    if(text.startsWith('reject')){

      const id =
        text.split(' ')[1];

      await pool.query(

        `UPDATE transactions

         SET status='rejected'

         WHERE id=$1`,

        [id]

      );

      console.log(
        'Rejected transaction',
        id
      );

    }

    res.sendStatus(200);

  } catch(error){

    console.log(error);

    res.sendStatus(500);

  }

});

app.post('/deals', async (req,res)=>{

  try {

    const {

      client_name,

      cash_holder,

      cash_amount,

      fee_percentage,

      gross_profit,

      charges,

      net_profit,

      payable_amount,

      bank_used,

      transfer_account,

      remarks

    } = req.body;

    const result =
      await pool.query(

      `INSERT INTO deals (

        client_name,

        cash_holder,

        cash_amount,

        fee_percentage,

        gross_profit,

        charges,

        net_profit,

        payable_amount,

        bank_used,

        transfer_account,

        remarks

      )

      VALUES (

        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11

      )

      RETURNING *`,

      [

        client_name,

        cash_holder,

        cash_amount,

        fee_percentage,

        gross_profit,

        charges,

        net_profit,

        payable_amount,

        bank_used,

        transfer_account,

        remarks

      ]

    );

    res.json(result.rows[0]);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Deal creation failed'
    });

  }

});

app.get('/deals', async (req,res)=>{

  try {

    const result =
      await pool.query(

        `SELECT *
         FROM deals
         ORDER BY created_at DESC`

      );

    res.json(result.rows);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Deals fetch failed'
    });

  }

});

app.post('/bank-accounts', async (req,res)=>{

  try {

    const {

      account_name,

      account_holder_name,

      account_number,

      iban_number,

      bank_name,

      type

    } = req.body;

    const result =
      await pool.query(

      `INSERT INTO bank_accounts (

        account_name,

        account_holder_name,

        account_number,

        iban_number,

        bank_name,

        type

      )

      VALUES (

        $1,$2,$3,$4,$5,$6

      )

      RETURNING *`,

      [

        account_name,

        account_holder_name,

        account_number,

        iban_number,

        bank_name,

        type

      ]

    );

    res.json(result.rows[0]);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Bank account save failed'
});

app.get('/employee-holdings', async (req,res)=>{

  try {

    const result =
      await pool.query(`

        SELECT
          employee_name,

          SUM(
            CASE
              WHEN entry_type = 'cash_received'
              THEN amount
              ELSE -amount
            END
          ) AS holding

        FROM treasury_ledger

        GROUP BY employee_name

      `);

    res.json(result.rows);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Holdings fetch failed'
    });

  }

});

app.get('/profile/:id', async (req,res)=>{

  try {

    const result =
      await pool.query(

        `SELECT *
         FROM users
         WHERE id = $1`,

        [req.params.id]

      );

    res.json(result.rows[0]);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Profile fetch failed'
    });

  }

});

app.put('/profile/:id', async (req,res)=>{

  try {

    const {

      name,

      email,

      phone,

      role

    } = req.body;

    const result =
      await pool.query(

      `UPDATE users

       SET

       name = $1,

       email = $2,

       phone = $3,

       role = $4

       WHERE id = $5

       RETURNING *`,

      [

        name,

        email,

        phone,

        role,

        req.params.id

      ]

    );

    res.json(result.rows[0]);

  } catch(error){

    console.log(error);

    res.status(500).json({
      error:'Profile update failed'
    });

  }

});

// SERVER
app.listen(3000, () => {

  console.log(
    '🚀 Server running on http://localhost:3000'
  );

});