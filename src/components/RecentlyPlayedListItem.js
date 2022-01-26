import React from 'react';

export default function RecentlyPlayedListItem ({ title, artist, album, albumArt }) {
    return (
        <li className="p-4 flex w-auto">
            <img className="h-10 w-10" src={albumArt} alt={album} />
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
                <p className="text-sm text-gray-500 truncate">{artist} - {album}</p>
            </div>
        </li>
    );
}