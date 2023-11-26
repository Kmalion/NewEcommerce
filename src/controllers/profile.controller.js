import UsersModel from '../models/schema/users.schema.js';
import multer from 'multer';
import fs from 'fs';

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';

        // Crea el directorio de carga si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Controlador para mostrar el formulario de subida de imágenes
export const showUploadForm = (req, res) => {
    res.render('uploadForm');
};

// Controlador para manejar la subida de archivos
export const handleImageUpload = upload.single('profilePic'); // 'profilePic' es el nombre del campo en el formulario

// Controlador para guardar el enlace a la imagen en el perfil del usuario
export const saveImageLinkToUserProfile = async (req, res) => {
    try {
        // Guarda el enlace a la imagen en el perfil del usuario
        const userId = req.user.id; // Asume que el usuario está autenticado y su ID está disponible en req.user
        const userProfile = await UsersModel.findById(userId);

        if (!userProfile) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        userProfile.documents.push({
            name: req.file.originalname,
            link: req.file.path, // Enlace a la imagen en el sistema de archivos
            profilePic: req.file.filename, // Nombre del archivo
        });

        await userProfile.save();

        // Renderiza la vista de perfil con la nueva imagen
        res.render('profile', {
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email,
            age: userProfile.age,
            role: userProfile.role,
            profilePic: req.file.filename, // Pasa el nombre del archivo a la vista
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir la imagen', error: error.message });
    }
};


// Controlador para renderizar la vista de perfil
export const profileController = async (req, res, next) => {
    try {
        // Construir la ruta completa de la imagen de perfil
        const profilePicPath = req.user.documents.length > 0 ? `/uploads/${req.user.documents[0].profilePic}` : null;
        // Crear el objeto del usuario para pasar al contexto de Handlebars
        const userLoggedIn = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            profilePic: profilePicPath,
        };

        // Renderizar la vista de perfil con el objeto del usuario
        res.render('profile', userLoggedIn);
    } catch (error) {
        console.error(error);
        next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
};


// Controlador para renderizar la vista de perfil resumido
export const profileSummaryController = async (req, res, next) => {
    try {
        let userLoggedIn = {};

        if (req.user.email) {
            userLoggedIn = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            };
        } else {
            userLoggedIn = {
                username: req.user.username,
                githubId: req.user.githubId,
            };
        }
        res.render('home', userLoggedIn);
    } catch (error) {
        console.error(error);
        next(error); // Pasa el error al siguiente middleware de manejo de errores
    }
};
