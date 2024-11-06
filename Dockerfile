# Usar una imagen base de Node.js
FROM node:18

# Crear y establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta el backend (ejemplo: 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]