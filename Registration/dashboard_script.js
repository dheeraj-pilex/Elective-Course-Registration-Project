document.addEventListener('DOMContentLoaded', () => {
    const courseCatalogDiv = document.getElementById('course-catalog');
    const myCoursesListDiv = document.getElementById('my-courses-list'); // Get the new div
    const logoutButton = document.getElementById('logout-button');
    const userGreetingSpan = document.getElementById('user-greeting');

    // --- State Management (FRONTEND SIMULATION ONLY) ---
    let registeredCourseIds = []; // Array to hold IDs of registered courses
    let allCoursesData = []; // Store the fetched/dummy course data globally

    // --- Simulate User Info ---
    const studentName = "Test Student";
    if (userGreetingSpan) {
        userGreetingSpan.textContent = `Welcome, ${studentName}!`;
    }

    // --- Dummy Course Data (Will be replaced by fetch later) ---
    const dummyCourses = [
        { id: "CS301", title: "Advanced Web Development", description: "Learn modern frontend and backend frameworks.", prerequisites: "CS201", seatsAvailable: 15, totalSeats: 30 },
        { id: "MG450", title: "Project Management Fundamentals", description: "Core concepts of managing projects.", prerequisites: "None", seatsAvailable: 25, totalSeats: 40 },
        { id: "EE410", title: "Introduction to IoT", description: "Explore the basics of IoT.", prerequisites: "EE205", seatsAvailable: 0, totalSeats: 20 }, // Full
        { id: "DS350", title: "Data Visualization Techniques", description: "Create compelling visualizations.", prerequisites: "MA210", seatsAvailable: 18, totalSeats: 25 },
        { id: "PROJ501", title: "Academic Research Project", description: "Independent research project.", prerequisites: "Approval Required", seatsAvailable: 5, totalSeats: 10 }
    ];

    // --- Function to Display Available Courses Catalog ---
    function displayAvailableCourses(courses) {
        if (!courseCatalogDiv) return;
        courseCatalogDiv.innerHTML = ''; // Clear loading/previous content

        if (courses.length === 0) {
            courseCatalogDiv.innerHTML = '<p>No courses available at this time.</p>';
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.classList.add('course-card');
            card.setAttribute('data-course-id', course.id); // Add course ID to card

            const isRegistered = registeredCourseIds.includes(course.id);
            const isFull = course.seatsAvailable <= 0;

            let buttonHtml = '';
            if (isRegistered) {
                buttonHtml = `<button class="button-drop" data-action="drop" data-course-id="${course.id}">Drop</button>`;
            } else if (isFull) {
                // Basic waitlist simulation - just show the button
                buttonHtml = `<button class="button-waitlist" data-action="waitlist" data-course-id="${course.id}">Join Waitlist</button>`;
                 // OR if no waitlist:
                 // buttonHtml = `<button class="button-full" disabled>Full</button>`;
            } else {
                buttonHtml = `<button class="button-primary button-register" data-action="register" data-course-id="${course.id}">Register</button>`;
            }

            // Update availability text based on registration status too
             let availabilityText = `${course.seatsAvailable} / ${course.totalSeats} Seats Available`;
             if (isFull && !isRegistered) availabilityText = 'Full (Waitlist Available)';
             if (isRegistered) availabilityText = 'Registered';


            card.innerHTML = `
                <h3>${course.title} (${course.id})</h3>
                <p>${course.description}</p>
                <div class="details">
                   <span><strong>Prerequisites:</strong> ${course.prerequisites}</span>
                   <span><strong>Availability:</strong> ${availabilityText}</span>
                </div>
                ${buttonHtml}
            `;
            courseCatalogDiv.appendChild(card);
        });
    }

     // --- Function to Display Registered Courses ---
     function displayMyCourses() {
        if (!myCoursesListDiv) return;
        myCoursesListDiv.innerHTML = ''; // Clear previous content

        if (registeredCourseIds.length === 0) {
            myCoursesListDiv.innerHTML = '<p>You have not registered for any courses yet.</p>';
            return;
        }

        // Filter the main course list to get details of registered courses
        const myCourses = allCoursesData.filter(course => registeredCourseIds.includes(course.id));

        myCourses.forEach(course => {
            const item = document.createElement('div');
            item.classList.add('registered-course-item');
            item.innerHTML = `
                <span>${course.title} (${course.id})</span>
                <button class="button-drop" data-action="drop" data-course-id="${course.id}">Drop</button>
            `;
            myCoursesListDiv.appendChild(item);
        });
    }


    // --- Event Handler for Course Actions (Register/Drop/Waitlist) ---
    function handleCourseAction(event) {
        const targetButton = event.target.closest('button[data-action]'); // Find the button
        if (!targetButton) return; // Exit if click wasn't on an action button

        const action = targetButton.dataset.action;
        const courseId = targetButton.dataset.courseId;

        console.log(`Action: ${action}, Course ID: ${courseId}`); // For debugging

        // Find the course data
        const course = allCoursesData.find(c => c.id === courseId);
        if (!course) return; // Should not happen if data is consistent

        switch (action) {
            case 'register':
                // SIMULATION: Basic check if already registered or full
                if (registeredCourseIds.includes(courseId)) {
                    alert(`You are already registered for ${course.title}.`);
                } else if (course.seatsAvailable <= 0) {
                    alert(`${course.title} is currently full. You can join the waitlist.`);
                     // Optionally, automatically trigger waitlist action here
                } else {
                     // SIMULATION: Add to registered list and decrement available seats
                     registeredCourseIds.push(courseId);
                     course.seatsAvailable--; // Decrease available seats (simulation)
                     console.log("Registered courses:", registeredCourseIds);
                     alert(`Successfully registered for ${course.title}.`);
                     // Re-render both sections
                     displayAvailableCourses(allCoursesData);
                     displayMyCourses();
                 }
                break;

            case 'drop':
                // SIMULATION: Remove from registered list and increment available seats
                const index = registeredCourseIds.indexOf(courseId);
                if (index > -1) {
                    registeredCourseIds.splice(index, 1); // Remove from array
                    course.seatsAvailable++; // Increase available seats (simulation)
                    console.log("Registered courses:", registeredCourseIds);
                    alert(`Successfully dropped ${course.title}.`);
                     // Re-render both sections
                     displayAvailableCourses(allCoursesData);
                     displayMyCourses();
                }
                break;

            case 'waitlist':
                 // SIMULATION: Just show an alert for now
                 alert(`You have joined the waitlist for ${course.title}. (Backend logic needed)`);
                 // Future: Send API request to backend to add to waitlist
                 // Update button text/state if needed (e.g., "On Waitlist")
                break;
        }
    }

    // --- Attach Event Listeners using Event Delegation ---
    if (courseCatalogDiv) {
        courseCatalogDiv.addEventListener('click', handleCourseAction);
    }
    if (myCoursesListDiv) {
        myCoursesListDiv.addEventListener('click', handleCourseAction); // Handle drops from "My Courses" too
    }


    // --- Logout Functionality ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout clicked");
            alert("Simulating logout...");
            // Clear simulated state if needed (though redirecting will do it)
            registeredCourseIds = [];
            window.location.href = 'index.html';
        });
    }

    // --- Initial Load ---
    // Simulate loading data (replace with fetch later)
    setTimeout(() => {
        allCoursesData = dummyCourses; // Store dummy data globally
        displayAvailableCourses(allCoursesData); // Display the main catalog
        displayMyCourses(); // Display the (initially empty) registered courses
    }, 300); // Shorter delay

}); // End DOMContentLoaded
// === Add near the top with other state variables ===
let waitlistedCourseIds = []; // Array to hold IDs of waitlisted courses

// === Modify the displayAvailableCourses function ===
function displayAvailableCourses(courses) {
    // ... (keep existing code to clear div and handle empty courses) ...

    courses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        card.setAttribute('data-course-id', course.id);

        const isRegistered = registeredCourseIds.includes(course.id);
        const isWaitlisted = waitlistedCourseIds.includes(course.id); // Check waitlist status
        const isFull = course.seatsAvailable <= 0;

        let buttonHtml = '';
        let availabilityText = `${course.seatsAvailable} / ${course.totalSeats} Seats Available`;

        if (isRegistered) {
            buttonHtml = `<button class="button-drop" data-action="drop" data-course-id="${course.id}">Drop</button>`;
            availabilityText = 'Registered';
        } else if (isWaitlisted) {
            buttonHtml = `<button class="button-on-waitlist" data-action="leave-waitlist" data-course-id="${course.id}">Leave Waitlist</button>`;
            availabilityText = `On Waitlist (Position #?)`; // Position requires backend
        } else if (isFull) {
            buttonHtml = `<button class="button-waitlist" data-action="join-waitlist" data-course-id="${course.id}">Join Waitlist</button>`;
            availabilityText = 'Full (Waitlist Available)';
        } else {
            buttonHtml = `<button class="button-primary button-register" data-action="register" data-course-id="${course.id}">Register</button>`;
        }

        card.innerHTML = `
            <h3>${course.title} (${course.id})</h3>
            <p>${course.description}</p>
            <div class="details">
               <span><strong>Prerequisites:</strong> ${course.prerequisites}</span>
               <span><strong>Availability:</strong> ${availabilityText}</span>
            </div>
            ${buttonHtml}
        `;
        courseCatalogDiv.appendChild(card);
    });
}


// === Modify the handleCourseAction function ===
function handleCourseAction(event) {
    // ... (keep existing code to get button, action, courseId, course) ...

    switch (action) {
        case 'register':
             // ... (keep existing checks for already registered) ...
             if (waitlistedCourseIds.includes(courseId)) { // Check if on waitlist first
                  alert(`You are currently on the waitlist for ${course.title}. Please leave the waitlist before registering.`);
             } else if (course.seatsAvailable <= 0) {
                alert(`${course.title} is currently full. You can join the waitlist.`);
            } else {
                // ... (keep existing registration simulation logic) ...
                registeredCourseIds.push(courseId);
                course.seatsAvailable--;
                alert(`Successfully registered for ${course.title}.`);
                displayAvailableCourses(allCoursesData);
                displayMyCourses();
            }
            break;

        case 'drop':
            // ... (keep existing drop simulation logic) ...
             const index = registeredCourseIds.indexOf(courseId);
            if (index > -1) {
                registeredCourseIds.splice(index, 1);
                course.seatsAvailable++;
                 alert(`Successfully dropped ${course.title}.`);
                displayAvailableCourses(allCoursesData);
                displayMyCourses();
            }
            break;

        case 'join-waitlist': // Renamed from 'waitlist' for clarity
             // SIMULATION: Add to waitlist if not already registered or waitlisted
             if (registeredCourseIds.includes(courseId)) {
                 alert(`You are already registered for ${course.title}.`);
             } else if (waitlistedCourseIds.includes(courseId)) {
                 alert(`You are already on the waitlist for ${course.title}.`);
             } else if (course.seatsAvailable > 0) {
                  alert(`Seats are still available for ${course.title}. Please register directly.`);
             }
              else {
                 waitlistedCourseIds.push(courseId);
                 console.log("Waitlisted courses:", waitlistedCourseIds);
                 alert(`You have joined the waitlist for ${course.title}. (Backend needed)`);
                 displayAvailableCourses(allCoursesData); // Re-render to update button
                 // displayMyWaitlistedCourses(); // Call if you add a "My Waitlist" section
             }
            break;

        case 'leave-waitlist': // New action
             // SIMULATION: Remove from waitlist
             const waitlistIndex = waitlistedCourseIds.indexOf(courseId);
             if (waitlistIndex > -1) {
                 waitlistedCourseIds.splice(waitlistIndex, 1);
                 console.log("Waitlisted courses:", waitlistedCourseIds);
                 alert(`You have left the waitlist for ${course.title}. (Backend needed)`);
                 displayAvailableCourses(allCoursesData); // Re-render to update button
                  // displayMyWaitlistedCourses(); // Call if you add a "My Waitlist" section
             }
            break;
    }
}

// === Ensure other functions like displayMyCourses, event listeners, logout, initial load are still present ===
// ...