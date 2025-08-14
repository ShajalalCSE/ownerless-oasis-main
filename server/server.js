import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'oasis',
  port: 3307,
});

app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({ message: 'Invalid or missing input fields' });
  }

  // Check if the email is already registered
  const checkEmailQuery = 'SELECT * FROM users WHERE Email = ?';
  db.promise()
    .query(checkEmailQuery, [email])
    .then(([existingUser]) => {
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Email is already registered. Please use a different email.' });
      }

      // Hash the password before storing it in the database
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      // Insert the new user into the database
      const insertUserQuery = 'INSERT INTO users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)';
      return db.promise().query(insertUserQuery, [firstName, lastName, email, hashedPassword]);
    })
    .then(() => {
      return res.json({ message: 'Signup successful!' });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred during signup. Please try again.', error });
    });
});


app.get('/alluser', (req ,res)=>{
    const sql ="select* from users";
    db.query(sql ,(err , result)=>{
        if(err) return res.json({Message:"Error in server"});
        return res.json(result)
    })

})



app.get('/orders', (req ,res)=>{
  const sql ="select* from orderdetails";
  db.query(sql ,(err , result)=>{
      if(err) return res.json({Message:"Error in server"});
      return res.json(result)
  })

})
app.get('/allProducts', (req ,res)=>{
  const sql ="select* from product";
  db.query(sql ,(err , result)=>{
      if(err) return res.json({Message:"Error in server"});
      return res.json(result)
  })

})
app.get('/products', (req ,res)=>{
  const sql ="select* from product";
  db.query(sql ,(err , result)=>{
      if(err) return res.json({Message:"Error in server"});
      return res.json(result)
  })

})
app.get('/salesreport', (req ,res)=>{
  const sql ="select* from orderdetails";
  db.query(sql ,(err , result)=>{
      if(err) return res.json({Message:"Error in server"});
      return res.json(result)
  })

})
app.get('/category', (req ,res)=>{
  const sql ="select* from category";
  db.query(sql ,(err , result)=>{
      if(err) return res.json({Message:"Error in server"});
      return res.json(result)
  })

})

app.post('/product', (req, res) => {
  const sql = "INSERT INTO product (ProductName, StockStatus, Quantity, Barcode, Price, PCategoryID, Img) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
      req.body.ProductName,
      req.body.StockStatus,
      req.body.Quantity,
      req.body.Barcode,
      req.body.Price,
      req.body.PCategoryID,
      req.body.Img
  ];

  db.query(sql, values, (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
  });
});

app.get('/read/:id', (req, res) => {
  const sql = "SELECT * FROM product WHERE ProductID = ?";
  const ProductID = req.params.id;
  
  db.query(sql, [ProductID], (err, result) => {
      if (err) {
          return res.json({ Message: "Error in server" });
      } else if (result.length === 0) {
          return res.json({ Message: "Product not found" });
      } else {
          return res.json(result);
      }
  });
});

app.put('/edit/:id', (req, res) => {
  const sql = "UPDATE product SET `ProductName` = ?, `StockStatus` = ?, `Quantity` = ?, `Barcode` = ?, `Img` = ?, `Price` = ?, `PCategoryID` = ? WHERE ProductID = ?";

  const ProductID = req.params.id;
  const values = [
      req.body.ProductName,
      req.body.StockStatus,
      req.body.Quantity,
      req.body.Barcode,
      req.body.Img,
      req.body.Price,
      req.body.PCategoryID,
      ProductID
  ];

  db.query(sql, values, (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
  });
});
app.delete('/delete/:id', (req, res) => {
  const sql = "DELETE FROM product WHERE ProductID = ?";
  const ProductID = req.params.id;

  db.query(sql, [ProductID], (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
  });
});
app.get('/products/:ProductID', (req ,res)=>{
  const sql ="select* from product where ProductID = ?";
  const ProductID = req.params.ProductID;
    db.query(sql ,[ProductID],(err , result)=>{
        if(err) return res.json({Message:"Error in server"});
        return res.json(result)
    })

})

app.post('/confirm', (req, res) => {
  const sql = 'INSERT INTO cart (OrderDate, Quantity, UserCartID) VALUES (?, ?, ?)';
  const values = [
    req.body.OrderDate,
    req.body.Quantity,
    req.body.UserCartID
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to confirm order." });
    }
    return res.status(201).json({ message: "Order confirmed successfully." });
  });
});


app.post('/users', (req, res) => {
  const sql = 'INSERT INTO users (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)';
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.password
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create user." });
    }
    return res.status(201).json({ message: "User created successfully." });
  });
});

app.get('/productdetails',(req,res)=>{
  const sql = "select* from product";
  db.query(sql,(err,result)=>{
    if(err) return res.json({Message:"Error in server orderdetails get method"});
    return res.json(result)
  })
})
app.get('/cartdetails',(req,res)=>{
  const sql = "select* from cart";
  db.query(sql,(err,result)=>{
    if(err) return res.json({Message:"Error in server orderdetails route"});
    return res.json(result)
  })
})

app.post('/orderdetails', (req, res) => {
  const sql = 'INSERT INTO orderdetails (OrderID, ProductID, Quantity) VALUES (?, ?, ?)';
  const values = [
    req.body.OrderID,
    req.body.ProductID,
    req.body.Quantity
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to insert order details." });
    }
    return res.status(201).json({ message: "Order details inserted successfully." });
  });
});

app.get('/placeorders', (req ,res)=>{
  const sql ="select* from users ";
  db.query(sql ,(err , result)=>{
      if(err) return res.json({Message:"Error in server"});
      return res.json(result)
  })

})

app.delete('/deleteuser/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE UserId = ?";
  const UserId = req.params.id;

  db.query(sql, [UserId], (err, result) => {
      if (err) return res.json(err);
      return res.json(result);
  });
});


app.post('/admin', (req, res) => {
  const sql = 'INSERT INTO admin ( EmailID) VALUES (?)';
  const values = [
    req.body.email
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create user." });
    }
    return res.status(201).json({ message: "Admin created successfully." });
  });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
