import { data1 } from "../data/data1";
export default function reducer(state = {cardData:[],fullData:data1}, action) {
  switch (action.type) {
    case "Add":
           state={...state,cardData:[...state.cardData,action.payload]}
      return state;
    case "Remove":
      return {...state,cardData:state.cardData.filter((elm, k) => elm.id !== action.payload)};


    case "Plus":
      const exists = state.cardData.find((item) => item.id === action.payload.id);
      if (exists) {
        return (state = {...state,cardData: state.cardData.map((elm) => {
          if (elm.id === action.payload.id) {
            return action.payload;
          } else {
            return elm;
          }
        })});
      }
      return state;


    case "More":
      const exists2 = state.cardData.find((item) => item.id === action.payload.id);
      if (exists2) {
        return (state = {...state,cardData: state.cardData.map((elm) => {
          if (elm.id === action.payload.id) {
            return action.payload;
          } else {
            return elm;
          }
        })});
      }
      return state;


    case 'ADD_MEDICAMENT':
      return { ...state, fullData: [...state.fullData, action.payload] };


    case 'DELETE_MEDICAMENT':
      return {
        ...state,
        fullData: state.fullData.filter((med) => med.id !== action.payload),
      };


    case 'UPDATE_MEDICAMENT':
      return {
        ...state,
        fullData: state.fullData.map((med) =>{if (med.id === action.payload.id) {
         return action.payload
        }else{
             return med
        }
       } )
      };


    default:
      return state;
  }
}

