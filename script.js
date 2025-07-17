document.addEventListener('DOMContentLoaded', () => {
    const selectionScreen = document.getElementById('selection-screen');
    const workoutScreen = document.getElementById('workout-screen');
    const finishedScreen = document.getElementById('finished-screen');

    const exerciseTitle = document.getElementById('exercise-title');
    const exerciseDescription = document.getElementById('exercise-description');
    const countdownEl = document.getElementById('countdown');
    const timerCircle = document.querySelector('.timer-circle');
    const exerciseVideo = document.getElementById('exercise-video');
    const restPlaceholder = document.getElementById('rest-placeholder');
    
    const pauseButton = document.getElementById('pause-button');
    const endButton = document.getElementById('end-button');
    const reminderButton = document.getElementById('reminder-button');

    const reminderModal = document.getElementById('reminder-modal');
    const notificationModal = document.getElementById('notification-modal');
    const timeInput = document.getElementById('time-input');
    const saveReminderBtn = document.getElementById('save-reminder');
    const cancelReminderBtn = document.getElementById('cancel-reminder');
    const enableNotificationsBtn = document.getElementById('enable-notifications');

    let currentExerciseIndex = 0;
    let timer;
    let countdown;
    let isWorkoutRunning = false;
    let activeWorkout = [];

    const WORKOUT_PLANS = {
        gentleStart: [
            { name: "Wall Push-Ups", duration: 30, description: "Strengthens chest, shoulders, and arms.", video: "https://media.istockphoto.com/id/1193951957/video/senior-man-doing-wall-push-ups-at-home.mp4?s=mp4-640x640-is&k=20&c=L4h3UKN_v3itO2-s2i3rS9AjyqPAZ_4wHqgL5s-p9_A=" },
            { name: "Rest", duration: 15, description: "Take a breath.", video: null },
            { name: "Chair Squats", duration: 40, description: "Strengthens legs and core.", video: "https://media.istockphoto.com/id/1318857505/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=NogG0u338a_D_gYx8Z0B-2j_3q_1l_9k_8h_7g_6f" },
            { name: "Rest", duration: 15, description: "Good job.", video: null },
            { name: "Marching in Place", duration: 60, description: "Gently raises your heart rate.", video: "https://media.istockphoto.com/id/1318857489/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=pA-XGOQy123G3L32o8Wajs5nS2j80a4E8uxd-dtJPUY=" },
            { name: "Rest", duration: 15, description: "Almost there.", video: null },
            { name: "Seated Leg Lifts", duration: 45, description: "Strengthens your thigh muscles. Switch legs halfway.", video: "https://media.istockphoto.com/id/1318857542/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=8Z7X6Y5W4V3U2T1S0R9Q8P7O6N5M4L3K" },
            { name: "Cool-Down Stretch", duration: 40, description: "Seated hamstring stretch. Hold for 20s each leg.", video: "https://media.istockphoto.com/id/1318857551/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=5e4d3c2b1a0z9y8x7w6v5u4t3s2r1q0p" }
        ],
        heartHealth: [
            { name: "Warm-Up March", duration: 60, description: "March gently in place to get blood flowing.", video: "https://media.istockphoto.com/id/1318857489/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=pA-XGOQy123G3L32o8Wajs5nS2j80a4E8uxd-dtJPUY=" },
            { name: "Rest", duration: 15, description: "Take a breath.", video: null },
            { name: "Heel-to-Toe Walk", duration: 45, description: "Improves balance. Use a wall for support.", video: "https://media.istockphoto.com/id/1329618937/video/a-senior-woman-with-a-walker-walking-in-a-park.mp4?s=mp4-640x640-is&k=20&c=1m_2j_3k_4l_5m_6n_7o_8p_9q_0r_1s" },
            { name: "Rest", duration: 15, description: "Focus on your balance.", video: null },
            { name: "Step-Taps", duration: 60, description: "Gets your heart rate up safely.", video: "https://media.istockphoto.com/id/1318857513/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f" },
            { name: "Rest", duration: 15, description: "Keep it up!", video: null },
            { name: "Single Leg Stand", duration: 40, description: "Builds balance. Hold onto a chair. Switch legs halfway.", video: "https://media.istockphoto.com/id/1318857521/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=f5e4d3c2b1a0z9y8x7w6v5u4t3s2r1q" },
            { name: "Cool-Down Stretches", duration: 40, description: "Gently roll shoulders and stretch your neck.", video: "https://media.istockphoto.com/id/1318857501/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p" }
        ],
        morningMobility: [
            { name: "Cat-Cow Stretch", duration: 45, description: "Sit on a chair edge, arching and rounding your back slowly.", video: "https://media.istockphoto.com/id/1318857555/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w" },
            { name: "Rest", duration: 15, description: "Breathe with the movement.", video: null },
            { name: "Seated Torso Twist", duration: 40, description: "Gently twist your upper body. Hold 20s each side.", video: "https://media.istockphoto.com/id/1318857560/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=w7x8y9z0a1b2c3d4e5f6g7h8i9j0k1l" },
            { name: "Rest", duration: 15, description: "Feel the stretch.", video: null },
            { name: "Ankle Circles", duration: 40, description: "Rotate each ankle 10 times in both directions.", video: "https://media.istockphoto.com/id/1318857497/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=9j8h7g6f5e4d3c2b1a0z9y8x7w6v5u4t" },
            { name: "Rest", duration: 15, description: "Great for your joints.", video: null },
            { name: "Overhead Arm Reach", duration: 30, description: "Sit or stand tall and reach for the sky.", video: "https://media.istockphoto.com/id/1318857534/video/senior-woman-doing-seated-chair-exercise-at-home.mp4?s=mp4-640x640-is&k=20&c=k2d2g9C_2zQ7gYqY7eW3o4e8dYk6a6f6i8b8g7f5e4d" }
        ]
    };

    function speak(text, callback) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.onend = callback;
            speechSynthesis.speak(utterance);
        } else {
            if (callback) setTimeout(callback, 1000);
        }
    }

    function startWorkout(workoutKey) {
        if (isWorkoutRunning) return;
        
        activeWorkout = WORKOUT_PLANS[workoutKey];
        if (!activeWorkout) return;

        isWorkoutRunning = true;
        currentExerciseIndex = 0;
        
        selectionScreen.classList.add('hidden');
        finishedScreen.classList.add('hidden');
        workoutScreen.classList.remove('hidden');
        pauseButton.textContent = "Pause";
        runExercise();
    }

    function endWorkout() {
        isWorkoutRunning = false;
        clearTimeout(timer);
        exerciseVideo.pause();
        workoutScreen.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        speak("Workout stopped.");
    }

    function pauseWorkout() {
        isWorkoutRunning = false;
        clearTimeout(timer);
        exerciseVideo.pause();
        pauseButton.textContent = "Resume";
        speak("Workout paused.");
    }

    function resumeWorkout() {
        isWorkoutRunning = true;
        pauseButton.textContent = "Pause";
        if (activeWorkout[currentExerciseIndex].video) {
            exerciseVideo.play();
        }
        speak("Resuming.", () => {
            runTimer(countdown);
        });
    }

    function runExercise() {
        if (currentExerciseIndex >= activeWorkout.length) {
            finishWorkout();
            return;
        }
        const exercise = activeWorkout[currentExerciseIndex];
        exerciseTitle.textContent = exercise.name;
        exerciseDescription.textContent = exercise.description;
        countdown = exercise.duration;
        
        if (exercise.video) {
            exerciseVideo.src = exercise.video;
            exerciseVideo.classList.remove('hidden');
            restPlaceholder.classList.add('hidden');
            exerciseVideo.play().catch(e => console.error("Video play failed:", e));
        } else {
            exerciseVideo.classList.add('hidden');
            restPlaceholder.classList.remove('hidden');
        }

        let announcement = `Next up: ${exercise.name}.`;
        if (exercise.name.toLowerCase().includes('rest')) {
            announcement = "Time to rest.";
        }

        speak(announcement, () => {
            if (isWorkoutRunning) runTimer(countdown);
        });
    }

    function runTimer(duration) {
        countdown = duration;
        updateTimerDisplay();
        
        timer = setTimeout(() => {
            countdown--;
            if (countdown >= 0 && isWorkoutRunning) {
                runTimer(countdown);
            } else if (isWorkoutRunning) {
                currentExerciseIndex++;
                runExercise();
            }
        }, 1000);
    }
    
    function updateTimerDisplay() {
        countdownEl.textContent = countdown;
        const totalDuration = activeWorkout[currentExerciseIndex].duration;
        const dashOffset = 283 * (1 - (countdown / totalDuration));
        timerCircle.style.strokeDashoffset = dashOffset;
    }

    function finishWorkout() {
        isWorkoutRunning = false;
        workoutScreen.classList.add('hidden');
        finishedScreen.classList.remove('hidden');
        speak("Workout complete! Fantastic job today.");
        setTimeout(() => {
            finishedScreen.classList.add('hidden');
            selectionScreen.classList.remove('hidden');
        }, 5000);
    }

    selectionScreen.addEventListener('click', (e) => {
        if (e.target.matches('[data-workout]')) {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            }
            const workoutKey = e.target.getAttribute('data-workout');
            startWorkout(workoutKey);
        }
    });

    pauseButton.addEventListener('click', () => {
        if (isWorkoutRunning) {
            pauseWorkout();
        } else {
            resumeWorkout();
        }
    });

    endButton.addEventListener('click', endWorkout);

    // Reminder Logic
    function showModal(modal) { modal.style.display = 'flex'; }
    function hideModal(modal) { modal.style.display = 'none'; }
    
    reminderButton.addEventListener('click', () => {
        if (!('Notification' in window)) {
            alert("This browser does not support desktop notification.");
            return;
        }
        if (Notification.permission === 'granted') {
            showModal(reminderModal);
        } else if (Notification.permission !== 'denied') {
            showModal(notificationModal);
        } else {
            alert('You have blocked notifications. Please enable them in your browser settings to use this feature.');
        }
    });

    enableNotificationsBtn.addEventListener('click', () => {
        Notification.requestPermission().then(permission => {
            hideModal(notificationModal);
            if (permission === 'granted') { showModal(reminderModal); }
        });
    });

    cancelReminderBtn.addEventListener('click', () => hideModal(reminderModal));

    saveReminderBtn.addEventListener('click', () => {
        const time = timeInput.value;
        if (!time) { alert('Please select a time.'); return; }
        localStorage.setItem('gentleMovesReminderTime', time);
        alert(`Reminder set for ${time} every day!`);
        hideModal(reminderModal);
        scheduleNotification(time);
    });
    
    function scheduleNotification(time) {
        if (Notification.permission !== 'granted') return;
        const [hours, minutes] = time.split(':');
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(hours, minutes, 0, 0);
        if (notificationTime <= now) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }
        const timeToNotification = notificationTime.getTime() - now.getTime();
        setTimeout(() => {
            new Notification('Time for your Gentle Moves!', {
                body: "Let's do some light exercises to feel great today.",
                icon: 'https://placehold.co/192x192/34D399/FFFFFF?text=GM'
            });
            setInterval(() => {
                 new Notification('Time for your Gentle Moves!', {
                    body: "Let's do some light exercises to feel great today.",
                    icon: 'https://placehold.co/192x192/34D399/FFFFFF?text=GM'
                });
            }, 24 * 60 * 60 * 1000);
        }, timeToNotification);
    }
    
    const savedTime = localStorage.getItem('gentleMovesReminderTime');
    if (savedTime) { scheduleNotification(savedTime); }
});

