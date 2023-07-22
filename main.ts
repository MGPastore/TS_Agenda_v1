import express, { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import { Contacto } from './interfaces';



const app = express();
const port = 3000;
// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configurar la ruta de archivos estáticos
app.use(express.static('public'));


// Conexión a la base de datos MongoDB
const dbURI = 'mongodb+srv://root:robertoPass@cluster0.nwto2.mongodb.net/myAgenda?retryWrites=true&w=majority';
mongoose.connect(dbURI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

// Modelo del contacto
const contactoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
});

interface ContactoDocument extends Contacto, Document {}

const ContactoModel = mongoose.model<ContactoDocument>('Contacto', contactoSchema);


// Obtener todos los contactos
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    const contacts: Contacto[] = await ContactoModel.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los contactos' });
  }
});

// Crear un nuevo contacto
app.post('/api/contacts', async (req: Request, res: Response) => {
  try {
    const { name, phone, mobile, email } = req.body;
    const newContact: Contacto = { name, phone, mobile, email };
    const savedContact: Contacto = await ContactoModel.create(newContact);
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el contacto' });
  }
});

// Obtener un contacto por ID
app.get('/api/contacts/:id', async (req: Request, res: Response) => {
  try {
    const contact: Contacto | null = await ContactoModel.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: 'Contacto no encontrado' });
    } else {
      res.json(contact);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el contacto' });
  }
});

// Actualizar un contacto por ID
app.put('/api/contacts/:id', async (req: Request, res: Response) => {
  try {
    const updatedContact: Contacto | null = await ContactoModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedContact) {
      res.status(404).json({ message: 'Contacto no encontrado' });
    } else {
      res.json(updatedContact);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el contacto' });
  }
});

// Eliminar un contacto por ID
app.delete('/api/contacts/:id', async (req: Request, res: Response) => {
  try {
    const deletedContact: Contacto | null = await ContactoModel.findByIdAndRemove(req.params.id);
    if (!deletedContact) {
      res.status(404).json({ message: 'Contacto no encontrado' });
    } else {
      res.json({ message: 'Contacto eliminado correctamente' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el contacto' });
  }
});

// Crear un nuevo contacto
app.get('/api/test/post', async (req: Request, res: Response) => {
  try {
    var data ={
      "name": "John Doe",
      "phone": "555-1234",
      "mobile": "666-5678",
      "email": "john@example.com",
   
    }
    
    const newContact: Contacto = data;
    const savedContact: Contacto = await ContactoModel.create(newContact);
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el contacto' });
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});


