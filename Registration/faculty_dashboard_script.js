document.addEventListener('DOMContentLoaded', () => {
    const assignedCoursesListDiv = document.getElementById('assigned-courses-list');
    const pendingApprovalsListDiv = document.getElementById('pending-approvals-list');
    const logoutButton = document.getElementById('logout-button');
    const userGreetingSpan = document.getElementById('user-greeting');

    // --- Simulate User Info ---
    const facultyName = "Dr. Faculty"; // Replace with actual data later
    if (userGreetingSpan) {
        userGreetingSpan.textContent = `Welcome, ${facultyName}!`;
    }

    // --- Dummy Data (SIMULATION ONLY) ---
    let assignedCourses = [
        { id: "CS301", title: "Advanced Web Development" },
        { id: "PROJ501", title: "Academic Research Project" }
    ];

    let pendingApprovals = [
        { approvalId: "appr_001", studentId: "S12345", studentName: "Alice Smith", projectId: "PROJ501", projectTitle: "Academic Research Project" },
        { approvalId: "appr_002", studentId: "S67890", studentName: "Bob Johnson", projectId: "PROJ501", projectTitle: "Academic Research Project" }
    ];

    // --- Function to Display Assigned Courses ---
    function displayAssignedCourses() {
        if (!assignedCoursesListDiv) return;
        assignedCoursesListDiv.innerHTML = ''; // Clear

        if (assignedCourses.length === 0) {
            assignedCoursesListDiv.innerHTML = '<p>No courses or projects currently assigned.</p>';
            return;
        }
        const list = document.createElement('ul');
        list.className = 'simple-list'; // Add a class for basic styling if needed
        assignedCourses.forEach(course => {
            const item = document.createElement('li');
            item.textContent = `${course.title} (${course.id})`;
            list.appendChild(item);
        });
        assignedCoursesListDiv.appendChild(list);
    }

    // --- Function to Display Pending Approvals ---
    function displayPendingApprovals() {
        if (!pendingApprovalsListDiv) return;
        pendingApprovalsListDiv.innerHTML = ''; // Clear

        if (pendingApprovals.length === 0) {
            pendingApprovalsListDiv.innerHTML = '<p>No pending approvals.</p>';
            return;
        }

        pendingApprovals.forEach(approval => {
            const item = document.createElement('div');
            item.classList.add('approval-item'); // Add class for styling
            item.setAttribute('data-approval-id', approval.approvalId);
            item.innerHTML = `
                <div class="approval-details">
                    <span><strong>Student:</strong> ${approval.studentName} (${approval.studentId})</span>
                    <span><strong>Project:</strong> ${approval.projectTitle} (${approval.projectId})</span>
                </div>
                <div class="approval-actions">
                    <button class="button-approve" data-action="approve" data-id="${approval.approvalId}">Approve</button>
                    <button class="button-disapprove" data-action="disapprove" data-id="${approval.approvalId}">Disapprove</button>
                </div>
            `;
            pendingApprovalsListDiv.appendChild(item);
        });
    }

    // --- Event Handler for Approval Actions ---
    function handleApprovalAction(event) {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const approvalId = button.dataset.id;

        // Find the approval in the dummy data
        const approvalIndex = pendingApprovals.findIndex(appr => appr.approvalId === approvalId);
        if (approvalIndex === -1) return;

        const approvalInfo = pendingApprovals[approvalIndex];

        // SIMULATION: Show alert and remove from list
        if (action === 'approve') {
            alert(`Approved enrollment for ${approvalInfo.studentName} in ${approvalInfo.projectTitle}. (Backend needed)`);
            // In real app: Send API request to backend
        } else if (action === 'disapprove') {
            alert(`Disapproved enrollment for ${approvalInfo.studentName} in ${approvalInfo.projectTitle}. (Backend needed)`);
            // In real app: Send API request to backend
        }

        // Remove from dummy data and re-render (simulation)
        pendingApprovals.splice(approvalIndex, 1);
        displayPendingApprovals();
    }

    // --- Attach Event Listeners ---
    if (pendingApprovalsListDiv) {
        pendingApprovalsListDiv.addEventListener('click', handleApprovalAction);
    }

     // --- Logout Functionality ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout clicked");
            alert("Simulating logout...");
            window.location.href = 'index.html'; // Redirect to login
        });
    }

    // --- Initial Load (Simulated) ---
    displayAssignedCourses();
    displayPendingApprovals();

});