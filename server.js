const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
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

  created_by

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

created_by

)

VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,

[

type,

amount,

from_user_id,

to_user_id,

from_name,

to_name,

remark,

'pending',

created_by

]

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
        to_name

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
app.get('/employee-balance', async (req, res) => {

  try {

    const result = await pool.query(`

      SELECT
        name,

        COALESCE(
          (
            SELECT SUM(amount)
            FROM transactions
            WHERE to_name = users.name
          ),0
        ) AS received,

        COALESCE(
          (
            SELECT SUM(amount)
            FROM transactions
            WHERE from_name = users.name
          ),0
        ) AS given

      FROM users

    `);

    const finalData = result.rows.map(r => ({

      name: r.name,

      received: Number(r.received),

      given: Number(r.given),

      balance:
        Number(r.received)
        -
        Number(r.given)

    }));

    res.json(finalData);

  } catch(error){

    console.error(error);

    res.status(500).json({
      error:'Balance error'
    });

  }

});

// SERVER
app.listen(3000, () => {

  console.log(
    '🚀 Server running on http://localhost:3000'
  );

});