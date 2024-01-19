// ** Require's */

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const userLogged = require('./middlewares/userLogged')


//** Router (require) */
const mainRoutes = require('./routes/mainRoutes');
const adminRoutes = require('./routes/adminRoutes');

//** Express() */
const app = express();

//** Middlewares */
app.use(express.static(path.join(__dirname, '../public')));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "The secret",
    resave: false, 
    saveUninitialized: true
}));

app.use(userLogged);



/** EJS */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/** Routes (use) */
app.use('/', mainRoutes);
app.use('/admin', adminRoutes)


//** Server */
const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port} - URL: http://localhost:${port}`,
        `||||  ADMIN - URL: http://localhost:${port}/admin/`)
});

module.exports = app;