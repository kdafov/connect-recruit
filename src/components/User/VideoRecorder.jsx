/**
 * JSX component that will provide the UI and
 * functionality for the VideoResponse which is
 * used in the screening for applications that
 * don't have quick apply on.
 * Returns: Video tag with implemented timer set by
 * the recruiter, option to re-record, upload, review,
 * and interact with the video.
 */

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/User/video.module.css';
import Button from '@mui/material/Button';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  let durationString = '';

  if (minutes > 0) {
    durationString = `${minutes}min `;
  }

  if (remainingSeconds > 0) {
    durationString += `${remainingSeconds}sec`;
  }

  return durationString;
};

const VideoResponse = ({ question, limit, uid, handle }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const videoRef = useRef();

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', () => {
          videoRef.current.play();
        });
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          stream.getTracks().forEach(track => track.stop());
        };
        recorder.start();
        setMediaRecorder(recorder); 

        const timer = setInterval(() => {
            setRecordedSeconds(prev => prev + 1);
        }, 1000);
        setTimerId(timer);

        setTimeout(() => {
            //clearInterval(timer);
            clearInterval(timerId);
            setRecordedSeconds(0);

            if (recorder.state === 'recording') {
                recorder.stop();
                setIsRecording(false);
                const stream = videoRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    videoRef.current.srcObject = null;
                }
            }
        }, limit * 1000);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsRecording(true);
    setVideoUrl(null);
    setRecordedSeconds(0);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        setIsRecording(false);
        const stream = videoRef.current.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  };

  const rerecord = () => {
    setVideoUrl(null);
    clearInterval(timerId);
    setRecordedSeconds(0);
  };

  const uploadVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('file', await fetch(videoUrl).then(res => res.blob()), 'video.webm');
      const response = await axios.post('/api/uploadVideo', formData);
      if (response.data.status === 200) {
        handle(uid, response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.videoScreening}>
        <span className={styles.title}>{question} {`(Max: ${formatDuration(limit)})`}</span>
        <div className={styles.videoContainer}>
            {videoUrl ? (
                <video ref={videoRef} src={videoUrl} controls onError={(e) => console.error(e)} /> 
            ) : (
                <video ref={videoRef} />
            )}

            {isRecording && (
                <div className={styles.overlay}>
                    <span className={styles.infolabel}>
                        Recording... 
                        <span className={limit - recordedSeconds < 10 ? styles.infoSubWarning : styles.infoSub}>
                            {`(Time left: ${formatDuration(limit - recordedSeconds)})`}
                        </span>
                    </span>
                    <Button variant="contained" onClick={stopRecording}>Stop</Button>
                </div>
            )}
        </div>
        <div className={styles.buttonsContainer}>
            {!isRecording && !videoUrl && (
                <Button variant="contained" onClick={startRecording}>Record</Button>
            )}
            {videoUrl && (
                <Button variant="contained" onClick={rerecord}>Re-record</Button>
            )}
            {videoUrl && (
                <Button variant="contained" onClick={uploadVideo}>Upload</Button>
            )}
        </div>
    </div>
    );
}

export default VideoResponse;