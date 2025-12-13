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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/contexts/NavigationContext.tsx":
/*!********************************************!*\
  !*** ./src/contexts/NavigationContext.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NavigationProvider: () => (/* binding */ NavigationProvider),\n/* harmony export */   useNavigation: () => (/* binding */ useNavigation)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst NavigationContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst useNavigation = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(NavigationContext);\n    if (!context) {\n        throw new Error(\"useNavigation must be used within a NavigationProvider\");\n    }\n    return context;\n};\nconst NavigationProvider = ({ children })=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const [navigationState, setNavigationState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({\n        currentPath: \"/\",\n        isNavigating: false,\n        previousPath: null\n    });\n    const setNavigating = (isNavigating)=>{\n        setNavigationState((prev)=>({\n                ...prev,\n                isNavigating\n            }));\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const handleRouteChangeStart = (url)=>{\n            setNavigationState((prev)=>({\n                    currentPath: prev.currentPath,\n                    isNavigating: true,\n                    previousPath: prev.currentPath\n                }));\n        };\n        const handleRouteChangeComplete = (url)=>{\n            setNavigationState((prev)=>({\n                    currentPath: url,\n                    isNavigating: false,\n                    previousPath: prev.previousPath\n                }));\n        };\n        const handleRouteChangeError = ()=>{\n            setNavigationState((prev)=>({\n                    ...prev,\n                    isNavigating: false\n                }));\n        };\n        // Set initial path\n        setNavigationState((prev)=>({\n                ...prev,\n                currentPath: router.asPath\n            }));\n        // Listen to route changes\n        router.events.on(\"routeChangeStart\", handleRouteChangeStart);\n        router.events.on(\"routeChangeComplete\", handleRouteChangeComplete);\n        router.events.on(\"routeChangeError\", handleRouteChangeError);\n        return ()=>{\n            router.events.off(\"routeChangeStart\", handleRouteChangeStart);\n            router.events.off(\"routeChangeComplete\", handleRouteChangeComplete);\n            router.events.off(\"routeChangeError\", handleRouteChangeError);\n        };\n    }, [\n        router\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(NavigationContext.Provider, {\n        value: {\n            navigationState,\n            setNavigating\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\WS\\\\git\\\\healthstandards.in\\\\src\\\\contexts\\\\NavigationContext.tsx\",\n        lineNumber: 87,\n        columnNumber: 5\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvTmF2aWdhdGlvbkNvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUE4RTtBQUN0QztBQWF4QyxNQUFNTSxrQ0FBb0JMLG9EQUFhQSxDQUFvQ007QUFFcEUsTUFBTUMsZ0JBQWdCO0lBQzNCLE1BQU1DLFVBQVVQLGlEQUFVQSxDQUFDSTtJQUMzQixJQUFJLENBQUNHLFNBQVM7UUFDWixNQUFNLElBQUlDLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNULEVBQUU7QUFNSyxNQUFNRSxxQkFBd0QsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDaEYsTUFBTUMsU0FBU1Isc0RBQVNBO0lBQ3hCLE1BQU0sQ0FBQ1MsaUJBQWlCQyxtQkFBbUIsR0FBR1osK0NBQVFBLENBQWtCO1FBQ3RFYSxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztJQUNoQjtJQUVBLE1BQU1DLGdCQUFnQixDQUFDRjtRQUNyQkYsbUJBQW1CSyxDQUFBQSxPQUFTO2dCQUMxQixHQUFHQSxJQUFJO2dCQUNQSDtZQUNGO0lBQ0Y7SUFFQWIsZ0RBQVNBLENBQUM7UUFDUixNQUFNaUIseUJBQXlCLENBQUNDO1lBQzlCUCxtQkFBbUJLLENBQUFBLE9BQVM7b0JBQzFCSixhQUFhSSxLQUFLSixXQUFXO29CQUM3QkMsY0FBYztvQkFDZEMsY0FBY0UsS0FBS0osV0FBVztnQkFDaEM7UUFDRjtRQUVBLE1BQU1PLDRCQUE0QixDQUFDRDtZQUNqQ1AsbUJBQW1CSyxDQUFBQSxPQUFTO29CQUMxQkosYUFBYU07b0JBQ2JMLGNBQWM7b0JBQ2RDLGNBQWNFLEtBQUtGLFlBQVk7Z0JBQ2pDO1FBQ0Y7UUFFQSxNQUFNTSx5QkFBeUI7WUFDN0JULG1CQUFtQkssQ0FBQUEsT0FBUztvQkFDMUIsR0FBR0EsSUFBSTtvQkFDUEgsY0FBYztnQkFDaEI7UUFDRjtRQUVBLG1CQUFtQjtRQUNuQkYsbUJBQW1CSyxDQUFBQSxPQUFTO2dCQUMxQixHQUFHQSxJQUFJO2dCQUNQSixhQUFhSCxPQUFPWSxNQUFNO1lBQzVCO1FBRUEsMEJBQTBCO1FBQzFCWixPQUFPYSxNQUFNLENBQUNDLEVBQUUsQ0FBQyxvQkFBb0JOO1FBQ3JDUixPQUFPYSxNQUFNLENBQUNDLEVBQUUsQ0FBQyx1QkFBdUJKO1FBQ3hDVixPQUFPYSxNQUFNLENBQUNDLEVBQUUsQ0FBQyxvQkFBb0JIO1FBRXJDLE9BQU87WUFDTFgsT0FBT2EsTUFBTSxDQUFDRSxHQUFHLENBQUMsb0JBQW9CUDtZQUN0Q1IsT0FBT2EsTUFBTSxDQUFDRSxHQUFHLENBQUMsdUJBQXVCTDtZQUN6Q1YsT0FBT2EsTUFBTSxDQUFDRSxHQUFHLENBQUMsb0JBQW9CSjtRQUN4QztJQUNGLEdBQUc7UUFBQ1g7S0FBTztJQUVYLHFCQUNFLDhEQUFDUCxrQkFBa0J1QixRQUFRO1FBQUNDLE9BQU87WUFBRWhCO1lBQWlCSztRQUFjO2tCQUNqRVA7Ozs7OztBQUdQLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWFsdGgtc3RhbmRhcmRzLXdlYnNpdGUvLi9zcmMvY29udGV4dHMvTmF2aWdhdGlvbkNvbnRleHQudHN4PzFjMDUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuXHJcbmludGVyZmFjZSBOYXZpZ2F0aW9uU3RhdGUge1xyXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmc7XHJcbiAgaXNOYXZpZ2F0aW5nOiBib29sZWFuO1xyXG4gIHByZXZpb3VzUGF0aDogc3RyaW5nIHwgbnVsbDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE5hdmlnYXRpb25Db250ZXh0VHlwZSB7XHJcbiAgbmF2aWdhdGlvblN0YXRlOiBOYXZpZ2F0aW9uU3RhdGU7XHJcbiAgc2V0TmF2aWdhdGluZzogKGlzTmF2aWdhdGluZzogYm9vbGVhbikgPT4gdm9pZDtcclxufVxyXG5cclxuY29uc3QgTmF2aWdhdGlvbkNvbnRleHQgPSBjcmVhdGVDb250ZXh0PE5hdmlnYXRpb25Db250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcclxuXHJcbmV4cG9ydCBjb25zdCB1c2VOYXZpZ2F0aW9uID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KE5hdmlnYXRpb25Db250ZXh0KTtcclxuICBpZiAoIWNvbnRleHQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcigndXNlTmF2aWdhdGlvbiBtdXN0IGJlIHVzZWQgd2l0aGluIGEgTmF2aWdhdGlvblByb3ZpZGVyJyk7XHJcbiAgfVxyXG4gIHJldHVybiBjb250ZXh0O1xyXG59O1xyXG5cclxuaW50ZXJmYWNlIE5hdmlnYXRpb25Qcm92aWRlclByb3BzIHtcclxuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgTmF2aWdhdGlvblByb3ZpZGVyOiBSZWFjdC5GQzxOYXZpZ2F0aW9uUHJvdmlkZXJQcm9wcz4gPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcbiAgY29uc3QgW25hdmlnYXRpb25TdGF0ZSwgc2V0TmF2aWdhdGlvblN0YXRlXSA9IHVzZVN0YXRlPE5hdmlnYXRpb25TdGF0ZT4oe1xyXG4gICAgY3VycmVudFBhdGg6ICcvJyxcclxuICAgIGlzTmF2aWdhdGluZzogZmFsc2UsXHJcbiAgICBwcmV2aW91c1BhdGg6IG51bGwsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNldE5hdmlnYXRpbmcgPSAoaXNOYXZpZ2F0aW5nOiBib29sZWFuKSA9PiB7XHJcbiAgICBzZXROYXZpZ2F0aW9uU3RhdGUocHJldiA9PiAoe1xyXG4gICAgICAuLi5wcmV2LFxyXG4gICAgICBpc05hdmlnYXRpbmcsXHJcbiAgICB9KSk7XHJcbiAgfTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IGhhbmRsZVJvdXRlQ2hhbmdlU3RhcnQgPSAodXJsOiBzdHJpbmcpID0+IHtcclxuICAgICAgc2V0TmF2aWdhdGlvblN0YXRlKHByZXYgPT4gKHtcclxuICAgICAgICBjdXJyZW50UGF0aDogcHJldi5jdXJyZW50UGF0aCxcclxuICAgICAgICBpc05hdmlnYXRpbmc6IHRydWUsXHJcbiAgICAgICAgcHJldmlvdXNQYXRoOiBwcmV2LmN1cnJlbnRQYXRoLFxyXG4gICAgICB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVJvdXRlQ2hhbmdlQ29tcGxldGUgPSAodXJsOiBzdHJpbmcpID0+IHtcclxuICAgICAgc2V0TmF2aWdhdGlvblN0YXRlKHByZXYgPT4gKHtcclxuICAgICAgICBjdXJyZW50UGF0aDogdXJsLFxyXG4gICAgICAgIGlzTmF2aWdhdGluZzogZmFsc2UsXHJcbiAgICAgICAgcHJldmlvdXNQYXRoOiBwcmV2LnByZXZpb3VzUGF0aCxcclxuICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVSb3V0ZUNoYW5nZUVycm9yID0gKCkgPT4ge1xyXG4gICAgICBzZXROYXZpZ2F0aW9uU3RhdGUocHJldiA9PiAoe1xyXG4gICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgaXNOYXZpZ2F0aW5nOiBmYWxzZSxcclxuICAgICAgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBTZXQgaW5pdGlhbCBwYXRoXHJcbiAgICBzZXROYXZpZ2F0aW9uU3RhdGUocHJldiA9PiAoe1xyXG4gICAgICAuLi5wcmV2LFxyXG4gICAgICBjdXJyZW50UGF0aDogcm91dGVyLmFzUGF0aCxcclxuICAgIH0pKTtcclxuXHJcbiAgICAvLyBMaXN0ZW4gdG8gcm91dGUgY2hhbmdlc1xyXG4gICAgcm91dGVyLmV2ZW50cy5vbigncm91dGVDaGFuZ2VTdGFydCcsIGhhbmRsZVJvdXRlQ2hhbmdlU3RhcnQpO1xyXG4gICAgcm91dGVyLmV2ZW50cy5vbigncm91dGVDaGFuZ2VDb21wbGV0ZScsIGhhbmRsZVJvdXRlQ2hhbmdlQ29tcGxldGUpO1xyXG4gICAgcm91dGVyLmV2ZW50cy5vbigncm91dGVDaGFuZ2VFcnJvcicsIGhhbmRsZVJvdXRlQ2hhbmdlRXJyb3IpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHJvdXRlci5ldmVudHMub2ZmKCdyb3V0ZUNoYW5nZVN0YXJ0JywgaGFuZGxlUm91dGVDaGFuZ2VTdGFydCk7XHJcbiAgICAgIHJvdXRlci5ldmVudHMub2ZmKCdyb3V0ZUNoYW5nZUNvbXBsZXRlJywgaGFuZGxlUm91dGVDaGFuZ2VDb21wbGV0ZSk7XHJcbiAgICAgIHJvdXRlci5ldmVudHMub2ZmKCdyb3V0ZUNoYW5nZUVycm9yJywgaGFuZGxlUm91dGVDaGFuZ2VFcnJvcik7XHJcbiAgICB9O1xyXG4gIH0sIFtyb3V0ZXJdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxOYXZpZ2F0aW9uQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17eyBuYXZpZ2F0aW9uU3RhdGUsIHNldE5hdmlnYXRpbmcgfX0+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvTmF2aWdhdGlvbkNvbnRleHQuUHJvdmlkZXI+XHJcbiAgKTtcclxufTsiXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiTmF2aWdhdGlvbkNvbnRleHQiLCJ1bmRlZmluZWQiLCJ1c2VOYXZpZ2F0aW9uIiwiY29udGV4dCIsIkVycm9yIiwiTmF2aWdhdGlvblByb3ZpZGVyIiwiY2hpbGRyZW4iLCJyb3V0ZXIiLCJuYXZpZ2F0aW9uU3RhdGUiLCJzZXROYXZpZ2F0aW9uU3RhdGUiLCJjdXJyZW50UGF0aCIsImlzTmF2aWdhdGluZyIsInByZXZpb3VzUGF0aCIsInNldE5hdmlnYXRpbmciLCJwcmV2IiwiaGFuZGxlUm91dGVDaGFuZ2VTdGFydCIsInVybCIsImhhbmRsZVJvdXRlQ2hhbmdlQ29tcGxldGUiLCJoYW5kbGVSb3V0ZUNoYW5nZUVycm9yIiwiYXNQYXRoIiwiZXZlbnRzIiwib24iLCJvZmYiLCJQcm92aWRlciIsInZhbHVlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/NavigationContext.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _contexts_NavigationContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contexts/NavigationContext */ \"./src/contexts/NavigationContext.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_NavigationContext__WEBPACK_IMPORTED_MODULE_1__.NavigationProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\WS\\\\git\\\\healthstandards.in\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\WS\\\\git\\\\healthstandards.in\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNtRTtBQUNwQztBQUVoQixTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFLDhEQUFDSCwyRUFBa0JBO2tCQUNqQiw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL2hlYWx0aC1zdGFuZGFyZHMtd2Vic2l0ZS8uL3NyYy9wYWdlcy9fYXBwLnRzeD9mOWQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XHJcbmltcG9ydCB7IE5hdmlnYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHRzL05hdmlnYXRpb25Db250ZXh0JztcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPE5hdmlnYXRpb25Qcm92aWRlcj5cclxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgPC9OYXZpZ2F0aW9uUHJvdmlkZXI+XHJcbiAgKTtcclxufSJdLCJuYW1lcyI6WyJOYXZpZ2F0aW9uUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

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
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();