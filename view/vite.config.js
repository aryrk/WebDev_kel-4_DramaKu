import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: process.env.VITE_PROXY_TARGET,
  //       // target: "https://web-dev-kel-4-pluto-cinema-server.vercel.app",
  //       changeOrigin: true,
  //       // secure: false,
  //       secure: true,
  //       configure: (proxy, options) => {
  //         proxy.on("proxyReq", (proxyReq, req, res) => {
  //           if (req.headers.origin) {
  //             proxyReq.setHeader("Origin", req.headers.origin);
  //           }
  //         });
  //       },
  //       headers: {
  //         Origin: process.env.VITE_ORIGIN,
  //       },
  //     },
  //   },
  //   cors: true,
  // },

  // base: "./",
});
