import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicament, deleteMedicament, updateMedicament } from '../store/actions';
import NavShop from './NavShop';
import '../css/Dashboard.css'
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useFeedback } from '../components/Feedback';
import { useI18n } from "../i18n/LanguageProvider";
import useLocalizedInvalid from "../i18n/useLocalizedInvalid";

const Dashboard = () => {
  const { t } = useI18n();
  const onInvalid = useLocalizedInvalid("Check the highlighted medication fields.");
  const medicaments = useSelector(state => state.fullData);
  const dispatch = useDispatch();
  const addButton = useRef(null);
  const { notify, requestConfirmation } = useFeedback();

  const [showModal, setShowModal] = useState(false);
  const [currentMedicament, setCurrentMedicament] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    needed_prescription: 'No',
    shortDescription:'',
    fullDescription:'',
    stock: '',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const medicamentData = {
      ...formData,
      id: currentMedicament ? currentMedicament.id : Math.max(...medicaments.map(item => Number(item.id)))+1,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    if (currentMedicament) {
      dispatch(updateMedicament(medicamentData));
      notify("success", "Medication updated.");
    } else {
      dispatch(addMedicament(medicamentData));
      notify("success", "Medication added.");
    }

    handleCloseModal();
  };

  const handleAddMedicament = () => {
    setCurrentMedicament(null);
    setFormData({
      title: '',
      price: '',
      category: '', 
      shortDescription:'',
      fullDescription:'',
      needed_prescription: 'No',
      stock: '',
      image: ''
    });
    setShowModal(true);
  };

  const handleEditMedicament = (medicament) => {
    setCurrentMedicament(medicament);
    setFormData({
      title: medicament.title,
      price: medicament.price,
      category: medicament.category,
      shortDescription:medicament.shortDescription,
      fullDescription:medicament.fullDescription,
      needed_prescription: medicament.needed_prescription,
      stock: medicament.stock,
      image: medicament.image 
    });
    setShowModal(true);
  };

  const handleDeleteMedicament = (medication, trigger) => {
    requestConfirmation({
      title: "Delete medication?",
      description: "Delete {0} from the catalog?",
      descriptionValues: [medication.title],
      confirmLabel: "Delete medication",
      trigger,
      fallbackFocus: () => addButton.current,
      onConfirm: () => {
        dispatch(deleteMedicament(medication.id));
        notify("success", "Medication deleted.");
      },
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMedicament(null);
  };

  return (
    <div className="dashboard-container">
      <NavShop/>
      <header className="dashboard-header">
        <div className="container">
          <h1 className="m-0">
           
            {t("PharmaClick Dashboard")}
          </h1>
        </div>
      </header>

      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h2>{t("Medicament Management")}</h2>
              <button 
                className="btn btn-success"
                ref={addButton}
                onClick={handleAddMedicament}
              >
                <FaPlus className="mr-2"/>
                {t("Add Medicament")}
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>{t("ID")}</th>
                    <th>{t("Title")}</th>
                    <th>{t("Price (Dhs)")}</th>
                    <th>{t("Category")}</th>
                    <th>{t("Prescription")}</th>
                    <th>{t("Stock")}</th>
                    <th>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {medicaments.map(med => (
                    <tr key={med.id}>
                      <td>{med.id}</td>
                      <td>{med.title}</td>
                      <td>{med.price.toFixed(2)}</td>
                      <td>{t(med.category)}</td>
                      <td>
                        {med.needed_prescription==='yes' ? (
                          <span className="">{t("Required")}</span>
                        ) : (
                          <span className="">{t("Not Required")}</span>
                        )}
                      </td>
                      <td>{med.stock}</td>
                      <td>
                        <button 
                          className="btn12 btn-sm btn-outline-primary mr-2"
                          aria-label={t("Edit {0}", [med.title])}
                          onClick={() => handleEditMedicament(med)}
                        >
                          <FaEdit/>
                        </button>
                        <button 
                          className="btn12 btn-sm btn-outline-danger"
                          aria-label={t("Delete {0}", [med.title])}
                          onClick={(event) => handleDeleteMedicament(med, event.currentTarget)}
                        >
                          <FaTrash/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {showModal && (
        <div className="add_idet">
          <div className="modal d-block" >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    {currentMedicament ? t("Edit Medicament") : t("Add New Medicament")}
                  </h5>
                  <button type="button" className="closeAdd" onClick={handleCloseModal}>
                    <FaTimes/>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit} onInvalid={onInvalid}>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>{t("Title")}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.title}
                          onChange={(e)=>setFormData({...formData,title:e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label>{t("Price (DHs)")}</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={(e)=>setFormData({...formData,price:e.target.value})}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>{t("Category")}</label>
                        <select
                          className="form-control"
                          name="category"
                          value={formData.category}
                          onChange={(e)=>setFormData({...formData,category:e.target.value})}
                          required
                        >
                          <option value="">{t("Select Category")}</option>
                          <option value="multivitamins">{t("Vitamins")}</option>
                          <option value="products_usf">{t("products_usf")}</option>
                          <option value="cleaning">{t("cleaning")}</option>
                          <option value="supplements">{t("supplements")}</option>
                        </select>
                      </div>
                      <div className="form-group col-md-6">
                        <label>{t("Stock Quantity")}</label>
                        <input
                          type="number"
                          className="form-control"
                          name="stock"
                          value={formData.stock}
                          onChange={(e)=>setFormData({...formData,stock:e.target.value})}
                          min="0"
                          required
                        />
                      </div>
                    </div>

                     <div className="form-group col-md-6">
                        <label>{t("short Description")}</label>
                        <textarea name="" required onChange={(e)=>setFormData({...formData,shortDescription:e.target.value})} value={formData.shortDescription} className="form-control"  id="">
                        </textarea>
                        
                      </div>

                       <div className="form-group col-md-6">
                        <label>{t("Full Description")}</label>
                        <textarea  required onChange={(e)=>setFormData({...formData,fullDescription:e.target.value})} value={formData.fullDescription} className="form-control"  id="">
                        </textarea>
                        
                      </div>

                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>{t("Image URL")}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="image"
                          value={formData.image}
                          onChange={(e)=>setFormData({...formData,image:e.target.value})}
                          placeholder={t("Optional image URL")}
                        />
                      </div>
                      <div className="form-group col-md-6 d-flex align-items-end">
                        <div className="">
                          <input
                            type="checkbox"
                            className="form-check"
                            name="prescriptionRequired"
                            
                          onChange={(e)=>setFormData({...formData,needed_prescription:e.target.checked?'yes':'No'})}
                            id="prescriptionCheck"
                          />
                          <label className="form-check-label" htmlFor="prescriptionCheck">
                            {t("Prescription Required")}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        {t("Cancel")}
                      </button>
                      <button type="submit" className="btn btn-success">
                        {currentMedicament ? t("Update Medicament") : t("Add Medicament")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
