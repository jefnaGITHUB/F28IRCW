// Since previous assignment was needing seperate results page, this was implemented

import { useEffect, useState} from "react";
import Spinner from '../Spinner';
import { useTimer } from '../Timer';

type Artist = {
  name: string;
}

type URL = {
  spotify : string;
}

type Images = {
  height : number;
  url : string;
  width : number;
}

type Album = {
  avaliable_markets: string[];
  images: Images[];
  name: string;
  artists: Artist[];
}

type Tracks = {
    album : Album;
    artists: Artist[];
    avaliable_markets: string[];
    duration_ms: number;
    name: string;
    popularity: number;
    external_urls : URL;
    preview_url : string;
};

function App() {

  const [tracks, setTracks] = useState<Tracks[]>([]);
  const [pickedMarket, setMarket] = useState<string>('US'); //temporarily like this
  const [pickedArtist, setArtist] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { seconds, start, stop, reset } = useTimer();
  const [tooLong, setTooLong] = useState(false);
  const regionNames = new Intl.DisplayNames(
    ['en'], { type: 'region' }
  );
  const DBPort = 2121;
  // const [error, setError] = useState('');

  const sortTracks = (trackArray : Tracks[]) => {
        return trackArray.sort((a, b) =>
            b.popularity - a.popularity
        );
  };

  const storeSearch = async (artistName : string, marketName : string, trackNumber : number) => {

    console.log(`Adding the search ${artistName} and ${marketName} to the DB`);

    try {
      const res = await fetch(`http://localhost:${DBPort}/api/searches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist: artistName, country: marketName, trackNumber : trackNumber }),
      }); 
      if (!res.ok) throw new Error('Failed to add search');

    } catch (err) {
      console.log(err);
    }
  }

  const getTopTracks = async (artistName: string, marketName: string) => {
    try {
      const response = await fetch('http://localhost:3030/api/spotify/top-tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artist: artistName, market: marketName }),
      });

      if (!response.ok) {
        // doesnt work right now
        // const errorData = await response.json();
        // throw new Error(errorData?.error || "Failed to fetch top tracks.");
      }

      const data = await response.json();
      return data;

    } 
    catch (err: any) {
      throw new Error(err.message || "Unexpected error occurred");
    }
  };


  const getParams = () => {
    const searchParams = new URLSearchParams(window.location.search);

    // get params
    const artistName = capitalizeWords(searchParams.get('q') || "");
    const market = searchParams.get('m') || "";

    // set params
    setArtist(artistName);
    setMarket(market);

    console.log(`Artist name is ${artistName}. Market is ${market}`); // artistName

  }

  function msToMinSec(milliseconds : number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function capitalizeWords(string : string) {
    return string.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  useEffect(() => {
    if (!iframeLoaded && !tooLong && seconds > 25) {
      console.log('Iframe is taking too long to load...');
      setTooLong(true);
      console.log(tooLong);
    }
  }, [seconds]);

  useEffect(() => {
    getParams(); // just sets artist + market
    start();
  }, []);

  useEffect(() => {
    if (iframeLoaded) {
      stop(); // stop the timer
      console.log('iframe has been loaded');
      reset();
    }
  }, [iframeLoaded]);

  useEffect(() => {
    let sortedTracks = null;
     if (!pickedArtist || !pickedMarket) return; // wait for both to be ready
    // Log which country you are in :)
    // console.log((new Date()).toString().split('(')[1].split(" ")[0].toUpperCase().substring(0, 3));
    setLoading(true); // Start loading
    getTopTracks(pickedArtist, pickedMarket).then((tracks) => {
      sortedTracks = sortTracks(tracks);
      console.log(sortedTracks);
      setTracks(sortedTracks);
    }).catch((error) => {
      // here as a warnign checker
      console.log(error);
    }).finally(() => {
      console.log("Fetch finished");
      setLoading(false); // Done loading
      setArtist(pickedArtist);
      // store search in DB
      storeSearch(pickedArtist, pickedMarket, sortedTracks.length);
    })
  } ,[pickedArtist, pickedMarket])

  return (
    <>
      <div className="text-red-500 text-3xl">
        {/* {error ? error : ''} */}
      </div>
      {!loading? (
        <>
          <div className={`text-white text-5xl flex mx-auto w-3/4 justify-center text-center p-10 font-semibold ${iframeLoaded ? 'block' : 'hidden'}`}>
            <h2 className="flex align center">{pickedArtist}'s Top 10 Tracks avaliable in {regionNames.of(pickedMarket)}</h2>
          </div>

          <div className={`w-3/4 mx-auto text-white m-10 mt-0 bg-[#071330] p-10 rounded-xl ${iframeLoaded ? 'block' : 'hidden'}`}>
            {tracks.map((track, index) => (
              <div key={index} className="flex w-full h-20 rounded-xl mb-5">
                {/* Index */}
                {<div className="w-20 h-full flex justify-center items-center rounded-l-xl font-semibold text-3xl">
                  {index + 1}
                </div>}

                {/* Album Art */}
                <div className="h-full flex items-center p-5 pl-0">
                  {track.album.images.length > 0 && (
                    <img
                      className="w-20 h-20 rounded-xl object-cover"
                      src={track.album.images[0].url}
                      alt="Album Cover"
                    />
                  )}
                </div>

                {/* Song Info + Duration */}
                <div className="flex justify-between items-center flex-1 px-5">
                  <div key={index} className="w-full">
                    <iframe
                      className="w-full"
                      src={track.external_urls.spotify.replace('/track/', '/embed/track/')}
                      onLoad={() => setIframeLoaded(true)}
                      style={{display : iframeLoaded ? 'block' : 'none'}} 
                      width="300"
                      height="80"
                      allow="encrypted-media"
                      title={`Spotify Player - ${track.name}`}
                    />
                  </div>
                  {/* Duration */}
                  <div className="text-sm text-white pl-4 whitespace-nowrap">
                    ({msToMinSec(track.duration_ms)})
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="temp div bg-white text-black">
          </div>
          {!iframeLoaded ?
          tooLong ?
          (<div className={`text-white text-5xl flex mx-auto w-3/4 justify-center p-10 font-semibold h-135`}>
            <h2 className="flex align center my-auto">Sorry. The artist you requested took too long to load...</h2>
          </div>) :
          <Spinner />
          : null}
        </>
      ) : (
          <Spinner />
      ) }
    </>
  );
}

export default App;