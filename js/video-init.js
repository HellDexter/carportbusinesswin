/**
 * Inicializace videa s moderními ovládacími prvky
 * Verze pro videa s integrovaným zvukem a moderním designem
 */
document.addEventListener('DOMContentLoaded', function() {
    // Nastavení náhledového obrázku pro všechna videa
    const videos = document.querySelectorAll('video[poster]');
    videos.forEach(video => {
        // Nastavíme událost pro případ, že se náhled nenačte
        video.addEventListener('error', function(e) {
            if (e.target.tagName === 'SOURCE') {
                console.log('Chyba při načítání videa, použije se náhledový obrázek');
            }
        }, true);
        
        // Vynucení použití posteru i na desktopu
        video.addEventListener('loadedmetadata', function() {
            if (!video.hasAttribute('data-poster-loaded')) {
                // Nastavíme příznak, že jsme už nastavili poster
                video.setAttribute('data-poster-loaded', 'true');
                // Vynucení zobrazení posteru
                video.currentTime = 0;
            }
        });
    });
    
    // Inicializace českého videa
    initVideoPlayer('aboutVideo', 'customControls');
    
    // Inicializace anglického videa (pokud existuje)
    initVideoPlayer('aboutVideoEn', 'customControlsEn');
    
    // Inicializace německého videa (pokud existuje)
    initVideoPlayer('aboutVideoDe', 'customControlsDe');
    
    // Inicializace videa konstrukce (používá nativní ovládací prvky)
    const constructionVideo = document.getElementById('constructionVideo');
    if (constructionVideo) {
        constructionVideo.controls = true;
    }
});

/**
 * Inicializuje přehrávač videa s moderními ovládacími prvky
 * @param {string} videoId - ID video elementu
 * @param {string} controlsId - ID elementu s vlastními ovládacími prvky
 */
function initVideoPlayer(videoId, controlsId) {
    const video = document.getElementById(videoId);
    const customControls = document.getElementById(controlsId);
    const videoContainer = video ? video.closest('.video-container') : null;
    
    if (!video || !customControls || !videoContainer) return;
    
    // Skryjeme nativní ovládací prvky
    video.controls = false;
    
    // Získáme reference na ovládací prvky
    const playButton = customControls.querySelector('.play-button');
    const volumeSlider = customControls.querySelector('.volume-slider');
    const volumeIcon = customControls.querySelector('.volume-icon');
    
    // Nastavíme výchozí stav
    let isPlaying = false;
    let inactivityTimer;
    const isMobile = window.innerWidth <= 768;
    
    // Funkce pro resetování časovače neaktivity
    function resetInactivityTimer() {
        // Resetujeme časovač na všech zařízeních
        clearTimeout(inactivityTimer);
        videoContainer.classList.remove('inactive');
        videoContainer.classList.remove('touch-active');
        
        // Nastavíme nový časovač - pouze pokud se přehrává video
        if (isPlaying) {
            inactivityTimer = setTimeout(() => {
                // Nejprve odebrat třídu touch-active, aby neměla vyšší prioritu
                videoContainer.classList.remove('touch-active');
                // Pak přidat třídu inactive pro skrytí ovládacích prvků
                videoContainer.classList.add('inactive');
                console.log('Skrytí ovládacích prvků po nečinnosti');
            }, 2000); // Skrýt po 2 sekundách nečinnosti
        }
    }
    
    // Přidáme event listenery pro video
    video.addEventListener('play', () => {
        isPlaying = true;
        playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>';
        videoContainer.classList.add('playing');
        videoContainer.classList.remove('paused');
        resetInactivityTimer();
    });
    
    video.addEventListener('pause', () => {
        isPlaying = false;
        playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
        videoContainer.classList.remove('playing');
        videoContainer.classList.add('paused');
        videoContainer.classList.remove('inactive');
    });
    
    video.addEventListener('ended', () => {
        isPlaying = false;
        playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
        video.currentTime = 0;
        videoContainer.classList.remove('playing');
        videoContainer.classList.add('paused');
        videoContainer.classList.remove('inactive');
    });
    
    // Přidáme event listenery pro ovládací prvky
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            video.pause();
        } else {
            video.play().catch(e => console.error('Chyba při přehrávání videa:', e));
        }
        resetInactivityTimer();
    });
    
    // Ovládání hlasitosti
    if (volumeSlider && volumeIcon) {
        // Nastavíme výchozí hlasitost
        video.volume = parseFloat(volumeSlider.value);
        volumeSlider.style.backgroundSize = `${video.volume * 100}% 100%`;
        
        // Aktualizace ikony hlasitosti
        updateVolumeIcon(video.volume);
        
        // Přidáme event listener pro změnu hlasitosti
        if (volumeSlider) {
            // Pro standardní zařízení
            volumeSlider.addEventListener('input', () => {
                video.volume = volumeSlider.value;
                volumeSlider.style.backgroundSize = `${volumeSlider.value * 100}% 100%`;
                updateVolumeIcon(video.volume);
            });
            
            // Pro mobilní zařízení - speciální ošetření pro dotykovou interakci
            if (isMobile) {
                volumeSlider.addEventListener('touchstart', function(e) {
                    e.stopPropagation();
                });
                
                volumeSlider.addEventListener('touchmove', function(e) {
                    e.stopPropagation();
                    
                    // Získáme pozici dotyku
                    const rect = volumeSlider.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const width = rect.width;
                    
                    // Vypočítáme hodnotu hlasitosti (0-1)
                    let value = Math.max(0, Math.min(1, x / width));
                    
                    // Nastavíme hlasitost
                    video.volume = value;
                    volumeSlider.value = value;
                    volumeSlider.style.backgroundSize = `${value * 100}% 100%`;
                    updateVolumeIcon(value);
                    
                    resetInactivityTimer();
                });
            }
        }
        
        // Přidáme event listener pro kliknutí na ikonu (ztlumení/zapnutí zvuku)
        const handleVolumeIconClick = function(e) {
            // Zastavíme propagaci události, aby se nezobrazily/neskryly ovládací prvky
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            
            if (video.volume > 0) {
                // Uložíme aktuální hlasitost před ztlumením
                volumeIcon.dataset.previousVolume = video.volume;
                video.volume = 0;
                volumeSlider.value = 0;
                volumeSlider.style.backgroundSize = '0% 100%';
            } else {
                // Obnovíme předchozí hlasitost
                const previousVolume = parseFloat(volumeIcon.dataset.previousVolume || 0.5);
                video.volume = previousVolume;
                volumeSlider.value = previousVolume;
                volumeSlider.style.backgroundSize = `${previousVolume * 100}% 100%`;
            }
            updateVolumeIcon(video.volume);
            resetInactivityTimer();
            console.log('Změna hlasitosti: ' + video.volume);
        };
        
        // Přidáme event listenery pro kliknutí i dotyk
        volumeIcon.addEventListener('click', handleVolumeIconClick);
        volumeIcon.addEventListener('touchstart', handleVolumeIconClick);
    }
    
    // Funkce pro aktualizaci ikony hlasitosti
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>';
        } else if (volume < 0.5) {
            volumeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" fill="currentColor"/></svg>';
        } else {
            volumeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/></svg>';
        }
    }
    
    // Přidáme event listenery pro zobrazování/skrývání ovládacích prvků na mobilních zařízeních
    if (isMobile) {
        // Při dotyku na video kontejner
        videoContainer.addEventListener('touchstart', function(e) {
            // Pokud je dotyk na ovládacích prvcích, nebudeme dále zpracovávat
            if (e.target.closest('.custom-video-controls')) {
                return;
            }
            
            // Přidáme třídu pro aktivní dotyk
            videoContainer.classList.add('touch-active');
            videoContainer.classList.remove('inactive');
            resetInactivityTimer();
        });
        
        // Při dotyku na video
        video.addEventListener('touchstart', function(e) {
            // Pokud jsou ovládací prvky skryté, zobrazíme je při prvním dotyku
            if (videoContainer.classList.contains('inactive') || 
                getComputedStyle(customControls).opacity < 0.5) {
                videoContainer.classList.remove('inactive');
                videoContainer.classList.add('touch-active');
                resetInactivityTimer();
                return;
            }
        });
        
        // Speciální ošetření pro tlačítko přehrávání na mobilních zařízeních
        playButton.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isPlaying) {
                video.pause();
            } else {
                video.play().catch(e => console.error('Chyba při přehrávání videa:', e));
            }
            
            resetInactivityTimer();
        });
        
        // Speciální ošetření pro ikonu hlasitosti na mobilních zařízeních
        if (volumeIcon) {
            volumeIcon.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (video.volume > 0) {
                    volumeIcon.dataset.previousVolume = video.volume;
                    video.volume = 0;
                    volumeSlider.value = 0;
                    volumeSlider.style.backgroundSize = '0% 100%';
                } else {
                    const previousVolume = parseFloat(volumeIcon.dataset.previousVolume || 0.5);
                    video.volume = previousVolume;
                    volumeSlider.value = previousVolume;
                    volumeSlider.style.backgroundSize = `${previousVolume * 100}% 100%`;
                }
                
                updateVolumeIcon(video.volume);
                resetInactivityTimer();
            });
        }
        
        // Speciální ošetření pro slider hlasitosti na mobilních zařízeních
        if (volumeSlider) {
            volumeSlider.addEventListener('touchmove', function(e) {
                e.stopPropagation();
                resetInactivityTimer();
            });
        }
        
        // Automaticky zobrazit ovládací prvky při načtení stránky
        setTimeout(() => {
            // Nejprve zobrazíme ovládací prvky
            videoContainer.classList.add('touch-active');
            videoContainer.classList.remove('inactive');
            
            // Po 2 sekundách je skryjeme, pokud se přehrává video
            setTimeout(() => {
                if (video.paused === false) {
                    // Nastavíme příznak přehrávání
                    isPlaying = true;
                    // Odebrat třídu touch-active
                    videoContainer.classList.remove('touch-active');
                    // Přidat třídu inactive pro skrytí
                    videoContainer.classList.add('inactive');
                    // Přidat třídu playing
                    videoContainer.classList.add('playing');
                    console.log('Automatické skrytí ovládacích prvků');
                }
            }, 2000);
        }, 500);
    }
    
    // Nastavíme výchozí ikonu přehrávání
    playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    
    // Zobrazení/skrytí ovládacích prvků při najetí myší
    videoContainer.addEventListener('mouseenter', () => {
        customControls.style.opacity = '1';
    });
    
    videoContainer.addEventListener('mouseleave', () => {
        if (isPlaying) {
            customControls.style.opacity = '0';
        }
    });
}
