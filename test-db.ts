import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as net from 'net';

dotenv.config();

// Mostrar variables de entorno
console.log("Variables de entorno DB:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

// Verificar si el puerto del host está escuchando
const port = Number(process.env.DB_PORT);
const host = process.env.DB_HOST;

const checkPort = () => {
  return new Promise<void>((resolve, reject) => {
    const socket = net.createConnection(port, host, () => {
      console.log(`✅ Puerto ${port} en ${host} está accesible`);
      socket.end();
      resolve();
    });
    socket.on('error', (err) => {
      console.error(`❌ No se puede conectar a ${host}:${port}`);
      reject(err);
    });
  });
};

// Configurar DataSource de TypeORM
const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const testConnection = async () => {
  try {
    await checkPort(); // Primero verificamos puerto
    console.log("Intentando conectar a la base de datos...");
    await AppDataSource.initialize();
    console.log("✅ Conexión exitosa!");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", (error as any).message);
    console.error(error);
  } finally {
    await AppDataSource.destroy().catch(() => {});
  }
};

testConnection();
