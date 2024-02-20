import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

const Mapss = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDFePY1l_INLcZoL7JbNOGdeYq7-NV5484",
    });
    
    const center = useMemo(() => ({
        lat: 3.469215222112361,
        lng: -76.51836179147858
    }), []);

    return (
        <div className="h-full w-full flex justify-center items-center">
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="h-screen w-screen"
                    center={center}
                    zoom={19}
                >
                    <Marker
                        position={{ lat: 3.46950, lng: -76.51835 }}
                        icon={"https://res.cloudinary.com/depcjbb7q/image/upload/v1689366897/multicomerciales1_1_pequena_c7lt70.png"}
                    />
                    <div className="flex flex-col absolute top-12 right-14 bg-white w-[320px] h-[360px] border-2 border-red-600 rounded-md">
                        <div>
                            <img src="https://res.cloudinary.com/depcjbb7q/image/upload/v1689533480/4_az8aur.jpg" alt="foto fachada"></img>
                        </div>
                        <div className="p-2 flex flex-col text-red-600 uppercase">
                            <span className="text-lg font-bold">CENTRO DE NEGOCIOS</span>
                            <span><ion-icon name="location-outline"></ion-icon>Calle 34 Nte. # 2AN-36</span>
                            <span>Barrio Prados Norte</span>
                            <span>Cali, Valle del Cauca</span>
                            <span><ion-icon name="call-outline"></ion-icon> 3207062751</span>
                            <span className="text-md lowercase"><ion-icon name="globe-outline"></ion-icon> www.multicomercialesdeoccidente.com</span>


                        </div>

                    </div>
                </GoogleMap>
            )}
        </div>
    );
};

export default Mapss;
