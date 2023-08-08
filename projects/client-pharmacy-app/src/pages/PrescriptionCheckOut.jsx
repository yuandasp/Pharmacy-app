import React from 'react'
import OrderPrescriptionCart from '../components/OrderPrescriptionCart';
import OrderTotalPriceCart from "../components/OrderTotalPriceCart";
import { useSelector } from 'react-redux';
import PrescriptionAddress from '../components/PrescriptionAddress';


function PrescriptionCheckOut() {
    const prescriptions = useSelector(state=>state.prescriptions.prescription)
    return (
        <div>
            <div className="mt-10 ml-7 font-bold font-roboto leading-2 text-xl tracking-wide"></div>
            <div className="flex md:flex-row flex-col mb-20">
                <div className="flex flex-col md:w-[50%] justify-center mx-8 md:ml-8 gap-0 mt-5 rounded-xl">
                    <PrescriptionAddress/>
                </div>
                <div className="mt-5 md:pr-4 md:w-[50%] flex flex-col items-center">
                    <OrderPrescriptionCart prescription={prescriptions} />
                </div>
            </div>
        </div>
    );
}

export default PrescriptionCheckOut