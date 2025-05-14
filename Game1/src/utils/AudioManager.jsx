import React, { useEffect, useRef } from 'react';

class AudioManager {
  constructor() {
    this.audioRef = null;
    this.isPlaying = false;
    this.audioUrl = null;
    this.fadeInterval = null;
    this.isLoading = false;
    this.onLoadingChange = null;
    this.onError = null;
    this.targetVolume = 0.5;
  }

  // Set callback for loading state changes
  setLoadingCallback(callback) {
    this.onLoadingChange = callback;
  }

  // Set callback for error handling
  setErrorCallback(callback) {
    this.onError = callback;
  }

  // Update loading state
  setLoading(loading) {
    this.isLoading = loading;
    if (this.onLoadingChange) {
      this.onLoadingChange(loading);
    }
  }

  // Handle errors
  handleError(error) {
    console.error('Audio error:', error);
    this.isPlaying = false;
    this.setLoading(false);
    if (this.onError) {
      this.onError(error);
    }
  }

  // Fade volume smoothly
  fadeVolume(targetVolume, duration = 1000) {
    if (!this.audioRef) return;

    const startVolume = this.audioRef.volume;
    const startTime = Date.now();
    this.targetVolume = targetVolume;

    // Clear any existing fade
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    this.fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smoother fade
      const easeProgress = this.easeInOutQuad(progress);
      const newVolume = startVolume + (targetVolume - startVolume) * easeProgress;

      this.audioRef.volume = newVolume;

      if (progress === 1) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    }, 16); // Update every 16ms for smooth animation
  }

  // Easing function for smooth fades
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  init(audioUrl) {
    this.setLoading(true);
    this.audioUrl = audioUrl;

    // Only create new audio if it doesn't exist or URL has changed
    if (!this.audioRef || this.audioRef.src !== window.location.origin + audioUrl) {
      // Clean up existing audio if it exists
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
      }

      this.audioRef = new Audio(audioUrl);
      this.audioRef.loop = true;
      
      // Restore volume from localStorage if available
      const savedVolume = localStorage.getItem('musicVolume');
      this.targetVolume = savedVolume ? parseFloat(savedVolume) : 0.5;
      this.audioRef.volume = 0; // Start at 0 for fade in

      // Add event listeners
      this.audioRef.addEventListener('canplaythrough', () => {
        this.setLoading(false);
        if (this.isPlaying) {
          this.fadeVolume(this.targetVolume);
        }
      });

      this.audioRef.addEventListener('error', (e) => {
        this.handleError(e);
      });

      this.audioRef.addEventListener('ended', () => {
        if (this.audioRef.loop) {
          this.audioRef.play().catch(error => this.handleError(error));
        }
      });

      // Load the audio
      this.audioRef.load();
    } else {
      this.setLoading(false);
    }
  }

  play() {
    if (!this.audioRef && this.audioUrl) {
      this.init(this.audioUrl);
      return;
    }

    if (this.audioRef && !this.isPlaying) {
      this.setLoading(true);
      
      // Reset the audio to the beginning if it was previously ended
      if (this.audioRef.ended) {
        this.audioRef.currentTime = 0;
      }

      const playPromise = this.audioRef.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.setLoading(false);
            this.fadeVolume(this.targetVolume);
          })
          .catch(error => {
            this.handleError(error);
            // Try to recover by reinitializing
            this.init(this.audioUrl);
          });
      }
    }
  }

  pause() {
    if (this.audioRef && this.isPlaying) {
      // Fade out before pausing
      this.fadeVolume(0, 500).then(() => {
        this.audioRef.pause();
        this.isPlaying = false;
      });
    }
  }

  setVolume(volume) {
    const newVolume = Math.max(0, Math.min(1, volume));
    this.targetVolume = newVolume;
    
    if (this.audioRef) {
      if (this.isPlaying) {
        this.fadeVolume(newVolume);
      } else {
        this.audioRef.volume = newVolume;
      }
    }
    
    localStorage.setItem('musicVolume', newVolume.toString());
  }

  cleanup() {
    if (this.audioRef) {
      this.fadeVolume(0, 500).then(() => {
        this.audioRef.pause();
        this.audioRef.removeEventListener('canplaythrough', () => {});
        this.audioRef.removeEventListener('error', () => {});
        this.audioRef.removeEventListener('ended', () => {});
        this.audioRef = null;
        this.isPlaying = false;
        this.setLoading(false);
      });
    }
  }

  isReady() {
    return this.audioRef !== null && this.audioRef.readyState >= 2;
  }

  isLoading() {
    return this.isLoading;
  }

  restart() {
    if (this.audioRef) {
      this.audioRef.currentTime = 0;
      this.play();
    } else if (this.audioUrl) {
      this.init(this.audioUrl);
      this.play();
    }
  }

  // New method to check audio status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      volume: this.audioRef ? this.audioRef.volume : 0,
      isReady: this.isReady(),
      error: this.audioRef ? this.audioRef.error : null
    };
  }
}

// Create a singleton instance
const audioManager = new AudioManager();

export default audioManager; 