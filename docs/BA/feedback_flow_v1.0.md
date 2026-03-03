# Business Analysis: Feedback Flow v1.0

## Feature: Contextual Action Feedback

### Title: Real-time Contextual Feedback for Tasks and Contracts
- **Actor**: Manager, Technician, Developer
- **Goal**: Enable direct, real-time communication on specific property management actions (Tasks and Contracts) to ensure operational clarity and provide logs for technical troubleshooting.
- **Business Value**: Reduces miscommunication, creates an immutable audit trail of operational decisions, and provides developers with immediate context for support requests.

### Acceptance Criteria
1.  **Floating Entry**: A non-intrusive floating chat bubble must appear ONLY on Task and Contract detail pages.
2.  **Contextual Isolation**: Messages sent within a Task must not appear in a Contract, and vice versa.
3.  **Real-time Indication**: A notification dot must appear on the bubble when new messages arrive while the window is closed.
4.  **Role Visibility**: Every message must display the sender's name and role (e.g., "Manager", "Technician").
5.  **Audit Trail**: All messages must be persisted with a timestamp and accessible via a central aggregation hub.

### Edge Cases
- **Long Messages**: The UI must handle long text without breaking the chat bubble layout (overflow/scrolling).
- **No Internet**: The system should gracefully handle failed POST requests (though full retry logic is v2.0).
- **ID Mismatch**: If a user manually navigates to a non-existent ID, the chat component should not crash.

### Failure Scenarios
- **API Timeout**: Chat displays a loading state; if it fails, it should show an error hint to the user.
- **Unauthorized Access**: If a user isn't logged in, the chat should not initialize (currently relying on system-dev-id for demo).

### Impacted Flow IDs
- `FLOW_TASK_EXEC_01`: Task Execution & Monitoring
- `FLOW_CONT_MGMT_02`: Contract Lifecycle Management

### Version Tag
v1.0.0

---

## Feature: Feedback Aggregation Hub

### Title: Centralized Feedback & Log Monitoring
- **Actor**: Manager, Auditor, Developer
- **Goal**: View all recent discussions and feedback across all buildings, rooms, and actions in a single, searchable list.
- **Business Value**: Provides a high-level overview of operational friction points and allows developers to monitor logs without diving into individual records.

### Acceptance Criteria
1.  **Direct Navigation**: Clicking a feedback item must take the user directly to the source Task or Contract.
2.  **Information Density**: Each list item must show the content, author, timestamp, and the specific building/room context.
3.  **Chronological Sort**: Newest feedback must always appear at the top.

### Version Tag
v1.0.0
