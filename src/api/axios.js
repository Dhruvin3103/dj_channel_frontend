import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',  // Adjust to your backend URL
    withCredentials: true,
});

export default api;


// // import axios from "axios";

// // // export default axios.create(
// // //    {baseURL: 'http://127.0.0.1:8000'}
// // // )

// // // // api.js
// // // import axios from 'axios';
// // api.js
// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://127.0.0.1:8000',  // Adjust to your backend URL
//     withCredentials: true,
// });

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const response = await api.post('/auth/jwt/refresh/');
//                 const newAccessToken = response.data.access;

//                 // Update access token in cookies
//                 document.cookie = `access_token=${newAccessToken}; HttpOnly; Secure; SameSite=Strict`;

//                 // Retry the original request with the new access token
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return api(originalRequest);
//             } catch (error) {
//                 console.log('Token refresh error:', error);
//                 // Redirect to login or perform other actions on token refresh failure
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;
