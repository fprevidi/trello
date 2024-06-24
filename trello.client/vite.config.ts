import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';

import child_process from 'child_process';

import path from 'path';

const certFilePath = './certificati/aspnetcore-dev-cert.pfx';
const certPassword = 'password'; // Usa la stessa password che hai usato durante l'esportazione



// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/api': {
                target: 'https://localhost:7286/',
                secure: false
            },
            '^/odata': {
                target: 'https://localhost:7286/',
                secure: false
            }
        },
        port: 5173,
        https: {
            pfx: certFilePath,
            passphrase: certPassword,
        }
    }
})
