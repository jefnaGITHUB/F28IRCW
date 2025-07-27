import { useState, useEffect} from 'react';
import Spinner from '../Spinner';

// this is a dummy page needing updated!

function SearchesPage() {

  type Searches = {
    artist : string;
    country : string;
    trackNumber : number;
  }

  const DBPort = 2121;

  const [searches, setSearches] = useState<Searches[]>([]);
  const [isLoading, setLoading] = useState(false);

  // Fetch latest searches on component mount
  useEffect(() => {
    // code here.
  }, []);

  async function fetchLatestSearches() {
    // fetch searches here...
    try {
      const res = await fetch(`http://localhost:${DBPort}/api/searches`);
      if (!res.ok) throw new Error('Failed to fetch searches');
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  };

  // need to add implementation that it connects to the DB and adds entries


   const handleSubmit = ((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    fetchLatestSearches().then((searches : Searches[]) => {
      setSearches(searches);
      console.log(searches);
    }).catch((err) => {
      console.log(err);
    }).finally(( () => {
      setLoading(false);
    }))
  });

  return (
    <>
    {isLoading ? (
       <Spinner/> 
    ) : (
    <>
        <div className='w-3/4 mx-auto mt-20 rounded-xl p-10 grid rows-2 bg-[#d5c1bd]/95'>
          <form onSubmit={handleSubmit} className='grid rows-2 justify-center items-center gap-2 w-full'>
            <h1 className='text-black text-5xl font-semibold'>View Recent Searches</h1>
            <h2 className='text-black text-2xl font-light'>Get the top 20 most recent searches</h2>
            <button  type='submit' className='text-white rounded-lg p-2 cursor-pointer bg-[#161414] hover:bg-blue-950 font-semibold' name='search'>Get Now</button>
          </form>
        
          <>
          {searches ? (
            <>
            <div className={`grid grid-cols-4 gap-4 p-4 ${searches.length === 0 ? 'hidden' : ''}`}>
              {/* Header Row */}
              <div className='font-bold border-b pb-2'>#</div>
              <div className="font-bold border-b pb-2">Artist</div>
              <div className="font-bold border-b pb-2">Country Selected</div>
              <div className="font-bold border-b pb-2">Num of Tracks</div>

              {/* Data Rows */}
              {searches.map((search, index) => (
                <>
                <div key={index}>
                  <div>{index + 1}</div>
                </div>
                <div key={index}>
                  <div>{search.artist}</div>
                </div>
                <div key={index}>
                  <div>{search.country}</div>
                </div>
                <div key={index}>
                  <div>{search.trackNumber}</div>
                </div>
                </>
              ))}
            </div>

            </>
          ) : 
          (
            <div>
            </div>
          )}
          </>
    </div>
    </>
    )}
    </>
  );
}

export default SearchesPage;
