"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware para analizar el cuerpo de las solicitudes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configurar la ruta de archivos estáticos
app.use(express_1.default.static('public'));
// Conexión a la base de datos MongoDB
const dbURI = 'mongodb+srv://root:robertoPass@cluster0.nwto2.mongodb.net/myAgenda?retryWrites=true&w=majority';
mongoose_1.default.connect(dbURI);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
    console.log('Conexión exitosa a la base de datos');
});
// Modelo del contacto
const contactoSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
});
const ContactoModel = mongoose_1.default.model('Contacto', contactoSchema);
// Obtener todos los contactos
app.get('/api/contacts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield ContactoModel.find();
        res.json(contacts);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al obtener los contactos' });
    }
}));
// Crear un nuevo contacto
app.post('/api/contacts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, mobile, email } = req.body;
        const newContact = { name, phone, mobile, email };
        const savedContact = yield ContactoModel.create(newContact);
        res.status(201).json(savedContact);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al crear el contacto' });
    }
}));
// Obtener un contacto por ID
app.get('/api/contacts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield ContactoModel.findById(req.params.id);
        if (!contact) {
            res.status(404).json({ message: 'Contacto no encontrado' });
        }
        else {
            res.json(contact);
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error al obtener el contacto' });
    }
}));
// Actualizar un contacto por ID
app.put('/api/contacts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedContact = yield ContactoModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedContact) {
            res.status(404).json({ message: 'Contacto no encontrado' });
        }
        else {
            res.json(updatedContact);
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error al actualizar el contacto' });
    }
}));
// Eliminar un contacto por ID
app.delete('/api/contacts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedContact = yield ContactoModel.findByIdAndRemove(req.params.id);
        if (!deletedContact) {
            res.status(404).json({ message: 'Contacto no encontrado' });
        }
        else {
            res.json({ message: 'Contacto eliminado correctamente' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error al eliminar el contacto' });
    }
}));
// Crear un nuevo contacto
app.get('/api/test/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var data = {
            "name": "John Doe",
            "phone": "555-1234",
            "mobile": "666-5678",
            "email": "john@example.com",
        };
        const newContact = data;
        const savedContact = yield ContactoModel.create(newContact);
        res.status(201).json(savedContact);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al crear el contacto' });
    }
}));
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
