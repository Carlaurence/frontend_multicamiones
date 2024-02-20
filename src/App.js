import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//PAGINAS WEB DE NAVEGACION
import Home from './navigation/Home';
import Aboutus from './navigation/About_us'
import Contactus from './navigation/Contact_us';
import SignUp from './navigation/Sign_up';
import Signin from './navigation/Signin';
import Admin from './navigation/Admin';
import Product from './navigation/Product';
import ShowAllTrucks from './navigation/ShowAllTrucks'; 
import TrucksCategories from './navigation/TrucksByCategory';
import InfoProduct from './navigation/InfoProduct';
import MakeOffer from './navigation/MakeAnOffer';
import Error404 from './navigation/Error404';
import Location from './navigation/Location';
import Advertisements from './navigation/Advertisements';
import AdvertisementList from './navigation/AdvertisementList';
import TrucksList from './navigation/TrucksList';
import UpdateProduct from './navigation/UpdateProduct';
import Manufacturer from './navigation/Manufacturer';
import ManufacturersList from './navigation/ManufacturersList';
import UpdateManufacturer from './navigation/UpdateManufacturer';
import CreateModel from './navigation/Create_Model';
import ModelsList from './navigation/ModelsList';
import EngineManufacturer from './navigation/EngineManufacturer';
import EngineManufacturerslist from './navigation/EngineManufacturersList';
import UpdateEngineManufacturer from './navigation/UpdateEngineManufacturer';
import CargoBodyType from './navigation/CargoBodyType';
import CargoBodyTypeList from './navigation/CargoBodyTypeList';
import UpdateCargoBodyType from './navigation/UpdateCargoBodyType';
import Year from './navigation/Year';
//import YearsList from './navigation/YearList';
import Pruebas from './navigation/Pruebas';
import AddImages from './navigation/Add_Images';
import CreateFinancialCorp from "./navigation/Create_FinancialCorp"
import FinancialCorpList from './navigation/FinancialCorpList';
import UpdateFinancialCorp from './navigation/UpdateFinancialCorp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/about_us' exact element={<Aboutus/>}/>
        <Route path='/contact_us' exact element={<Contactus/>}/>
        <Route path='/sign_in' exact element={<Signin/>}/>
        <Route path='/sign_up' exact element={<SignUp/>}/>
        <Route path='/admin' exact element={<Admin/>}/>
        <Route path='/create_product/:id' exact element={<Product/>}/>
        <Route path='/trucksAll' exact element={<ShowAllTrucks/>}/>
        <Route path='/category/:id' exact element={<TrucksCategories/>}/>
        <Route path='/info_product/:id' exact element={<InfoProduct/>}/>
        <Route path='/make_offer' exact element={<MakeOffer/>}/>
        <Route path='*' exact element={<Error404/>}/>
        <Route path='/location' exact element={<Location/>}/>
        <Route path='/advertisements' exact element={<Advertisements/>}/>
        <Route path='/advertisement_list' exact element={<AdvertisementList/>}/>
        <Route path='/trucks_list' exact element={<TrucksList/>}/>
        <Route path='/update_product/:id' exact element={<UpdateProduct/>}/>
        <Route path='/create_manufacturer' exact element={<Manufacturer/>}/>
        <Route path='/manufacturers_list' exact element={<ManufacturersList/>}/>
        <Route path='/update_manufacturer/:id' exact element={<UpdateManufacturer/>}/>
        <Route path='/create_model' exact element={<CreateModel/>}/>
        <Route path='/models_list' exact element={<ModelsList/>}/>
        <Route path='/create_enginemanufacturer' exact element={<EngineManufacturer/>}/>
        <Route path='/enginemanufacturers_list' exact element={<EngineManufacturerslist/>}/>
        <Route path='/update_enginemanufacturer/:id' exact element={<UpdateEngineManufacturer/>}/>
        <Route path='/create_cargobodytype' exact element={<CargoBodyType/>}/>
        <Route path='/cargobodytype_list' exact element={<CargoBodyTypeList/>}/>
        <Route path='/update_cargobodytype/:id' exact element={<UpdateCargoBodyType/>}/>
        <Route path='/years' exact element={<Year/>}/>
        {/*<Route path='/years_list' exact element={<YearsList/>}/>*/}
        <Route path='/add_images/:id' exact element={<AddImages/>}/>
        <Route path='/create_financialcorp' exact element={<CreateFinancialCorp/>}/>
        <Route path='/financialcorp_list' exact element={<FinancialCorpList/>}/>
        <Route path='/update_financialcorp/:id' exact element={<UpdateFinancialCorp/>}/>
        
        <Route path='/pruebas' exact element={<Pruebas/>}/>
        
      
      </Routes>
    </Router>

  );
}

export default App;
