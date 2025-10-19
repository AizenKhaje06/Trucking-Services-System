/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_google_sheets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/google-sheets */ \"(rsc)/./lib/google-sheets.ts\");\n\n\nasync function POST(request) {\n    try {\n        const { role, accountNo, password } = await request.json();\n        if (!role || !accountNo || !password) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Missing required fields\"\n            }, {\n                status: 400\n            });\n        }\n        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;\n        if (!spreadsheetId) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Google Sheets configuration missing\"\n            }, {\n                status: 500\n            });\n        }\n        const sheetName = role === \"Owner\" ? \"Owners\" : \"Employees\";\n        const users = await (0,_lib_google_sheets__WEBPACK_IMPORTED_MODULE_1__.readSheetData)(spreadsheetId, `${sheetName}!A:D`);\n        const user = users.find((u)=>u[\"Account Number\"] === accountNo && u[\"Password\"] === password);\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Invalid account number or password\"\n            }, {\n                status: 401\n            });\n        }\n        const session = {\n            userId: user[\"Account Number\"],\n            name: user[\"Name\"],\n            role,\n            email: user[\"Email\"],\n            loginTime: new Date().toISOString()\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            session\n        }, {\n            status: 200\n        });\n    } catch (error) {\n        console.error(\"Login error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"An error occurred during login\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTREO0FBQ1Q7QUFFNUMsZUFBZUUsS0FBS0MsT0FBb0I7SUFDN0MsSUFBSTtRQUNGLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFFBQVEsRUFBRSxHQUFHLE1BQU1ILFFBQVFJLElBQUk7UUFFeEQsSUFBSSxDQUFDSCxRQUFRLENBQUNDLGFBQWEsQ0FBQ0MsVUFBVTtZQUNwQyxPQUFPTixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO2dCQUFFQyxTQUFTO1lBQTBCLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNqRjtRQUVBLE1BQU1DLGdCQUFnQkMsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0I7UUFDbEQsSUFBSSxDQUFDSCxlQUFlO1lBQ2xCLE9BQU9WLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7Z0JBQUVDLFNBQVM7WUFBc0MsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQzdGO1FBRUEsTUFBTUssWUFBWVYsU0FBUyxVQUFVLFdBQVc7UUFDaEQsTUFBTVcsUUFBUSxNQUFNZCxpRUFBYUEsQ0FBQ1MsZUFBZSxHQUFHSSxVQUFVLElBQUksQ0FBQztRQUVuRSxNQUFNRSxPQUFPRCxNQUFNRSxJQUFJLENBQUMsQ0FBQ0MsSUFBTUEsQ0FBQyxDQUFDLGlCQUFpQixLQUFLYixhQUFhYSxDQUFDLENBQUMsV0FBVyxLQUFLWjtRQUV0RixJQUFJLENBQUNVLE1BQU07WUFDVCxPQUFPaEIscURBQVlBLENBQUNPLElBQUksQ0FBQztnQkFBRUMsU0FBUztZQUFxQyxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDNUY7UUFFQSxNQUFNVSxVQUFVO1lBQ2RDLFFBQVFKLElBQUksQ0FBQyxpQkFBaUI7WUFDOUJLLE1BQU1MLElBQUksQ0FBQyxPQUFPO1lBQ2xCWjtZQUNBa0IsT0FBT04sSUFBSSxDQUFDLFFBQVE7WUFDcEJPLFdBQVcsSUFBSUMsT0FBT0MsV0FBVztRQUNuQztRQUVBLE9BQU96QixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1lBQUVZO1FBQVEsR0FBRztZQUFFVixRQUFRO1FBQUk7SUFDdEQsRUFBRSxPQUFPaUIsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsZ0JBQWdCQTtRQUM5QixPQUFPMUIscURBQVlBLENBQUNPLElBQUksQ0FBQztZQUFFQyxTQUFTO1FBQWlDLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ3hGO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcQWl6ZW4wNlxcRG9jdW1lbnRzXFxHSVRIVUIgUFJPSkVDVFxcVHJ1Y2tpbmcgU2VydmljZXMgU3lzdGUsXFxUcnVja2luZy1TZXJ2aWNlcy1TeXN0ZW1cXGFwcFxcYXBpXFxhdXRoXFxsb2dpblxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCJcclxuaW1wb3J0IHsgcmVhZFNoZWV0RGF0YSB9IGZyb20gXCJAL2xpYi9nb29nbGUtc2hlZXRzXCJcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgcm9sZSwgYWNjb3VudE5vLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKClcclxuXHJcbiAgICBpZiAoIXJvbGUgfHwgIWFjY291bnRObyB8fCAhcGFzc3dvcmQpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJNaXNzaW5nIHJlcXVpcmVkIGZpZWxkc1wiIH0sIHsgc3RhdHVzOiA0MDAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzcHJlYWRzaGVldElkID0gcHJvY2Vzcy5lbnYuR09PR0xFX1NIRUVUU19JRFxyXG4gICAgaWYgKCFzcHJlYWRzaGVldElkKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiR29vZ2xlIFNoZWV0cyBjb25maWd1cmF0aW9uIG1pc3NpbmdcIiB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2hlZXROYW1lID0gcm9sZSA9PT0gXCJPd25lclwiID8gXCJPd25lcnNcIiA6IFwiRW1wbG95ZWVzXCJcclxuICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgcmVhZFNoZWV0RGF0YShzcHJlYWRzaGVldElkLCBgJHtzaGVldE5hbWV9IUE6RGApXHJcblxyXG4gICAgY29uc3QgdXNlciA9IHVzZXJzLmZpbmQoKHUpID0+IHVbXCJBY2NvdW50IE51bWJlclwiXSA9PT0gYWNjb3VudE5vICYmIHVbXCJQYXNzd29yZFwiXSA9PT0gcGFzc3dvcmQpXHJcblxyXG4gICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiSW52YWxpZCBhY2NvdW50IG51bWJlciBvciBwYXNzd29yZFwiIH0sIHsgc3RhdHVzOiA0MDEgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZXNzaW9uID0ge1xyXG4gICAgICB1c2VySWQ6IHVzZXJbXCJBY2NvdW50IE51bWJlclwiXSxcclxuICAgICAgbmFtZTogdXNlcltcIk5hbWVcIl0sXHJcbiAgICAgIHJvbGUsXHJcbiAgICAgIGVtYWlsOiB1c2VyW1wiRW1haWxcIl0sXHJcbiAgICAgIGxvZ2luVGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHNlc3Npb24gfSwgeyBzdGF0dXM6IDIwMCB9KVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiTG9naW4gZXJyb3I6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJBbiBlcnJvciBvY2N1cnJlZCBkdXJpbmcgbG9naW5cIiB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJyZWFkU2hlZXREYXRhIiwiUE9TVCIsInJlcXVlc3QiLCJyb2xlIiwiYWNjb3VudE5vIiwicGFzc3dvcmQiLCJqc29uIiwibWVzc2FnZSIsInN0YXR1cyIsInNwcmVhZHNoZWV0SWQiLCJwcm9jZXNzIiwiZW52IiwiR09PR0xFX1NIRUVUU19JRCIsInNoZWV0TmFtZSIsInVzZXJzIiwidXNlciIsImZpbmQiLCJ1Iiwic2Vzc2lvbiIsInVzZXJJZCIsIm5hbWUiLCJlbWFpbCIsImxvZ2luVGltZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImVycm9yIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/google-sheets.ts":
/*!******************************!*\
  !*** ./lib/google-sheets.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   appendSheetData: () => (/* binding */ appendSheetData),\n/* harmony export */   clearSheetData: () => (/* binding */ clearSheetData),\n/* harmony export */   readSheetData: () => (/* binding */ readSheetData),\n/* harmony export */   writeSheetData: () => (/* binding */ writeSheetData)\n/* harmony export */ });\n/* harmony import */ var googleapis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! googleapis */ \"(rsc)/./node_modules/.pnpm/googleapis@164.0.0/node_modules/googleapis/build/src/index.js\");\n\nconst auth = new googleapis__WEBPACK_IMPORTED_MODULE_0__.google.auth.GoogleAuth({\n    credentials: {\n        type: \"service_account\",\n        project_id: process.env.GOOGLE_PROJECT_ID,\n        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,\n        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\\\n/g, \"\\n\"),\n        client_email: process.env.GOOGLE_CLIENT_EMAIL,\n        client_id: process.env.GOOGLE_CLIENT_ID,\n        auth_uri: \"https://accounts.google.com/o/oauth2/auth\",\n        token_uri: \"https://oauth2.googleapis.com/token\",\n        auth_provider_x509_cert_url: \"https://www.googleapis.com/oauth2/v1/certs\",\n        client_x509_cert_url: process.env.GOOGLE_CERT_URL\n    },\n    scopes: [\n        \"https://www.googleapis.com/auth/spreadsheets\"\n    ]\n});\nconst sheets = googleapis__WEBPACK_IMPORTED_MODULE_0__.google.sheets({\n    version: \"v4\",\n    auth\n});\nasync function readSheetData(spreadsheetId, range) {\n    try {\n        const response = await sheets.spreadsheets.values.get({\n            spreadsheetId,\n            range\n        });\n        const rows = response.data.values || [];\n        if (rows.length === 0) return [];\n        const headers = rows[0];\n        const data = rows.slice(1).map((row)=>{\n            const obj = {};\n            headers.forEach((header, index)=>{\n                obj[header] = row[index] || null;\n            });\n            return obj;\n        });\n        return data;\n    } catch (error) {\n        console.error(\"Error reading sheet data:\", error);\n        throw error;\n    }\n}\nasync function writeSheetData(spreadsheetId, range, values) {\n    try {\n        await sheets.spreadsheets.values.update({\n            spreadsheetId,\n            range,\n            valueInputOption: \"RAW\",\n            requestBody: {\n                values\n            }\n        });\n    } catch (error) {\n        console.error(\"Error writing sheet data:\", error);\n        throw error;\n    }\n}\nasync function appendSheetData(spreadsheetId, range, values) {\n    try {\n        await sheets.spreadsheets.values.append({\n            spreadsheetId,\n            range,\n            valueInputOption: \"RAW\",\n            requestBody: {\n                values\n            }\n        });\n    } catch (error) {\n        console.error(\"Error appending sheet data:\", error);\n        throw error;\n    }\n}\nasync function clearSheetData(spreadsheetId, range) {\n    try {\n        await sheets.spreadsheets.values.clear({\n            spreadsheetId,\n            range\n        });\n    } catch (error) {\n        console.error(\"Error clearing sheet data:\", error);\n        throw error;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZ29vZ2xlLXNoZWV0cy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFtQztBQUVuQyxNQUFNQyxPQUFPLElBQUlELDhDQUFNQSxDQUFDQyxJQUFJLENBQUNDLFVBQVUsQ0FBQztJQUN0Q0MsYUFBYTtRQUNYQyxNQUFNO1FBQ05DLFlBQVlDLFFBQVFDLEdBQUcsQ0FBQ0MsaUJBQWlCO1FBQ3pDQyxnQkFBZ0JILFFBQVFDLEdBQUcsQ0FBQ0cscUJBQXFCO1FBQ2pEQyxhQUFhTCxRQUFRQyxHQUFHLENBQUNLLGtCQUFrQixFQUFFQyxRQUFRLFFBQVE7UUFDN0RDLGNBQWNSLFFBQVFDLEdBQUcsQ0FBQ1EsbUJBQW1CO1FBQzdDQyxXQUFXVixRQUFRQyxHQUFHLENBQUNVLGdCQUFnQjtRQUN2Q0MsVUFBVTtRQUNWQyxXQUFXO1FBQ1hDLDZCQUE2QjtRQUM3QkMsc0JBQXNCZixRQUFRQyxHQUFHLENBQUNlLGVBQWU7SUFDbkQ7SUFDQUMsUUFBUTtRQUFDO0tBQStDO0FBQzFEO0FBRUEsTUFBTUMsU0FBU3hCLDhDQUFNQSxDQUFDd0IsTUFBTSxDQUFDO0lBQUVDLFNBQVM7SUFBTXhCO0FBQUs7QUFNNUMsZUFBZXlCLGNBQWNDLGFBQXFCLEVBQUVDLEtBQWE7SUFDdEUsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUwsT0FBT00sWUFBWSxDQUFDQyxNQUFNLENBQUNDLEdBQUcsQ0FBQztZQUNwREw7WUFDQUM7UUFDRjtRQUVBLE1BQU1LLE9BQU9KLFNBQVNLLElBQUksQ0FBQ0gsTUFBTSxJQUFJLEVBQUU7UUFDdkMsSUFBSUUsS0FBS0UsTUFBTSxLQUFLLEdBQUcsT0FBTyxFQUFFO1FBRWhDLE1BQU1DLFVBQVVILElBQUksQ0FBQyxFQUFFO1FBQ3ZCLE1BQU1DLE9BQW9CRCxLQUFLSSxLQUFLLENBQUMsR0FBR0MsR0FBRyxDQUFDLENBQUNDO1lBQzNDLE1BQU1DLE1BQWlCLENBQUM7WUFDeEJKLFFBQVFLLE9BQU8sQ0FBQyxDQUFDQyxRQUFnQkM7Z0JBQy9CSCxHQUFHLENBQUNFLE9BQU8sR0FBR0gsR0FBRyxDQUFDSSxNQUFNLElBQUk7WUFDOUI7WUFDQSxPQUFPSDtRQUNUO1FBRUEsT0FBT047SUFDVCxFQUFFLE9BQU9VLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLDZCQUE2QkE7UUFDM0MsTUFBTUE7SUFDUjtBQUNGO0FBRU8sZUFBZUUsZUFDcEJuQixhQUFxQixFQUNyQkMsS0FBYSxFQUNiRyxNQUE4QztJQUU5QyxJQUFJO1FBQ0YsTUFBTVAsT0FBT00sWUFBWSxDQUFDQyxNQUFNLENBQUNnQixNQUFNLENBQUM7WUFDdENwQjtZQUNBQztZQUNBb0Isa0JBQWtCO1lBQ2xCQyxhQUFhO2dCQUNYbEI7WUFDRjtRQUNGO0lBQ0YsRUFBRSxPQUFPYSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDLE1BQU1BO0lBQ1I7QUFDRjtBQUVPLGVBQWVNLGdCQUNwQnZCLGFBQXFCLEVBQ3JCQyxLQUFhLEVBQ2JHLE1BQThDO0lBRTlDLElBQUk7UUFDRixNQUFNUCxPQUFPTSxZQUFZLENBQUNDLE1BQU0sQ0FBQ29CLE1BQU0sQ0FBQztZQUN0Q3hCO1lBQ0FDO1lBQ0FvQixrQkFBa0I7WUFDbEJDLGFBQWE7Z0JBQ1hsQjtZQUNGO1FBQ0Y7SUFDRixFQUFFLE9BQU9hLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLCtCQUErQkE7UUFDN0MsTUFBTUE7SUFDUjtBQUNGO0FBRU8sZUFBZVEsZUFBZXpCLGFBQXFCLEVBQUVDLEtBQWE7SUFDdkUsSUFBSTtRQUNGLE1BQU1KLE9BQU9NLFlBQVksQ0FBQ0MsTUFBTSxDQUFDc0IsS0FBSyxDQUFDO1lBQ3JDMUI7WUFDQUM7UUFDRjtJQUNGLEVBQUUsT0FBT2dCLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLDhCQUE4QkE7UUFDNUMsTUFBTUE7SUFDUjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFpemVuMDZcXERvY3VtZW50c1xcR0lUSFVCIFBST0pFQ1RcXFRydWNraW5nIFNlcnZpY2VzIFN5c3RlLFxcVHJ1Y2tpbmctU2VydmljZXMtU3lzdGVtXFxsaWJcXGdvb2dsZS1zaGVldHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ29vZ2xlIH0gZnJvbSBcImdvb2dsZWFwaXNcIlxyXG5cclxuY29uc3QgYXV0aCA9IG5ldyBnb29nbGUuYXV0aC5Hb29nbGVBdXRoKHtcclxuICBjcmVkZW50aWFsczoge1xyXG4gICAgdHlwZTogXCJzZXJ2aWNlX2FjY291bnRcIixcclxuICAgIHByb2plY3RfaWQ6IHByb2Nlc3MuZW52LkdPT0dMRV9QUk9KRUNUX0lELFxyXG4gICAgcHJpdmF0ZV9rZXlfaWQ6IHByb2Nlc3MuZW52LkdPT0dMRV9QUklWQVRFX0tFWV9JRCxcclxuICAgIHByaXZhdGVfa2V5OiBwcm9jZXNzLmVudi5HT09HTEVfUFJJVkFURV9LRVk/LnJlcGxhY2UoL1xcXFxuL2csIFwiXFxuXCIpLFxyXG4gICAgY2xpZW50X2VtYWlsOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0VNQUlMLFxyXG4gICAgY2xpZW50X2lkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lELFxyXG4gICAgYXV0aF91cmk6IFwiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGhcIixcclxuICAgIHRva2VuX3VyaTogXCJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlblwiLFxyXG4gICAgYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsOiBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0c1wiLFxyXG4gICAgY2xpZW50X3g1MDlfY2VydF91cmw6IHByb2Nlc3MuZW52LkdPT0dMRV9DRVJUX1VSTCxcclxuICB9LFxyXG4gIHNjb3BlczogW1wiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9zcHJlYWRzaGVldHNcIl0sXHJcbn0pXHJcblxyXG5jb25zdCBzaGVldHMgPSBnb29nbGUuc2hlZXRzKHsgdmVyc2lvbjogXCJ2NFwiLCBhdXRoIH0pXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNoZWV0RGF0YSB7XHJcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IG51bGxcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRTaGVldERhdGEoc3ByZWFkc2hlZXRJZDogc3RyaW5nLCByYW5nZTogc3RyaW5nKTogUHJvbWlzZTxTaGVldERhdGFbXT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNoZWV0cy5zcHJlYWRzaGVldHMudmFsdWVzLmdldCh7XHJcbiAgICAgIHNwcmVhZHNoZWV0SWQsXHJcbiAgICAgIHJhbmdlLFxyXG4gICAgfSlcclxuXHJcbiAgICBjb25zdCByb3dzID0gcmVzcG9uc2UuZGF0YS52YWx1ZXMgfHwgW11cclxuICAgIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdXHJcblxyXG4gICAgY29uc3QgaGVhZGVycyA9IHJvd3NbMF1cclxuICAgIGNvbnN0IGRhdGE6IFNoZWV0RGF0YVtdID0gcm93cy5zbGljZSgxKS5tYXAoKHJvdykgPT4ge1xyXG4gICAgICBjb25zdCBvYmo6IFNoZWV0RGF0YSA9IHt9XHJcbiAgICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICBvYmpbaGVhZGVyXSA9IHJvd1tpbmRleF0gfHwgbnVsbFxyXG4gICAgICB9KVxyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciByZWFkaW5nIHNoZWV0IGRhdGE6XCIsIGVycm9yKVxyXG4gICAgdGhyb3cgZXJyb3JcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZVNoZWV0RGF0YShcclxuICBzcHJlYWRzaGVldElkOiBzdHJpbmcsXHJcbiAgcmFuZ2U6IHN0cmluZyxcclxuICB2YWx1ZXM6IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgbnVsbClbXVtdLFxyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICB0cnkge1xyXG4gICAgYXdhaXQgc2hlZXRzLnNwcmVhZHNoZWV0cy52YWx1ZXMudXBkYXRlKHtcclxuICAgICAgc3ByZWFkc2hlZXRJZCxcclxuICAgICAgcmFuZ2UsXHJcbiAgICAgIHZhbHVlSW5wdXRPcHRpb246IFwiUkFXXCIsXHJcbiAgICAgIHJlcXVlc3RCb2R5OiB7XHJcbiAgICAgICAgdmFsdWVzLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIHdyaXRpbmcgc2hlZXQgZGF0YTpcIiwgZXJyb3IpXHJcbiAgICB0aHJvdyBlcnJvclxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFwcGVuZFNoZWV0RGF0YShcclxuICBzcHJlYWRzaGVldElkOiBzdHJpbmcsXHJcbiAgcmFuZ2U6IHN0cmluZyxcclxuICB2YWx1ZXM6IChzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgbnVsbClbXVtdLFxyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICB0cnkge1xyXG4gICAgYXdhaXQgc2hlZXRzLnNwcmVhZHNoZWV0cy52YWx1ZXMuYXBwZW5kKHtcclxuICAgICAgc3ByZWFkc2hlZXRJZCxcclxuICAgICAgcmFuZ2UsXHJcbiAgICAgIHZhbHVlSW5wdXRPcHRpb246IFwiUkFXXCIsXHJcbiAgICAgIHJlcXVlc3RCb2R5OiB7XHJcbiAgICAgICAgdmFsdWVzLFxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGFwcGVuZGluZyBzaGVldCBkYXRhOlwiLCBlcnJvcilcclxuICAgIHRocm93IGVycm9yXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJTaGVldERhdGEoc3ByZWFkc2hlZXRJZDogc3RyaW5nLCByYW5nZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHNoZWV0cy5zcHJlYWRzaGVldHMudmFsdWVzLmNsZWFyKHtcclxuICAgICAgc3ByZWFkc2hlZXRJZCxcclxuICAgICAgcmFuZ2UsXHJcbiAgICB9KVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY2xlYXJpbmcgc2hlZXQgZGF0YTpcIiwgZXJyb3IpXHJcbiAgICB0aHJvdyBlcnJvclxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiZ29vZ2xlIiwiYXV0aCIsIkdvb2dsZUF1dGgiLCJjcmVkZW50aWFscyIsInR5cGUiLCJwcm9qZWN0X2lkIiwicHJvY2VzcyIsImVudiIsIkdPT0dMRV9QUk9KRUNUX0lEIiwicHJpdmF0ZV9rZXlfaWQiLCJHT09HTEVfUFJJVkFURV9LRVlfSUQiLCJwcml2YXRlX2tleSIsIkdPT0dMRV9QUklWQVRFX0tFWSIsInJlcGxhY2UiLCJjbGllbnRfZW1haWwiLCJHT09HTEVfQ0xJRU5UX0VNQUlMIiwiY2xpZW50X2lkIiwiR09PR0xFX0NMSUVOVF9JRCIsImF1dGhfdXJpIiwidG9rZW5fdXJpIiwiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIiwiY2xpZW50X3g1MDlfY2VydF91cmwiLCJHT09HTEVfQ0VSVF9VUkwiLCJzY29wZXMiLCJzaGVldHMiLCJ2ZXJzaW9uIiwicmVhZFNoZWV0RGF0YSIsInNwcmVhZHNoZWV0SWQiLCJyYW5nZSIsInJlc3BvbnNlIiwic3ByZWFkc2hlZXRzIiwidmFsdWVzIiwiZ2V0Iiwicm93cyIsImRhdGEiLCJsZW5ndGgiLCJoZWFkZXJzIiwic2xpY2UiLCJtYXAiLCJyb3ciLCJvYmoiLCJmb3JFYWNoIiwiaGVhZGVyIiwiaW5kZXgiLCJlcnJvciIsImNvbnNvbGUiLCJ3cml0ZVNoZWV0RGF0YSIsInVwZGF0ZSIsInZhbHVlSW5wdXRPcHRpb24iLCJyZXF1ZXN0Qm9keSIsImFwcGVuZFNoZWV0RGF0YSIsImFwcGVuZCIsImNsZWFyU2hlZXREYXRhIiwiY2xlYXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/google-sheets.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Aizen06_Documents_GITHUB_PROJECT_Trucking_Services_Syste_Trucking_Services_System_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Aizen06\\\\Documents\\\\GITHUB PROJECT\\\\Trucking Services Syste,\\\\Trucking-Services-System\\\\app\\\\api\\\\auth\\\\login\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Aizen06_Documents_GITHUB_PROJECT_Trucking_Services_Syste_Trucking_Services_System_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjIuMF9yZWFjdEAxOS4yLjBfX3JlYWN0QDE5LjIuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBaXplbjA2JTVDRG9jdW1lbnRzJTVDR0lUSFVCJTIwUFJPSkVDVCU1Q1RydWNraW5nJTIwU2VydmljZXMlMjBTeXN0ZSUyQyU1Q1RydWNraW5nLVNlcnZpY2VzLVN5c3RlbSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDQWl6ZW4wNiU1Q0RvY3VtZW50cyU1Q0dJVEhVQiUyMFBST0pFQ1QlNUNUcnVja2luZyUyMFNlcnZpY2VzJTIwU3lzdGUlMkMlNUNUcnVja2luZy1TZXJ2aWNlcy1TeXN0ZW0maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2tGO0FBQy9KO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxBaXplbjA2XFxcXERvY3VtZW50c1xcXFxHSVRIVUIgUFJPSkVDVFxcXFxUcnVja2luZyBTZXJ2aWNlcyBTeXN0ZSxcXFxcVHJ1Y2tpbmctU2VydmljZXMtU3lzdGVtXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxsb2dpblxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9sb2dpbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbG9naW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvbG9naW4vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxBaXplbjA2XFxcXERvY3VtZW50c1xcXFxHSVRIVUIgUFJPSkVDVFxcXFxUcnVja2luZyBTZXJ2aWNlcyBTeXN0ZSxcXFxcVHJ1Y2tpbmctU2VydmljZXMtU3lzdGVtXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxsb2dpblxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/googleapis@164.0.0","vendor-chunks/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0","vendor-chunks/google-auth-library@10.4.1","vendor-chunks/googleapis-common@8.0.0","vendor-chunks/math-intrinsics@1.1.0","vendor-chunks/gaxios@7.1.2","vendor-chunks/es-errors@1.3.0","vendor-chunks/qs@6.14.0","vendor-chunks/jws@4.0.0","vendor-chunks/call-bind-apply-helpers@1.0.2","vendor-chunks/json-bigint@1.0.0","vendor-chunks/google-logging-utils@1.1.1","vendor-chunks/get-proto@1.0.1","vendor-chunks/gcp-metadata@8.1.1","vendor-chunks/object-inspect@1.13.4","vendor-chunks/has-symbols@1.1.0","vendor-chunks/gopd@1.2.0","vendor-chunks/function-bind@1.1.2","vendor-chunks/ecdsa-sig-formatter@1.0.11","vendor-chunks/gtoken@8.0.0","vendor-chunks/url-template@2.0.8","vendor-chunks/side-channel@1.1.0","vendor-chunks/side-channel-weakmap@1.0.2","vendor-chunks/side-channel-map@1.0.1","vendor-chunks/side-channel-list@1.0.0","vendor-chunks/safe-buffer@5.2.1","vendor-chunks/jwa@2.0.1","vendor-chunks/hasown@2.0.2","vendor-chunks/get-intrinsic@1.3.0","vendor-chunks/extend@3.0.2","vendor-chunks/es-object-atoms@1.1.1","vendor-chunks/es-define-property@1.0.1","vendor-chunks/dunder-proto@1.0.1","vendor-chunks/call-bound@1.0.4","vendor-chunks/buffer-equal-constant-time@1.0.1","vendor-chunks/bignumber.js@9.3.1","vendor-chunks/base64-js@1.5.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAizen06%5CDocuments%5CGITHUB%20PROJECT%5CTrucking%20Services%20Syste%2C%5CTrucking-Services-System&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();