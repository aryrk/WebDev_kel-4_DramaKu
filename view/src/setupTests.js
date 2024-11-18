import "whatwg-fetch"; // Menambahkan polyfill untuk fetch
import { TextEncoder, TextDecoder } from "text-encoding";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
