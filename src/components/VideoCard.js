import React from 'react'
import { API_OPTIONS, TMDB_IMAGE } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addNowPlayingTrailer } from '../utils/moviesSlice';
import { toggleGptState } from '../utils/gptSlice';

const VideoCard = ({ movie }) => {
  const dispatch = useDispatch();
  const nowPlayingTrailer = useSelector(store => store.movies.nowPlayingTrailer);
  const { gptState } = useSelector(store => store.gpt);
  if (!movie?.poster_path) return null;
  const { id } = movie;

  async function handleClick() {
    if (nowPlayingTrailer.movie.id === id) return;
    const videos = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, API_OPTIONS);
    const json = await videos.json();
    const filteredData = json.results.filter(movie => movie.type === "Trailer");
    const selectedVideo = filteredData.length ? filteredData[0] : json.results[0];
    if (!selectedVideo) {
      dispatch(addNowPlayingTrailer({ movie, trailer: null }));
    }
    else {
      dispatch(addNowPlayingTrailer({ movie, trailer: selectedVideo.key }));
    }
    if (gptState === true) dispatch(toggleGptState());
  }

  return <div className="w-32 sm:w-36 md:w-40 pr-3 cursor-pointer hover:scale-105 duration-200" onClick={handleClick}>
    <img src={TMDB_IMAGE + movie.poster_path} alt="poster"
    />
  </div>
}

export default VideoCard;