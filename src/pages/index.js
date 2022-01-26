import { graphql } from "gatsby";
import React, { useEffect, useState } from "react";
import RecentlyPlayedListItem from "../components/RecentlyPlayedListItem";
import { PauseIcon, PlayIcon } from '@heroicons/react/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
  
    const toggle = () => setPlaying(!playing);
  
    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [audio, playing]);
  
    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, [audio]);
  
    return [playing, toggle];
};

export default function Home({ data }) {
    const [playing, toggle] = useAudio(data.currentSong.currentSong.url);
    const [open, setOpen] = useState(false);

    const toggleList = () => {
        setOpen(!open);
    }

    return (
        <div className="h-screen overflow-hidden bg-red-400">
            <div className="h-full overflow-y-hidden pb-48">
                {/* Music Player */}
                <div className="relative h-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        {playing === false
                            ? <PlayIcon onClick={toggle} className="h-32 w-32 text-white cursor-pointer" />
                            : <PauseIcon onClick={toggle} className="h-32 w-32 text-white cursor-pointer" />
                        }
                        <div className="mt-4">
                            <p className="text-white font-bold text-lg">{data.currentSong.currentSong.track}</p>
                        </div>
                    </div>
                </div>
                {/* Recently Played */}
                <div className={classNames(
                    open ? "translate-y-0" : "translate-y-3/4",
                    "fixed bottom-0 bg-white rounded-t-lg shadow-md w-full transition-all ease-in-out duration-200"
                )}>
                    <div onClick={() => toggleList()} className="flex justify-center pt-2" role="button">
                        <div className="h-3 w-12 bg-gray-400 rounded-full" />
                    </div>
                    <div className="p-4 text-lg font-bold">Recently Played</div>
                    <ul className="divide-y divide-gray-200">
                        {data.allSong.nodes.map(song => <RecentlyPlayedListItem key={song.id} title={song.title} artist={song.artist} album={song.album} albumArt={song.album_art.small} />)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export const recentlyPlayedQuery = graphql`
    query MyQuery {
        currentSong {
            currentSong {
              track
              url
            }
        }
        allSong {
            nodes {
                artist
                title
                album
                sample_url
                played_at
                album_art {
                    small
                    large
                }
            }
        }
    }
`