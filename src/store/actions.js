export  function AddPanier (produit){
       return (
        {type:'Add',payload:produit}
       )
}
;
export  function RemovePanier (produit){
       return (
        {type:'Remove',payload:produit}
       )
};

export function Addplus(produit){
        return(
               {type:'Plus',payload:produit}
        )
}

export function AddMore(produit){
           return({
                type:'More',payload:produit
           })
}

export function addMedicament (medicament) {
       return ({
  type: 'ADD_MEDICAMENT',
  payload: medicament,
});
}


export function deleteMedicament (id) {
       return ({
  type: 'DELETE_MEDICAMENT',
  payload: id,
})};

export function updateMedicament (medicament){
       return ({
  type: 'UPDATE_MEDICAMENT',
  payload: medicament,
});}