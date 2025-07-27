import { ClipLoader } from "react-spinners"

export default function Spinner() {
    return(
        <>
        <div className="flex grid grid-rows-2 w-full justify-center items-center p-40">
            <ClipLoader className='mx-auto' color="white" loading={true} size={80} aria-label="Loading Spinner"/>
            <h1 className="text-white font-semibold text-2xl">Loading...</h1>
        </div>
        </>
    );
};