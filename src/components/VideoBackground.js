import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTmdbProxyUrl } from '../utils/constants'
import { addNowPlayingTrailer } from '../utils/moviesSlice';

const VideoBackground = ({ movie }) => {
  const dispatch = useDispatch();
  const nowPlayingTrailer = useSelector(state => state.movies.nowPlayingTrailer);
  const { id, title, overview } = movie;

  useEffect(() => {
    const getMovieTrailer = async () => {
      const videos = await fetch(getTmdbProxyUrl(`movie/${id}/videos`, { language: "en-US" }));
      const json = await videos.json();
      const filteredData = json.results.filter(movie => movie.type === "Trailer");
      const selectedVideo = filteredData.length ? filteredData[0] : json.results[0];
      if (!selectedVideo) {
        dispatch(addNowPlayingTrailer({ movie, trailer: null }));
      }
      else {
        dispatch(addNowPlayingTrailer({ movie, trailer: selectedVideo.key }));
      }
    }
    (nowPlayingTrailer.trailer === null || nowPlayingTrailer.movie.id !== movie.id) && getMovieTrailer();
  }, [dispatch, movie, id, nowPlayingTrailer.movie.id, nowPlayingTrailer.trailer]);

  return (
    <div className="w-screen relative"
      style={{ pointerEvents: 'none' }}
    >
      <iframe
        className="w-full h-full aspect-video"
        title="YouTube video player"
        src={`https://www.youtube.com/embed/${nowPlayingTrailer.trailer}?autoplay=1&cc_load_policy=0&color=white&controls=0&disablekb=1fs=0iv_load_policy=3&loop=1&mute=1&playlist=${nowPlayingTrailer.trailer}&playsinline=1&rel=0`}
        loading='lazy'
      />
      <div className="w-2/3 absolute top-0 mt-12 flex flex-col ml-12">
        <div className="lg:pl-12 py-8 text-black lg:bg-white/95">
          <p className="text-red-500 font-bold drop-shadow-md text-2xl sm:text-3xl md:text-[45px]">{title}</p>
          <p className="mt-4 leading-snug drop-shadow-md  w-5/6 text-justify invisible lg:visible">{overview}</p>
          <div>
            <button className="my-2 py-2 px-6 text-lg bg-red-600 text-white font-semibold rounded-2xl transition-all duration-300 invisible lg:visible">PLAY</button>
            <button className="my-2 py-2 px-6 text-lg bg-black/50 text-white font-semibold rounded-2xl transition-all duration-300 invisible lg:visible ml-2">MORE INFO</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoBackground;