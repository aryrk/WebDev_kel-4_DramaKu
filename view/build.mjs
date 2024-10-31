import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestSourcePath = path.resolve(__dirname, 'public', 'manifest.json');
const manifestDestPath = path.resolve(__dirname, 'dist', 'manifest.json');

fs.copyFileSync(manifestSourcePath, manifestDestPath);

const manifestData = JSON.parse(fs.readFileSync(manifestDestPath, 'utf8'));

manifestData.server = process.env.VITE_PROXY_TARGET;

fs.writeFileSync(manifestDestPath, JSON.stringify(manifestData, null, 2));
console.log('Manifest updated successfully in the build folder');
