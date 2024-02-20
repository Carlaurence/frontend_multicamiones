/******************** COMPONENTE SLIDER INDIVIDUAL ***************************/
/*NOTA IMPORTANTE: LAS IMAGENES DE LOS VEHICULOS DEBEN CONSERVAR UNA RELACION DE ASAPECTO DE 5:4
*/
import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs'
import { RxDotFilled } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom';

/*EN ESTE ARG {images} ENTRA UN ARRAY DE IMAGES POR CADA LLAMADO DEL COMPONENTE <Carousel/>*/
const Carousel = (props) => {

    const navigate = useNavigate();

    //console.log(props.images[0].secure_url)

    /*************************************************************************************************/
    /************CONSTRUCCION DE FUNCIONES PARA DAR MOVIMIENTO A LAS FLECHAS SLIDER*******************/
    /*************************************************************************************************/
    const [currentIndex, setCurrentIndex] = useState(0);//El indice inicial va a ser 0 por defecto

    //Funcionamiento de la flecha izq <= del slider
    //Esta funcion se debe insertar en la Left Arrow mediante un onClick()
    const prevSlider = () => {
        const isFirstSlider = currentIndex === 0;
        const newIndex = isFirstSlider ? props.images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    //Funcionamiento de la flecha derecha => del slider
    //Esta funcion se debe insertar en la Right Arrow mediante un onClick()
    const nextSlider = () => {
        const isLastSlider = currentIndex === props.images.length - 1;
        const newIndex = isLastSlider ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    //Funcionamiento de la Barra inferior de puntos para correr las imagenes
    const goToSlide = (index) => {
        setCurrentIndex(index);
    }

    /*NOTA IMPORTANTE: LAS IMAGENES DE LOS VEHICULOS DEBEN CONSERVAR UN ASPECTO RATIO 5:4 
    classname="asapect-[5/4]" PARA CONSERVAR EL DISEÑO DE LAS CARDS.
     */
    return (
        <div>
            {/*ESTE DIV CONTIENE LA IMAGEN CAROUSEL props.images[0].secure_url*/}
            <div style={{  aspectRatio:4/3, backgroundImage: `url(${props.images[currentIndex].secure_url})` }} className='relative flex items-end bg-cover bg-center bg-no-repeat rounded-md bg-gray-900'>

                <div onClick={() => navigate(`/info_product/${props.product._id}`) } className='absolute top-0 left-0 right-0 m-auto flex w-[75%] h-[90%] bg-transparent cursor-pointer'></div>

                {/*ESTE DIV CONTIENE UNICAMENTE LOS LATERAL ARROWS Y LOS DOTS A UNA ALTURA DEL 50% DEL DIV DE LA IMAGEN*/}
                <div className='flex flex-col justify-between h-[60%] w-full'>

                    {/*ESTE DIV CONTIENE LOS DOS LATERAL ARROWS DENTRO DE LA IMAGEN*/}
                    <div className='flex justify-between w-full h-14' >

                        <div className='hidden group-hover:block h-12 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer' >
                            <BsChevronCompactLeft size={30} onClick={() => prevSlider()} />
                        </div>

                        <div className='hidden group-hover:block h-12 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer' >
                            <BsChevronCompactRight size={30} onClick={() => nextSlider()} />
                        </div>

                    </div>

                    {/*ESTE DIV CONTIENE LOS DOTS DENTRO DE LA IMAGEN*/}
                    <div className='flex justify-center'>
                        <div className='flex rounded-xl bg-black/30 truncate'>
                            {props.images.map((element, index) => (
                                <div key={index} className='text-xl text-white/70 cursor-pointer'>
                                    <RxDotFilled onClick={() => goToSlide(index)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Carousel;