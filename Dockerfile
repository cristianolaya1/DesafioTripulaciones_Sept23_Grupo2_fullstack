#Utilizar la imagen base de Node.js 14
FROM node:18-alpine

#Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

#Copiar el código del cliente al directorio de trabajo
COPY ./ ./

#Instalar las dependencias del cliente
RUN npm install

#Exponer el puerto utilizado por el cliente
EXPOSE 5000

#Iniciar el cliente
CMD ["sh", "-c", "npm run dev"]