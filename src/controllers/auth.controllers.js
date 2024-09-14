import User from '../models/user.model.js';
import Teacher from '../models/teacher.model.js';
import bcrypt from "bcryptjs";
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';


// Función para registrar usuarios o profesores
export const registerUserOrTeacher = async (req, res) => {
  const { email, password, userName, role } = req.body;

  try {
    let existingUser;
    let Model;

    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    existingUser = await Model.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: `El correo electrónico ya está en uso por otro ${role}` });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new Model({
      userName,
      email,
      password: passwordHash,
      role
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id, role });
    res.cookie('token', token, { httpOnly: false, secure: false });
    res.json({
      id: userSaved._id,
      userName: userSaved.userName,
      email: userSaved.email,
      role: userSaved.role
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ message: error.message });
  }
};

// Función para iniciar sesión de usuarios o profesores
export const loginUserOrTeacher = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    let Model;

    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} no encontrado` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.CLAVE_SECRETA, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: false, secure: false });

    return res.json({
      message: "Inicio de sesión exitoso",
      id: user._id,
      userName: user.userName,
      email: user.email,
      date: user.createdAt,
      role: role,
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para cerrar sesión
export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: false,
  });
  return res.sendStatus(200);
};

// Función para obtener el perfil del usuario o profesor
export const profile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role === 'student') {
      user = await User.findById(id);
    } else if (role === 'teacher') {
      user = await Teacher.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//funcion para verificar el token
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No hay token, no estás autorizado" });
    }

    jwt.verify(token, process.env.CLAVE_SECRETA, async (err, decoded) => {
      if (err) {
        return res.status(402).json({ message: "No estás autorizado" });
      }

      const { id, role } = decoded;
      let userFound;

      if (role === 'student') {
        userFound = await User.findById(id);
      } else if (role === 'teacher') {
        userFound = await Teacher.findById(id);
      }

      if (!userFound) {
        return res.status(403).json({ message: "Usuario no encontrado" });
      }

      return res.json({
        id: userFound._id,
        userName: userFound.userName,
        email: userFound.email,
        role
      });
    });
  } catch (error) {
    console.error('Error en la verificación del token:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para eliminar un usuario
export const DeleteUser = async (req, res) => {
  const { id, role } = req.user;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }

    let Model;
    if (role === 'student') {
      Model = User;
    } else if (role === 'teacher') {
      Model = Teacher;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await Model.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true, // Asegúrate de que la cookie sea httpOnly
      secure: true,
    });

    console.log("Usuario eliminado:", user);
    return res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Función para obtener las calificaciones de un usuario
export const getGrades = async (req, res) => {
  const { id, role } = req.user;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }

    let Model;
    if (role === 'student') {
      Model = User;
    } else {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const calificaciones = user.calificacionesEntrevistas || [];

    // Enviar las calificaciones de vuelta al frontend
    return res.status(200).json({ calificaciones });
  } catch (error) {
    console.error('Error al obtener las calificaciones:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Función paraobtener las calificaciones de un profesor
export const getAccionTeacher = async (req, res) => {
  const { id, role } = req.user;
  try {
    if (!id || !role) {
      return res.status(400).json({ message: "ID o rol faltante" });
    }

    if (role !== 'teacher') {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    const acciones = teacher.accionesEntrevistasTeacher || [];

    // Enviar las acciones de vuelta al frontend
    return res.status(200).json({ acciones });
  } catch (error) {
    console.error('Error al obtener las acciones:', error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}