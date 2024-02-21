import React, { useEffect, useState } from "react";

const LoanCalculator = (props) => {

    //FUNCION PARA DAR FORMATO PESOS COP A LOS VALORES NUMERICOS
    const formatterPesoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    const months = [12, 24, 36, 48, 60, 72]/**NUMERO DE CUOTAS */

    const [data, setData] = useState({
        apr: '',
        periods: ''
    })

    useEffect(() => {
        setData({
            ...data,
            apr: document.getElementById("apr").value,
            periods: document.getElementById("periods").value
        })

    }, [])

    const onChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    /**PROPS VALUES*/
    const listFinancialCorps = props.financialCorps
    const downPayment = (props.price*0.2)//CUOTA INICIAL ES EL 20% DEL TOTAL 
    const loanAmount = (props.price-downPayment)//VALOR DEL CREDITO
    const monthlyPayment = loanAmount*((data.apr/100)/12) / (1- Math.pow(1+((data.apr/100)/12), (-1*(data.periods))))

    return (
        <div>
            <div className="flex flex-col gap-2 text-red-800 font-medium border-[1px] border-red-800 p-1">

                {/**SELECCION DE FINANCIERA*/}
                <div className="flex flex-col">
                    <label>Financiera</label>
                    <select className="border-[1px] border-red-800 opacity-70 h-7 text-sm font-bold"
                        id="apr"
                        name="apr"
                        onChange={onChange}
                        defaultValue={listFinancialCorps[0].name}
                    >
                        {
                            listFinancialCorps.map((item, index) => (
                                <option key={index} value={item.apr}>{item.name}</option>
                            ))}
                    </select>
                </div>

                {/**NUMERO DE CUOTAS*/}
                <div className="flex items-center border-[1px] border-red-800">
                    <label className="w-[50%]">No. Cuotas</label>
                    <select className="border-[1px] border-red-800 opacity-70 w-[50%] h-7 text-sm font-bold"
                        id="periods"
                        name="periods"
                        onChange={onChange}
                        defaultValue={months[5]}
                    >
                        {
                            months.map((period, index) => (
                                <option key={index}>{period}</option>
                            ))}
                    </select>
                </div>

                {/**TASA INTERES E.A*/}
                <div className="flex items-center border-[1px] border-red-800">
                    <label className="w-[50%]">%Interes E.A</label>
                    <h1 className="flex items-center px-2 bg-white w-[50%] border-[1px] opacity-70 border-red-800 h-7 text-sm md:text-[13px] lg:text-sm font-bold">{data.apr}</h1>
                </div>

                {/**CALCULO CUOTA INICIAL*/}
                <div className="flex items-center border-[1px] border-red-800">
                    <label className="w-[50%]">Cuota Inicial</label>
                    <h1 className="flex items-center px-2 bg-white w-[50%] border-[1px] opacity-70 border-red-800 h-7 text-sm md:text-[13px] lg:text-sm font-bold overflow-hidden">{formatterPesoCOP.format(downPayment)}</h1>
                </div>

                {/**MONTO A FINANCIAR*/}
                <div className="flex items-center border-[1px] border-red-800">
                    <label className="w-[50%]">Financiacion</label>
                    <h1 className="flex items-center px-2 bg-white w-[50%] border-[1px] opacity-70 border-red-800 h-7 text-sm md:text-[13px] lg:text-sm font-bold overflow-hidden">{formatterPesoCOP.format(loanAmount)}</h1>
                </div>

                {/**CUOTA MENSUAL*/}
                <div className="flex items-center border-[1px] border-red-800">
                    <label className="w-[50%]">Cuota * Mes</label>
                    <h1 className="flex items-center px-2 bg-white w-[50%] border-[1px] opacity-70 border-red-800 h-7 text-sm md:text-[13px] lg:text-sm font-bold overflow-hidden">{formatterPesoCOP.format(monthlyPayment)}</h1>
                </div>


            </div>

        </div>
    )

}

export default LoanCalculator;