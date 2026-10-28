// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom under jest 27 (what CRA 5 ships) does not define TextEncoder or
// TextDecoder, which react-router 7 requires at import time. Node has had
// both since v11; this just exposes them as globals so a routed component
// can be imported in a test at all.
const { TextEncoder, TextDecoder } = require("util");
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
