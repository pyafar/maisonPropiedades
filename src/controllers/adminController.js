/** Firestore */
const { db } = require('../database/config/dbConfig');
const Propiedad = require('../database/models/Propiedad');
const fs = require('fs');



/** Controller */
const adminController = {

    index: (req, res) => {
        db.collection('propiedades').get().then((querySnapshot) => {
            const propiedades = querySnapshot.docs.map(doc => {
                const propiedadData = doc.data();
                const propiedadId = doc.id;
                return { ...propiedadData, propiedadId };
            });

            res.render('adminPanel', { propiedades });
        });

    },

    create: (req, res) => {
        res.render('create')
    },

    store: (req, res) => {
        let images = req.files.map(file => file.filename);
        let nuevaPropiedad = Propiedad.create(req.body, images);

        db.collection('propiedades').add(nuevaPropiedad)
            .then(docRef => {
                console.log('Propiedad creada exitosamente. ID:', docRef.id);
                res.redirect('/admin');
            })
            .catch(error => {
                console.error('Error al crear la propiedad:', error);
                res.status(500).send('Error al crear la propiedad');
            });

    },

    edit: (req, res) => {
        let propiedadId = req.params.id;

        db.collection('propiedades').doc(propiedadId).get()
            .then(doc => {
                if (!doc.exists) {
                    res.status(404).send('Propiedad no encontrada');
                    return;
                }

                res.render('edit', { propiedad: doc.data(), propiedadId: doc.id })
            })
            .catch(error => {
                console.error('Error al obtener la propiedad', error);
                res.status(500).send('Error al obtener la propiedad')
            })

    },

    update: async (req, res) => {
        const propiedadId = req.params.id;
        const updatedData = req.body;
        const imagesToDelete = req.body.imagesToDelete || [];
    
        try {
            const doc = await db.collection('propiedades').doc(propiedadId).get();
    
            if (!doc.exists) {
                res.status(404).send('Propiedad no encontrada');
                return;
            }
    
            const existingData = doc.data();
    
            imagesToDelete.forEach(async image => {
                const imagePath = `public/img/propiedades/${image}`;
    
                try {
                    if (fs.existsSync(imagePath)) {
                        await fs.promises.unlink(imagePath);
                        console.log(`Imagen ${image} eliminada con éxito`);
                    } else {
                        console.log(`La imagen ${image} no existe en el sistema de archivos`);
                    }
                } catch (error) {
                    console.error(`Error al eliminar la imagen ${image}:`, error);
                }
            });
    
            const uploadedImages = req.files.map(file => file.filename);
    
            const updatedImages = existingData.images
                .filter(image => !imagesToDelete.includes(image))
                .concat(uploadedImages);
    
            await db.collection('propiedades').doc(propiedadId).update({
                ...updatedData,
                destacada: updatedData.destacada === 'on',
                amueblado: updatedData.amueblado === 'on',
                piscina: updatedData.piscina === 'on',
                estacionamiento: updatedData.estacionamiento === 'on',
                vigilancia: updatedData.vigilancia === 'on',
                images: updatedImages,
            });
    
            console.log('Propiedad actualizada con éxito');
            res.redirect('/admin');
        } catch (error) {
            console.error('Error al actualizar la propiedad:', error);
            res.status(500).send('Error al actualizar la propiedad');
        }
    },

    destroy: (req, res) => {
        let propiedadId = req.params.id;
        db.collection('propiedades').doc(propiedadId).delete()
            .then(() => {
                console.log('propiedad eliminada');
                res.redirect('/admin')
            })
            .catch(error => {
                console.error('Error al eliminar la propiedad', error);
                res.status(500).send('Error al eliminar la propiedad');
            });
    }
};

module.exports = adminController;