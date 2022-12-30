import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function Chatgpt() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timerInterval;

    if (isRunning) {
      const startTime = Date.now() - elapsedTime;

      timerInterval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, elapsedTime]);

  function startTimer() {
    setIsRunning(true);
  }

  function pauseTimer() {
    setIsRunning(false);
  }

  function resetTimer() {
    setElapsedTime(0);
    setIsRunning(false);
  }

  function formatTime(time) {
    const hours = ('0' + Math.floor(time / (1000 * 60 * 60))).slice(-2);
    const minutes = ('0' + Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))).slice(-2);
    const seconds = ('0' + Math.floor((time % (1000 * 60)) / 1000)).slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <View>
      <Text>{formatTime(elapsedTime)}</Text>
      {!isRunning && <Button onPress={startTimer} title="Start" />}
      {isRunning && <Button onPress={pauseTimer} title="Pause" />}
      <Button onPress={resetTimer} title="Reset" />
</View>
  )}