import React from "react";

interface SubtitleItem {
  text: string;
  start: number;
  duration: number;
}

interface SubtitlesProps {
  subtitles: SubtitleItem[];
  currentTime: number;
}

const Subtitles: React.FC<SubtitlesProps> = ({ subtitles, currentTime }) => {
  const currentSubtitle = subtitles.find(
    (subtitle) => currentTime >= subtitle.start && currentTime < subtitle.start + subtitle.duration
  );

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <p className="text-center text-lg font-semibold">
        {currentSubtitle ? currentSubtitle.text : ''}
      </p>
    </div>
  );
};

export default Subtitles;