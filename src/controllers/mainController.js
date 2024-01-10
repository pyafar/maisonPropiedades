/** Firestore */
const { db } = require('../database/config/dbConfig');
// const { validationResult } = require('express-validator')


const mainController = {
    index: (req, res) => {
        db.collection('propiedades').get().then((querySnapshot) => {
            const propiedades = querySnapshot.docs.map(doc => {
                const propiedadData = doc.data();
                const propiedadId = doc.id;
                return { ...propiedadData, propiedadId };
            });
            res.render('index', { propiedades });
        })
            .catch(error => {
                console.error('Error getting documents', error);
                res.status(500).send('Error getting documents');
            });
    },

    login: (req, res) => {

        res.render('login');
    },

    processLogin: (req, res) => {

        const { email, password } = req.body;

        // Validación campos
        if (!email || !password) {
            res.status(400).send('Email y contraseña son requeridos');
            return;
        }

        db.collection('adminUser')
            .where('email', '==', email)
            .where('password', '==', password)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    // Usuario no encontrado
                    res.status(401).send('Credenciales incorrectas: no se encontró ningún usuario');
                    return;
                }

                // Login exitoso
                const user = querySnapshot.docs[0].data();
                console.log('Usuario autenticado:', user);

                req.session.user = user;

                res.redirect('/admin');
            })
            .catch(error => {
                console.error('Error al procesar el login:', error);
                res.status(500).send('Error al procesar el login');
            });


    },

    detail: (req, res) => {

        const propiedadId = req.params.id;

        db.collection('propiedades').doc(propiedadId).get()
            .then(doc => {
                if (!doc.exists) {
                    res.status(404).send('Propiedad no encontrada');
                    return;
                }
    
                const propiedadData = doc.data();
                const propiedadId = doc.id;
    
                res.render('detail', { propiedad: { ...propiedadData, propiedadId } });
            })
            .catch(error => {
                console.error('Error al obtener la propiedad', error);
                res.status(500).send('Error al obtener la propiedad');
            });
    },

    search: (req, res) => {
        const { operacion, tipo, zona, dormitorios } = req.query;

        let query = db.collection('propiedades');

        if (operacion) {
            query = query.where('operacion', '==', operacion);
        }

        if (tipo) {
            query = query.where('tipo', '==', tipo);
        }

        if (zona) {
            query = query.where('zona', '==', zona);
        }
        if (dormitorios) {
            query = query.where('dormitorios', '==', dormitorios);
        }

        query.get()
            .then((querySnapshot) => {
                const propiedades = querySnapshot.docs.map(doc => {
                    const propiedadData = doc.data();
                    const propiedadId = doc.id;
                    return { ...propiedadData, propiedadId };
                });

                const mensaje = propiedades.length === 0
                    ? 'No se encontraron propiedades que coincidan con los criterios de búsqueda.'
                    : null;

                res.render('resultados', { propiedades, mensaje });
            })
            .catch(error => {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error al ejecutar la consulta');
            });
    },

    venta: (req, res) => {

        db.collection('propiedades')
            .where('operacion', '==', 'venta')
            .get()
            .then((querySnapshot) => {
                const propiedades = querySnapshot.docs.map(doc => {
                    const propiedadData = doc.data();
                    const propiedadId = doc.id;
                    return { ...propiedadData, propiedadId };
                });

                const mensaje = propiedades.length === 0
                    ? 'No se encontraron propiedades que coincidan con los criterios de búsqueda.'
                    : null;

                res.render('resultados', { propiedades, mensaje });
            })
            .catch(error => {
                console.error('Error al obtener propiedades en venta:', error);
                res.status(500).send('Error al obtener propiedades en venta');
            });
    },


    alquiler: (req, res) => {
        db.collection('propiedades')
            .where('operacion', '==', 'alquiler')
            .get()
            .then((querySnapshot) => {
                const propiedades = querySnapshot.docs.map(doc => {
                    const propiedadData = doc.data();
                    const propiedadId = doc.id;
                    return { ...propiedadData, propiedadId };
                });

                const mensaje = propiedades.length === 0
                    ? 'No se encontraron propiedades que coincidan con los criterios de búsqueda.'
                    : null;

                res.render('resultados', { propiedades, mensaje });
            })
            .catch(error => {
                console.error('Error al obtener propiedades en alquiler:', error);
                res.status(500).send('Error al obtener propiedades en alquiler');
            });
    },
    destacados: (req, res) => {
        db.collection('propiedades')
            .where('destacada', '==', true)
            .get()
            .then((querySnapshot) => {
                const propiedades = querySnapshot.docs.map(doc => {
                    const propiedadData = doc.data();
                    const propiedadId = doc.id;
                    return { ...propiedadData, propiedadId };
                });
                const mensaje = propiedades.length === 0
                    ? 'No se encontraron propiedades que coincidan con los criterios de búsqueda.'
                    : null;

                res.render('resultados', { propiedades, mensaje });
            })
            .catch(error => {
                console.error('Error al obtener propiedades destacadas:', error);
                res.status(500).send('Error al obtener propiedades destacadas');
            });
    }

}


module.exports = mainController;