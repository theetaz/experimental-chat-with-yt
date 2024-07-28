"use client"
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { RiSearchFill, RiLoader2Line } from '@remixicon/react'
import { getYoutubeTranscript } from "@/actions/get-transcript";
import { toast } from "sonner"
import ReactPlayer from 'react-player'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { videoConversation } from "@/actions/questions";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { ScrollArea } from "@/components/ui/scroll-area"

const YoutubeVideoSearch: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitlePath, setSubtitlePath] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answered, setAnswered] = useState<string>("");
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  const playerRef = useRef<ReactPlayer>(null);



  const handleSearch = async () => {
    if (!inputValue) {
      toast.error("Please enter a valid YouTube video URL")
      return;
    }
    setIsLoading(true);
    setVideoUrl(inputValue);

    const transcriptResponse = await getYoutubeTranscript(inputValue);

    if (transcriptResponse.success) {
      toast.info("Transcript fetched successfully")
      // const subtitleFilePathEn = transcriptResponse.filePath!;
      // setSubtitlePath(subtitleFilePathEn);
    } else {
      toast.error("Failed to fetch transcript")
    }
    setIsLoading(false);
  }


  const handleAskQuestion = async () => {
    setIsAnswering(true);
    if (!inputValue) {
      toast.error("Please enter a valid YouTube video URL")
      return;
    }

    const response = await videoConversation(inputValue, question);
    if (response.success) {
      toast.info("Question answered successfully")
      setAnswered(response.answer);
    } else {
      toast.error("Failed to answer the question")
    }
    setIsAnswering(false);
  }


  return (
    <div className="w-full sm:max-w-[500px] md:max-w-[700px] mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-x-2">
        <div className="search-bar w-full">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter YouTube video URL"
            className="rounded-full"
          />
        </div>
        <div className="search-button w-full sm:w-auto">
          {isLoading ? (
            <Button
              disabled
              className="rounded-full w-full sm:w-auto"
            >
              <RiLoader2Line className="w-4 h-4 mr-2 animate-spin" />
              Loading
            </Button>
          ) : (
            <Button
              className="rounded-full w-full sm:w-auto"
              onClick={handleSearch}
            >
              <RiSearchFill className="w-4 h-4 mr-2" />
              Search
            </Button>
          )}
        </div>
      </div>

      {videoUrl && (
        <div className="w-full p-2 rounded-lg mt-5">
          <AspectRatio ratio={16 / 9} className="rounded-lg">
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              controls
              width="100%"
              height="100%"
              onProgress={(state) => setCurrentTime(state.playedSeconds)}
            />
          </AspectRatio>
          <div className="flex flex-col space-y-2">

            <div className="answer-box my-3">
              <ScrollArea className="h-min-screen w-full rounded-md">
                <MarkdownPreview
                  source={answered}
                  style={{
                    backgroundColor: "transparent",
                    color: "#000",
                    fontSize: "14px",
                  }}
                  wrapperElement={{
                    "data-color-mode": "dark",
                  }}
                />
              </ScrollArea>
            </div>

            <div className="question-box flex space-x-2 mt-4 mb-5">
              <Input
                placeholder="Enter your question"
                className="rounded-lg"
                onChange={(e) => setQuestion(e.target.value)}
              />

              {isAnswering ? (
                <Button
                  disabled
                  className="rounded-full w-full sm:w-auto"
                >
                  <RiLoader2Line className="w-4 h-4 mr-2 animate-spin" />
                  Loading
                </Button>
              ) : (
                <Button className="rounded-full" onClick={handleAskQuestion}>
                  Ask
                </Button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YoutubeVideoSearch;