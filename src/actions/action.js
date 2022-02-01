import axios from 'axios';

export const getUserData = () => {
  return dispatch => {
       return axios
             .get('https://kyupid-api.vercel.app/api/users')
             .then(json => {
               dispatch({
                 type: "USER-DATA",
                 data: json.data
               });
             }
       );
     };
}

export const getAreaDetails = () => {
  return dispatch => {
       return axios
             .get('https://kyupid-api.vercel.app/api/areas')
             .then(json => {
               dispatch({
                 type: "AREA-DETAILS",
                 data: json.data
               });
             }
       );
     };
}