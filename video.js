const videoModal = document.getElementById('videoModal');
const demoVideo = document.getElementById('demoVideo');

document.getElementById('watchDemoBtn').addEventListener('click', () => {
    videoModal.showModal();
    demoVideo.play();
});

document.getElementById('closeModal').addEventListener('click', () => {
    videoModal.close();
    demoVideo.pause();
    demoVideo.currentTime = 0;
});
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.close();
        demoVideo.pause();
        demoVideo.currentTime = 0;
    }
});
videoModal.addEventListener('close', () => {
    demoVideo.pause();
    demoVideo.currentTime = 0;
});