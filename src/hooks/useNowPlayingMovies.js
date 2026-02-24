import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTmdbProxyUrl } from '../utils/constants'
import { addNowPlayingMovies } from "../utils/moviesSlice";

const useNowPlayingMovies = () => {
    const dispatch = useDispatch();
    const nowPlayingMovies = useSelector(store => store.movies.nowPlayingMovies);

    useEffect(() => {
        const getNowPlayingMovies = async () => {
            const movieCategories = ["upcoming", "now_playing", "popular", "top_rated"];
            const movies = {};

            try {
                const promises = [];
                movieCategories.forEach(category => {
                    const promise1 = fetch(getTmdbProxyUrl(`movie/${category}`, { region: "IN" }));
                    const promise2 = fetch(getTmdbProxyUrl(`movie/${category}`, { region: "IN", page: "2" }));
                    promises.push(promise1);
                    promises.push(promise2);
                });

                const results = await Promise.all(promises);
                for (let index = 0; index < results.length; index++) {
                    const data = await results[index].json();
                    const category = movieCategories[Math.floor(index / 2)];
                    if (!movies[category]) movies[category] = [];
                    movies[category] = movies[category].concat(data.results);
                }
                dispatch(addNowPlayingMovies(movies));
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        !nowPlayingMovies && getNowPlayingMovies();
    }, [dispatch, nowPlayingMovies])
}

export default useNowPlayingMovies;