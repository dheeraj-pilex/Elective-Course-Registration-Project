document.addEventListener('DOMContentLoaded', () => {
    const coursesTableBody = document.getElementById('courses-table-body');
    const addNewButton = document.getElementById('add-new-button');
    const formContainer = document.getElementById('add-edit-form-container');
    const addEditForm = document.getElementById('add-edit-form');
    const formTitle = document.getElementById('form-title');
    const cancelButton = document.getElementById('cancel-button');
    const editCourseIdInput = document.getElementById('edit-course-id'); // Hidden input

    const logoutButton = document.getElementById('logout-button');
    const userGreetingSpan = document.getElementById('user-greeting');

     // --- Simulate User Info ---
    const adminName = "Admin User"; // Replace with actual data later
    if (userGreetingSpan) {
        userGreetingSpan.textContent = `Welcome, ${adminName}!`;
    }

    // --- Dummy Data (SIMULATION ONLY - Use same structure as student dashboard) ---
    let allCourses = [
        { id: "CS301", title: "Advanced Web Development", description: "Learn modern frontend and backend frameworks.", prerequisites: "CS201", seatsAvailable: 15, totalSeats: 30 },
        { id: "MG450", title: "Project Management Fundamentals", description: "Core concepts of managing projects.", prerequisites: "None", seatsAvailable: 25, totalSeats: 40 },
        { id: "EE410", title: "Introduction to IoT", description: "Explore the basics of IoT.", prerequisites: "EE205", seatsAvailable: 0, totalSeats: 20 },
        { id: "DS350", title: "Data Visualization Techniques", description: "Create compelling visualizations.", prerequisites: "MA210", seatsAvailable: 18, totalSeats: 25 },
        { id: "PROJ501", title: "Academic Research Project", description: "Independent research project.", prerequisites: "Approval Required", seatsAvailable: 5, totalSeats: 10 }
    ];

    // --- Function to Display Courses in Table ---
    function displayCoursesTable() {
        if (!coursesTableBody) return;
        coursesTableBody.innerHTML = ''; // Clear existing rows

        if (allCourses.length === 0) {
            coursesTableBody.innerHTML = '<tr><td colspan="5">No courses found.</td></tr>';
            return;
        }

        allCourses.forEach(course => {
            const row = document.createElement('tr');
            row.setAttribute('data-course-id', course.id);
            row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.title}</td>
                <td>${course.seatsAvailable} / ${course.totalSeats}</td>
                <td>${course.prerequisites}</td>
                <td>
                    <button class="button-edit action-button" data-action="edit" data-id="${course.id}">Edit</button>
                    <button class="button-delete action-button" data-action="delete" data-id="${course.id}">Delete</button>
                </td>
            `;
            coursesTableBody.appendChild(row);
        });
    }

    // --- Show/Hide Form Functions ---
    function showForm(mode = 'add', courseId = null) {
        editCourseIdInput.value = ''; // Reset edit ID
        addEditForm.reset(); // Clear form fields

        if (mode === 'edit' && courseId) {
            const course = allCourses.find(c => c.id === courseId);
            if (course) {
                formTitle.textContent = `Edit Course: ${course.title}`;
                editCourseIdInput.value = course.id; // Set hidden input for edit mode
                // Populate form fields
                document.getElementById('course-id').value = course.id;
                document.getElementById('course-id').readOnly = true; // Don't allow editing ID
                document.getElementById('course-title').value = course.title;
                document.getElementById('course-desc').value = course.description;
                document.getElementById('course-prereqs').value = course.prerequisites;
                document.getElementById('course-seats').value = course.totalSeats;
            } else {
                alert("Error: Could not find course to edit.");
                return; // Don't show form if course not found
            }
        } else {
            formTitle.textContent = 'Add New Course/Project';
            document.getElementById('course-id').readOnly = false; // Allow editing ID for new courses
        }
        formContainer.style.display = 'block'; // Show the form
    }

    function hideForm() {
        formContainer.style.display = 'none';
        addEditForm.reset();
        editCourseIdInput.value = '';
    }

    // --- Form Submission Handler ---
    function handleFormSubmit(event) {
        event.preventDefault(); // Stop default page reload

        // Get form data
        const courseData = {
            id: document.getElementById('course-id').value.trim(),
            title: document.getElementById('course-title').value.trim(),
            description: document.getElementById('course-desc').value.trim(),
            prerequisites: document.getElementById('course-prereqs').value.trim(),
            totalSeats: parseInt(document.getElementById('course-seats').value, 10),
            // Assume seatsAvailable starts same as totalSeats for new courses (simplification)
            seatsAvailable: parseInt(document.getElementById('course-seats').value, 10)
        };

        // Basic validation
        if (!courseData.id || !courseData.title || isNaN(courseData.totalSeats)) {
            alert("Please fill in all required fields (ID, Title, Seats).");
            return;
        }

        const editingId = editCourseIdInput.value;

        // SIMULATION: Add or Update in the dummy array
        if (editingId) {
            // Update existing course
            const index = allCourses.findIndex(c => c.id === editingId);
            if (index > -1) {
                 // Keep original seatsAvailable if editing, unless totalSeats changed drastically (complex logic omitted)
                 const originalSeatsAvailable = allCourses[index].seatsAvailable;
                 const seatsDiff = courseData.totalSeats - allCourses[index].totalSeats;
                 allCourses[index] = { ...courseData, id: editingId, seatsAvailable: Math.max(0, originalSeatsAvailable + seatsDiff) }; // Update, keep ID constant, adjust available seats
                 alert(`Course ${editingId} updated successfully! (Backend needed)`);
            }
        } else {
             // Add new course (Check if ID already exists)
             if (allCourses.some(c => c.id === courseData.id)) {
                 alert(`Error: Course ID ${courseData.id} already exists.`);
                 return;
             }
            allCourses.push(courseData);
            alert(`Course ${courseData.id} added successfully! (Backend needed)`);
        }

        console.log("Updated Courses Array:", allCourses); // Debugging

        hideForm(); // Hide form after submit
        displayCoursesTable(); // Refresh the table
    }

    // --- Delete Course Handler ---
    function handleDeleteCourse(courseId) {
        const course = allCourses.find(c => c.id === courseId);
        if (!course) return;

        if (confirm(`Are you sure you want to delete "${course.title}" (${course.id})?`)) {
            // SIMULATION: Remove from dummy array
            allCourses = allCourses.filter(c => c.id !== courseId);
            alert(`Course ${courseId} deleted successfully! (Backend needed)`);
            console.log("Updated Courses Array:", allCourses); // Debugging
            displayCoursesTable(); // Refresh the table
        }
    }

    // --- Attach Event Listeners ---
    if (addNewButton) {
        addNewButton.addEventListener('click', () => showForm('add'));
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', hideForm);
    }

    if (addEditForm) {
        addEditForm.addEventListener('submit', handleFormSubmit);
    }

    // Use event delegation for Edit/Delete buttons in the table
    if (coursesTableBody) {
        coursesTableBody.addEventListener('click', (event) => {
            const button = event.target.closest('.action-button');
            if (!button) return;

            const action = button.dataset.action;
            const courseId = button.dataset.id;

            if (action === 'edit') {
                showForm('edit', courseId);
            } else if (action === 'delete') {
                handleDeleteCourse(courseId);
            }
        });
    }

     // --- Logout Functionality ---
     if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout clicked");
            alert("Simulating logout...");
            window.location.href = 'index.html'; // Redirect to login
        });
    }


    // --- Initial Load ---
    displayCoursesTable(); // Display courses on page load

});