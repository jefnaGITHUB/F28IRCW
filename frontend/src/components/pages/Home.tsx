import { useNavigate } from 'react-router'
import { useEffect, useState } from "react";

function App() {

  const [warning, setWarning] = useState('');


  // Gets current country from browser data
  function getCountry() {
    const locale = navigator.language;
    const countryCode = locale.split('-')[1];
    return countryCode || 'Unknown';
  }

  useEffect(() => {
    document.body.classList.add("body-bg-black");

    return () => {
      document.body.classList.remove("body-bg-black");
    };
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const artistQuery = formData.get('artistName') as string;
        console.log(artistQuery);
        let marketQuery = formData.get('marketName') as string;

        // Input validation
        console.log(getCountry());

        // if no country was specified, then use country from local computer
        if(!marketQuery || marketQuery === null || marketQuery === ''){
          marketQuery = getCountry();
        }

        if(!(/\s/.test(artistQuery)) && artistQuery.length >= 30){
          setWarning('Artist Length Invalid'); 
          return;
        }
        if(artistQuery === null  || artistQuery === "") {
          setWarning('noArtist was selected');
          return;
        }

        // redirect to results page
        navigate(`/results?q=${artistQuery}&m=${marketQuery}`)
  }

  return (
    <>
    <div className='w-3/4 mx-auto justify-items-center mt-20 p-5 bg-[#d5c1bd]/95 rounded-xl'>
      <div className='w-fit'>
        <div className='w-fit p-5 pb-0'>
          <h1 className="text-5xl font-semibold text-black">Get your favourite artists tracks</h1>
          <h2 className="text-2xl font-light text-black-100">Choose country (via dropdown) to display tracks by chosen artist</h2>
        </div>

        <div className='w-full p-5'>
          <form onSubmit={handleSubmit}>
            <div className='flex justify-left shadow-lg shadow-black-400 bg-[#d5c1bd] rounded-xl'>
              <input name="artistName" required placeholder="Search any artist here..." className='placeholder-gray-700 appearance-none rounded py-3.5 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline w-3/4' />
              <select name="marketName" defaultValue="" className="bg-blue-950 text-[#F2F0EF]/85 font-bold focus:outline-none !rounded-none">
                <option value="" disabled>Choose Country</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="ES">Spain</option>
                <option value="JP">Japan</option>
                <option value="UA">Ukraine</option>
              </select>
              <button type="submit" className='bg-[#161414] hover:bg-blue-950 text-[#F2F0EF]/85 font-bold py-2 px-4 rounded-r-xl  focus:outline-none focus:shadow-outline cursor-pointer w-1/4'>Search</button>
            </div>
          </form>
        </div>
      </div>
      <div className='text-red-500 justify-items-start w-fit'>
        {warning ? warning : '' }
      </div>
    </div>
    </>
  )
}

export default App;